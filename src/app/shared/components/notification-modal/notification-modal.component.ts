import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notification-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="absolute top-16 right-4 sm:right-6 md:right-8 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden flex flex-col max-h-[400px]">
      
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
        <h3 class="font-bold text-gray-800">Notificaciones</h3>
        <span class="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full" *ngIf="unreadCount > 0">
          {{ unreadCount }} nuevas
        </span>
      </div>

      <!-- Loading / Error States -->
      <div *ngIf="loading" class="p-6 flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <div *ngIf="error" class="p-4 text-center text-sm text-red-500 bg-red-50 m-2 rounded-xl">
        {{ error }}
      </div>

      <!-- Notifications List -->
      <div class="overflow-y-auto flex-1 p-2" *ngIf="!loading && !error">
        
        <div *ngIf="notifications.length === 0" class="text-center py-8 text-gray-500 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p class="text-sm">No tienes notificaciones</p>
        </div>

        <div *ngFor="let notification of limitNotifications" 
             class="p-3 mb-2 rounded-xl transition-colors cursor-pointer hover:bg-gray-50 border border-transparent"
             [ngClass]="{'bg-blue-50/50 border-blue-100/50': !notification.leida}"
             (click)="markAsRead(notification)">
          
          <div class="flex items-start gap-3">
            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-lg">
              {{ getTypeIcon(notification.tipo) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-0.5">
                <h4 class="text-sm font-bold text-gray-800 truncate pr-2" [class.text-blue-900]="!notification.leida">
                  {{ notification.titulo }}
                </h4>
                <span class="text-[10px] text-gray-500 shrink-0 whitespace-nowrap mt-0.5">{{ getTimeAgo(notification.fechaCreacion) }}</span>
              </div>
              <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {{ notification.mensaje }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div class="p-3 border-t border-gray-100 bg-white shrink-0">
        <button (click)="goToAll()" class="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          Ver todas las notificaciones
        </button>
      </div>

    </div>

    <!-- Backdrop to close modal when clicking outside -->
    <div class="fixed inset-0 z-[90]" (click)="close.emit()"></div>
  `
})
export class NotificationModalComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    notifications: Notification[] = [];
    loading = true;
    error = '';

    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        this.loading = true;
        this.error = '';
        this.notificationService.getMyNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error cargando notificaciones en modal:', err);
                this.error = 'Error cargando notificaciones';
                this.loading = false;
            }
        });
    }

    get limitNotifications() {
        // Show top 4 notifications in modal
        return this.notifications.slice(0, 4);
    }

    get unreadCount() {
        return this.notifications.filter(n => !n.leida).length;
    }

    getTypeIcon(tipo: string): string {
        switch (tipo?.toUpperCase()) {
            case 'PUSH': return '🔔';
            case 'EMAIL': return '📧';
            case 'SISTEMA': return '⚙️';
            default: return '📢';
        }
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

    markAsRead(notification: Notification) {
        if (notification.leida) return;
        this.notificationService.markAsRead(notification.id).subscribe({
            next: (updated) => {
                const index = this.notifications.findIndex(n => n.id === notification.id);
                if (index !== -1) {
                    this.notifications[index] = updated;
                }
            }
        });
    }

    goToAll() {
        this.close.emit();
        // Assuming you want to route to the standard notification page
        // The route varies depending on user type, but standard one is '/user/notifications/standard'
        // Let's use router to figure out the right path based on current URL or just navigate
        if (this.router.url.includes('/therapist')) {
            this.router.navigate(['/therapist/notifications']);
        } else {
            this.router.navigate(['/user/notifications/standard']);
        }
    }
}
