import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-header-with-icons',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header
        class="flex items-center px-4 py-3 bg-linear-to-r from-secondary-background/80 to-blue-800/80 backdrop-blur-sm sticky top-0 z-50">

        <button class="p-2 cursor-pointer" (click)="onBack()" [disabled]="disableBack" [class.opacity-50]="disableBack">
            <img src="assets/icons/flechaBlack.svg" alt="back" class="w-6 h-6" />
        </button>

        <div class="flex-1 text-center text-xl font-bold text-[#f5f5f5]">{{ centerText }}</div>

        <button class="p-2 cursor-pointer" (click)="onNotification()" [disabled]="disableNotification" [class.opacity-50]="disableNotification">
            <img src="assets/icons/notificacionBlack.svg" alt="notifications" class="w-6 h-6" />
        </button>

    </header>
  `,
    styles: []
})
export class HeaderWithIconsComponent {
    @Input() centerText: string = 'Título';
    @Input() disableBack: boolean = false;
    @Input() disableNotification: boolean = false;

    @Output() back = new EventEmitter<void>();
    @Output() notificationClick = new EventEmitter<void>();

    constructor(private location: Location) { }

    onBack() {
        if (!this.disableBack) {
            this.location.back();
            this.back.emit();
        }
    }

    onNotification() {
        if (!this.disableNotification) this.notificationClick.emit();
    }
}
