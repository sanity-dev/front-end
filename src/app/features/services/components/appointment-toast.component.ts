import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { SpecialistService } from '../services/specialist.service';
import { AuthHelperService } from '../services/auth-helper.service';
import { Specialist, CreateAppointmentDto, parseDisponibilidad, DisponibilidadSlot } from '../models/specialist.model';

/** Genera todas las fechas (YYYY-MM-DD) de los próximos `weeks` semanas
 *  que coincidan con el día de la semana del slot. */
function generarFechasParaSlot(slot: DisponibilidadSlot, weeks = 6): string[] {
  const diasMap: Record<string, number> = {
    Lun: 1, Mar: 2, Mié: 3, Jue: 4, Vie: 5, Sáb: 6, Dom: 0,
    lun: 1, mar: 2, mié: 3, jue: 4, vie: 5, sáb: 6, dom: 0,
    // También nombres completos por si acaso
    Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6, Domingo: 0,
  };

  const targetDay = diasMap[slot.dia];
  if (targetDay === undefined) return [];

  const fechas: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= weeks * 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === targetDay) {
      fechas.push(d.toISOString().split('T')[0]);
    }
  }
  return fechas;
}

/** Genera horas en bloques de 1h dentro del rango del slot */
function generarHorasParaSlot(slot: DisponibilidadSlot): string[] {
  const [hIni, mIni] = slot.horaInicio.split(':').map(Number);
  const [hFin, mFin] = slot.horaFin.split(':').map(Number);
  const horas: string[] = [];

  let cur = hIni * 60 + (mIni || 0);
  const end = hFin * 60 + (mFin || 0);

  while (cur < end) {
    const h = Math.floor(cur / 60).toString().padStart(2, '0');
    const m = (cur % 60).toString().padStart(2, '0');
    horas.push(`${h}:${m}`);
    cur += 60;
  }
  return horas;
}

