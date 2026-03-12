import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../layout/header/header.component';
import { SectionComponent } from '../../components/section/section.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
import { MembershipSectionComponent } from '../../components/membership-section/membership-section.component';
import { FooterComponent } from '../../../../layout/footer/footer.component';
import { HeroComponent } from '../../../../shared/components/hero/hero.component';



@Component({
    selector: 'app-welcome-page',
    standalone: true,
    imports: [CommonModule, HeaderComponent, SectionComponent, InfoSectionComponent, MembershipSectionComponent, FooterComponent, HeroComponent],
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
            image: 'assets/images/diario3.svg'
        },
        {
            title: 'EuphorIA',
            description: 'Nuestro agente de IA está disponible las 24 horas del día, los 7 días de la semana para brindar apoyo y orientación. Obtén recomendaciones personalizadas y aprende estrategias de afrontamiento.',
            image: 'assets/images/euphoria2.svg'
        }
    ];

    professionalServices = [
        {
            title: 'Sesiones de terapia',
            description: 'Conéctate con terapeutas licenciados para obtener apoyo personalizado. Programa sesiones y gestiona tu atención sin problemas.',
            image: 'assets/images/onbording1.svg'
        },
        {
            title: 'Servicios de asesoramiento',
            description: 'Accede a servicios de asesoramiento profesional adaptados a tus necesidades. Encuentra al consejero adecuado y comienza tu viaje hacia una mejor salud mental.',
            image: 'assets/images/asesoramiento.svg'
        }
    ];

    healthyHabits = [
        {
            title: 'Ejercicios de atención plena',
            description: 'Practica la atención plena con meditaciones guiadas y ejercicios de respiración para reducir el estrés y mejorar la concentración.',
            image: 'assets/images/habitos.svg'
        },
        {
            title: 'Contacto de emergencia',
            description: 'Accede rápidamente a contactos de emergencia y recursos para obtener apoyo inmediato durante las crisis.',
            image: 'assets/images/emergencia.svg'
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

    membershipTitle = '¿Eres terapeuta profesional?';
    membershipDescription = 'Únete a Sanity y amplía tu alcance conectando con pacientes que necesitan tu ayuda. Ofrece tus servicios en nuestra plataforma.';

    membershipPlan = {
        name: 'Premium',
        price: '$70.000 COP',
        period: 'mes',
        trialText: '7 días de prueba gratis',
        benefits: [
            { text: 'Perfil profesional verificado visible para todos los usuarios' },
            { text: 'Gestión de citas y agenda integrada' },
            { text: 'Panel de métricas y seguimiento de pacientes' },
            { text: 'Soporte prioritario del equipo Sanity' },
            { text: 'Visibilidad destacada en búsquedas de terapeutas' }
        ]
    };

    membershipHighlights = [
        {
            title: 'Sin compromiso',
            description: 'Prueba gratis por 7 días. Cancela en cualquier momento sin penalidades ni cargos ocultos.',
            iconPath: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        },
        {
            title: 'Más pacientes',
            description: 'Conecta con miles de usuarios que buscan apoyo profesional en salud mental.',
            iconPath: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
        }
    ];

    menuItems = [
        { label: 'Inicio', id: 'hero' },
        { label: 'Actividades', id: 'features' },
        { label: 'Servicios', id: 'services' },
        { label: 'Hábitos', id: 'habits' },
        { label: 'Nosotros', id: 'why-sanity' },
        { label: 'Membresía', id: 'membership' },
        { label: 'Únete', id: 'cta' }
    ];

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
