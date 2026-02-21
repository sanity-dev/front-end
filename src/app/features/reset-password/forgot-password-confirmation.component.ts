import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HeaderWithIconsComponent } from "../../layout/header/header-with-icons.component";


@Component({
    selector: 'app-forgot-password-confirmation',
    standalone: true,
    imports: [ButtonComponent, HeaderWithIconsComponent],
    template: `
    <div class="flex flex-col min-h-screen ">
     <!-- Header -->
     <app-header-with-icons [centerText]="'Restablecer contraseña'" [disableBack]="false" [disableNotification]="false"></app-header-with-icons>

      <!-- Contenido centrado -->
      <div class="flex flex-col flex-1 items-center justify-start px-6 pt-12">

        <h1 class="text-2xl font-extrabold text-text-primary text-center leading-tight tracking-tight mb-6">
          Revisa tu correo electrónico
        </h1>

        <p class="text-sm text-text-primary text-center leading-relaxed">
          Hemos enviado un enlace para restablecer tu contraseña a tu dirección de correo electrónico.
          Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu
          contraseña. Si no ves el correo electrónico, revisa tu carpeta de spam.
        </p>

      </div>

      <!-- Botón fijo en la parte inferior -->
      <div class="px-6 pb-10">
        <app-button
          variant="primary"
          [fullWidth]="true"
          (click)="goToLogin()"
        >
          Volver a iniciar sesión
        </app-button>
      </div>

    </div>
  `,
    styles: []
})
export class ForgotPasswordConfirmationComponent {
    private router = inject(Router);

    goToLogin() {
        this.router.navigate(['/login']);
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