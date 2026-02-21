import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
    selector: 'app-profile-ready',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="flex flex-col h-full bg-linear-to-b from-[#8d8d8d] to-[#ffffff]/50">
      <!-- Illustration Area -->
      <div class="flex-1 overflow-hidden rounded-b-[3rem] mb-6">
           <img class="w-100 h-80 object-cover" src="assets/images/onbording2.svg" alt="Ilustración" />
      </div>

      <!-- Content Area -->
      <div class="px-6 pb-8 flex flex-col items-center text-center">
        <h1 class="text-2xl font-bold text-text-primary mb-4">¡Tu perfil está casi listo!</h1>
        <p class="text-text-primary mb-8 max-w-xs">
          Estás a solo un paso de conectar con clientes. Explora tu panel de control o completa la verificación de tus credenciales para comenzar.
        </p>

        <!-- Dots Indicator -->
        <div class="flex gap-2 mb-8">
          <div class="w-2.5 h-2.5 rounded-full bg-white/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-white/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
        </div>

        <!-- Button -->
        <div class="w-full">
            <app-button [fullWidth]="true" (click)="next()">Verificar perfil</app-button>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ProfileReadyComponent {
    constructor(private router: Router) { }

    next() {
        this.router.navigate(['/users/therapist/verification']);
    }
}
