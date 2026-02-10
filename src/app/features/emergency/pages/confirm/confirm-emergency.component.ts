import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
    selector: 'app-confirm-emergency',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, ButtonComponent],
    template: `
    <div class="min-h-screen bg-[#60a5fa] relative font-sans text-[#1e293b]">
      <!-- Status Bar Area (simulated) -->
      <div class="h-6 w-full"></div>

      <!-- Main Content Container with rounded top and simulated phone border -->
      <div class="bg-blue-400 min-h-screen flex flex-col relative pt-16">

         <!-- Header -->
        <div class="bg-white/10 backdrop-blur-md border-b border-white/20 flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-10 pt-8">
             <div class="w-6"></div> <!-- Spacer for alignment -->
             <h1 class="text-lg font-semibold text-[#1e293b]">Confirmar Emergencia</h1>
             <button (click)="cancel()" class="text-[#1e293b] focus:outline-none p-1 rounded-full hover:bg-black/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
             </button>
        </div>

        <!-- Content Card -->
        <div class="px-6 mt-8 flex flex-col items-center text-center">
            <h2 class="text-2xl font-bold mb-4 text-[#1e293b]">
                ¿Estás seguro de que<br>quieres enviar la alerta de<br>emergencia?
            </h2>
            <p class="text-[#475569] text-sm mb-12 leading-relaxed max-w-xs">
                Esta acción notificará inmediatamente a tus<br>contactos de emergencia y al equipo de soporte<br>de Sanity.
            </p>

            <div class="w-full flex flex-col gap-4 max-w-xs">
                <app-button
                    variant="primary"
                    [fullWidth]="true"
                    (click)="confirm()"
                    class="shadow-none rounded-xl"
                >Sí, Enviar</app-button>

                <app-button
                    variant="secondary"
                    [fullWidth]="true"
                    (click)="cancel()"
                     class="shadow-none rounded-xl text-[#1e293b]"
                >Cancelar</app-button>
            </div>
        </div>
        
        <!-- Bottom Gradiant Fade -->
        <div class="flex-grow bg-gradient-to-b from-blue-400 to-blue-300"></div>

         <!-- Bottom Navigation -->
        <app-bottom-nav></app-bottom-nav>
      </div>
    </div>
  `,
    styles: [`
    /* Override specific styles for this page to match the design exactly */
    :host ::ng-deep app-button[variant="primary"] button {
        background-color: #22d3ee; /* cyan-400 */
        color: #1e293b;
        font-weight: 600;
        border-radius: 12px;
    }
    :host ::ng-deep app-button[variant="primary"] button:hover {
        background-color: #06b6d4; /* cyan-500 */
    }

    :host ::ng-deep app-button[variant="secondary"] button {
        background-color: #f1f5f9; /* slate-100 */
        color: #1e293b;
        font-weight: 600;
        border-radius: 12px;
    }
     :host ::ng-deep app-button[variant="secondary"] button:hover {
        background-color: #e2e8f0; /* slate-200 */
    }

    h2 {
        color: #0f172a;
    }
  `]
})
export class ConfirmEmergencyComponent {

    constructor(private router: Router) { }

    confirm() {
        this.router.navigate(['/emergency/sent']);
    }

    cancel() {
        this.router.navigate(['/']);
    }
}
