import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-info-field',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center justify-between py-3">
      <div class="flex flex-col gap-0.5">
        <span class="text-base font-medium text-text-primary">{{ value }}</span>
        <span class="text-xs text-gray-400">{{ label }}</span>
      </div>
      <button
        *ngIf="editable"
        class="p-2 border-none bg-transparent text-gray-400 cursor-pointer rounded-lg transition-all duration-200 hover:text-secondary-background hover:bg-secondary-background/10"
        (click)="edit.emit()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
        </svg>
      </button>
    </div>
  `,
    styles: []
})
export class InfoFieldComponent {
    @Input() value = '';
    @Input() label = '';
    @Input() editable = true;
    @Output() edit = new EventEmitter<void>();
}
