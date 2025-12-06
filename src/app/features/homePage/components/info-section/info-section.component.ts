import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InfoSectionItem {
    iconPath: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-info-section',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="scroll-mt-28">
        <h2 class="text-xl font-bold mb-6 text-secondary-background">{{ title }}</h2>
        <div class="space-y-6">
            <div *ngFor="let item of items" class="flex gap-4">
                <div class="bg-white p-3 rounded-lg h-12 w-12 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            [attr.d]="item.iconPath" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-bold text-sm text-[#1d1d1d]">{{ item.title }}</h3>
                    <p class="text-xs text-[#1d1d1d]">{{ item.description }}</p>
                </div>
            </div>
        </div>
    </section>
  `,
    styles: [`
    :host {
        display: block;
    }
  `]
})
export class InfoSectionComponent {
    @Input() title: string = '';
    @Input() items: InfoSectionItem[] = [];
}
