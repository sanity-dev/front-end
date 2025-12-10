import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { GoogleButtonComponent } from '../../../../../shared/ui/google-button/google-button.component';
import { InputComponent } from '../../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, GoogleButtonComponent, InputComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
      <div>
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
          [disabled]="registerForm.invalid"
        >
          Registrarse
        </app-button>

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

  constructor(private fb: FormBuilder) {
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
      console.log('Form Submitted', this.registerForm.value);//borrar esto en produccion
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
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Client ID
      scope: 'email profile',
      callback: (response: any) => {
        if (response.access_token) {
          console.log('Google Access Token:', response.access_token);
          this.getUserProfile(response.access_token);
        }
      },
    });

    client.requestAccessToken();
  }

  getUserProfile(accessToken: string) {
    // Example of how to use the token to get user info (or send to backend)
    console.log('Fetching user profile with token...');
    // In a real app, you would send this token to your backend
    // this.authService.loginWithGoogle(accessToken).subscribe(...)
  }
}
