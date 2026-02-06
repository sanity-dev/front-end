import { Routes } from '@angular/router';

import { WelcomePageComponent } from './features/homePage/pages/home/welcome-page.component';

import { StandardRegisterComponent } from './features/auth/standar/pages/register/standard-register.component';
import { StandardLoginComponent } from './features/auth/standar/pages/login/standard-login.component';

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'register', component: StandardRegisterComponent },
    { path: 'login', component: StandardLoginComponent },
    { path: 'emergency/confirm', loadComponent: () => import('./features/emergency/pages/confirm/confirm-emergency.component').then(m => m.ConfirmEmergencyComponent) },
    { path: 'emergency/sent', loadComponent: () => import('./features/emergency/pages/sent/alert-sent.component').then(m => m.AlertSentComponent) }
];
