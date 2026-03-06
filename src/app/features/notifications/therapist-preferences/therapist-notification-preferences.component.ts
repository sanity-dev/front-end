import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-therapist-notification-preferences',
    standalone: true,
    imports: [CommonModule, BottomNavComponent],
    templateUrl: './therapist-notification-preferences.component.html',
    styleUrls: ['./therapist-notification-preferences.component.css']
})
export class TherapistNotificationPreferencesComponent {
    notifications = {
        nuevasSolicitudes: true,
        recordatoriosCitas: true,
        mensajesPacientes: true,
        cambiosPerfil: true,
        appNotif: false,
        emailNotif: false,
        smsNotif: false
    };

    therapistNavItems = [
        { label: 'Pacientes', icon: 'pacientes', route: '/users/therapist/pacientes' },
        { label: 'Notificaciones', icon: 'notificaciones', route: '/users/therapist/notificaciones/preferencias' },
        { label: 'Mensajes', icon: 'chat', route: '/users/therapist/mensajes' },
        { label: 'Perfil', icon: 'usuario', route: '/users/therapist/perfil' }
    ];

    toggle(key: keyof typeof this.notifications) {
        this.notifications[key] = !this.notifications[key];
    }
}
