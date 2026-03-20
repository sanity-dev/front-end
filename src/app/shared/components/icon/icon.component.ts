import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-block"
      [ngClass]="computedClass"
      [innerHTML]="svgContent">
    </span>
  `,
})
export class IconComponent implements OnChanges {

  @Input({ required: true }) name!: string;

  // Puedes usar size en px o usar clases Tailwind
  @Input() size?: number;

  // Clases extra como text-gray-600 hover:text-black
  @Input() class: string = '';

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  svgContent: SafeHtml | null = null;

  get computedClass() {
    if (this.size) {
      return `w-[${this.size}px] h-[${this.size}px] ${this.class}`;
    }
    return this.class;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      this.loadIcon();
    }
  }

  private loadIcon() {
    this.http
      .get(`assets/icons/${this.name}.svg`, { responseType: 'text' })
      .subscribe({
        next: (svg) => {
          let cleanedSvg = svg
            // Remove dimensions to allow scaling via CSS
            .replace(/width="[^"]*"/g, '')
            .replace(/height="[^"]*"/g, '');

          // Normalize viewBox if needed, but respect original if acceptable.
          if (!cleanedSvg.includes('viewBox')) {
            cleanedSvg = cleanedSvg.replace(/<svg/, '<svg viewBox="0 0 24 24"');
          }

          // Handle cleanup of transform which might shift icon out of view
          cleanedSvg = cleanedSvg.replace(/transform="[^"]*"/g, '');

          // Color handling
          if (this.name.includes('White')) {
            // Force white color:
            // 1. Remove existing fill/stroke attributes to prevent overriding
            cleanedSvg = cleanedSvg
              .replace(/fill="[^"]*"/g, '')
              .replace(/stroke="[^"]*"/g, '');

            // 2. Inject fill="#FFFFFF" into the SVG tag
            cleanedSvg = cleanedSvg.replace(/<svg/, '<svg fill="#FFFFFF" stroke="#FFFFFF"');
          } else if (this.name.includes('Black')) {
            // Ensure it is black
            cleanedSvg = cleanedSvg
              .replace(/fill="[^"]*"/g, '')
              .replace(/stroke="[^"]*"/g, '');
            cleanedSvg = cleanedSvg.replace(/<svg/, '<svg fill="#000000" stroke="#000000"');
          }

          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(cleanedSvg);
        },
        error: (err) => {
          console.error(`Failed to load icon: ${this.name}`, err);
          this.svgContent = null;
        }
      });
  }
}
