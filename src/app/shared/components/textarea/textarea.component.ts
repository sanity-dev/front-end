import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaComponent),
            multi: true
        }
    ],
    template: `
    <div class="w-full">
      <textarea
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        [rows]="rows"
        class="border-[0.065rem] border-[#d1d9e0] rounded-md w-full px-4 py-3 focus:ring-2 focus:ring-sky-500 text-gray-800 placeholder-gray-500 transition-all outline-none resize-y min-h-[100px] font-[inherit]"
        [ngClass]="customClass"
      ></textarea>
    </div>
  `,
    styles: []
})
export class TextareaComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() rows: number = 4;
    @Input() customClass: string = '';

    value: string = '';
    disabled: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: any): void {
        this.value = event.target.value;
        this.onChange(this.value);
    }
}