interface FechaHoraOption {
  label: string;        // "Lun 14 Jul · 09:00"
  value: string;        // "2025-07-14T09:00"
  fecha: string;        // "2025-07-14"
  hora: string;         // "09:00"
  dia: string;          // "Lun"
}

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
    <div @fadeIn class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" (click)="close()"></div>

    <div @slideUp class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl flex flex-col" style="max-height: 92vh">
      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
        <div class="w-10 h-1 rounded-full bg-gray-200"></div>
      </div>

      <!-- Header -->
      <div class="px-5 pt-1 pb-3 border-b border-gray-100 flex-shrink-0">
        <div class="flex items-center gap-2 mb-2">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
          >
            📅
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-bold text-text-primary text-sm">
              {{ specialist.nombre || 'Terapeuta' }}
            </h2>
            <p class="text-xs text-third-background truncate">{{ specialist.tituloProfesional }}</p>
          </div>
          <button
            (click)="close()"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Días disponibles del terapeuta -->
        <div class="flex flex-wrap gap-1">
          <span
            *ngFor="let slot of slots"
            class="px-2 py-0.5 rounded-lg font-bold"
            style="font-size: 9px; background: #4CA1AF1A; color: #4CA1AF"
          >
            {{ slot.dia }} {{ slot.horaInicio }}–{{ slot.horaFin }}
          </span>
        </div>
      </div>

      <!-- Form scrollable -->
      <div class="overflow-y-auto flex-1">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col px-5 py-4 gap-4 pb-28">

          <!-- Tipo de sesión -->
          <div>
            <label class="block text-xs font-semibold text-text-primary mb-1.5">Tipo de sesión *</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                *ngFor="let tipo of specialist.servicios"
                (click)="form.patchValue({ tipoSesion: tipo })"
                class="px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all"
                [class]="form.value.tipoSesion === tipo
                  ? 'bg-third-background text-white border-third-background'
                  : 'bg-white text-text-primary border-white-sanity'"
              >
                {{ tipo }}
              </button>
            </div>
            <p *ngIf="f['tipoSesion'].invalid && submitted" class="text-red-400 mt-1" style="font-size: 10px">
              Selecciona un tipo de sesión
            </p>
          </div>

          <!-- ── SELECTOR DE FECHAS DISPONIBLES ── -->
          <div>
            <label class="block text-xs font-semibold text-text-primary mb-1.5">Día disponible *</label>

            <!-- Sin disponibilidad -->
            <div
              *ngIf="slots.length === 0"
              class="rounded-xl border border-gray-100 bg-gray-50 text-center py-6"
            >
              <p style="font-size: 1.5rem; margin-bottom: 0.25rem">😕</p>
              <p class="text-xs text-gray-400">Este terapeuta aún no tiene disponibilidad configurada</p>
            </div>

            <!-- Fechas agrupadas por slot -->
            <div *ngIf="slots.length > 0" style="display: flex; flex-direction: column; gap: 0.75rem">
              <div *ngFor="let grupo of gruposFechas">
                <!-- Etiqueta del día -->
                <p class="text-[10px] font-bold uppercase tracking-wider mb-1.5" style="color: #4CA1AF">
                  {{ grupo.slot.dia }} · {{ grupo.slot.horaInicio }} a {{ grupo.slot.horaFin }}
                </p>

                <!-- Chips de fecha -->
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    *ngFor="let fecha of grupo.fechas"
                    (click)="seleccionarFecha(fecha)"
                    class="rounded-xl border font-bold transition-all active:scale-[0.96]"
                    style="padding: 0.375rem 0.75rem; font-size: 11px"
                    [style]="fechaSeleccionada === fecha
                      ? 'background: linear-gradient(135deg, #4C9EEB, #4CA1AF); color: white; border-color: transparent'
                      : 'background: white; color: #374151; border-color: #E5E7EB'"
                  >
                    {{ formatearFechaChip(fecha) }}
                  </button>
                </div>
              </div>
            </div>

            <p *ngIf="!fechaSeleccionada && submitted" class="text-red-400 mt-1" style="font-size: 10px">
              Selecciona un día disponible
            </p>
          </div>

          <!-- ── SELECTOR DE HORA ── -->
          <div *ngIf="fechaSeleccionada && horasDisponibles.length > 0">
            <label class="block text-xs font-semibold text-text-primary mb-1.5">Hora *</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                *ngFor="let hora of horasDisponibles"
                (click)="seleccionarHora(hora)"
                class="rounded-xl border font-bold transition-all active:scale-[0.96]"
                style="padding: 0.375rem 0.875rem; font-size: 12px"
                [style]="horaSeleccionada === hora
                  ? 'background: linear-gradient(135deg, #4C9EEB, #4CA1AF); color: white; border-color: transparent'
                  : 'background: white; color: #374151; border-color: #E5E7EB'"
              >
                {{ hora }}
              </button>
            </div>
            <p *ngIf="!horaSeleccionada && submitted" class="text-red-400 mt-1" style="font-size: 10px">
              Selecciona una hora
            </p>
          </div>

          <!-- Resumen de selección -->
          <div
            *ngIf="fechaSeleccionada && horaSeleccionada"
            class="rounded-2xl flex items-center gap-3"
            style="background: #4CA1AF0D; border: 1px solid #4CA1AF25; padding: 0.875rem 1rem"
          >
            <span style="font-size: 1.25rem">🗓️</span>
            <div>
              <p class="text-xs font-bold" style="color: #4CA1AF">Cita confirmada para:</p>
              <p class="text-sm font-bold text-gray-800">
                {{ formatearResumen() }}
              </p>
            </div>
          </div>

          <!-- Error -->
          <div
            *ngIf="errorMsg"
            class="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-500"
          >
            {{ errorMsg }}
          </div>

          <!-- Éxito -->
          <div
            *ngIf="success"
            class="rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2"
            style="background: #4CA1AF1A; color: #4CA1AF; border: 1px solid #4CA1AF30"
          >
            ✅ ¡Cita agendada exitosamente!
          </div>

          <!-- Botón -->
          <button
            type="submit"
            [disabled]="loading || success"
            class="w-full py-3.5 rounded-2xl text-white font-bold text-sm active:scale-[0.98] transition-all disabled:opacity-60"
            style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
          >
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

  fechaSeleccionada: string | null = null;
  horaSeleccionada: string | null = null;
  horasDisponibles: string[] = [];

  /** Cada slot → sus próximas fechas disponibles */
  gruposFechas: Array<{ slot: DisponibilidadSlot; fechas: string[] }> = [];

  get slots(): DisponibilidadSlot[] {
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

    // Construir grupos de fechas a partir de los slots del terapeuta
    this.gruposFechas = this.slots.map((slot) => ({
      slot,
      fechas: generarFechasParaSlot(slot, 6),
    }));
  }

  get f() {
    return this.form.controls;
  }

  seleccionarFecha(fecha: string) {
    this.fechaSeleccionada = fecha;
    this.horaSeleccionada = null;
    this.form.patchValue({ fecha: '' });

    // Buscar el slot que corresponde a esta fecha (por día de semana)
    const diaSemana = new Date(fecha + 'T12:00:00').getDay();
    const diasMap: Record<number, string[]> = {
      0: ['Dom', 'dom', 'Domingo'],
      1: ['Lun', 'lun', 'Lunes'],
      2: ['Mar', 'mar', 'Martes'],
      3: ['Mié', 'mié', 'Miércoles'],
      4: ['Jue', 'jue', 'Jueves'],
      5: ['Vie', 'vie', 'Viernes'],
      6: ['Sáb', 'sáb', 'Sábado'],
    };

    const slot = this.slots.find((s) => diasMap[diaSemana]?.includes(s.dia));
    this.horasDisponibles = slot ? generarHorasParaSlot(slot) : [];
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
    const isoFecha = `${this.fechaSeleccionada}T${hora}`;
    this.form.patchValue({ fecha: isoFecha });
  }

  formatearFechaChip(fecha: string): string {
    const d = new Date(fecha + 'T12:00:00');
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`;
  }

  formatearResumen(): string {
    if (!this.fechaSeleccionada || !this.horaSeleccionada) return '';
    const chip = this.formatearFechaChip(this.fechaSeleccionada);
    return `${chip} · ${this.horaSeleccionada}`;
  }

  onSubmit() {
    this.submitted = true;

    const fechaValida = !!this.fechaSeleccionada && !!this.horaSeleccionada;
    if (this.form.get('tipoSesion')?.invalid || !fechaValida) {
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
      specialistUserId: this.specialist.id,
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