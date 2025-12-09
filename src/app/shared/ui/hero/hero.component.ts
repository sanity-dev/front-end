import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="text-center py-8 scroll-mt-22">
      <div class="flex justify-center">
        <div class="text-white w-20 h-20">
          <img src="assets/icons/LogoSanityBlue2.png" alt="sanityLogo" />
        </div>
      </div>
      <h1
        class="text-3xl font-bold mb-2 mt-4 text-secondary-background"
        [innerHTML]="title"
      ></h1>
      <p class="text-base mb-4 max-w-md mx-auto text-text-primary">
        {{ description }}
      </p>
    </section>
  `,
  styles: [],
})
export class HeroComponent {
  @Input() title: string = '';
  @Input() description: string = '';
}