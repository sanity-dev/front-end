import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-standard-notification',
    standalone: true,
    imports: [CommonModule, BottomNavComponent],
    templateUrl: './standard-notification.component.html',
    styleUrls: ['./standard-notification.component.css']
})
export class StandardNotificationComponent {
    notifications = {
        citas: false,
        actividades: false,
        habitos: false,
        nuevasActividades: false,
        mensajesIA: false,
        push: false,
        email: false
    };

    toggle(key: keyof typeof this.notifications) {
        this.notifications[key] = !this.notifications[key];
    }
}
