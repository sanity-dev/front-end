import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MobileMenuComponent, RouterLink],
    template: `
    <header
        class="flex items-center px-4 py-3 bg-linear-to-r from-secondary-background/80 to-blue-800/80 backdrop-blur-sm sticky top-0 z-50"
        [ngClass]="justifyClass">
        <a *ngIf="showBackButton" routerLink="/" class="p-2 cursor-pointer z-10 text-[#f5f5f5] hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </a>
        <button *ngIf="!hideMenuButton" class="p-2 cursor-pointer z-10" (click)="toggleMenu()" [disabled]="disableMenuButton" [class.opacity-50]="disableMenuButton" [class.cursor-not-allowed]="disableMenuButton">
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

        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-[#f5f5f5] z-10">
            <a routerLink="/" class="cursor-pointer">{{ title }}</a>
        </div>
        
        <a [routerLink]="actionRoute" class="text-base font-medium hover:opacity-80 text-[#f5f5f5] cursor-pointer ml-auto z-10">{{ actionLabel }}</a>
    </header>
  `,
    styles: []
})
export class HeaderComponent {
    @Input() menuItems: { label: string; id: string }[] = [];
    @Input() disableMenuButton: boolean = false;
    @Input() hideMenuButton: boolean = false;
    @Input() showBackButton: boolean = false;
    @Input() title: string = 'Sanity';
    @Input() actionLabel: string = 'Iniciar sesión';
    @Input() actionRoute: string = '/login';
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
