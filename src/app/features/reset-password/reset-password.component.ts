import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { AuthService } from '../../core/services/auth.service';
import { HeaderWithIconsComponent } from '../../layout/header/header-with-icons.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, HeaderWithIconsComponent],
  template: `
    <div class="flex flex-col min-h-screen ">

     <!-- Header -->
     <app-header-with-icons [centerText]="'Restablecer contraseña'" [disableBack]="false" [disableRightIcon]="false"></app-header-with-icons>

      <!-- Contenido -->
      <div class="flex flex-col flex-1 px-6 pt-8">

        <h1 class="text-[26px] font-extrabold text-text-primary leading-tight tracking-tight mb-3">
          Crea una nueva contraseña
        </h1>

        <p class="text-sm text-text-primary leading-relaxed mb-8">
          Ingresa tu nueva contraseña a continuación para recuperar el acceso a tu cuenta.
        </p>

        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

          <!-- Mensaje de éxito -->
          <div *ngIf="successMessage"
               class="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm mb-4">
            {{ successMessage }}
          </div>

          <!-- Mensaje de error -->
          <div *ngIf="errorMessage"
               class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {{ errorMessage }}
          </div>

          <ng-container *ngIf="!successMessage">
            <!-- Campo contraseña -->
            <div class="flex flex-col gap-1">
              <app-input
                type="password"
                formControlName="password"
                placeholder="Nueva contraseña"
              ></app-input>
              <div
                *ngIf="resetPasswordForm.get('password')?.invalid && (resetPasswordForm.get('password')?.dirty || resetPasswordForm.get('password')?.touched)"
                class="text-red-600 text-xs pl-1">
                <span *ngIf="resetPasswordForm.get('password')?.errors?.['required']">La contraseña es requerida.</span>
                <span *ngIf="resetPasswordForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres.</span>
              </div>
            </div>

            <!-- Campo confirmar contraseña -->
            <div class="flex flex-col gap-1 mt-2">
              <app-input
                type="password"
                formControlName="confirmPassword"
                placeholder="Confirmar nueva contraseña"
              ></app-input>
              <div
                *ngIf="resetPasswordForm.get('confirmPassword')?.invalid && (resetPasswordForm.get('confirmPassword')?.dirty || resetPasswordForm.get('confirmPassword')?.touched)"
                class="text-red-600 text-xs pl-1">
                <span *ngIf="resetPasswordForm.get('confirmPassword')?.errors?.['required']">Debes confirmar la contraseña.</span>
              </div>
              <div
                *ngIf="resetPasswordForm.errors?.['passwordMismatch'] && (resetPasswordForm.get('confirmPassword')?.dirty || resetPasswordForm.get('confirmPassword')?.touched)"
                class="text-red-600 text-xs pl-1">
                Las contraseñas no coinciden.
              </div>
            </div>

            <!-- Botón -->
            <app-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [disabled]="resetPasswordForm.invalid || isLoading"
              class="mt-6 w-full block"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar contraseña' }}
            </app-button>
          </ng-container>

          <ng-container *ngIf="successMessage">
             <app-button
              type="button"
              variant="primary"
              [fullWidth]="true"
              (click)="goToLogin()"
              class="mt-2 w-full block"
            >
              Ir a Iniciar Sesión
            </app-button>
          </ng-container>

        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage = 'El enlace de recuperación no es válido o está incompleto.';
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (!this.token) {
      this.errorMessage = 'Token de seguridad inválido. Vuelve a solicitar la recuperación.';
      return;
    }

    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const newPassword = this.resetPasswordForm.value.password;

      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.mensaje || '¡Tu contraseña ha sido actualizada con éxito!';
          this.resetPasswordForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || error.error?.message || 'Ocurrió un error al actualizar la contraseña.';
        }
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
