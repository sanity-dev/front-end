import { Routes } from '@angular/router';

export const SERVICES_ROUTES: Routes = [
  {
    path: '',
    // ✅ services.component.ts está en el MISMO nivel que services.routes.ts
    //    ambos en  src/app/features/services/
    loadComponent: () =>
      import('./services.component').then(m => m.ServicesComponent),
  },
];