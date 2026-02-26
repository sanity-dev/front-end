import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { HeaderWithIconsComponent } from "../header/header-with-icons.component";

@Component({
  selector: 'app-standard-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BottomNavComponent, HeaderWithIconsComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Header -->
      <app-header-with-icons centerText="Sanity" [disableBack]="false" [disableNotification]="false" />

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
 
}
