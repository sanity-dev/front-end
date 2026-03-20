import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SectionItem {
    image: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-section',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-secondary-background">{{ title }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let item of items" class="bg-transparent">
                <div class="bg-orange-100 rounded-xl overflow-hidden mb-3 aspect-square relative">
                    <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover">
                </div>
                <h3 class="font-bold mb-1 text-secondary-background text-lg">{{ item.title }}</h3>
                <p class="text-base leading-relaxed text-text-primary">{{ item.description }}</p>
            </div>
        </div>
    </section>
  `,
    styles: []
})
export class SectionComponent {
    @Input() title: string = '';
    @Input() items: SectionItem[] = [];
}
