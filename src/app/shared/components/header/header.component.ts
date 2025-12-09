import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MobileMenuComponent],
    template: `
    <header
        class="flex items-center px-4 py-3 bg-secondary-background/80 backdrop-blur-sm sticky top-0 z-50"
        [ngClass]="justifyClass">
        <button class="p-2" (click)="toggleMenu()" [disabled]="disableMenuButton" [class.opacity-50]="disableMenuButton" [class.cursor-not-allowed]="disableMenuButton">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6 text-[#f5f5f5]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <app-mobile-menu 
            *ngIf="isMenuOpen" 
            [items]="menuItems" 
            (itemClick)="handleItemClick($event)">
        </app-mobile-menu>

        <div class="text-xl font-bold text-[#f5f5f5] ml-8"><a href="#">{{ title }}</a></div>
        <a href="#" class="text-base font-medium hover:primary text-[#f5f5f5]">{{ actionLabel }}</a>
    </header>
  `,
    styles: []
})
export class HeaderComponent {
    @Input() menuItems: { label: string; id: string }[] = [];
    @Input() disableMenuButton: boolean = false;
    @Input() title: string = 'Sanity';
    @Input() actionLabel: string = 'Iniciar sesión';
    @Input() justifyClass: string = 'justify-between';
    @Output() navigate = new EventEmitter<string>();

    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    handleItemClick(id: string) {
        this.isMenuOpen = false;
        this.navigate.emit(id);
    }
}
