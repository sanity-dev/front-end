import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { AuthService } from '../../core/services/auth.service';
import { HeaderWithIconsComponent } from '../../layout/header/header-with-icons.component';

@Component({
    selector: 'app-forgot-password-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, HeaderWithIconsComponent],
    template: `
    <div class="flex flex-col min-h-screen ">

     <!-- Header -->
     <app-header-with-icons [centerText]="'Restablecer contraseña'" [disableBack]="false" [disableNotification]="false"></app-header-with-icons>

      <!-- Contenido -->
      <div class="flex flex-col flex-1 px-6 pt-8">

        <h1 class="text-[26px] font-extrabold text-text-primary leading-tight tracking-tight mb-3">
          ¿Olvidaste tu contraseña?
        </h1>

        <p class="text-sm text-text-primary leading-relaxed mb-8">
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

          <!-- Mensaje de éxito -->
          <div *ngIf="successMessage"
               class="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <!-- Mensaje de error -->
          <div *ngIf="errorMessage"
               class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Campo email -->
          <div class="flex flex-col gap-1">
            <app-input
              type="email"
              formControlName="email"
              placeholder="Correo electrónico"
            ></app-input>
            <div
              *ngIf="forgotPasswordForm.get('email')?.invalid && (forgotPasswordForm.get('email')?.dirty || forgotPasswordForm.get('email')?.touched)"
              class="text-red-600 text-xs pl-1">
              <span *ngIf="forgotPasswordForm.get('email')?.errors?.['required']">El correo es requerido.</span>
              <span *ngIf="forgotPasswordForm.get('email')?.errors?.['email']">Ingrese un correo válido.</span>
            </div>
          </div>

          <!-- Botón -->
          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [disabled]="forgotPasswordForm.invalid || isLoading"
            class="mt-2 w-full block"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar enlace' }}
          </app-button>

        </form>
      </div>
    </div>
  `,
    styles: []
})
export class ForgotPasswordFormComponent {
    forgotPasswordForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        if (this.forgotPasswordForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const { email } = this.forgotPasswordForm.value;

            this.authService.forgotPassword(email).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/forgot-password/confirmation']);

                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = error.error?.message || 'Ocurrió un error. Intenta nuevamente.';
                }
            });
        } else {
            this.forgotPasswordForm.markAllAsTouched();
        }
    }
    cancel() {
        this.router.navigate(['/']);
    }
    onBack() {
        this.cancel();
    }

    onNotif() {
        // Navigate to notifications screen if exists; otherwise no-op or log
        this.router.navigate(['/notifications']).catch(() => {
            // If route doesn't exist, stay here — could show a toast instead
            console.warn('Navigation to /notifications failed or route not found');
        });
    }
}