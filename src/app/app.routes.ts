import { Routes } from '@angular/router';
import { WelcomePageComponent } from './features/homePage/pages/home/welcome-page.component';
import { StandardLoginComponent } from './features/auth/standar/pages/login/standard-login.component';
import { StandardNotificationComponent } from './features/notifications/standard-notification.component';

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'login', component: StandardLoginComponent },
    { path: 'notificaciones', component: StandardNotificationComponent },
];
