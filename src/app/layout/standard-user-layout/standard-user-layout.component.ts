import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { HeaderWithIconsComponent } from "../header/header-with-icons.component";
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-standard-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BottomNavComponent, HeaderWithIconsComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Header -->
      <app-header-with-icons
        [centerText]="headerText"
        [rightIcon]="headerRightIcon"
        [disableBack]="false"
        [disableRightIcon]="false"
        (rightIconClick)="onRightIconClick()"
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
  headerText = 'Sanity';
  headerRightIcon = 'notification';

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
      settings: '/user/settings',
      notification: '/user/notifications',
    };
    const route = actionMap[this.headerRightIcon];
    if (route) this.router.navigate([route]);
  }
}
