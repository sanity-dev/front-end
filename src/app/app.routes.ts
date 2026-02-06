import { Routes } from '@angular/router';
import { JournalEntryComponent } from './features/journal-entry/journal-entry.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';

export const routes: Routes = [
    { path: '', component: JournalEntryComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'analisis', redirectTo: 'analytics' }
];
