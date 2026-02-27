import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToggleSwitchComponent } from '../../../../../shared/components/toggle-switch/toggle-switch.component';
import { InfoFieldComponent } from '../../../../../shared/components/info-field/info-field.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { EditFieldModalComponent, EditFieldConfig } from '../../../../../shared/components/edit-field-modal/edit-field-modal.component';

interface TherapistProfile {
    idPersona: number;
    nombre: string;
    correo: string;
    telefono: string;
    cedula: string;
    tarjetaProfesional: string;
    fotoPerfilUrl: string | null;
}

@Component({
    selector: 'app-therapist-profile',
    standalone: true,
    imports: [CommonModule, ToggleSwitchComponent, InfoFieldComponent, ButtonComponent, EditFieldModalComponent],
    template: `
    <div class="flex flex-col px-5 pb-8">

      <!-- Foto de perfil + nombre + badge -->
      <section class="flex flex-col items-center py-6 gap-2">
        <div
          class="relative w-28 h-28 rounded-full cursor-pointer overflow-hidden shadow-lg shadow-secondary-background/25 transition-transform duration-200 hover:scale-[1.03]"
          (click)="triggerFileInput()"
        >
          <img
            [src]="therapist.fotoPerfilUrl || 'assets/icons/usuario.svg'"
            [alt]="therapist.nombre"
            class="w-full h-full object-cover rounded-full border-3 border-secondary-background"
            [ngClass]="!therapist.fotoPerfilUrl ? 'p-6 bg-linear-to-br from-blue-100 to-blue-200 border-dashed' : ''"
          />
          <div class="absolute bottom-0 left-0 right-0 h-9 bg-black/45 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          <input
            #fileInput
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            class="hidden"
            (change)="onFileSelected($event)"
          />
        </div>
        <h2 class="text-xl font-extrabold text-text-primary m-0">{{ therapist.nombre }}</h2>
        <p class="text-sm text-gray-400 m-0">{{ therapist.correo }}</p>
        <span class="text-xs font-semibold text-white bg-secondary-background px-3 py-1 rounded-full">Terapeuta</span>
      </section>

      <!-- Divider -->
      <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-2"></div>

      <!-- Información personal -->
      <section class="py-3">
        <h3 class="text-lg font-bold text-text-primary mb-3">Información personal</h3>
        <app-info-field [value]="therapist.nombre" label="Nombre" (edit)="editField('nombre')" />
        <app-info-field [value]="therapist.correo" label="Correo electrónico" (edit)="editField('correo')" />
        <app-info-field value="********" label="Contraseña" (edit)="editField('contraseña')" />
        <app-info-field [value]="therapist.telefono || 'Sin registrar'" label="Teléfono" (edit)="editField('telefono')" />
        <app-info-field [value]="therapist.cedula || 'Sin registrar'" label="Cédula" [editable]="false" />
      </section>

      <!-- Divider -->
      <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-2"></div>

      <!-- Información profesional -->
      <section class="py-3">
        <h3 class="text-lg font-bold text-text-primary mb-3">Información profesional</h3>
        <app-info-field [value]="therapist.tarjetaProfesional || 'Sin registrar'" label="Tarjeta profesional" [editable]="false" />

        <!-- Estado de verificación -->
        <div class="flex items-center gap-2 mt-2 py-2">
          <div
            class="w-2.5 h-2.5 rounded-full"
            [ngClass]="{
              'bg-emerald-500': verificationState === 'VERIFICADO',
              'bg-amber-400': verificationState === 'PENDIENTE',
              'bg-red-500': verificationState === 'RECHAZADO',
              'bg-gray-300': verificationState === 'SIN_DOCUMENTOS'
            }"
          ></div>
          <span class="text-sm text-gray-500">{{ verificationLabel }}</span>
        </div>

        <!-- Botón verificación -->
        <app-button
          variant="gradient"
          [fullWidth]="true"
          (click)="goToVerification()"
        >
          {{ verificationState === 'VERIFICADO' ? 'Ver documentos' : 'Verificar documentos' }}
        </app-button>
      </section>

      <!-- Divider -->
      <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-2"></div>

      <!-- Configuración de consulta -->
      <section class="py-3">
        <h3 class="text-lg font-bold text-text-primary mb-3">Configuración de consulta</h3>

        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-text-primary">Disponible para nuevos pacientes</span>
          <app-toggle-switch [(checked)]="availableForPatients" />
        </div>

        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-text-primary">Citas online</span>
          <app-toggle-switch [(checked)]="onlineAppointments" />
        </div>

        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-text-primary">Citas presenciales</span>
          <app-toggle-switch [(checked)]="inPersonAppointments" />
        </div>
      </section>

      <!-- Divider -->
      <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-2"></div>

      <!-- Notificaciones -->
      <section class="py-3">
        <h3 class="text-lg font-bold text-text-primary mb-3">Notificaciones</h3>

        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-text-primary">Notificaciones push</span>
          <app-toggle-switch [(checked)]="pushNotifications" />
        </div>

        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-text-primary">Notificaciones por correo electrónico</span>
          <app-toggle-switch [(checked)]="emailNotifications" />
        </div>

        <div class="flex items-center justify-between py-2.5">
          <span class="text-sm text-text-primary">Recordatorio de citas</span>
          <app-toggle-switch [(checked)]="appointmentReminders" />
        </div>
      </section>

      <!-- Cerrar sesión -->
      <app-button
        variant="danger"
        [fullWidth]="true"
        (click)="logout()"
      >
        Cerrar sesión
      </app-button>

      <!-- Estado de subida -->
      <div
        *ngIf="uploadStatus"
        class="text-center py-3 px-4 rounded-xl text-sm font-semibold mt-3 animate-[fadeIn_0.3s_ease]"
        [ngClass]="{
          'bg-emerald-50 text-emerald-600 border border-emerald-200': uploadStatus === 'success',
          'bg-red-50 text-red-600 border border-red-200': uploadStatus === 'error'
        }"
      >
        {{ uploadMessage }}
      </div>

    </div>

    <!-- Edit Modal -->
    <app-edit-field-modal
      [visible]="showEditModal"
      [config]="editConfig"
      [isSaving]="isSaving"
      (save$)="saveField($event)"
      (close$)="showEditModal = false"
    />
  `,
    styles: []
})
export class TherapistProfileComponent implements OnInit {
    private router = inject(Router);
    private http = inject(HttpClient);

