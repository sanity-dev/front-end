import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { GoogleButtonComponent } from '../../../../../shared/ui/google-button/google-button.component';
import { InputComponent } from '../../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, GoogleButtonComponent, InputComponent],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <app-input
          type="email"
          formControlName="email"
          placeholder="Ingresa tu correo electrónico"
        ></app-input>
        <div *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="loginForm.get('email')?.errors?.['required']">El correo es requerido.</div>
          <div *ngIf="loginForm.get('email')?.errors?.['email']">Ingrese un correo válido.</div>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <app-input
          type="password"
          formControlName="password"
          placeholder="Ingresa tu contraseña"
        ></app-input>
        <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)" class="text-red-500 text-xs mt-1">
          <div *ngIf="loginForm.get('password')?.errors?.['required']">La contraseña es requerida.</div>
        </div>
      </div>

      <div class="flex justify-start">
        <a href="#" class="text-sm text-gray-400 hover:text-gray-600">¿Olvidaste tu contraseña?</a>
      </div>

      <div class="pt-2 space-y-3">
        <app-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          class="w-full block"
          [disabled]="loginForm.invalid"
        >
          Iniciar sesión
        </app-button>

        <app-google-button
          text="Continuar con Google"
          (onClick)="handleGoogleLogin()"
        ></app-google-button>
      </div>
      
      <div class="pt-8">
        <app-button
            type="button"
            variant="secondary"
            [fullWidth]="true"
            class="w-full block bg-gray-100 border-none text-gray-700 hover:bg-gray-200"
            route="/register"
          >
            Registrarse
        </app-button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Submitted', this.loginForm.value); //quitar esto en producción
    } else {
      this.loginForm.markAllAsTouched();
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
