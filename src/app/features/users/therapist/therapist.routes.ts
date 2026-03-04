import { Routes } from '@angular/router';
import { TherapistLayoutComponent } from '../../../layout/therapist-layout/therapist-layout.component';

export const THERAPIST_ROUTES: Routes = [
    {
        path: '',
        component: TherapistLayoutComponent,
        children: [
            {
                path: 'welcome',
                data: { headerText: 'Bienvenido' },
                loadComponent: () => import('./pages/welcome/welcome-therapist.component').then(m => m.WelcomeTherapistComponent)
            },
            {
                path: 'create-profile',
                data: { headerText: 'Crear Perfil' },
                loadComponent: () => import('./pages/create-profile/create-profile.component').then(m => m.CreateProfileComponent)
            },
            {
                path: 'profile-ready',
                data: { headerText: 'Perfil Listo' },
                loadComponent: () => import('./pages/profile-ready/profile-ready.component').then(m => m.ProfileReadyComponent)
            },
            {
                path: 'verification',
                data: { headerText: 'Verificación' },
                loadComponent: () => import('./pages/verification/verification.component').then(m => m.VerificationComponent)
            },
            {
                path: 'dashboard',
                data: { headerText: 'Sanity' },
                loadComponent: () =>
                    import('./dashboard/therapist-dashboard.component')
                        .then(m => m.TherapistDashboardComponent)
            },
            {
                path: 'profile',
                data: { headerText: 'Perfil' },
                loadComponent: () =>
                    import('./pages/profile/therapist-profile.component')
                        .then(m => m.TherapistProfileComponent)
            },
            {
                path: '',
                redirectTo: 'welcome',
                pathMatch: 'full'
            }
        ]
    }
];
