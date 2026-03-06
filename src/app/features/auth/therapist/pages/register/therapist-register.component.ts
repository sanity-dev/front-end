import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../../layout/header/header.component';
import { TherapistRegisterFormComponent } from '../../components/register-form/register-form.component';
import { HeroComponent } from '../../../../../shared/components/hero/hero.component';

@Component({
    selector: 'app-therapist-register',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, TherapistRegisterFormComponent, HeroComponent],
    template: `
     <div class="min-h-screen flex flex-col">
        <app-header [disableMenuButton]="true"></app-header>
        <div class="w-full max-w-md mx-auto flex flex-col justify-center"> 
            <div class="px-4 pb-12">
            <app-hero
                title="Crea tu cuenta profesional"
                description=""
            ></app-hero>

            <app-therapist-register-form></app-therapist-register-form>


            <div class="mt-8 text-center text-text-primary space-y-2">
                
                <a routerLink="/login" class="block text-sm opacity-90 cursor-pointer">
                ¿Ya tienes una cuenta? <span class="font-semibold text-secondary-background">Iniciar sesión</span>
                </a>
            </div>
            </div>
        </div>
    </div>
  `,
    styles: []
})
export class TherapistRegisterComponent { }
