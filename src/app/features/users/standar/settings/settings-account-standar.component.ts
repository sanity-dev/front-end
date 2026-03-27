import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { SettingsItemComponent } from '../../../../shared/components/setting-button/settings-item.component';
import { EditFieldModalComponent, EditFieldConfig } from '../../../../shared/components/edit-field-modal/edit-field-modal.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, SettingsItemComponent, EditFieldModalComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-linear-to-b from-grey-400 to-grey-600">

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
            label="Configuración de Notificaciones"
            description="Personaliza tus alertas y métodos de notificación"
            type="navigate"
            (itemClick)="navigate('/user/notifications/preferences')"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </app-settings-item>
        </div>

        <!-- SEGURIDAD -->
        <h2 class="text-base font-bold text-text-primary mt-5 mb-2">Seguridad</h2>

        <div class="flex flex-col gap-2">
          <app-settings-item
            label="Botón de emergencia"
            description="Gestiona el botón de emergencia"
            type="navigate"
            (itemClick)="navigate('/user/emergency-button')"
          >
            <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </app-settings-item>
        </div>

        <!-- OTROS -->
        <h2 class="text-base font-bold text-text-primary mt-5 mb-2">Otros</h2>

        <div class="flex flex-col gap-2">
          <app-settings-item
            label="Eliminar cuenta"
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

    <!-- Edit Field Modal (también maneja confirm-delete) -->
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
export class ConfiguracionComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  privacyEnabled = true;
  showModal = false;
  isSaving = false;
  modalConfig: EditFieldConfig = { field: '', label: '', value: '', type: 'text' };

  private apiUrl = `${environment.apiUrl}/api/personas`;

  ngOnInit(): void { }

  goBack(): void {
    this.router.navigate(['/user/profile']);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
          this.authService.logout();
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
}