import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { GoogleButtonComponent } from '../../../../../shared/components/google-button/google-button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, GoogleButtonComponent, InputComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
      <!-- Mensaje de error general -->
      <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
        {{ errorMessage }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <app-input
          type="text"
          formControlName="name"
          placeholder="Nombre"
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
export class RegisterFormComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

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
      confirmPassword: ['', Validators.required]
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
      // Clear error if it was set by this validator
      if (confirmPassword.hasError('passwordMismatch')) {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          // If no other errors, setErrors(null)
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

      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.isLoading = false;
          // Redirige al dashboard o página principal
          this.router.navigate(['/dashboard']);
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
      console.error('Google Identity Services not loaded');
      return;
    }

    // @ts-ignore
    const client = google.accounts.oauth2.initTokenClient({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Reemplaza con tu Client ID real
      scope: 'email profile',
      callback: (response: any) => {
        if (response.access_token) {
          this.authService.loginWithGoogle(response.access_token).subscribe({
            next: (authResponse) => {
              console.log('Registro con Google exitoso', authResponse);
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error en registro con Google', error);
              this.errorMessage = 'Error al registrarse con Google. Intenta nuevamente.';
            }
          });
        }
      },
    });

    client.requestAccessToken();
  }
}
