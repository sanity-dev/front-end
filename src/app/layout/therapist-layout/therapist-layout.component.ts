import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { HeaderWithIconsComponent } from '../header/header-with-icons.component';

@Component({
    selector: 'app-therapist-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, BottomNavComponent, HeaderWithIconsComponent],
    template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Header -->
      <app-header-with-icons centerText="Sanity" [disableBack]="false" [disableNotification]="false" />

      <!-- Main Content -->
      <main class="flex-1 pb-18">
        <router-outlet />
      </main>

      <!-- Bottom Navigation -->
      <app-bottom-nav [items]="navItems" />
    </div>
  `,
    styles: []
})
export class TherapistLayoutComponent {

    navItems = [
        { label: 'Inicio', icon: 'home', route: '/users/therapist/welcome' },
        { label: 'Agenda', icon: 'agenda', route: '/users/therapist/agenda' },
        { label: 'Pacientes', icon: 'pacientes', route: '/users/therapist/patients' },
        { label: 'Servicios', icon: 'servicio', route: '/users/therapist/services' },
        { label: 'Perfil', icon: 'usuario', route: '/users/therapist/profile' }
    ];
}
