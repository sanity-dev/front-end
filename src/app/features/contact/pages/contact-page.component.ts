import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header.component';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    HeroComponent,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header [disableMenuButton]="true"></app-header>
      <div class="w-full max-w-md mx-auto flex flex-col justify-center">
        <div class="px-4 pb-12">
          <app-hero
            title="Contáctanos"
            description="¿Tienes alguna pregunta o sugerencia? Envíanos un mensaje y te responderemos lo antes posible."
          ></app-hero>

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
            <!-- Mensaje de éxito -->
            <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded text-sm font-medium">
              {{ successMessage }}
            </div>

            <!-- Mensaje de error -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {{ errorMessage }}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <app-input
                type="text"
                formControlName="name"
                placeholder="Tu nombre completo"
              ></app-input>
              <div *ngIf="contactForm.get('name')?.invalid && (contactForm.get('name')?.dirty || contactForm.get('name')?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="contactForm.get('name')?.errors?.['required']">El nombre es requerido.</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <app-input
                type="email"
                formControlName="email"
                placeholder="tu@correo.com"
              ></app-input>
              <div *ngIf="contactForm.get('email')?.invalid && (contactForm.get('email')?.dirty || contactForm.get('email')?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="contactForm.get('email')?.errors?.['required']">El correo es requerido.</div>
                <div *ngIf="contactForm.get('email')?.errors?.['email']">Ingrese un correo válido.</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número de celular</label>
              <app-input
                type="tel"
                formControlName="phone"
                placeholder="Ej: 3001234567"
              ></app-input>
              <div *ngIf="contactForm.get('phone')?.invalid && (contactForm.get('phone')?.dirty || contactForm.get('phone')?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="contactForm.get('phone')?.errors?.['required']">El número de celular es requerido.</div>
                <div *ngIf="contactForm.get('phone')?.errors?.['pattern']">Ingrese un número válido (mínimo 7 dígitos).</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <app-input
                type="text"
                formControlName="subject"
                placeholder="Asunto de tu mensaje"
              ></app-input>
              <div *ngIf="contactForm.get('subject')?.invalid && (contactForm.get('subject')?.dirty || contactForm.get('subject')?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="contactForm.get('subject')?.errors?.['required']">El asunto es requerido.</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                formControlName="message"
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
                class="border-[0.065rem] border-[#d1d9e0] rounded-md w-full px-4 py-3 focus:ring-2 focus:ring-sky-500 text-gray-800 placeholder-gray-500 transition-all outline-none resize-none"
              ></textarea>
              <div *ngIf="contactForm.get('message')?.invalid && (contactForm.get('message')?.dirty || contactForm.get('message')?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="contactForm.get('message')?.errors?.['required']">El mensaje es requerido.</div>
                <div *ngIf="contactForm.get('message')?.errors?.['minlength']">El mensaje debe tener al menos 10 caracteres.</div>
              </div>
            </div>

            <div class="pt-4 space-y-3">
              <app-button
                type="submit"
                variant="primary"
                [fullWidth]="true"
                class="w-full block"
                [disabled]="contactForm.invalid || isLoading"
              >
                {{ isLoading ? 'Enviando...' : 'Enviar mensaje' }}
              </app-button>

              <app-button
                type="button"
                variant="outline"
                [fullWidth]="true"
                class="w-full block"
                route="/"
              >
                Volver al inicio
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContactPageComponent {
  contactForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Simular envío del formulario
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = '¡Mensaje enviado exitosamente! Te responderemos pronto.';
        this.contactForm.reset();
      }, 1500);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
