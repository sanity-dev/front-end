import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-gray-400 border-t border-gray-300 px-4 py-2 flex justify-around items-center z-50">
      <button
        *ngFor="let item of items"
        (click)="navigate(item.route)"
        class="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200"
        [ngClass]="isActive(item.route) ? 'opacity-100' : 'opacity-80 hover:opacity-100'"
        [attr.aria-current]="isActive(item.route) ? 'page' : null"
      >
        <div class="w-6 h-6">
          <app-icon
            [name]="isActive(item.route) ? item.icon + 'Black' : item.icon + 'White'"
            [class]="'w-6 h-6'"
          />
        </div>
        <span class="text-[.625rem] font-medium" [ngClass]="isActive(item.route) ? 'text-black' : 'text-white'">{{ item.label }}</span>
      </button>
    </nav>
  `,
  styles: []
})
export class BottomNavComponent implements OnInit {
  items: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard' },
    { label: 'Diario', icon: 'diario', route: '/journal-entry' },
    { label: 'EuphorIA', icon: 'agente', route: '/euphoria' },
    { label: 'Servicios', icon: 'servicio', route: '/services' },
    { label: 'Perfil', icon: 'usuario', route: '/profile' }
  ];

  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Establecer la ruta inicial
    this.currentRoute = this.router.url;

    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  isActive(route: string): boolean {
    return this.currentRoute.includes(route.split('/')[1]);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  getIconName(icon: string, isActive: boolean): string {
    const colorSuffix = isActive ? 'Black' : 'White';
    
    // Caso especial para home (blackHome/whiteHome)
    if (icon === 'home') {
      return isActive ? 'blackHome' : 'whiteHome';
    }
    
    // Para otros iconos: diarioBlack, diarioWhite, etc.
    return icon + colorSuffix;
  }

}