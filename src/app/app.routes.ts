import { Routes } from '@angular/router';
import { JournalEntryComponent } from './features/journal-entry/journal-entry.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { WelcomePageComponent } from './features/homePage/pages/home/welcome-page.component';
import { StandardRegisterComponent } from './features/auth/standar/pages/register/standard-register.component';
import { StandardLoginComponent } from './features/auth/standar/pages/login/standard-login.component';

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'login', component: StandardLoginComponent },

    {
        path: 'emergency/confirm',
        loadComponent: () =>
            import('./features/emergency/pages/confirm/confirm-emergency.component')
                .then(m => m.ConfirmEmergencyComponent)
    },

    {
        path: 'emergency/sent',
        loadComponent: () =>
            import('./features/emergency/pages/sent/alert-sent.component')
                .then(m => m.AlertSentComponent)
    },

    {
        path: 'diario',
        loadComponent: () =>
            import('./features/journal-entry/journal-entry.component')
                .then(m => m.JournalEntryComponent)
    },

    {
        path: 'analytics',
        loadComponent: () =>
            import('./features/analytics/analytics.component')
                .then(m => m.AnalyticsComponent)
    },

    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/standar/pages/register/standard-register.component')
                .then(m => m.StandardRegisterComponent)
    },

    {
        path: 'therapist-register',
        loadComponent: () =>
            import('./features/auth/therapist/pages/register/therapist-register.component')
                .then(m => m.TherapistRegisterComponent)
    },
    {
        path: 'users/therapist',
        loadChildren: () => import('./features/users/therapist/therapist.routes').then(m => m.THERAPIST_ROUTES)
    },
    {
        path: 'forgot-password',
        loadChildren: () =>
            import('./features/reset-password/reset-password.routes')
                .then(m => m.RESET_PASSWORD_ROUTES)
    }

];
