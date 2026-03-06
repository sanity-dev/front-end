import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { GoogleButtonComponent } from '../../../../../shared/components/google-button/google-button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, GoogleButtonComponent, InputComponent, RouterLink],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
      <!-- Mensaje de error general -->
      <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
        {{ errorMessage }}
      </div>

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
        <a routerLink="/forgot-password" class="text-sm text-text-secondary hover:text-gray-600">¿Olvidaste tu contraseña?</a>
      </div>

      <div class="pt-2 space-y-4">
        <app-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          class="w-full block"
          [disabled]="loginForm.invalid || isLoading"
        >
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </app-button>
        
        <div class="relative flex items-center gap-4">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="text-gray-400 text-sm font-medium">O</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>
        
        <app-google-button
          text="Continuar con Google"
          (onClick)="handleGoogleLogin()"
        ></app-google-button>
      </div>
      
     <div class="mt-12 text-xl text-center text-text-secondary space-y-2">
                <a routerLink="/register" class="block underline font-semibold">Registrarse</a>
     </div>
    </form>
  `,
  styles: []
})
export class LoginFormComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirige al dashboard según tipo de usuario
          this.router.navigate([this.authService.getRedirectUrl()]);
        },
        error: (error) => {
          console.error('Error en el inicio de sesión', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error en el inicio de sesión. Verifica tus credenciales.';
        }
      });
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
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Reemplaza con tu Client ID real
      scope: 'email profile',
      callback: (response: any) => {
        if (response.access_token) {
          this.authService.loginWithGoogle(response.access_token).subscribe({
            next: (authResponse) => {
              this.router.navigate([this.authService.getRedirectUrl()]);
            },
            error: (error) => {
              console.error('Error en inicio de sesión con Google', error);
              this.errorMessage = 'Error al iniciar sesión con Google. Intenta nuevamente.';
            }
          });
        }
      },
    });

    client.requestAccessToken();
  }
}
