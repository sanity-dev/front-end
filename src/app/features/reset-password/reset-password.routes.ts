import { Routes } from '@angular/router';

export const RESET_PASSWORD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./forgot-password.component')
        .then(m => m.ForgotPasswordFormComponent)
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./forgot-password-confirmation.component')
        .then(m => m.ForgotPasswordConfirmationComponent)
  }
];