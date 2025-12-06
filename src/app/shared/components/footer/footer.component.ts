import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../iu/button/button.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <footer class="text-center pb-8">
        <h2 class="text-xl font-bold mb-6 text-[#1d1d1d]">Comienza tu transformación hoy</h2>
        <div class="flex flex-col gap-3 mb-8">
            <app-button variant="primary" [fullWidth]="true">Registrarse</app-button>
            <app-button variant="secondary" [fullWidth]="true">Iniciar sesión</app-button>
        </div>

        <div class="space-y-4 text-sm text-[#1d1d1d]">
            <a href="#" class="block hover:text-[#1d1d1d]">Contáctanos</a>
            <a href="#" class="block hover:text-[#1d1d1d]">Términos y condiciones</a>
            <a href="#" class="block hover:text-[#1d1d1d]">Política de privacidad</a>
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
