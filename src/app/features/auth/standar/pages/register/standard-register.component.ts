import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../../../../shared/ui/hero/hero.component';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-standard-register',
  standalone: true,
  imports: [CommonModule, HeroComponent, HeaderComponent, RegisterFormComponent, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center ">
      <div class="w-full max-w-md "> 
        <app-header [disableMenuButton]="true"></app-header>
        <div class="px-4 pb-12">
          <app-hero
            title="Registarse"
            description=""
          ></app-hero>

          <app-register-form></app-register-form>

          <div class="mt-8 text-center text-text-primary space-y-2">
            <a href="#" class="block hover:underline font-semibold">Soy terapeuta</a>
            <a routerLink="/login" class="block hover:underline text-sm opacity-90 cursor-pointer">
              ¿Ya tienes una cuenta? <span class="font-semibold">Iniciar sesión</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,

})
export class StandardRegisterComponent { }
