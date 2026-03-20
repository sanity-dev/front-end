import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MembershipBenefit {
    text: string;
}

export interface MembershipPlan {
    name: string;
    price: string;
    period: string;
    trialText: string;
    benefits: MembershipBenefit[];
}

export interface MembershipHighlight {
    iconPath: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-membership-section',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="scroll-mt-28 mb-12">
        <!-- Título con gradiente -->
        <div class="text-center mb-8">
            <h2 class="text-2xl font-extrabold mb-2 text-text-secondary bg-clip-text">
                {{ title }}
            </h2>
            <p class="text-base text-text-primary max-w-md mx-auto">{{ description }}</p>
        </div>

        <!-- Tarjeta del plan -->
        <div class="relative rounded-2xl overflow-hidden shadow-lg mb-8">
            <!-- Fondo con gradiente -->
            <div class="absolute inset-0 bg-linear-to-br from-secondary-background to-third-background opacity-95"></div>

            <div class="relative p-6 text-white">
                <!-- Badge del plan -->
                <div class="flex items-center justify-between mb-4">
                    <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {{ plan.name }}
                    </span>
                    <span class="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                        🎉 {{ plan.trialText }}
                    </span>
                </div>

                <!-- Precio -->
                <div class="mb-5">
                    <div class="flex items-baseline gap-1">
                        <span class="text-4xl font-extrabold">{{ plan.price }}</span>
                        <span class="text-base opacity-80">/ {{ plan.period }}</span>
                    </div>
                </div>

                <!-- Beneficios -->
                <ul class="space-y-3 mb-6">
                    <li *ngFor="let benefit of plan.benefits" class="flex items-start gap-3">
                        <div class="bg-white/20 rounded-full p-1 mt-0.5 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                                stroke="currentColor" class="w-3.5 h-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                        <span class="text-sm leading-snug">{{ benefit.text }}</span>
                    </li>
                </ul>

                <!-- CTA -->
                <button
                    class="w-full bg-white text-secondary-background font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-base"
                    (click)="onCtaClick()">
                    Comenzar prueba gratuita
                </button>
            </div>
        </div>

        <!-- Highlights -->
        <div class="space-y-5">
            <div *ngFor="let highlight of highlights" class="flex gap-4">
                <div class="bg-linear-to-br from-secondary-background/10 to-third-background/10 p-3 rounded-xl h-12 w-12 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6 text-secondary-background">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            [attr.d]="highlight.iconPath" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-bold text-sm text-text-primary">{{ highlight.title }}</h3>
                    <p class="text-xs text-text-primary opacity-70">{{ highlight.description }}</p>
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
export class MembershipSectionComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() plan!: MembershipPlan;
    @Input() highlights: MembershipHighlight[] = [];

    onCtaClick() {
        // Navigate to registration or membership page
        window.location.href = '/therapist-register';
    }
}
