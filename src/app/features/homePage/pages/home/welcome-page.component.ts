import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SectionComponent } from '../../components/section/section.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { HeroComponent } from '../../../../shared/iu/hero/hero.component';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    imports: [CommonModule, HeaderComponent, SectionComponent, InfoSectionComponent, FooterComponent, HeroComponent],
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
    heroTitle = 'Tu salud mental,<br>simplificada';
    heroDescription = 'Sanity es tu compañero integral para la salud mental. Registra tu estado de ánimo, chatea con Euphoria nuestro agente de IA y conéctate con profesionales.';

    features = [
        {
            title: 'Diario interactivo',
            description: 'Reflexiona sobre tu día con nuestro diario intuitivo. Registra tu estado de ánimo, identifica patrones y obtén información sobre tu bienestar mental.',
            image: 'https://images.unsplash.com/photo-1650848200302-22e62d26a75a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Placeholder
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
            image: 'https://plus.unsplash.com/premium_photo-1664378616928-dc6842677183?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Placeholder
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

    whySanityItems = [
        {
            title: 'Soporte inteligente',
            description: 'Nuestro agente de IA está disponible las 24 horas del día, los 7 días de la semana para brindarte apoyo inmediato cuando más lo necesitas.',
            iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        },
        {
            title: 'Privacidad y seguridad',
            description: 'Tus datos están encriptados y protegidos con los más altos estándares de seguridad. Tu privacidad es nuestra prioridad.',
            iconPath: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
        },
        {
            title: 'Enfoque científico',
            description: 'Nuestros métodos se basan en las últimas investigaciones en salud mental y psicología positiva para garantizar resultados efectivos.',
            iconPath: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5'
        }
    ];

    menuItems = [
        { label: 'Inicio', id: 'hero' },
        { label: 'Actividades', id: 'features' },
        { label: 'Servicios', id: 'services' },
        { label: 'Hábitos', id: 'habits' },
        { label: 'Nosotros', id: 'why-sanity' },
        { label: 'Únete', id: 'cta' }
    ];

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
