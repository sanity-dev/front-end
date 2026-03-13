import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderWithIconsComponent } from '../../../../layout/header/header-with-icons.component';
import { ToggleSwitchComponent } from '../../../../shared/components/toggle-switch/toggle-switch.component';
import { InfoFieldComponent } from '../../../../shared/components/info-field/info-field.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { EditFieldModalComponent, EditFieldConfig } from '../../../../shared/components/edit-field-modal/edit-field-modal.component';
import { environment } from '../../../../../environments/environment';

interface UserProfile {
  idPersona: number;
  nombre: string;
  correo: string;
  telefono: string;
  cedula: string;
  fotoPerfilUrl: string | null;
}

@Component({
  selector: 'app-standard-profile',
  standalone: true,
  imports: [CommonModule, ToggleSwitchComponent, InfoFieldComponent, EditFieldModalComponent],
  template: `
    <div class="flex flex-col px-5 pb-8">

      <!-- Foto de perfil + nombre -->
      <section class="flex flex-col items-center py-6 gap-2">
        <div
          class="relative w-28 h-28 rounded-full cursor-pointer overflow-hidden shadow-lg shadow-secondary-background/25 transition-transform duration-200 hover:scale-[1.03]"
          (click)="triggerFileInput()"
        >
          <img
            [src]="user.fotoPerfilUrl || './assets/icons/usuario.svg'"
            [alt]="user.nombre"
            class="w-full h-full object-cover rounded-full border-3 border-secondary-background"
            [ngClass]="!user.fotoPerfilUrl ? 'p-6 bg-linear-to-br from-blue-100 to-blue-200 border-dashed' : ''"
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
        <h2 class="text-xl font-extrabold text-text-primary m-0">{{ user.nombre }}</h2>
        <p class="text-sm text-gray-400 m-0">{{ user.correo }}</p>
      </section>

      <!-- Divider -->
      <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-2"></div>

      <!-- Información personal -->
      <section class="py-3">
        <h3 class="text-lg font-bold text-text-primary mb-3">Información personal</h3>

        <app-info-field [value]="user.nombre" label="Nombre" (edit)="editField('nombre')" />
        <app-info-field [value]="user.correo" label="Correo electrónico" (edit)="editField('correo')" />
        <app-info-field value="********" label="Contraseña" (edit)="editField('contraseña')" />
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
      </section>

      <!-- Estado de subida -->
      <div
        *ngIf="uploadStatus"
        class="text-center py-3 px-4 rounded-xl text-sm font-semibold mt-2 animate-[fadeIn_0.3s_ease]"
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
export class StandardProfileComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  user: UserProfile = {
    idPersona: 0,
    nombre: '',
    correo: '',
    telefono: '',
    cedula: '',
    fotoPerfilUrl: null
  };

  pushNotifications = true;
  emailNotifications = true;
  uploadStatus: 'success' | 'error' | null = null;
  uploadMessage = '';

  // Edit modal
  showEditModal = false;
  isSaving = false;
  editConfig: EditFieldConfig = { field: '', label: '', value: '', type: 'text' };

  private apiUrl = `${environment.apiUrl}/api/personas`;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub;

      this.http.get<UserProfile[]>(this.apiUrl).subscribe({
        next: (personas) => {
          const found = personas.find(p => p.correo === email);
          if (found) {
            this.user = found;
          }
        },
        error: (err) => console.error('Error loading profile:', err)
      });
    } catch (e) {
      console.error('Error decoding token:', e);
    }
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

    this.http.post<UserProfile>(
      `${this.apiUrl}/${this.user.idPersona}/foto-perfil`,
      formData
    ).subscribe({
      next: (updated) => {
        this.user = updated;
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
      nombre: { field: 'nombre', label: 'Nombre', value: this.user.nombre, type: 'text' },
      correo: { field: 'correo', label: 'Correo electrónico', value: this.user.correo, type: 'email' },
      'contraseña': { field: 'contraseña', label: 'Contraseña', value: '', type: 'password' },
      telefono: { field: 'telefono', label: 'Teléfono', value: this.user.telefono || '', type: 'tel' }
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
      `${this.apiUrl}/${this.user.idPersona}/basica`,
      payload
    ).subscribe({
      next: (updated) => {
        this.user = { ...this.user, ...updated };
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
