import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [class]="getClasses()"
      (click)="onClick($event)"
      [disabled]="disabled"
    >
      <ng-content></ng-content>
    </button>
  `,
    styles: [],
})
export class ButtonComponent {
    @Input() label: string = '';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'outline' | 'ghost' | 'secondary' = 'primary';
    @Input() fullWidth: boolean = false;
    @Input() disabled: boolean = false;
    @Input() route: string | null = null;

    constructor(private router: Router) { }

    onClick(event: MouseEvent) {
        if (this.route) {
            this.router.navigate([this.route]);
        }
    }

    getClasses(): string {
        const baseClasses =
            'inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:pointer-events-none';

        let variantClasses = '';
        switch (this.variant) {
            case 'primary':
                variantClasses = 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500';
                break;
            case 'secondary':
                variantClasses = 'border-[0.065rem] border-[#d1d9e0] bg-gray-100 text-gray-800 hover:bg-orange-300 focus:ring-orange-200';
                break;
            case 'outline':
                variantClasses = 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500';
                break;
            case 'ghost':
                variantClasses = 'bg-transparent hover:bg-gray-100 focus:ring-gray-500';
                break;
        }

        const widthClass = this.fullWidth ? 'w-full' : '';

        return `${baseClasses} ${variantClasses} ${widthClass}`;
    }
}
