import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { GoogleButtonComponent } from '../../../../../shared/components/google-button/google-button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-therapist-register-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, GoogleButtonComponent, InputComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
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
          type="text"
          formControlName="documentNumber"
          placeholder="Número de documento"
        ></app-input>
        <div *ngIf="registerForm.get('documentNumber')?.invalid && (registerForm.get('documentNumber')?.dirty || registerForm.get('documentNumber')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('documentNumber')?.errors?.['required']">El número de documento es requerido.</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
        <select
          formControlName="specialty"
          class="border-[0.065rem] border-[#d1d9e0] rounded-md w-full px-4 py-3 focus:ring-2 focus:ring-sky-500 text-gray-800 transition-all outline-none bg-white"
        >
          <option value="" disabled>Selecciona una especialidad</option>
          <option value="anxiety">Ansiedad</option>
          <option value="depression">Depresión</option>
          <option value="relationships">Problemas de relación</option>
          <option value="other">Otra</option>
        </select>
        <div *ngIf="registerForm.get('specialty')?.invalid && (registerForm.get('specialty')?.dirty || registerForm.get('specialty')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('specialty')?.errors?.['required']">Selecciona una especialidad.</div>
        </div>
      </div>

      <div *ngIf="registerForm.get('specialty')?.value === 'other'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Otra especialidad</label>
        <app-input
          type="text"
          formControlName="otherSpecialty"
          placeholder="Especifica tu especialidad"
        ></app-input>
        <div *ngIf="registerForm.get('otherSpecialty')?.invalid && (registerForm.get('otherSpecialty')?.dirty || registerForm.get('otherSpecialty')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('otherSpecialty')?.errors?.['required']">Especifica tu especialidad.</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número de teléfono</label>
        <app-input
          type="tel"
          formControlName="phoneNumber"
          placeholder="Número de teléfono"
        ></app-input>
        <div *ngIf="registerForm.get('phoneNumber')?.invalid && (registerForm.get('phoneNumber')?.dirty || registerForm.get('phoneNumber')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="registerForm.get('phoneNumber')?.errors?.['required']">El número de teléfono es requerido.</div>
          <div *ngIf="registerForm.get('phoneNumber')?.errors?.['pattern']">Ingrese un número de teléfono válido.</div>
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
export class TherapistRegisterFormComponent {
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
      confirmPassword: ['', Validators.required],
      documentNumber: ['', Validators.required],
      specialty: ['', Validators.required],
      otherSpecialty: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]]
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

      const { confirmPassword, otherSpecialty, ...registerData } = this.registerForm.value;

      // Si la especialidad es "other", usar otherSpecialty
      if (registerData.specialty === 'other') {
        registerData.specialty = otherSpecialty;
      }

      this.authService.registerTherapist(registerData).subscribe({
        next: (response) => {
          console.log('Registro de terapeuta exitoso', response);
          this.isLoading = false;
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
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
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
