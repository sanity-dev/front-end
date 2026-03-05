import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HeaderWithIconsComponent } from '../../../../layout/header/header-with-icons.component';

@Component({
    selector: 'app-confirm-emergency',
    standalone: true,
    imports: [CommonModule, BottomNavComponent, ButtonComponent, HeaderWithIconsComponent],
    template: `
    <div class="min-h-screen relative font-sans text-text-primary">
    
         <!-- Header -->
        <app-header-with-icons [centerText]="'Confirmar Emergencia'" [disableBack]="false" [disableRightIcon]="false" ></app-header-with-icons>

      <!-- Content Card -->
      <div class="px-6 mt-12 flex flex-col items-center text-center pb-20">
          <h2 class="text-2xl font-bold mb-4 text-text-primary">
              ¿Estás seguro de que<br>quieres enviar la alerta de<br>emergencia?
          </h2>
          <p class="text-text-primary text-sm mb-12 leading-relaxed max-w-xs">
              Esta acción notificará inmediatamente a tus<br>contactos de emergencia y al equipo de soporte<br>de Sanity.
          </p>

          <div class="w-full flex flex-col gap-4 max-w-xs">
              <app-button
                  variant="primary"
                  [fullWidth]="true"
                  (click)="confirm()"
                  class="shadow-none rounded-xl"
              >Enviar</app-button>

              <app-button
                  variant="secondary"
                  [fullWidth]="true"
                  (click)="cancel()"
                   class="shadow-none rounded-xl"
              >Cancelar</app-button>
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
export class ConfirmEmergencyComponent {

    constructor(private router: Router) { }

    confirm() {
        this.router.navigate(['/emergency/sent']);
    }

    cancel() {
        this.router.navigate(['/']);
    }

}
