import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
    selector: 'app-therapist-notification-list',
    standalone: true,
    imports: [CommonModule, BottomNavComponent],
    templateUrl: './therapist-notification-list.component.html',
    styleUrls: ['./therapist-notification-list.component.css']
})
export class TherapistNotificationListComponent implements OnInit {
    notifications: Notification[] = [];
    loading = true;
    error = '';

    therapistNavItems = [
        { label: 'Inicio', icon: 'home', route: '/users/therapist/dashboard' },
        { label: 'Pacientes', icon: 'pacientes', route: '/users/therapist/pacientes' },
        { label: 'Notificaciones', icon: 'notificaciones', route: '/users/therapist/notificaciones/lista' },
        { label: 'Perfil', icon: 'usuario', route: '/users/therapist/perfil' }
    ];

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.loadNotifications();
    }

    loadNotifications(): void {
        this.loading = true;
        this.error = '';
        this.notificationService.getMyNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error cargando notificaciones:', err);
                this.error = 'No se pudieron cargar las notificaciones.';
                this.loading = false;
            }
        });
    }

    markAsRead(notification: Notification): void {
        if (notification.leida) return;
        this.notificationService.markAsRead(notification.id).subscribe({
            next: (updated) => {
                const index = this.notifications.findIndex(n => n.id === notification.id);
                if (index !== -1) {
                    this.notifications[index] = updated;
                }
            },
            error: (err) => console.error('Error marcando como leída:', err)
        });
    }

    deleteNotification(id: number): void {
        this.notificationService.deleteNotification(id).subscribe({
            next: () => {
                this.notifications = this.notifications.filter(n => n.id !== id);
            },
            error: (err) => console.error('Error eliminando notificación:', err)
        });
    }

    getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    }

    getTypeIcon(tipo: string): string {
        switch (tipo?.toUpperCase()) {
            case 'PUSH': return '🔔';
            case 'EMAIL': return '📧';
            case 'SISTEMA': return '⚙️';
            default: return '📢';
        }
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.leida).length;
    }
}
