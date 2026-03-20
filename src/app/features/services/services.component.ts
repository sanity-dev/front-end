import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { SpecialistService } from './services/specialist.service';
import { AuthHelperService } from './services/auth-helper.service';
import { MembershipService, MembershipStatus } from './membership.service';
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
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease', style({ opacity: 1 }))]),
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92)' }),
        animate('480ms cubic-bezier(0.34,1.56,0.64,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen" style="background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%)">

      <!-- Banner de pago exitoso -->
      <div *ngIf="paymentSuccess" @fadeIn
        class="mx-5 mt-4 rounded-2xl text-white text-sm font-medium flex items-center gap-2"
        style="padding: 0.875rem 1rem; background: linear-gradient(135deg, #2ecc71, #27ae60)">
        ✅ ¡Pago exitoso! Tu membresía ya está activa.
      </div>

      <!-- Banner esperando pago -->
      <div *ngIf="waitingPayment" @fadeIn
        class="mx-5 mt-4 rounded-2xl text-white text-sm font-medium flex items-center gap-2"
        style="padding: 0.875rem 1rem; background: linear-gradient(135deg, #4C9EEB, #4CA1AF)">
        ⏳ Esperando confirmación del pago...
      </div>

      <!-- Banner de pago pendiente -->
      <div *ngIf="paymentPending" @fadeIn
        class="mx-5 mt-4 rounded-2xl text-white text-sm font-medium flex items-center gap-2"
        style="padding: 0.875rem 1rem; background: linear-gradient(135deg, #f39c12, #e67e22)">
        ⏳ Tu pago está pendiente de confirmación.
      </div>

      <!-- Banner de pago fallido -->
      <div *ngIf="paymentFailed" @fadeIn
        class="mx-5 mt-4 rounded-2xl text-white text-sm font-medium flex items-center gap-2"
        style="padding: 0.875rem 1rem; background: linear-gradient(135deg, #e74c3c, #c0392b)">
        ❌ El pago no pudo procesarse. Intenta de nuevo.
      </div>

      <main class="px-5 pt-5">

        <!-- Loading -->
        <div *ngIf="loading" @fadeIn class="space-y-4" style="padding-bottom: 6rem">
          <div class="h-52 rounded-3xl animate-pulse" style="background: #E5E7EB"></div>
          <div class="h-5 rounded-full w-1/2 animate-pulse" style="background: #E5E7EB"></div>
          <div class="h-28 rounded-2xl animate-pulse" style="background: #E5E7EB"></div>
        </div>

        <!-- ══ TERAPEUTA ══ -->
        <ng-container *ngIf="!loading && isTherapist">

          <!-- SIN membresía o EXPIRADA -->
          <ng-container *ngIf="!membership || membership.status === 'EXPIRED'">
            <div @bounceIn class="flex flex-col items-center text-center px-2"
              style="padding-top: 2rem; padding-bottom: 7rem">

              <!-- Ilustración -->
              <div class="relative" style="margin-bottom: 2rem">
                <div class="w-36 h-36 rounded-full flex items-center justify-center"
                  style="background: linear-gradient(135deg, #4C9EEB22, #4CA1AF44); font-size: 4rem">
                  {{ membership?.status === 'EXPIRED' ? '🥺' : '🩺' }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF); font-size: 1.25rem">
                  ✨
                </div>
              </div>

              <h2 class="text-2xl font-bold"
                style="color: #1d1d1d; font-family: Manrope, sans-serif; margin-bottom: 0.5rem">
                {{ membership?.status === 'EXPIRED' ? '¡Renueva tu membresía!' : '¡Haz crecer tu práctica!' }}
              </h2>
              <p class="text-gray-400 text-sm leading-relaxed max-w-xs" style="margin-bottom: 2rem">
                {{ membership?.status === 'EXPIRED'
                  ? 'Tu membresía expiró y ya no apareces en el directorio. Renueva para volver a conectar con pacientes.'
                  : 'Elige cómo quieres empezar. Puedes probar gratis o activar tu membresía completa desde el primer día.' }}
              </p>

              <!-- Trial -->
              <ng-container *ngIf="!membership">
                <div class="w-full max-w-sm rounded-3xl text-left relative overflow-hidden"
                  style="margin-bottom: 1rem; background: linear-gradient(135deg, #4C9EEB15, #4CA1AF25); border: 2px solid #4CA1AF50; padding: 1.25rem">
                  <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full" style="background: #4CA1AF15"></div>
                  <div class="flex items-start justify-between" style="margin-bottom: 0.75rem">
                    <div>
                      <p class="font-bold text-gray-800" style="font-size: 1rem">🎁 Prueba gratuita</p>
                      <p class="text-gray-500 text-xs" style="margin-top: 0.25rem">Sin tarjeta. Sin compromiso.</p>
                    </div>
                    <span class="font-bold rounded-full text-white text-xs"
                      style="padding: 0.375rem 0.875rem; background: linear-gradient(135deg, #4C9EEB, #4CA1AF); white-space: nowrap">
                      7 días gratis
                    </span>
                  </div>
                  <ul class="text-xs text-gray-500"
                    style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem">
                    <li>✓ Aparece en el directorio de pacientes</li>
                    <li>✓ Recibe citas ilimitadas</li>
                    <li>✓ Cancela cuando quieras</li>
                  </ul>
                  <button (click)="onStartTrial()" [disabled]="trialLoading"
                    class="w-full rounded-2xl text-white font-bold text-sm"
                    style="padding: 0.875rem; background: linear-gradient(135deg, #4C9EEB, #4CA1AF); transition: opacity 0.2s"
                    [style.opacity]="trialLoading ? '0.7' : '1'">
                    {{ trialLoading ? '⏳ Activando...' : '🚀 Iniciar prueba gratis' }}
                  </button>
                </div>
              </ng-container>

              <!-- Pago mensual -->
              <div class="w-full max-w-sm rounded-3xl text-left"
                style="border: 1.5px solid #E5E7EB; padding: 1.25rem; background: white; margin-bottom: 1rem">
                <div class="flex items-start justify-between" style="margin-bottom: 0.75rem">
                  <div>
                    <p class="font-bold text-gray-800" style="font-size: 1rem">💳 Membresía mensual</p>
                    <p class="text-gray-500 text-xs" style="margin-top: 0.25rem">Acceso completo por 30 días</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-800" style="font-size: 1.1rem">$70.000</p>
                    <p class="text-gray-400 text-xs">COP / mes</p>
                  </div>
                </div>
                <ul class="text-xs text-gray-500"
                  style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem">
                  <li>✓ Todo lo del trial incluido</li>
                  <li>✓ Perfil destacado en búsquedas</li>
                  <li>✓ Soporte prioritario</li>
                </ul>
                <button (click)="onPagar()" [disabled]="payLoading || waitingPayment"
                  class="w-full rounded-2xl font-bold text-sm border-2"
                  style="padding: 0.875rem; border-color: #4C9EEB; color: #4C9EEB; background: white; transition: opacity 0.2s"
                  [style.opacity]="payLoading || waitingPayment ? '0.7' : '1'">
                  {{ payLoading ? '⏳ Redirigiendo...' : waitingPayment ? '⏳ Esperando pago...' : '💳 Pagar membresía' }}
                </button>
              </div>

              <p *ngIf="membershipError" class="text-red-400 text-xs" style="margin-top: 0.5rem">
                ⚠️ {{ membershipError }}
              </p>

            </div>
          </ng-container>

          <!-- CON membresía activa o trial -->
          <ng-container *ngIf="membership && membership.isActive">

            <ng-container *ngIf="myProfile">
              <app-therapist-profile [specialist]="myProfile" (edit)="showForm = true">
              </app-therapist-profile>
            </ng-container>

            <ng-container *ngIf="!myProfile">
              <div @bounceIn class="flex flex-col items-center text-center px-2"
                style="padding-top: 2rem; padding-bottom: 7rem">
                <div class="relative" style="margin-bottom: 1.75rem">
                  <div class="w-32 h-32 rounded-full flex items-center justify-center"
                    style="background: linear-gradient(135deg, #4C9EEB22, #4CA1AF33); font-size: 3.5rem">
                    🌱
                  </div>
                  <div class="absolute -bottom-1 -right-2 w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                    style="background: #4C9EEB; font-size: 1.1rem">✨</div>
                </div>
                <h2 class="text-2xl font-bold tracking-tight"
                  style="color: #1d1d1d; font-family: Manrope, sans-serif; margin-bottom: 0.5rem">
                  ¡Membresía activa! 🎉
                </h2>
                <p class="text-gray-400 text-sm leading-relaxed max-w-xs" style="margin-bottom: 2rem">
                  Ya puedes registrar tus servicios y empezar a recibir pacientes.
                </p>
                <div class="flex flex-wrap justify-center" style="gap: 0.5rem; margin-bottom: 2rem">
                  <span *ngFor="let chip of chips" class="text-xs font-bold rounded-full border"
                    style="padding: 0.375rem 0.75rem; background: #4CA1AF1A; color: #4CA1AF; border-color: #4CA1AF33">
                    ✓ {{ chip }}
                  </span>
                </div>
                <button (click)="showForm = true"
                  class="w-full max-w-sm rounded-2xl text-white font-bold text-base flex items-center justify-center"
                  style="padding: 1rem; background: linear-gradient(135deg, #2C3E50, #4CA1AF); gap: 0.5rem">
                  🚀 Registrar mis servicios
                </button>
                <p class="text-xs text-gray-400" style="margin-top: 1rem">
                  Solo toma unos minutos completar tu perfil
                </p>
              </div>
            </ng-container>

          </ng-container>
        </ng-container>

        <!-- ══ USUARIO ══ -->
        <ng-container *ngIf="!loading && !isTherapist">
          <app-specialists-carousel [specialists]="allSpecialists" (book)="selectedSpecialist = $event">
          </app-specialists-carousel>
        </ng-container>

      </main>

      <ng-container *ngIf="showForm">
        <app-specialist-form-toast [existingProfile]="myProfile" (closed)="showForm = false" (saved)="onSaved()">
        </app-specialist-form-toast>
      </ng-container>

      <ng-container *ngIf="selectedSpecialist">
        <app-appointment-toast [specialist]="selectedSpecialist" (closed)="selectedSpecialist = null">
        </app-appointment-toast>
      </ng-container>

      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
})
export class ServicesComponent implements OnInit, OnDestroy {
  private specialistSvc = inject(SpecialistService);
  private authSvc       = inject(AuthHelperService);
  private membershipSvc = inject(MembershipService);
  private route         = inject(ActivatedRoute);

