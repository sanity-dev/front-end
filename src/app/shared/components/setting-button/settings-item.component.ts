import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch.component';

export type SettingsItemType = 'navigate' | 'toggle' | 'value' | 'danger';

@Component({
    selector: 'app-settings-item',
    standalone: true,
    imports: [CommonModule, ToggleSwitchComponent],
    template: `
    <div
      class="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm transition-colors cursor-pointer group"
      [class.justify-between]="type !== 'danger'"
      [class.hover:bg-gray-50]="type === 'navigate' || type === 'value' || type === 'toggle'"
      [class.hover:bg-red-50]="type === 'danger'"
      (click)="handleClick()"
    >
      <!-- Icono + Texto -->
      <div class="flex items-center gap-3 flex-1">
        <div
          class="w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-colors"
          [class.bg-sky-50]="type !== 'danger'"
          [class.bg-red-50]="type === 'danger'"
          [class.group-hover:bg-red-100]="type === 'danger'"
        >
          <ng-content select="[icon]" />
        </div>
        <div>
          <p
            class="text-sm font-semibold leading-tight transition-colors"
            [class.text-text-primary]="type !== 'danger'"
            [class.text-gray-700]="type === 'danger'"
            [class.group-hover:text-red-600]="type === 'danger'"
          >{{ label }}</p>
          <p *ngIf="description" class="text-xs text-gray-400 leading-tight mt-0.5">{{ description }}</p>
        </div>
      </div>

      <!-- Trailing -->
      <ng-container *ngIf="type === 'navigate'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </ng-container>

      <ng-container *ngIf="type === 'toggle'">
        <app-toggle-switch
          [checked]="checked"
          (checkedChange)="onToggleChange($event)"
        />
      </ng-container>

      <ng-container *ngIf="type === 'value'">
        <span class="text-sm text-gray-500 font-medium shrink-0">{{ value }}</span>
      </ng-container>

    </div>
  `
})
export class SettingsItemComponent {
    @Input() label = '';
    @Input() description = '';
    @Input() type: SettingsItemType = 'navigate';

    @Input() checked = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    @Input() value = '';

    @Output() itemClick = new EventEmitter<void>();

    handleClick(): void {
        if (this.type !== 'toggle') {
            this.itemClick.emit();
        }
    }

    onToggleChange(value: boolean): void {
        this.checked = value;
        this.checkedChange.emit(value);
    }
}