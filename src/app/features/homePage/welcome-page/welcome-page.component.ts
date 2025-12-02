import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/iu/button/button.component';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
    features = [
        {
            title: 'Diario interactivo',
            description: 'Reflexiona sobre tu día con nuestro diario intuitivo. Registra tu estado de ánimo, identifica patrones y obtén información sobre tu bienestar mental.',
            image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Placeholder
        },
        {
            title: 'Agente de IA',
            description: 'Nuestro agente de IA está disponible las 24 horas del día, los 7 días de la semana para brindar apoyo y orientación. Obtén recomendaciones personalizadas y aprende estrategias de afrontamiento.',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Placeholder
        }
    ];

    professionalServices = [
        {
            title: 'Sesiones de terapia',
            description: 'Conéctate con terapeutas licenciados para obtener apoyo personalizado. Programa sesiones y gestiona tu atención sin problemas.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Placeholder
        },
        {
            title: 'Servicios de asesoramiento',
            description: 'Accede a servicios de asesoramiento profesional adaptados a tus necesidades. Encuentra al consejero adecuado y comienza tu viaje hacia una mejor salud mental.',
            image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Placeholder
        }
    ];

    healthyHabits = [
        {
            title: 'Ejercicios de atención plena',
            description: 'Practica la atención plena con meditaciones guiadas y ejercicios de respiración para reducir el estrés y mejorar la concentración.',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Placeholder
        },
        {
            title: 'Contacto de emergencia',
            description: 'Accede rápidamente a contactos de emergencia y recursos para obtener apoyo inmediato durante las crisis.',
            image: 'https://images.unsplash.com/photo-1532883130016-f3d311140ba8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Placeholder
        }
    ];
}
