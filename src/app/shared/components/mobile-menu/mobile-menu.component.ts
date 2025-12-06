import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mobile-menu',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
        class="bg-secondary-background shadow-lg py-4 px-6 flex flex-col gap-4 border-t border-white/10 animate-fade-in">
        <button *ngFor="let item of items" (click)="onItemClick(item.id)"
            class="text-left text-[#f5f5f5] text-lg font-medium hover:text-orange-200 transition-colors py-2 border-b border-white/5 last:border-0">
            {{ item.label }}
        </button>
    </div>
  `,
    styles: [`
    :host {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 40;
    }
  `]
})
export class MobileMenuComponent {
    @Input() items: { label: string; id: string }[] = [];
    @Output() itemClick = new EventEmitter<string>();

    onItemClick(id: string) {
        this.itemClick.emit(id);
    }
}
