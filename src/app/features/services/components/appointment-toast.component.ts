import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { SpecialistService } from '../services/specialist.service';
import { AuthHelperService } from '../services/auth-helper.service';
import { Specialist, CreateAppointmentDto, parseDisponibilidad } from '../models/specialist.model';

@Component({
  selector: 'app-appointment-toast',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '360ms cubic-bezier(0.32,0.72,0,1)',
          style({ transform: 'translateY(0)', opacity: 1 }),
        ),
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
    <div @fadeIn class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" (click)="close()"></div>

    <div
      @slideUp
      class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[82vh] flex flex-col"
    >
      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
        <div class="w-10 h-1 rounded-full bg-white-sanity"></div>
      </div>

      <!-- Header -->
      <div class="px-6 pt-2 pb-4 border-b border-white-sanity/50 flex-shrink-0">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
          >
            🧑‍⚕️
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-bold text-text-primary">{{ specialist.nombre || 'Terapeuta' }}</h2>
            <p class="text-sm text-third-background truncate">{{ specialist.tituloProfesional }}</p>
          </div>
          <button
            (click)="close()"
            class="w-9 h-9 rounded-full bg-white-sanity/40 flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-5 h-5 text-text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <!-- Slots de disponibilidad -->
        <div class="flex flex-wrap gap-1">
          <span
            *ngFor="let slot of slots.slice(0, 4)"
            class="px-2 py-1 rounded-lg text-[10px] font-bold bg-third-background/10 text-third-background"
          >
            {{ slot.dia }} {{ slot.horaInicio }}–{{ slot.horaFin }}
          </span>
        </div>
      </div>

      <!-- Form -->
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-8 scrollbar-hide"
      >
        <!-- Tipo de sesión -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-2">Tipo de sesión *</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              *ngFor="let tipo of specialist.servicios"
              (click)="form.patchValue({ tipoSesion: tipo })"
              class="px-4 py-3 rounded-xl border text-xs font-semibold text-center transition-all"
              [class]="
                form.value.tipoSesion === tipo
                  ? 'bg-third-background text-white border-third-background'
                  : 'bg-white text-text-primary border-white-sanity'
              "
            >
              {{ tipo }}
            </button>
          </div>
          <p *ngIf="f['tipoSesion'].invalid && submitted" class="text-red-400 text-xs mt-1">
            Selecciona un tipo de sesión
          </p>
        </div>

        <!-- Fecha y hora -->
        <div>
          <label class="block text-sm font-semibold text-text-primary mb-1.5">Fecha y hora *</label>
          <input
            formControlName="fecha"
            type="datetime-local"
            class="w-full rounded-xl border border-white-sanity bg-gray-50 px-4 py-3 text-sm text-text-primary
                   focus:outline-none focus:ring-2 focus:ring-secondary-background focus:border-transparent transition"
          />
          <p *ngIf="f['fecha'].invalid && f['fecha'].touched" class="text-red-400 text-xs mt-1">
            Selecciona fecha y hora
          </p>
        </div>

        <!-- Error -->
        <div
          *ngIf="errorMsg"
          class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500"
        >
          {{ errorMsg }}
        </div>

        <!-- Éxito -->
        <div
          *ngIf="success"
          class="rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 bg-third-background/10 text-third-background border border-third-background/30"
        >
          ✅ ¡Cita agendada exitosamente!
        </div>

        <!-- Botón -->
        <button
          type="submit"
          [disabled]="loading || success"
          class="w-full py-4 rounded-2xl text-white font-bold text-sm active:scale-[0.98] transition-all disabled:opacity-60"
          style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
        >
          <span *ngIf="!loading && !success">Confirmar cita 📅</span>
          <span *ngIf="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
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

  form!: FormGroup;
  loading = false;
  success = false;
  submitted = false;
  errorMsg = '';

  get slots() {
    return parseDisponibilidad(this.specialist?.disponibilidad ?? '[]');
  }

  constructor(
    private fb: FormBuilder,
    private specialistSvc: SpecialistService,
    private auth: AuthHelperService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      tipoSesion: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.getAuthUser();
    if (!user) {
      this.errorMsg = 'Sesión expirada.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const dto: CreateAppointmentDto = {
      pacienteID: user.userId,
      tipoSesion: this.form.value.tipoSesion,
      fecha: this.form.value.fecha,
      specialistUserId: this.specialist.id, // ← cambia .userId por .id
    };

    this.specialistSvc.createAppointment(dto).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.close(), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err?.error?.message ?? 'No se pudo agendar. Intenta con otro horario.';
      },
    });
  }

  close() {
    this.closed.emit();
  }
}