  loading              = true;
  isTherapist          = false;
  myProfile: Specialist | null        = null;
  allSpecialists: Specialist[]        = [];
  membership: MembershipStatus | null = null;
  showForm             = false;
  selectedSpecialist: Specialist | null = null;
  trialLoading         = false;
  payLoading           = false;
  membershipError      = '';
  waitingPayment       = false;

  paymentSuccess = false;
  paymentPending = false;
  paymentFailed  = false;

  private pollingSub?: Subscription;

  chips = ['Sin comisiones', 'Citas ilimitadas', 'Cancela cuando quieras'];

  get inicial(): string {
    return this.authSvc.getAuthUser()?.nombre?.charAt(0).toUpperCase() ?? '?';
  }

  ngOnInit(): void {
    this.isTherapist = this.authSvc.isTherapist();

    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        this.paymentSuccess = true;
        setTimeout(() => this.loadTherapistView(), 3000);
        setTimeout(() => this.paymentSuccess = false, 6000);
      } else if (params['payment'] === 'pending') {
        this.paymentPending = true;
        setTimeout(() => this.paymentPending = false, 6000);
      } else if (params['payment'] === 'failure') {
        this.paymentFailed = true;
        setTimeout(() => this.paymentFailed = false, 6000);
      }
    });

    this.isTherapist ? this.loadTherapistView() : this.loadPatientView();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private loadTherapistView(): void {
    this.loading = true;
    this.membershipSvc.getStatus().subscribe({
      next:  m  => this.membership = m,
      error: () => this.membership = null,
    });
    this.specialistSvc.getMyProfile().subscribe({
      next:  p  => { this.myProfile = p; this.loading = false; },
      error: () => { this.myProfile = null; this.loading = false; },
    });
  }

  private loadPatientView(): void {
    this.loading = true;
    this.specialistSvc.getAllSpecialists().subscribe({
      next:  list => { this.allSpecialists = list; this.loading = false; },
      error: ()   => { this.allSpecialists = []; this.loading = false; },
    });
  }

  // ── Polling — consulta el estado cada 5 segundos hasta que sea ACTIVE ────
  private startPolling(): void {
    this.stopPolling();
    this.pollingSub = interval(5000).pipe(
      switchMap(() => this.membershipSvc.getStatus()),
      takeWhile(m => m?.status !== 'ACTIVE', true)
    ).subscribe({
      next: m => {
        if (m?.status === 'ACTIVE') {
          this.membership     = m;
          this.waitingPayment = false;
          this.paymentSuccess = true;
          this.stopPolling();
          setTimeout(() => this.paymentSuccess = false, 6000);
        }
      },
      error: () => this.stopPolling()
    });
  }

  private stopPolling(): void {
    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;
  }

  onStartTrial(): void {
    this.trialLoading    = true;
    this.membershipError = '';
    this.membershipSvc.startTrial().subscribe({
      next: m => {
        this.membership   = m;
        this.trialLoading = false;
        if (!this.myProfile) this.showForm = true;
      },
      error: () => {
        this.membershipError = 'No se pudo activar la prueba. Intenta de nuevo.';
        this.trialLoading    = false;
      },
    });
  }

  onPagar(): void {
    this.payLoading      = true;
    this.membershipError = '';
    this.membershipSvc.checkout().subscribe({
      next: ({ checkoutUrl }) => {
        this.payLoading     = false;
        this.waitingPayment = true;
        window.open(checkoutUrl, '_blank');
        this.startPolling();
      },
      error: () => {
        this.membershipError = 'No se pudo conectar con el sistema de pagos.';
        this.payLoading      = false;
      },
    });
  }

  onSaved(): void {
    this.showForm = false;
    this.loadTherapistView();
  }
}