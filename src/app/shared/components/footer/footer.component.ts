import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <footer class="text-center pb-8">
        <h2 class="text-xl font-bold mb-6 text-text-primary">Comienza tu transformación hoy</h2>
        <div class="flex flex-col gap-3 mb-8">
            <app-button variant="primary" [fullWidth]="true" route="/register">Registrarse</app-button>
            <app-button variant="secondary" [fullWidth]="true" route="/login">Iniciar sesión</app-button>
        </div>

        <div class="space-y-4 text-sm text-text-primary">
            <a href="#" class="block hover:text-text-primary">Contáctanos</a>
            <a href="#" class="block hover:text-text-primary">Términos y condiciones</a>
            <a href="#" class="block hover:text-text-primary">Política de privacidad</a>
            <div class="pt-4 text-xs opacity-60">© 2024 Sanity. Todos los derechos reservados.</div>
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
