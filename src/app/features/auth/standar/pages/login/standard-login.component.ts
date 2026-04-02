import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../../../../shared/components/hero/hero.component';
import { HeaderComponent } from '../../../../../layout/header/header.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-standard-login',
  standalone: true,
  imports: [CommonModule, HeroComponent, HeaderComponent, LoginFormComponent],
  template: `
    <div class="min-h-screen flex flex-col">
        <app-header [hideMenuButton]="true" [showBackButton]="true"></app-header>
        <div class="w-full max-w-md mx-auto flex flex-col justify-center"> 
            <div class="px-4 pb-12">
            <app-hero
                title="Bienvenido de nuevo"
                description=""
            ></app-hero>

            <app-login-form></app-login-form>
            </div>
        </div>
    </div>
  `,
  styles: []
})
export class StandardLoginComponent { }
