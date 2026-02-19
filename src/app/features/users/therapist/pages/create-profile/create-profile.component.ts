import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
    selector: 'app-create-profile',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="flex flex-col h-full bg-linear-to-b from-[#8d8d8d] to-[#ffffff]/50">
      <!-- Illustration Area -->
      <div class="flex-1 flex items-center justify-center p-6 bg-white/50 rounded-b-[3rem] mb-6">
        <div class="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
           <!-- Placeholder for Illustration -->
           <span>Ilustración</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="px-6 pb-8 flex flex-col items-center text-center">
        <h1 class="text-2xl font-bold text-text-primary mb-4">Crea tu perfil público</h1>
        <p class="text-text-primary mb-8 max-w-xs">
          Vamos a dar forma a tu identidad profesional. Añade una breve biografía, destaca tus especialidades y selecciona una imagen de perfil.
        </p>

        <!-- Dots Indicator -->
        <div class="flex gap-2 mb-8">
          <div class="w-2.5 h-2.5 rounded-full bg-white/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-white/50"></div>
        </div>

        <!-- Button -->
        <div class="w-full">
            <app-button [fullWidth]="true" (click)="next()">Siguiente</app-button>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class CreateProfileComponent {
    constructor(private router: Router) { }

    next() {
        this.router.navigate(['/users/therapist/profile-ready']);
    }
}
