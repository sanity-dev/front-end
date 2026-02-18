import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
    selector: 'app-alert-sent',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, ButtonComponent],
    template: `
    <div class="min-h-screen relative font-sans text-text-primary">
      <!-- Header -->
      <header
        class="flex items-center justify-end px-4 sm:px-6 py-4 bg-linear-to-r from-secondary-background/80 to-blue-800/80 backdrop-blur-sm sticky top-0 z-10">
          <button (click)="goHome()" class="text-[#f5f5f5] focus:outline-none p-1 rounded-full hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
      </header>

      <!-- Content -->
      <div class="px-6 flex flex-col items-center text-center mt-8 pb-20">
          <h1 class="text-2xl font-bold mb-4 text-text-primary">
              ¡Alerta de emergencia<br>enviada con éxito!
          </h1>
          <p class="text-gray-500 text-sm mb-12 leading-relaxed">
              Tu contacto de emergencia ha sido notificado.<br>La ayuda está en camino.
          </p>

          <!-- Card with Check Icon -->
          <div class="bg-orange-100 rounded-3xl w-full max-w-xs aspect-square flex items-center justify-center shadow-sm mb-10 relative overflow-hidden">
              <div class="w-24 h-48 border-r-8 border-b-8 border-secondary-background transform rotate-45 -mt-8 drop-shadow-md opacity-60"></div>
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
                   class="shadow-none rounded-xl"
              >Contactar Otro Recurso</app-button>
          </div>
      </div>

       <!-- Bottom Navigation -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
    styles: [`
    :host ::ng-deep app-button[variant="primary"] button {
        background-color: #4C9EEB;
        color: #ffffff;
        font-weight: 600;
        border-radius: 12px;
    }
    :host ::ng-deep app-button[variant="primary"] button:hover {
        background-color: #3b82f6;
    }

    :host ::ng-deep app-button[variant="secondary"] button {
        background-color: #f1f5f9;
        color: #1d1d1d;
        font-weight: 600;
        border-radius: 12px;
    }
     :host ::ng-deep app-button[variant="secondary"] button:hover {
        background-color: #e2e8f0;
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

