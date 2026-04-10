import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { SettingsItemComponent } from '../../shared/components/setting-button/settings-item.component';
import { environment } from '../../../environments/environment';

interface NotificationPreference {
    label: string;
    description: string;
    enabled: boolean;
}

interface NotificationSection {
    title: string;
    preferences: NotificationPreference[];
}

interface NotificationMethod {
    label: string;
    enabled: boolean;
}

@Component({
    selector: 'app-notification-preferences',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, SettingsItemComponent],
    template: `
    <div class="flex flex-col min-h-screen bg-linear-to-b from-grey-400 to-grey-600 pb-20">

      <!-- Content -->
      <main class="flex-1 px-5 py-4 w-full space-y-6">

        <!-- Notification sections -->
        <div *ngFor="let section of sections" class="space-y-2">
          <h2 class="text-base font-bold text-text-primary px-1">{{ section.title }}</h2>
          <div class="flex flex-col gap-2">
            <app-settings-item
              *ngFor="let pref of section.preferences"
              [label]="pref.label"
              [description]="pref.description"
              type="toggle"
              [(checked)]="pref.enabled"
              (checkedChange)="onPreferenceChange()"
            >
              <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </app-settings-item>
          </div>
        </div>

        <!-- Notification methods -->
        <div class="space-y-2">
          <h2 class="text-base font-bold text-text-primary px-1">Método de notificación</h2>
          <div class="flex flex-col gap-2">
            <app-settings-item
              *ngFor="let method of methods"
              [label]="method.label"
              type="toggle"
              [(checked)]="method.enabled"
              (checkedChange)="onMethodChange()"
            >
              <svg icon xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </app-settings-item>
          </div>
        </div>

      </main>

      <!-- Bottom Nav -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
    styles: []
})
export class NotificationPreferencesComponent implements OnInit {

    private router = inject(Router);
    private http = inject(HttpClient);
    private apiUrl =  `${environment.apiUrl}/api/notifications/usuarios`;

    sections: NotificationSection[] = [
        {
            title: 'Recordatorios',
            preferences: [
                {
                    label: 'Recordatorios de citas',
                    description: 'Recibe recordatorios para tus citas programadas.',
                    enabled: true
                },
                {
                    label: 'Recordatorios de actividades',
                    description: 'Recibe recordatorios para completar tus actividades diarias.',
                    enabled: true
                },
                {
                    label: 'Recordatorios de hábitos',
                    description: 'Recibe recordatorios para mantener tus hábitos.',
                    enabled: true
                }
            ]
        },
        {
            title: 'Actualizaciones',
            preferences: [
                {
                    label: 'Nuevas actividades',
                    description: 'Recibe notificaciones sobre nuevas actividades sugeridas.',
                    enabled: false
                },
                {
                    label: 'Mensajes del agente de IA',
                    description: 'Recibe mensajes de tu agente de IA.',
                    enabled: true
                }
            ]
        }
    ];

    methods: NotificationMethod[] = [
        { label: 'Notificaciones push', enabled: true },
        { label: 'Correo electrónico', enabled: true }
    ];

    ngOnInit(): void {
        this.loadPreferences();
    }

    getUserId(): string | null {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.idPersona || payload.sub;
        } catch (e) {
            return null;
        }
    }

    loadPreferences(): void {
        const userId = this.getUserId();
        if (!userId) return;

        this.http.get<any>(`${this.apiUrl}/${userId}/preferencias`).subscribe({
            next: (data) => {
                const pushMethod = this.methods.find(m => m.label === 'Notificaciones push');
                if (pushMethod) pushMethod.enabled = data.pushEnabled ?? true;
                
                const emailMethod = this.methods.find(m => m.label === 'Correo electrónico');
                if (emailMethod) emailMethod.enabled = data.emailEnabled ?? true;

                // Recordatorios
                const recordatoriosSection = this.sections.find(s => s.title === 'Recordatorios');
                if (recordatoriosSection) {
                    const citas = recordatoriosSection.preferences.find(p => p.label === 'Recordatorios de citas');
                    if (citas) citas.enabled = data.recordatoriosCitas ?? true;

                    const actividades = recordatoriosSection.preferences.find(p => p.label === 'Recordatorios de actividades');
                    if (actividades) actividades.enabled = data.recordatoriosActividades ?? true;

                    const habitos = recordatoriosSection.preferences.find(p => p.label === 'Recordatorios de hábitos');
                    if (habitos) habitos.enabled = data.recordatoriosHabitos ?? true;
                }

                // Actualizaciones
                const actualizacionesSection = this.sections.find(s => s.title === 'Actualizaciones');
                if (actualizacionesSection) {
                    const nuevasActividades = actualizacionesSection.preferences.find(p => p.label === 'Nuevas actividades');
                    if (nuevasActividades) nuevasActividades.enabled = data.nuevasActividades ?? false;

                    const mensajesIa = actualizacionesSection.preferences.find(p => p.label === 'Mensajes del agente de IA');
                    if (mensajesIa) mensajesIa.enabled = data.mensajesIa ?? true;
                }
            },
            error: () => {}
        });
    }

    savePreferences(): void {
        const userId = this.getUserId();
        if (!userId) return;

        const pushMethod = this.methods.find(m => m.label === 'Notificaciones push');
        const emailMethod = this.methods.find(m => m.label === 'Correo electrónico');

        // Extract preferences
        const recordatoriosSection = this.sections.find(s => s.title === 'Recordatorios');
        const recordatoriosCitas = recordatoriosSection?.preferences.find(p => p.label === 'Recordatorios de citas')?.enabled ?? true;
        const recordatoriosActividades = recordatoriosSection?.preferences.find(p => p.label === 'Recordatorios de actividades')?.enabled ?? true;
        const recordatoriosHabitos = recordatoriosSection?.preferences.find(p => p.label === 'Recordatorios de hábitos')?.enabled ?? true;

        const actualizacionesSection = this.sections.find(s => s.title === 'Actualizaciones');
        const nuevasActividades = actualizacionesSection?.preferences.find(p => p.label === 'Nuevas actividades')?.enabled ?? false;
        const mensajesIa = actualizacionesSection?.preferences.find(p => p.label === 'Mensajes del agente de IA')?.enabled ?? true;

        const payload = {
            pushEnabled: pushMethod ? pushMethod.enabled : true,
            emailEnabled: emailMethod ? emailMethod.enabled : true,
            recordatoriosCitas: recordatoriosCitas,
            recordatoriosActividades: recordatoriosActividades,
            recordatoriosHabitos: recordatoriosHabitos,
            nuevasActividades: nuevasActividades,
            mensajesIa: mensajesIa
        };

        this.http.put(`${this.apiUrl}/${userId}/preferencias`, payload).subscribe({
            next: () => {},
            error: () => {}
        });
    }

    onPreferenceChange(): void {

        this.savePreferences();
    }

    onMethodChange(): void {

        this.savePreferences();
    }

    goBack(): void {
        if (this.router.url.includes('/users/therapist')) {
            this.router.navigate(['/users/therapist/settings']);
        } else {
            this.router.navigate(['/user/settings']);
        }
    }
}
