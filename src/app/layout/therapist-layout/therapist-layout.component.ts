import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { HeaderWithIconsComponent } from '../header/header-with-icons.component';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-therapist-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BottomNavComponent, HeaderWithIconsComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <app-header-with-icons
        [centerText]="headerText"
        [rightIcon]="headerRightIcon"
        [disableBack]="false"
        [disableRightIcon]="false"
        (rightIconClick)="onRightIconClick()"
      />
      <main class="flex-1 pb-18">
        <router-outlet />
      </main>
      <app-bottom-nav [items]="navItems" />
    </div>
  `,
  styles: []
})
export class TherapistLayoutComponent {
  headerText = 'Sanity';
  headerRightIcon = 'notification';

  navItems = [
    { label: 'Inicio', icon: 'home', route: '/users/therapist/dashboard' },
    { label: 'Pacientes', icon: 'pacientes', route: '/users/therapist/patients' },
    { label: 'Servicios', icon: 'servicio', route: '/users/therapist/services' },
    { label: 'Perfil', icon: 'usuario', route: '/users/therapist/profile' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child?.snapshot.data;
      })
    ).subscribe(data => {
      this.headerText = data?.['headerText'] || 'Sanity';
      this.headerRightIcon = data?.['headerRightIcon'] || 'notification';
    });
  }

  onRightIconClick(): void {
    const actionMap: Record<string, string> = {
      settings: '/users/therapist/settings',
    };
    const route = actionMap[this.headerRightIcon];
    if (route) this.router.navigate([route]);
  }
}