    therapist: TherapistProfile = {
        idPersona: 0,
        nombre: '',
        correo: '',
        telefono: '',
        cedula: '',
        tarjetaProfesional: '',
        fotoPerfilUrl: null
    };

    // Configuración de consulta
    availableForPatients = true;
    onlineAppointments = true;
    inPersonAppointments = false;

    // Notificaciones
    pushNotifications = true;
    emailNotifications = true;
    appointmentReminders = true;

    // Verificación
    verificationState: 'VERIFICADO' | 'PENDIENTE' | 'RECHAZADO' | 'SIN_DOCUMENTOS' = 'SIN_DOCUMENTOS';

    // Edit modal
    showEditModal = false;
    isSaving = false;
    editConfig: EditFieldConfig = { field: '', label: '', value: '', type: 'text' };

    // Upload
    uploadStatus: 'success' | 'error' | null = null;
    uploadMessage = '';

    private apiUrl = 'http://localhost:8080/api/personas';

    get verificationLabel(): string {
        const labels: Record<string, string> = {
            VERIFICADO: 'Documentos verificados',
            PENDIENTE: 'Verificación pendiente',
            RECHAZADO: 'Documentos rechazados',
            SIN_DOCUMENTOS: 'Documentos sin subir'
        };
        return labels[this.verificationState];
    }

