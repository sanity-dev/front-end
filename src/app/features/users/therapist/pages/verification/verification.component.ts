import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="flex flex-col min-h-screen bg-linear-to-b from-[#cbcbcb] to-[#ffffff]/50">
    
      <!-- Content -->
      <div class="flex-1 px-6 pt-4 pb-8">
        <h2 class="text-2xl font-bold text-text-primary mb-2">Envía tus documentos</h2>
        <p class="text-text-primary text-sm mb-8">
          Para completar tu perfil y empezar a atender pacientes, necesitamos verificar tus credenciales profesionales. Por favor, sube los siguientes documentos:
        </p>

        <!-- Document List -->
        <div class="space-y-4 mb-8">
            <!-- Item 1 -->
            <div class="flex items-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-gray-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-sm">Tarjeta profesional</h3>
                    <p class="text-xs text-gray-600">Tarjeta profesional vigente</p>
                </div>
                <button class="p-2 ml-2 bg-white rounded-full text-blue-500 shadow-sm hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </button>
            </div>

            <!-- Item 2 -->
            <div class="flex items-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-gray-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-sm">Títulos</h3>
                    <p class="text-xs text-gray-600">Títulos académicos relevantes</p>
                </div>
                <button class="p-2 ml-2 bg-white rounded-full text-blue-500 shadow-sm hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </button>
            </div>

             <!-- Item 3 -->
            <div class="flex items-center p-4 bg-white/80 rounded-xl backdrop-blur-sm">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-gray-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-sm">Identificación</h3>
                    <p class="text-xs text-gray-600">Documento de identidad oficial</p>
                </div>
                <button class="p-2 ml-2 bg-white rounded-full text-blue-500 shadow-sm hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Button -->
        <div class="w-full">
            <app-button [fullWidth]="true">Subir Documentos</app-button>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class VerificationComponent {
    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/users/therapist/profile-ready']);
    }
}
