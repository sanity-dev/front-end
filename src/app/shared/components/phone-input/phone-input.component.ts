import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Reusable phone input with a fixed country-code prefix badge.
 *
 * Usage with reactive forms:
 *   <app-phone-input formControlName="phone" label="Teléfono"></app-phone-input>
 *
 * The value emitted to the form already includes the prefix (+57 by default).
 * e.g. user types "3001234567" → form value is "+573001234567"
 *
 * Inputs:
 *   prefix      — country code badge text   (default "+57")
 *   placeholder — inner input placeholder   (default "3001234567")
 *   label       — optional label above      (default "")
 *   maxlength   — max digits the user types (default 10)
 */
@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>

      <div
        class="flex rounded-md w-full overflow-hidden border transition-all bg-white"
        [class.border-gray-300]="!focused && !disabled"
        [class.border-secondary-background]="focused"
        [class.ring-1]="focused"
        [class.ring-secondary-background]="focused"
        [class.opacity-50]="disabled"
        [class.cursor-not-allowed]="disabled"
      >
        <!-- Prefijo país -->
        <span
          class="flex items-center px-3 bg-gray-100 text-sm font-semibold text-gray-600 border-r border-gray-300 select-none shrink-0"
        >{{ prefix }}</span>

        <!-- Campo numérico -->
        <input
          type="tel"
          [placeholder]="placeholder"
          [attr.maxlength]="maxlength"
          inputmode="numeric"
          [disabled]="disabled"
          [value]="displayValue"
          (input)="onInput($event)"
          (focus)="focused = true"
          (blur)="onBlur()"
          class="flex-1 px-4 py-3 text-sm w-full text-gray-800 placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>
    </div>
  `,
})
export class PhoneInputComponent implements ControlValueAccessor {
  @Input() prefix      = '+57';
  @Input() placeholder = '3001234567';
  @Input() label       = '';
  @Input() maxlength   = 10;

  /** Digits-only portion shown inside the input (without the prefix) */
  displayValue = '';
  disabled     = false;
  focused      = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void         = () => {};

  // ── ControlValueAccessor ────────────────────────────────────────────

  writeValue(value: string): void {
    if (!value) { this.displayValue = ''; return; }
    // Strip the prefix if it was already stored with it
    this.displayValue = value.startsWith(this.prefix)
      ? value.slice(this.prefix.length)
      : value;
  }

  registerOnChange(fn: (v: string) => void): void  { this.onChange  = fn; }
  registerOnTouched(fn: () => void): void           { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void       { this.disabled  = isDisabled; }

  // ── Handlers ────────────────────────────────────────────────────────

  onInput(event: Event): void {
    const raw   = (event.target as HTMLInputElement).value.replace(/\D/g, ''); // digits only
    this.displayValue = raw;
    (event.target as HTMLInputElement).value = raw; // keep the input clean
    // Emit full number (with prefix) to the form control
    this.onChange(raw ? `${this.prefix}${raw}` : '');
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
  }
}
