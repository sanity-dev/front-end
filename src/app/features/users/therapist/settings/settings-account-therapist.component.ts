import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SettingsItemComponent } from '../../../../shared/components/setting-button/settings-item.component';
import { EditFieldModalComponent, EditFieldConfig } from '../../../../shared/components/edit-field-modal/edit-field-modal.component';

@Component({
    selector: 'app-therapist-settings',
    standalone: true,
    imports: [CommonModule, SettingsItemComponent, EditFieldModalComponent],
    template: `
    <div class="flex flex-col min-h-screen bg-linear-to-b from-grey-400 to-grey-600">

      <!-- Content -->
      <div class="flex flex-col px-5 pb-10 gap-1">

        <!-- CUENTA -->
        <h2 class="text-base font-bold text-text-primary mt-4 mb-2">Cuenta</h2>

        <div class="flex flex-col gap-2">
          <app-settings-item
            label="Privacidad"
            description="Comparte datos anónimos para mejorar la app"
            type="toggle"
            [(checked)]="privacyEnabled"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </app-settings-item>
        </div>

        <!-- NOTIFICACIONES -->
        <h2 class="text-base font-bold text-text-primary mt-5 mb-2">Notificaciones</h2>

        <div class="flex flex-col gap-2">
          <app-settings-item
            label="Notificaciones del Terapeuta"
            type="navigate"
            (itemClick)="navigate('/users/therapist/settings/notificaciones')"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </app-settings-item>
        </div>

        <!-- SUSCRIPCIÓN Y FACTURACIÓN -->
        <h2 class="text-base font-bold text-text-primary mt-5 mb-2">Suscripción y Facturación</h2>

        <div class="flex flex-col gap-2">
          <app-settings-item
            label="Gestionar Suscripción"
            type="navigate"
            (itemClick)="navigate('/users/therapist/settings/suscripcion')"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </app-settings-item>

        </div>

        <!-- ACCIONES DE CUENTA -->
        <h2 class="text-base font-bold text-text-primary mt-5 mb-2">Acciones de Cuenta</h2>

        <div class="flex flex-col gap-2">
          <app-settings-item
            label="Cerrar Sesión"
            type="danger"
            (itemClick)="logout()"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </app-settings-item>

          <app-settings-item
            label="Eliminar Cuenta"
            type="danger"
            (itemClick)="confirmDeleteAccount()"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </app-settings-item>
        </div>

      </div>

    </div>

    <!-- Modal reutilizable (cambiar contraseña + eliminar cuenta) -->
    <app-edit-field-modal
      [visible]="showModal"
      [config]="modalConfig"
      [isSaving]="isSaving"
      (save$)="onModalSave($event)"
      (close$)="showModal = false"
    />
  `,
    styles: []
})
export class TherapistSettingsComponent implements OnInit {
    private router = inject(Router);
    private http = inject(HttpClient);
    privacyEnabled = true;
    showModal = false;
    isSaving = false;
    modalConfig: EditFieldConfig = { field: '', label: '', value: '', type: 'text' };

    private apiUrl = 'http://localhost:8080/api/terapeutas';

    ngOnInit(): void { }

    goBack(): void {
        this.router.navigate(['/users/therapist/profile']);
    }

    navigate(path: string): void {
        this.router.navigate([path]);
    }

    openChangePassword(): void {
        this.modalConfig = {
            field: 'contraseña',
            label: 'Contraseña',
            value: '',
            type: 'password'
        };
        this.showModal = true;
    }

    confirmDeleteAccount(): void {
        this.modalConfig = {
            field: 'eliminar-cuenta',
            label: 'Eliminar cuenta',
            value: '',
            type: 'confirm-delete'
        };
        this.showModal = true;
    }

    onModalSave(data: Record<string, string>): void {
        if (this.modalConfig.type === 'confirm-delete') {
            this.deleteAccount(data['contraseñaConfirmacion']);
            return;
        }

        if (this.modalConfig.field === 'contraseña') {
            this.changePassword(data['contraseñaActual'], data['contraseña']);
        }
    }

    private changePassword(currentPassword: string, newPassword: string): void {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.idPersona;
            this.isSaving = true;

            this.http.put(`${this.apiUrl}/${userId}/password`, {
                contraseñaActual: currentPassword,
                contraseñaNueva: newPassword
            }).subscribe({
                next: () => {
                    this.isSaving = false;
                    this.showModal = false;
                },
                error: (err) => {
                    this.isSaving = false;
                    console.error('Error al cambiar contraseña:', err);
                }
            });
        } catch (e) {
            this.isSaving = false;
            console.error('Error al procesar token:', e);
        }
    }

    private deleteAccount(password: string): void {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.idPersona;
            this.isSaving = true;

            this.http.delete(`${this.apiUrl}/${userId}`, {
                body: { contraseña: password }
            }).subscribe({
                next: () => {
                    localStorage.removeItem('authToken');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.isSaving = false;
                    console.error('Error al eliminar cuenta:', err);
                }
            });
        } catch (e) {
            this.isSaving = false;
            console.error('Error al procesar token:', e);
        }
    }

    logout(): void {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
    }
}