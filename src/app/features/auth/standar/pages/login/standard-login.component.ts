import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../../../../shared/ui/hero/hero.component';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'app-standard-login',
    standalone: true,
    imports: [CommonModule, HeroComponent, HeaderComponent, LoginFormComponent],
    template: `
    <div class="min-h-screen flex flex-col items-center">
      <div class="w-full max-w-md"> 
        <app-header [disableMenuButton]="true" ></app-header>
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
