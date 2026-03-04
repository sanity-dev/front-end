import { Routes } from '@angular/router';
import { JournalEntryComponent } from './features/journal-entry/journal-entry.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { WelcomePageComponent } from './features/homePage/pages/home/welcome-page.component';
import { StandardRegisterComponent } from './features/auth/standar/pages/register/standard-register.component';
import { StandardLoginComponent } from './features/auth/standar/pages/login/standard-login.component';
<<<<<<< HEAD
import { StandardNotificationComponent } from './features/notifications/standard-notification.component';
=======
import { StandardUserLayoutComponent } from './layout/standard-user-layout/standard-user-layout.component';
import { TherapistLayoutComponent } from './layout/therapist-layout/therapist-layout.component';
>>>>>>> 66496bd31736919b1841436a693eebf9408c7a5c

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'login', component: StandardLoginComponent },
<<<<<<< HEAD
    { path: 'emergency/confirm', loadComponent: () => import('./features/emergency/pages/confirm/confirm-emergency.component').then(m => m.ConfirmEmergencyComponent) },
    { path: 'emergency/sent', loadComponent: () => import('./features/emergency/pages/sent/alert-sent.component').then(m => m.AlertSentComponent) },
    { path: 'diario', component: JournalEntryComponent },
    { path: 'notificaciones', component: StandardNotificationComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'analisis', redirectTo: 'analytics' }
=======

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
    },
    {
        path: 'euphoria/chat',
        loadComponent: () =>
            import('./features/diary/components/chat.component')
                .then(m => m.ChatComponent)
    },
    {
        path: 'user',
        component: StandardUserLayoutComponent,
        children: [
            {
                path: 'dashboard',
                data: { headerText: 'Sanity' },
                loadComponent: () =>
                    import('./features/users/standar/dashboard/standard-dashboard.component')
                        .then(m => m.StandardDashboardComponent)
            },
            {
                path: 'profile',
                data: { headerText: 'Perfil' },
                loadComponent: () =>
                    import('./features/users/standar/profile/standard-profile.component')
                        .then(m => m.StandardProfileComponent)
            }
        ]
    },
    {
        path: 'profile',
        redirectTo: 'user/profile',
        pathMatch: 'full'
    },


>>>>>>> 66496bd31736919b1841436a693eebf9408c7a5c
];

