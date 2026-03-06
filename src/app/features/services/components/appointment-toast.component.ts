import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { trigger, style, animate, transition } from '@angular/animations';
import { Specialist, CreateAppointmentDto, parseDisponibilidad } from '../models/specialist.model';
import { AuthHelperService } from '../services/auth-helper.service';

const API = 'http://localhost:8080/api/services';

@Component({
  selector: 'app-appointment-toast',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('360ms cubic-bezier(0.32,0.72,0,1)', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('240ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease', style({ opacity: 0 }))]),
    ]),
  ],
  template: `
    <div @fadeIn class="fixed inset-0 z-50" style="background:rgba(0,0,0,0.6);backdrop-filter:blur(4px)" (click)="close()"></div>

    <div @slideUp class="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[82vh] flex flex-col">

      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1 shrink-0">
        <div class="w-10 h-1 rounded-full" style="background:var(--color-white-sanity)"></div>
      </div>

      <!-- Header -->
      <div class="px-6 pt-2 pb-4 shrink-0" style="border-bottom:1px solid var(--color-white-sanity)">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style="background:linear-gradient(135deg,var(--color-secondary-background),var(--color-third-background))">
            🧑‍⚕️
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-bold m-0" style="color:var(--color-text-primary)">
              Agendar con {{ specialist.nombre || 'el terapeuta' }}
            </h2>
            <p class="text-sm m-0 truncate" style="color:var(--color-third-background)">
              {{ specialist.tituloProfesional }}
            </p>
          </div>
          <button (click)="close()" class="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer"
            style="background:var(--color-white-sanity)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="flex flex-wrap gap-1">
          <span *ngFor="let slot of slots.slice(0,4)"
            class="px-2 py-1 rounded-lg text-[10px] font-bold"
            style="background:rgba(76,161,175,0.1);color:var(--color-third-background)">
            {{ slot.dia }} {{ slot.horaInicio }}–{{ slot.horaFin }}
          </span>
        </div>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()"
        class="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide" style="display:flex;flex-direction:column;gap:1rem;padding-bottom:2rem">

        <!-- Tipo de sesión -->
        <div>
          <label class="block text-sm font-semibold mb-2" style="color:var(--color-text-primary)">Tipo de sesión *</label>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" *ngFor="let tipo of tiposSesion"
              (click)="form.patchValue({ tipoSesion: tipo })"
              class="px-4 py-3 rounded-xl text-xs font-semibold text-center transition-all border-none cursor-pointer"
              [style.background]="form.value.tipoSesion === tipo ? 'var(--color-third-background)' : 'white'"
              [style.color]="form.value.tipoSesion === tipo ? 'white' : 'var(--color-text-primary)'"
              [style.outline]="form.value.tipoSesion !== tipo ? '1px solid var(--color-white-sanity)' : 'none'">
              {{ tipo }}
            </button>
          </div>
          <p *ngIf="f['tipoSesion'].invalid && submitted" class="text-xs mt-1" style="color:#e74c3c">
            Selecciona un tipo de sesión
          </p>
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm font-semibold mb-1.5" style="color:var(--color-text-primary)">Fecha y hora *</label>
          <input formControlName="fecha" type="datetime-local"
            class="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style="background:#f8f9fa;border:1.5px solid var(--color-white-sanity);color:var(--color-text-primary);font-family:var(--font-sans)">
          <p *ngIf="f['fecha'].invalid && f['fecha'].touched" class="text-xs mt-1" style="color:#e74c3c">
            Selecciona una fecha y hora
          </p>
        </div>

        <div *ngIf="errorMsg" class="rounded-xl px-4 py-3 text-sm" style="background:#fef2f2;color:#e74c3c">
          {{ errorMsg }}
        </div>
        <div *ngIf="success" class="rounded-xl px-4 py-3 text-sm font-semibold"
          style="background:rgba(76,161,175,0.1);color:var(--color-third-background)">
          ✅ ¡Cita agendada exitosamente!
        </div>

        <button type="submit" [disabled]="loading || success"
          class="w-full py-4 rounded-2xl text-white font-bold text-sm border-none cursor-pointer active:scale-[0.98] transition-all"
          [style.background]="'linear-gradient(135deg,var(--color-secondary-background),var(--color-third-background))'"
          [style.opacity]="loading || success ? '0.6' : '1'">
          <span *ngIf="!loading && !success">Confirmar cita 📅</span>
          <span *ngIf="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Agendando...
          </span>
          <span *ngIf="success">✓ Agendada</span>
        </button>

      </form>
    </div>
  `,
})
export class AppointmentToastComponent implements OnInit {
  @Input() specialist!: Specialist;
  @Output() closed = new EventEmitter<void>();

  private fb   = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(AuthHelperService);

  form = this.fb.group({
    tipoSesion: ['', Validators.required],
    fecha:      ['', Validators.required],
  });

  loading   = false;
  success   = false;
  submitted = false;
  errorMsg  = '';

  tiposSesion = [
    'Consulta individual', 'Terapia de pareja',
    'Terapia familiar',   'Terapia grupal',
    'Evaluación psicológica', 'Sesión de emergencia',
  ];

  get slots() { return parseDisponibilidad(this.specialist?.disponibilidad ?? '[]'); }
  get f()     { return this.form.controls; }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const user = this.auth.getAuthUser();
    if (!user) { this.errorMsg = 'Sesión expirada.'; return; }

    this.loading  = true;
    this.errorMsg = '';

    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getBearerToken()}` });

    const dto: CreateAppointmentDto = {
      pacienteID:       user.userId,
      tipoSesion:       this.form.value.tipoSesion!,
      fecha:            this.form.value.fecha!,
      specialistUserId: this.specialist.userId,
    };

    this.http.post(`${API}/appointments`, dto, { headers }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.close(), 2000);
      },
      error: (err: any) => {
        this.loading  = false;
        this.errorMsg = err?.error?.message ?? 'No se pudo agendar. Intenta con otro horario.';
      },
    });
  }

  close(): void { this.closed.emit(); }
}