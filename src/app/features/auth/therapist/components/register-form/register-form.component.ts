import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { GoogleButtonComponent } from '../../../../../shared/components/google-button/google-button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-therapist-register-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, GoogleButtonComponent, InputComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
      <!-- Mensaje de éxito -->
      <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
        {{ successMessage }}
      </div>

      <!-- Mensaje de error general -->
      <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
        {{ errorMessage }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <app-input
          type="text"
          formControlName="name"
          placeholder="Nombre completo"
        ></app-input>
        <div *ngIf="registerForm.get('name')?.invalid && (registerForm.get('name')?.dirty || registerForm.get('name')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('name')?.errors?.['required']">El nombre es requerido.</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <app-input
          type="email"
          formControlName="email"
          placeholder="Correo electrónico"
        ></app-input>
        <div *ngIf="registerForm.get('email')?.invalid && (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('email')?.errors?.['required']">El correo es requerido.</div>
          <div *ngIf="registerForm.get('email')?.errors?.['email']">Ingrese un correo válido.</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <app-input
          type="password"
          formControlName="password"
          placeholder="Contraseña"
        ></app-input>
        <div *ngIf="registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('password')?.errors?.['required']">La contraseña es requerida.</div>
          <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Mínimo 8 caracteres.</div>
          <div *ngIf="registerForm.get('password')?.errors?.['missingSpecialChar']">Debe contener al menos un carácter especial.</div>
          <div *ngIf="registerForm.get('password')?.errors?.['missingUppercase']">Debe contener al menos una letra mayúscula.</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
        <app-input
          type="password"
          formControlName="confirmPassword"
          placeholder="Confirmar contraseña"
        ></app-input>
        <div *ngIf="registerForm.get('confirmPassword')?.invalid && (registerForm.get('confirmPassword')?.dirty || registerForm.get('confirmPassword')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirme su contraseña.</div>
          <div *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Las contraseñas no coinciden.</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
        <app-input
          type="number"
          formControlName="documentNumber"
          placeholder="Número de documento"
        ></app-input>
        <div *ngIf="registerForm.get('documentNumber')?.invalid && (registerForm.get('documentNumber')?.dirty || registerForm.get('documentNumber')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('documentNumber')?.errors?.['required']">El número de documento es requerido.</div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta profesional</label>
        <app-input
          type="text"
          formControlName="professionalLicenseNumber"
          placeholder="Número de tarjeta profesional"
        ></app-input>
        <div *ngIf="registerForm.get('professionalLicenseNumber')?.invalid && (registerForm.get('professionalLicenseNumber')?.dirty || registerForm.get('professionalLicenseNumber')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('professionalLicenseNumber')?.errors?.['required']">El número de tarjeta profesional es requerido.</div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número de teléfono</label>
        <app-input
          type="number"
          formControlName="phoneNumber"
          placeholder="Número de teléfono"
        ></app-input>
        <div *ngIf="registerForm.get('phoneNumber')?.invalid && (registerForm.get('phoneNumber')?.dirty || registerForm.get('phoneNumber')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('phoneNumber')?.errors?.['required']">El número de teléfono es requerido.</div>
          <div *ngIf="registerForm.get('phoneNumber')?.errors?.['pattern']">Ingrese un número de teléfono válido.</div>
        </div>
      </div>

      <!-- Términos y condiciones -->
      <div class="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          id="therapistAcceptTerms"
          formControlName="acceptTerms"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label for="therapistAcceptTerms" class="text-sm text-gray-600 cursor-pointer select-none">
          Acepto los <a href="https://storage.googleapis.com/115305318075-us-central1-blueprint-config/terminos-cond-sanity/Sanity_Terminos_y_Condiciones.pdf" target="_blank" class="text-blue-600 underline hover:text-blue-800 font-medium">términos y condiciones</a> de Sanity
        </label>
      </div>
      <div *ngIf="registerForm.get('acceptTerms')?.invalid && (registerForm.get('acceptTerms')?.dirty || registerForm.get('acceptTerms')?.touched)" class="text-red-500 text-xs -mt-2">
        <div *ngIf="registerForm.get('acceptTerms')?.errors?.['required']">Debe aceptar los términos y condiciones para registrarse.</div>
      </div>

      <div class="pt-4 space-y-3">
        <app-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          class="w-full block"
          [disabled]="registerForm.invalid || isLoading"
        >
          {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </app-button>
        
        <div class="relative flex items-center gap-4">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="text-gray-400 text-sm font-medium">O</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>
        
        <app-google-button
          text="Registrarse con Google"
          (onClick)="handleGoogleLogin()"
        ></app-google-button>
      </div>
    
    </form>
  `,
  styles: []
})
export class TherapistRegisterFormComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.specialCharValidator,
        this.uppercaseValidator
      ]],
      confirmPassword: ['', Validators.required],
      documentNumber: ['', Validators.required],
      professionalLicenseNumber: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  specialCharValidator(control: AbstractControl): ValidationErrors | null {
    const hasSpecialChar = /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(control.value);
    return hasSpecialChar ? null : { missingSpecialChar: true };
  }

  uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { missingUppercase: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            confirmPassword.setErrors(null);
          } else {
            confirmPassword.setErrors(errors);
          }
        }
      }
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, acceptTerms, ...registerData } = this.registerForm.value;

      this.authService.registerTherapist(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error en el registro', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error en el registro. Intenta nuevamente.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  handleGoogleLogin() {
    // @ts-ignore
    if (typeof google === 'undefined' || !google.accounts) {
      this.errorMessage = 'El servicio de Google no está disponible. Intenta recargar la página.';
      return;
    }

    // @ts-ignore
    const client = google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: 'email profile',
      callback: (response: any) => {
        if (response.access_token) {
          this.isLoading = true;
          this.errorMessage = '';
          this.authService.loginWithGoogle(response.access_token).subscribe({
            next: (authResponse) => {
              this.isLoading = false;
              this.router.navigate([this.authService.getRedirectUrl()]);
            },
            error: (error) => {
              console.error('Error en registro con Google', error);
              this.isLoading = false;
              this.errorMessage = 'Error al registrarse con Google. Intenta nuevamente.';
            }
          });
        }
      },
    });

    client.requestAccessToken();
  }
}
