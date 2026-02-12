import { Component, Input, inject } from '@angular/core';
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
export class IconComponent {

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

  ngOnInit() {
    this.http
      .get(`assets/icons/${this.name}.svg`, { responseType: 'text' })
      .subscribe(svg => {

        let cleanedSvg = svg
          .replace(/width="[^"]*"/g, '')
          .replace(/height="[^"]*"/g, '')
          .replace(/viewBox="[^"]*"/g, 'viewBox="0 0 24 24"')
          .replace(/transform="[^"]*"/g, '');

        // Si el ícono tiene "White" en el nombre, cambiar todos los colores a blanco
        if (this.name.includes('White')) {
          cleanedSvg = cleanedSvg
            .replace(/fill="[^"]*"/g, 'fill="#FFFFFF"')
            .replace(/stroke="[^"]*"/g, 'stroke="#FFFFFF"')
            .replace(/<path(?!\s+fill)/g, '<path fill="#FFFFFF"');
        }

        this.svgContent =
          this.sanitizer.bypassSecurityTrustHtml(cleanedSvg);
      });
  }
}
