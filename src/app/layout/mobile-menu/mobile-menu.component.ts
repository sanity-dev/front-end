import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mobile-menu',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
        class="bg-linear-to-b from-secondary-background to-slate-900 shadow-2xl py-6 px-4 flex flex-col gap-1 animate-fade-in backdrop-blur-sm">
        <button 
            *ngFor="let item of items; let last = last" 
            (click)="onItemClick(item.id)"
            class="group relative px-6 py-4 text-left text-[#f5f5f5] text-base font-semibold transition-all duration-300 ease-in-out
                     hover:bg-white/10 hover:text-orange-300 hover:translate-x-1
                     active:scale-95 active:bg-white/20
                     flex items-center gap-3
                     before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-400 before:rounded-l-lg before:scale-y-0 before:transition-transform before:duration-300 before:origin-center
                     group-hover:before:scale-y-100
                     {{ last ? '' : 'border-b border-white' }}">
            <span class="flex-1">{{ item.label }}</span>
            <span class="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-400/20 text-orange-300 rounded px-2 py-1">Click</span>
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
