import { Routes } from '@angular/router';
import { JournalEntryComponent } from './features/journal-entry/journal-entry.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';

export const routes: Routes = [
    { path: 'diario', component: JournalEntryComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'analisis', redirectTo: 'analytics' }
import { WelcomePageComponent } from './features/homePage/pages/home/welcome-page.component';

import { StandardRegisterComponent } from './features/auth/standar/pages/register/standard-register.component';
import { StandardLoginComponent } from './features/auth/standar/pages/login/standard-login.component';

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'register', component: StandardRegisterComponent },
    { path: 'login', component: StandardLoginComponent }
];
