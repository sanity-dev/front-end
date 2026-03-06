import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

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
    imports: [CommonModule, BottomNavComponent],
    template: `
    <div class="min-h-screen bg-gradient-to-b from-[#6eb5e8] via-[#a8d4f0] to-[#d0e8f5] flex flex-col font-sans pb-20">

      <!-- Header -->
      <header class="flex items-center px-4 sm:px-6 py-4 bg-[#6eb5e8]">
        <button (click)="goBack()" class="p-2 rounded-full hover:bg-white/20 transition-colors mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#1e293b]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-[#1e293b]">Notificaciones</h1>
      </header>

      <!-- Content -->
      <main class="flex-1 px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full space-y-6">

        <!-- Notification sections -->
        <div *ngFor="let section of sections" class="space-y-1">
          <h2 class="text-base font-bold text-[#1e293b] mb-3">{{ section.title }}</h2>

          <div *ngFor="let pref of section.preferences"
               class="bg-white/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 flex items-center justify-between gap-3 mb-2">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-[#1e293b]">{{ pref.label }}</p>
              <p class="text-xs text-[#1e293b]/60 mt-0.5">{{ pref.description }}</p>
            </div>

            <!-- Toggle switch -->
            <button
              (click)="togglePreference(pref)"
              class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
              [class.bg-blue-500]="pref.enabled"
              [class.bg-gray-300]="!pref.enabled"
            >
              <span
                class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
                [class.translate-x-5]="pref.enabled"
                [class.translate-x-0.5]="!pref.enabled"
              ></span>
            </button>
          </div>
        </div>

        <!-- Notification methods -->
        <div class="space-y-1">
          <h2 class="text-base font-bold text-[#1e293b] mb-3">Método de notificación</h2>

          <div *ngFor="let method of methods"
               class="bg-white/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 flex items-center justify-between gap-3 mb-2">
            <p class="text-sm font-medium text-[#1e293b]">{{ method.label }}</p>

            <!-- Toggle switch -->
            <button
              (click)="toggleMethod(method)"
              class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
              [class.bg-blue-500]="method.enabled"
              [class.bg-gray-300]="!method.enabled"
            >
              <span
                class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
                [class.translate-x-5]="method.enabled"
                [class.translate-x-0.5]="!method.enabled"
              ></span>
            </button>
          </div>
        </div>

      </main>

      <!-- Bottom Nav -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
    styles: []
})
export class NotificationPreferencesComponent {

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

    constructor(private router: Router) { }

    togglePreference(pref: NotificationPreference): void {
        pref.enabled = !pref.enabled;
        console.log(`📬 Preferencia "${pref.label}": ${pref.enabled ? 'activada' : 'desactivada'}`);
        // TODO: Guardar preferencia en el backend cuando el endpoint esté disponible
    }

    toggleMethod(method: NotificationMethod): void {
        method.enabled = !method.enabled;
        console.log(`📨 Método "${method.label}": ${method.enabled ? 'activado' : 'desactivado'}`);
        // TODO: Guardar preferencia en el backend cuando el endpoint esté disponible
    }

    goBack(): void {
        this.router.navigate(['/notificaciones']);
    }
}
