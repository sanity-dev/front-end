import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toggle-switch',
    standalone: true,
    imports: [CommonModule],
    template: `
    <label class="relative inline-block w-12 h-[26px]">
      <input
        type="checkbox"
        class="opacity-0 w-0 h-0 peer"
        [checked]="checked"
        (change)="toggle()"
      />
      <span class="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all duration-300
        peer-checked:bg-linear-to-r peer-checked:from-secondary-background peer-checked:to-third-background
        before:content-[''] before:absolute before:h-5 before:w-5 before:left-[3px] before:bottom-[3px]
        before:bg-white before:rounded-full before:transition-all before:duration-300 before:shadow-sm
        peer-checked:before:translate-x-[22px]">
      </span>
    </label>
  `,
    styles: []
})
export class ToggleSwitchComponent {
    @Input() checked = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    toggle(): void {
        this.checked = !this.checked;
        this.checkedChange.emit(this.checked);
    }
}
