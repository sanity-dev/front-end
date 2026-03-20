import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, ButtonComponent, RouterLink],
    template: `
    <footer class="text-center pb-8">
        <h2 class="text-xl font-bold mb-6 text-text-primary">Comienza tu transformación hoy</h2>
        <div class="flex flex-col gap-3 mb-8">
            <app-button variant="primary" [fullWidth]="true" route="/register">Registrarse</app-button>
            <app-button variant="secondary" [fullWidth]="true" route="/login">Iniciar sesión</app-button>
        </div>

        <div class="space-y-4 text-sm text-text-primary">
            <a routerLink="/contact" class="block hover:text-text-primary underline">Contáctanos</a>
            <a href="https://storage.googleapis.com/115305318075-us-central1-blueprint-config/terminos-cond-sanity/Sanity_Terminos_y_Condiciones.pdf" target="_blank" rel="noopener noreferrer" class="block hover:text-text-primary underline">Términos y condiciones</a>
            <a href="https://storage.googleapis.com/115305318075-us-central1-blueprint-config/terminos-cond-sanity/Sanity_Politica_de_Privacidad.pdf" target="_blank" rel="noopener noreferrer" class="block hover:text-text-primary underline">Política de privacidad</a>
            <div class="pt-4 text-xs opacity-60">© 2026 Sanity. Todos los derechos reservados.</div>
        </div>
    </footer>
  `,
    styles: [`
    :host {
        display: block;
    }
  `]
})
export class FooterComponent { }
