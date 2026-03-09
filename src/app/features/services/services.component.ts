import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { SpecialistService } from './services/specialist.service';
import { AuthHelperService } from './services/auth-helper.service';
import { SpecialistFormToastComponent } from './components/specialist-form-toast.component';
import { TherapistProfileComponent } from './components/therapist-profile.component';
import { SpecialistsCarouselComponent } from './components/specialists-carousel.component';
import { AppointmentToastComponent } from './components/appointment-toast.component';
import { Specialist } from './models/specialist.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    BottomNavComponent,
    SpecialistFormToastComponent,
    TherapistProfileComponent,
    SpecialistsCarouselComponent,
    AppointmentToastComponent,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease', style({ opacity: 1 })),
      ]),
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92)' }),
        animate('420ms cubic-bezier(0.34,1.56,0.64,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen" style="background: linear-gradient(180deg, #ffffff 0%, #fafcff 100%)">

      <!-- Top bar -->
      <header class="bg-white border-b sticky top-0 z-40 px-5 flex items-center justify-between"
        style="padding-top: 1rem; padding-bottom: 1rem; border-color: #D9D9D9">
        <div>
          <p class="text-xs font-medium text-gray-400">{{ saludo }}</p>
          <h1 class="text-lg font-bold tracking-tight" style="color: #1d1d1d; font-family: Manrope, sans-serif">
            Servicios
          </h1>
        </div>
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
          style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)">
          {{ inicial }}
        </div>
      </header>

      <main class="px-5 pt-5">

        <!-- Loading skeleton -->
        <div *ngIf="loading" @fadeIn class="space-y-4" style="padding-bottom: 6rem">
          <div class="h-52 rounded-3xl animate-pulse" style="background: #D9D9D9"></div>
          <div class="h-5 rounded-full w-1/3 animate-pulse" style="background: #D9D9D9"></div>
          <div class="h-28 rounded-2xl animate-pulse" style="background: #D9D9D9"></div>
          <div class="h-28 rounded-2xl animate-pulse" style="background: #D9D9D9"></div>
        </div>

        <!-- TERAPEUTA — ya registró sus servicios -->
        <ng-container *ngIf="!loading && isTherapist && myProfile">
          <app-therapist-profile
            [specialist]="myProfile"
            (edit)="showForm = true">
          </app-therapist-profile>
        </ng-container>

        <!-- TERAPEUTA — aún NO registró sus servicios -->
        <ng-container *ngIf="!loading && isTherapist && !myProfile">
          <div @bounceIn class="flex flex-col items-center justify-center text-center px-2"
            style="padding-top: 2.5rem; padding-bottom: 6rem">

            <div class="relative" style="margin-bottom: 1.75rem">
              <div class="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-inner"
                style="background: linear-gradient(135deg, #4C9EEB22, #4CA1AF33)">
                🌱
              </div>
              <div class="absolute -bottom-1 -right-2 w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-md"
                style="background: #4C9EEB">
                ✨
              </div>
            </div>

            <h2 class="text-2xl font-bold tracking-tight" style="color: #1d1d1d; font-family: Manrope, sans-serif; margin-bottom: 0.5rem">
              ¡Haz crecer tu práctica!
            </h2>
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs" style="margin-bottom: 2rem">
              Registra tus servicios y conecta con pacientes que buscan exactamente tu especialidad.
            </p>

            <div class="flex flex-wrap justify-center gap-2" style="margin-bottom: 2rem">
              <span *ngFor="let chip of chips"
                class="text-xs font-bold rounded-full border"
                style="padding: 0.375rem 0.75rem; background: #4CA1AF1A; color: #4CA1AF; border-color: #4CA1AF33">
                ✓ {{ chip }}
              </span>
            </div>

            <button (click)="showForm = true"
              class="w-full max-w-sm rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              style="padding: 1rem; background: linear-gradient(135deg, #2C3E50, #4CA1AF); transition: transform 0.2s"
              onmousedown="this.style.transform='scale(0.98)'"
              onmouseup="this.style.transform='scale(1)'">
              🚀 ¡Ofrece tus servicios!
            </button>

            <p class="text-xs text-gray-400" style="margin-top: 1rem">Solo toma unos minutos completar tu perfil</p>
          </div>
        </ng-container>

        <!-- USUARIO — directorio de terapeutas -->
        <ng-container *ngIf="!loading && !isTherapist">
          <app-specialists-carousel
            [specialists]="allSpecialists"
            (book)="selectedSpecialist = $event">
          </app-specialists-carousel>
        </ng-container>

      </main>

      <!-- Toast formulario de servicios (TERAPEUTA) -->
      <!-- ✅ [existingProfile]="myProfile" precarga datos al editar -->
      <ng-container *ngIf="showForm">
        <app-specialist-form-toast
          [existingProfile]="myProfile"
          (closed)="showForm = false"
          (saved)="onSaved()">
        </app-specialist-form-toast>
      </ng-container>

      <!-- Toast agendar cita (USUARIO) -->
      <ng-container *ngIf="selectedSpecialist">
        <app-appointment-toast
          [specialist]="selectedSpecialist"
          (closed)="selectedSpecialist = null">
        </app-appointment-toast>
      </ng-container>

      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
})
export class ServicesComponent implements OnInit {
  private specialistSvc = inject(SpecialistService);
  private authSvc       = inject(AuthHelperService);

  loading            = true;
  isTherapist        = false;
  myProfile: Specialist | null = null;
  allSpecialists: Specialist[] = [];
  showForm           = false;
  selectedSpecialist: Specialist | null = null;

  chips = ['Gratis', 'Sin comisiones', 'Cancela cuando quieras'];

  get saludo(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días ☀️';
    if (h < 19) return 'Buenas tardes 🌤️';
    return 'Buenas noches 🌙';
  }

  get inicial(): string {
    return this.authSvc.getAuthUser()?.nombre?.charAt(0).toUpperCase() ?? '?';
  }

  ngOnInit(): void {
    this.isTherapist = this.authSvc.isTherapist();
    this.isTherapist ? this.loadTherapistView() : this.loadPatientView();
  }

  private loadTherapistView(): void {
    this.loading = true;
    this.specialistSvc.getMyProfile().subscribe({
      next: (profile: Specialist | null) => {
        this.myProfile = profile;
        this.loading   = false;
      },
      error: () => { this.myProfile = null; this.loading = false; },
    });
  }

  private loadPatientView(): void {
    this.loading = true;
    this.specialistSvc.getAllSpecialists().subscribe({
      next: (list: Specialist[]) => {
        this.allSpecialists = list;
        this.loading        = false;
      },
      error: () => { this.allSpecialists = []; this.loading = false; },
    });
  }

  onSaved(): void {
    this.showForm = false;
    this.loadTherapistView();
  }
}