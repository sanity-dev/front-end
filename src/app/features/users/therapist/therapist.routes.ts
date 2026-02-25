import { Routes } from '@angular/router';
import { TherapistLayoutComponent } from '../../../layout/therapist-layout/therapist-layout.component';

export const THERAPIST_ROUTES: Routes = [
    {
        path: '',
        component: TherapistLayoutComponent,
        children: [
            {
                path: 'welcome',
                loadComponent: () => import('./pages/welcome/welcome-therapist.component').then(m => m.WelcomeTherapistComponent)
            },
            {
                path: 'create-profile',
                loadComponent: () => import('./pages/create-profile/create-profile.component').then(m => m.CreateProfileComponent)
            },
            {
                path: 'profile-ready',
                loadComponent: () => import('./pages/profile-ready/profile-ready.component').then(m => m.ProfileReadyComponent)
            },
            {
                path: 'verification',
                loadComponent: () => import('./pages/verification/verification.component').then(m => m.VerificationComponent)
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./dashboard/therapist-dashboard.component')
                        .then(m => m.TherapistDashboardComponent)
            },
            {
                path: '',
                redirectTo: 'welcome',
                pathMatch: 'full'
            }
        ]
    }
];
