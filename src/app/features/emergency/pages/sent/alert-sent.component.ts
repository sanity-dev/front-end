import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
    selector: 'app-alert-sent',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, ButtonComponent],
    template: `
    <div class="min-h-screen bg-[#60a5fa] relative font-sans text-[#1e293b]">
      <!-- Status Bar Area -->
      <div class="h-6 w-full"></div>

      <!-- Main Content Container-->
      <div class="bg-blue-400 min-h-[calc(100vh-24px)] flex flex-col relative">

         <!-- Header -->
        <div class="flex justify-end items-center px-6 py-4">
             <button (click)="goHome()" class="text-[#1e293b] focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
             </button>
        </div>

        <!-- Content -->
        <div class="px-6 flex flex-col items-center text-center mt-2">
            <h1 class="text-2xl font-bold mb-4 text-[#0f172a]">
                ¡Alerta de emergencia<br>enviada con éxito!
            </h1>
            <p class="text-[#0f172a] text-sm mb-12 leading-relaxed opacity-80">
                Tu contacto de emergencia ha sido notificado.<br>La ayuda está en camino.
            </p>

            <!-- Card with Check Icon -->
            <div class="bg-[#fefce8] rounded-3xl w-full max-w-xs aspect-square flex items-center justify-center shadow-sm mb-10 relative overflow-hidden">
                <!-- Check Icon styled to match screenshot -->
                 <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-80">
                    <path d="M166.667 50L75 141.667L33.3334 100" stroke="#d4d4d8" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" class="stroke-[#d1d5db]"/>
                     <path d="M166.667 50L75 141.667L33.3334 100" stroke="#d4d4d8" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" class="stroke-[#a1a1aa] mix-blend-multiply opacity-50 block"/>
                     
                     <!-- Custom SVG path to mimic the thick marker style checkmark -->
                     <path d="M40 100 L80 140 L160 60" stroke="#b6b6a9" stroke-width="30" stroke-linecap="square" stroke-linejoin="miter" fill="none" style="opacity: 0.4"/>
                </svg>
                 <!-- Re-do svg to better match the beige card/checkmark style -->
                 <div class="absolute inset-0 flex items-center justify-center">
                    <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#cdcbae" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
                        <polyline points="20 6 9 17 4 12" stroke-width="3"></polyline>
                    </svg>
                 </div>
                 
                 <!-- Another attempt at the specific graphic style -->
                 <div class="absolute inset-0 bg-[#faeadd] flex items-center justify-center">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="#bfaea1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.1));"/> 
                        <path d="M5 13L9 17L19 7" stroke="#b4bea1" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="round" class="text-[#bfaea1]" style="stroke: #bfaea1; opacity: 1;"/>
                        <!-- Using a simple image placeholder if SVG is too complex to replicate exact texture -->
                      </svg>
                      <!-- Pure CSS Checkmark attempt -->
                      <div class="w-24 h-48 border-r-8 border-b-8 border-[#cbbcae] transform rotate-45 -mt-8 drop-shadow-md opacity-60"></div>
                 </div>
            </div>

            <div class="w-full flex flex-col gap-4 max-w-xs">
                <app-button
                    variant="primary"
                    [fullWidth]="true"
                    (click)="goHome()"
                    class="shadow-none rounded-xl"
                >Volver a Inicio</app-button>

                <app-button
                    variant="secondary"
                    [fullWidth]="true"
                    (click)="contactOther()"
                     class="shadow-none rounded-xl text-[#1e293b]"
                >Contactar Otro Recurso</app-button>
            </div>
        </div>

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
  `]
})
export class AlertSentComponent {

    constructor(private router: Router) { }

    goHome() {
        this.router.navigate(['/']);
    }

    contactOther() {
        // Placeholder for actual functionality
        console.log('Contactar otro recurso clicked');
    }
}
