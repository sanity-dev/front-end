import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NotificationModalComponent } from '../../shared/components/notification-modal/notification-modal.component';

@Component({
    selector: 'app-header-with-icons',
    standalone: true,
    imports: [CommonModule, NotificationModalComponent],
    template: `
    <header class="flex items-center px-4 py-3 bg-linear-to-r from-secondary-background/80 to-blue-800/80 backdrop-blur-sm sticky top-0 z-50">

      <!-- Botón izquierdo -->
      <button class="p-2 cursor-pointer" (click)="onBack()" [disabled]="disableBack" [class.opacity-50]="disableBack">
        <img src="assets/icons/flechaBlack.svg" alt="back" class="w-6 h-6" />
      </button>

      <!-- Título -->
      <div class="flex-1 text-center text-lg font-semibold text-white">{{ centerText }}</div>

      <!-- Botón derecho dinámico -->
      <button class="p-2 cursor-pointer relative" (click)="onRightAction()" [disabled]="disableRightIcon" [class.opacity-50]="disableRightIcon">
        <img [src]="'assets/icons/' + rightIconFile" [alt]="rightIcon" class="w-6 h-6" />
      </button>

      <!-- Modal de Notificaciones -->
      <app-notification-modal 
        *ngIf="showNotificationModal" 
        (close)="showNotificationModal = false">
      </app-notification-modal>

    </header>
  `,
    styles: []
})
export class HeaderWithIconsComponent {
    @Input() centerText: string = 'Título';
    @Input() disableBack: boolean = false;

    // Reemplaza disableNotification por el genérico
    @Input() disableRightIcon: boolean = false;

    // Ícono derecho: 'notification' | 'settings' | 'filter' | 'more' | etc.
    @Input() rightIcon: string = 'notification';

    @Output() back = new EventEmitter<void>();
    @Output() rightIconClick = new EventEmitter<void>();

    // Mantiene compatibilidad con el output anterior
    @Output() notificationClick = new EventEmitter<void>();

    constructor(private location: Location) { }

    get rightIconFile(): string {
        const iconMap: Record<string, string> = {
            notification: 'notificacionBlack.svg',
            settings: 'settings.svg',
            filter: 'filter.svg',
            more: 'more.svg',
            edit: 'edit.svg',
            search: 'search.svg',
        };
        return iconMap[this.rightIcon] ?? 'notificacionBlack.svg';
    }

    onBack(): void {
        if (!this.disableBack) {
            this.location.back();
            this.back.emit();
        }
    }

    showNotificationModal = false;

    onRightAction(): void {
        if (!this.disableRightIcon) {
            this.rightIconClick.emit();
            // Mostrar modal si el ícono es notificación
            if (this.rightIcon === 'notification') {
                this.showNotificationModal = !this.showNotificationModal;
            }
        }
    }
}