    ngOnInit(): void {
        this.loadProfile();
        this.loadVerificationStatus();
    }

    loadProfile(): void {
        const token = localStorage.getItem('authToken');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const email = payload.sub;

            this.http.get<TherapistProfile[]>(this.apiUrl).subscribe({
                next: (personas) => {
                    const found = personas.find(p => p.correo === email);
                    if (found) {
                        this.therapist = found;
                    }
                },
                error: (err) => console.error('Error loading profile:', err)
            });
        } catch (e) {
            console.error('Error decoding token:', e);
        }
    }

    loadVerificationStatus(): void {
        this.http.get<any>('http://localhost:8080/api/documents/verification-status').subscribe({
            next: (response) => {
                switch (response.status) {
                    case 'verified':
                        this.verificationState = 'VERIFICADO';
                        break;
                    case 'rejected':
                        this.verificationState = 'RECHAZADO';
                        break;
                    case 'pending':
                        if (response.documents && response.documents.length > 0) {
                            this.verificationState = 'PENDIENTE';
                        } else {
                            this.verificationState = 'SIN_DOCUMENTOS';
                        }
                        break;
                    default:
                        this.verificationState = 'SIN_DOCUMENTOS';
                }
            },
            error: () => this.verificationState = 'SIN_DOCUMENTOS'
        });
    }

    triggerFileInput(): void {
        const input = document.querySelector<HTMLInputElement>('input[type="file"]');
        input?.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];

        if (file.size > 5 * 1024 * 1024) {
            this.showStatus('error', 'La imagen es demasiado grande (máx. 5MB)');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        this.http.post<TherapistProfile>(
            `${this.apiUrl}/${this.therapist.idPersona}/foto-perfil`,
            formData
        ).subscribe({
            next: (updated) => {
                this.therapist = updated;
                this.showStatus('success', '✓ Foto de perfil actualizada');
            },
            error: (err) => {
                console.error('Error uploading photo:', err);
                this.showStatus('error', 'Error al subir la foto');
            }
        });
    }

    editField(field: string): void {
        const fieldMap: Record<string, EditFieldConfig> = {
            nombre: { field: 'nombre', label: 'Nombre', value: this.therapist.nombre, type: 'text' },
            correo: { field: 'correo', label: 'Correo electrónico', value: this.therapist.correo, type: 'email' },
            'contraseña': { field: 'contraseña', label: 'Contraseña', value: '', type: 'password' },
            telefono: { field: 'telefono', label: 'Teléfono', value: this.therapist.telefono || '', type: 'tel' }
        };

        const config = fieldMap[field];
        if (config) {
            this.editConfig = config;
            this.showEditModal = true;
        }
    }

    saveField(data: Record<string, string>): void {
        this.isSaving = true;

        const payload: any = {};
        if (data['nombre']) payload.nombre = data['nombre'];
        if (data['correo']) payload.correo = data['correo'];
        if (data['contraseña']) payload.contraseña = data['contraseña'];
        if (data['telefono']) payload.telefono = data['telefono'];

        this.http.put<any>(
            `${this.apiUrl}/${this.therapist.idPersona}/basica`,
            payload
        ).subscribe({
            next: (updated) => {
                this.therapist = { ...this.therapist, ...updated };
                this.isSaving = false;
                this.showEditModal = false;
                this.showStatus('success', '✓ Perfil actualizado');
            },
            error: (err) => {
                this.isSaving = false;
                console.error('Error updating profile:', err);
                this.showStatus('error', err.error?.message || 'Error al actualizar');
            }
        });
    }

    goToVerification(): void {
        this.router.navigate(['/users/therapist/verification']);
    }

    logout(): void {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
    }

    private showStatus(type: 'success' | 'error', message: string): void {
        this.uploadStatus = type;
        this.uploadMessage = message;
        setTimeout(() => { this.uploadStatus = null; }, 3000);
    }
}
