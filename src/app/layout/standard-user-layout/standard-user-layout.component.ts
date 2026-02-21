import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-standard-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, BottomNavComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Header -->
      <app-header
        [title]="'Sanity'"
        [actionLabel]="'Perfil'"
        [actionRoute]="'/profile'"
        [menuItems]="menuItems"
        (navigate)="handleNavigation($event)"
      />

      <!-- Main Content -->
      <main class="flex-1 pb-24">
        <router-outlet />
      </main>

      <!-- Bottom Navigation -->
      <app-bottom-nav />
    </div>
  `,
  styles: []
})
export class StandardUserLayoutComponent {
  menuItems = [
    { label: 'Inicio', id: 'dashboard' },
    { label: 'Diario', id: 'journal-entry' },
    { label: 'EuphorIA', id: 'euphoria' },
    { label: 'Servicios', id: 'services' },
    { label: 'Perfil', id: 'profile' }
  ];

  handleNavigation(id: string): void {
    // Manejar la navegación si es necesario
    console.log('Navegando a:', id);
  }
}
