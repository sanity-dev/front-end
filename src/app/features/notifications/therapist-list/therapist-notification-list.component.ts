import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

interface NotificationItem {
    patientName: string;
    message: string;
    avatarUrl: string;
}

@Component({
    selector: 'app-therapist-notification-list',
    standalone: true,
    imports: [CommonModule, BottomNavComponent],
    templateUrl: './therapist-notification-list.component.html',
    styleUrls: ['./therapist-notification-list.component.css']
})
export class TherapistNotificationListComponent {
    notifications: NotificationItem[] = [
        { patientName: 'Nombre del Paciente', message: 'Nueva solicitud de cita', avatarUrl: 'assets/images/avatar1.jpg' },
        { patientName: 'Nombre del Paciente', message: 'Cita confirmada', avatarUrl: 'assets/images/avatar2.jpg' },
        { patientName: 'Nombre del Paciente', message: 'Nuevo mensaje del paciente', avatarUrl: 'assets/images/avatar3.jpg' },
        { patientName: 'Nombre del Paciente', message: 'Solicitud de cambio de horario', avatarUrl: 'assets/images/avatar4.jpg' },
        { patientName: 'Nombre del Paciente', message: 'Cita confirmada', avatarUrl: 'assets/images/avatar5.jpg' },
        { patientName: 'Nombre del Paciente', message: 'Nuevo mensaje del paciente', avatarUrl: 'assets/images/avatar6.jpg' },
        { patientName: 'Nombre del Paciente', message: 'Solicitud de cambio de horario', avatarUrl: 'assets/images/avatar7.jpg' }
    ];

    therapistNavItems = [
        { label: 'Inicio', icon: 'home', route: '/users/therapist/dashboard' },
        { label: 'Pacientes', icon: 'pacientes', route: '/users/therapist/pacientes' },
        { label: 'Notificaciones', icon: 'notificaciones', route: '/users/therapist/notificaciones/lista' },
        { label: 'Perfil', icon: 'usuario', route: '/users/therapist/perfil' }
    ];
}
