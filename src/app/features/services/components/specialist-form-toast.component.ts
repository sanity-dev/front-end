import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { SpecialistService } from '../services/specialist.service';
import { AuthHelperService } from '../services/auth-helper.service';
import {
  CreateSpecialistDto,
  DisponibilidadSlot,
  stringifyDisponibilidad,
} from '../models/specialist.model';

@Component({
  selector: 'app-specialist-form-toast',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '380ms cubic-bezier(0.32,0.72,0,1)',
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
    <!-- Overlay -->
    <div @fadeIn class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" (click)="close()"></div>

    <!-- Sheet -->
    <div
      @slideUp
      class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[93vh] flex flex-col"
    >
      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
        <div class="w-10 h-1 rounded-full bg-[#D9D9D9]"></div>
      </div>

      <!-- Header -->
      <div
        class="px-6 pt-2 pb-4 border-b border-[#D9D9D9]/50 flex items-center justify-between flex-shrink-0"
      >
        <div>
          <h2 class="text-xl font-bold text-[#1d1d1d]" style="font-family: Manrope, sans-serif">
            Ofrece tus servicios
          </h2>
          <p class="text-xs text-[#4C9EEB] mt-0.5">Tu perfil será visible para los pacientes</p>
        </div>
        <button
          (click)="close()"
          class="w-9 h-9 rounded-full bg-[#D9D9D9]/40 flex items-center justify-center hover:bg-[#D9D9D9] transition-colors"
        >
          <svg class="w-5 h-5 text-[#1d1d1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Steps -->
      <div class="px-6 py-3 flex items-center gap-1 flex-shrink-0">
        <ng-container *ngFor="let s of [1, 2, 3]; let i = index">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            [ngClass]="{
              'text-white': step > i,
              'text-[#4C9EEB] border-2 border-[#4C9EEB] bg-blue-50': step === i + 1,
              'bg-[#D9D9D9]/50 text-gray-400': step < i + 1,
            }"
            [style.background]="step > i ? '#4CA1AF' : ''"
          >
            <span *ngIf="step > i">✓</span>
            <span *ngIf="step <= i">{{ s }}</span>
          </div>
          <div
            *ngIf="i < 2"
            class="h-0.5 w-8 rounded transition-all duration-300"
            [style.background]="step > i + 1 ? '#4CA1AF' : '#D9D9D9'"
          ></div>
        </ng-container>
        <span class="ml-auto text-xs text-gray-400">Paso {{ step }} de 3</span>
      </div>

      <!-- Form -->
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide"
      >
        <!-- ══ PASO 1: Info profesional ══ -->
        <div *ngIf="step === 1" class="space-y-5 py-4">
          <div>
            <p class="font-bold text-[#1d1d1d] text-sm">Información profesional</p>
            <p class="text-xs text-gray-400 mt-0.5">Tu formación y enfoque terapéutico</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-[#1d1d1d] mb-1.5"
              >Título profesional *</label
            >
            <input
              formControlName="tituloProfesional"
              placeholder="Ej: Psicólogo Clínico - Universidad Nacional"
              class="w-full rounded-xl border border-[#D9D9D9] bg-gray-50 px-4 py-3 text-sm text-[#1d1d1d]
                     focus:outline-none focus:ring-2 focus:ring-[#4C9EEB] focus:border-transparent transition"
            />
            <p
              *ngIf="f['tituloProfesional'].invalid && f['tituloProfesional'].touched"
              class="text-red-400 text-xs mt-1"
            >
              Campo requerido (mínimo 5 caracteres)
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-[#1d1d1d] mb-1.5">Presentación *</label>
            <textarea
              formControlName="presentacion"
              rows="4"
              placeholder="Describe tu enfoque, tu experiencia y cómo puedes ayudar a tus pacientes..."
              class="w-full rounded-xl border border-[#D9D9D9] bg-gray-50 px-4 py-3 text-sm text-[#1d1d1d]
                     resize-none focus:outline-none focus:ring-2 focus:ring-[#4C9EEB] focus:border-transparent transition"
            ></textarea>
            <div class="flex justify-between mt-1">
              <p
                *ngIf="f['presentacion'].invalid && f['presentacion'].touched"
                class="text-red-400 text-xs"
              >
                Mínimo 30 caracteres
              </p>
              <p class="text-xs text-gray-400 ml-auto">
                {{ f['presentacion'].value?.length || 0 }}/600
              </p>
            </div>
          </div>

          <button
            type="button"
            (click)="nextStep()"
            class="w-full py-4 rounded-2xl text-white font-bold text-sm active:scale-[0.98] transition-all"
            style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
          >
            Continuar →
          </button>
        </div>

        <!-- ══ PASO 2: Especialidades y servicios ══ -->
        <div *ngIf="step === 2" class="space-y-5 py-4">
          <div>
            <p class="font-bold text-[#1d1d1d] text-sm">Especialidades y servicios</p>
            <p class="text-xs text-gray-400 mt-0.5">Las áreas en las que trabajas</p>
          </div>

          <!-- Especialidades -->
          <div>
            <label class="block text-sm font-semibold text-[#1d1d1d] mb-2">Especialidades *</label>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                *ngFor="let esp of especialidadesOpciones"
                (click)="toggleItem('especialidades', esp)"
                class="px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-150"
                [style.background]="isSelected('especialidades', esp) ? '#4CA1AF' : ''"
                [style.color]="isSelected('especialidades', esp) ? 'white' : '#1d1d1d'"
                [style.border-color]="isSelected('especialidades', esp) ? '#4CA1AF' : '#D9D9D9'"
              >
                {{ esp }}
              </button>
            </div>
            <p
              *ngIf="submitted && getArray('especialidades').length === 0"
              class="text-red-400 text-xs mt-1"
            >
              Selecciona al menos una
            </p>
          </div>

          <!-- Servicios -->
          <div>
            <label class="block text-sm font-semibold text-[#1d1d1d] mb-2"
              >Servicios que ofreces *</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                *ngFor="let srv of serviciosOpciones"
                (click)="toggleItem('servicios', srv)"
                class="px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-150"
                [style.background]="isSelected('servicios', srv) ? '#4C9EEB' : ''"
                [style.color]="isSelected('servicios', srv) ? 'white' : '#1d1d1d'"
                [style.border-color]="isSelected('servicios', srv) ? '#4C9EEB' : '#D9D9D9'"
              >
                {{ srv }}
              </button>
            </div>
            <p
              *ngIf="submitted && getArray('servicios').length === 0"
              class="text-red-400 text-xs mt-1"
            >
              Selecciona al menos uno
            </p>
          </div>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              (click)="step = 1"
              class="flex-1 py-4 rounded-2xl border-2 border-[#D9D9D9] text-[#1d1d1d] font-bold text-sm active:scale-[0.98] transition-all"
            >
              ← Atrás
            </button>
            <button
              type="button"
              (click)="nextStep()"
              class="flex-[2] py-4 rounded-2xl text-white font-bold text-sm active:scale-[0.98] transition-all"
              style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
            >
              Continuar →
            </button>
          </div>
        </div>

        <!-- ══ PASO 3: Disponibilidad ══ -->
        <div *ngIf="step === 3" class="space-y-4 py-4">
          <div>
            <p class="font-bold text-[#1d1d1d] text-sm">Disponibilidad</p>
            <p class="text-xs text-gray-400 mt-0.5">Configura tus horarios de atención</p>
          </div>

          <div class="space-y-3">
            <div
              *ngFor="let slot of disponibilidadSlots; let i = index"
              class="bg-gray-50 rounded-2xl p-4 border border-[#D9D9D9]"
            >
              <!-- Selector de día -->
              <div class="flex items-center gap-1.5 mb-3 flex-wrap">
                <button
                  type="button"
                  *ngFor="let dia of dias"
                  (click)="slot.dia = dia"
                  class="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all"
                  [style.background]="slot.dia === dia ? '#4CA1AF' : 'white'"
                  [style.color]="slot.dia === dia ? 'white' : '#1d1d1d'"
                  [style.border-color]="slot.dia === dia ? '#4CA1AF' : '#D9D9D9'"
                >
                  {{ dia }}
                </button>
                <button
                  type="button"
                  (click)="removeSlot(i)"
                  class="ml-auto w-7 h-7 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              <!-- Horas — usa ngModel dentro de FormsModule (standalone: true) -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-semibold text-gray-500 block mb-1"
                    >Hora inicio</label
                  >
                  <input
                    type="time"
                    [(ngModel)]="slot.horaInicio"
                    [ngModelOptions]="{ standalone: true }"
                    class="w-full rounded-xl border border-[#D9D9D9] bg-white px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#4C9EEB] focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-gray-500 block mb-1">Hora fin</label>
                  <input
                    type="time"
                    [(ngModel)]="slot.horaFin"
                    [ngModelOptions]="{ standalone: true }"
                    class="w-full rounded-xl border border-[#D9D9D9] bg-white px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#4C9EEB] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            (click)="addSlot()"
            class="w-full py-3 rounded-2xl border-2 border-dashed text-sm font-semibold
                   hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            style="border-color: #4C9EEB; color: #4C9EEB"
          >
            + Agregar día disponible
          </button>

          <p *ngIf="submitted && disponibilidadSlots.length === 0" class="text-red-400 text-xs">
            Agrega al menos un horario de disponibilidad
          </p>

          <div
            *ngIf="errorMsg"
            class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500"
          >
            {{ errorMsg }}
          </div>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              (click)="step = 2"
              class="flex-1 py-4 rounded-2xl border-2 border-[#D9D9D9] text-[#1d1d1d] font-bold text-sm active:scale-[0.98] transition-all"
            >
              ← Atrás
            </button>
            <button
              type="submit"
              [disabled]="loading"
              class="flex-[2] py-4 rounded-2xl text-white font-bold text-sm
                     active:scale-[0.98] transition-all disabled:opacity-60"
              style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
            >
              <span *ngIf="!loading">Publicar mis servicios ✨</span>
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
                Guardando...
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class SpecialistFormToastComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  step = 1;
  loading = false;
  submitted = false;
  errorMsg = '';

  disponibilidadSlots: DisponibilidadSlot[] = [];
  dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  especialidadesOpciones = [
    'Psicología clínica',
    'Psicología cognitivo-conductual',
    'Terapia familiar y de pareja',
    'Psicoterapia gestáltica',
    'Neuropsicología',
    'Psicología infantil y adolescente',
    'Psicoanálisis',
    'Mindfulness y bienestar',
    'Terapia de duelo',
    'Manejo del estrés y ansiedad',
  ];

  serviciosOpciones = [
    'Consulta individual',
    'Terapia de pareja',
    'Terapia familiar',
    'Terapia grupal',
    'Evaluación psicológica',
    'Orientación vocacional',
    'Sesión de emergencia',
    'Seguimiento mensual',
  ];

  constructor(
    private fb: FormBuilder,
    private specialistSvc: SpecialistService,
    private authSvc: AuthHelperService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tituloProfesional: ['', [Validators.required, Validators.minLength(5)]],
      presentacion: [
        '',
        [Validators.required, Validators.minLength(30), Validators.maxLength(600)],
      ],
      especialidades: [[]],
      servicios: [[]],
    });
    this.addSlot();
  }

  get f() {
    return this.form.controls;
  }

  getArray(field: string): string[] {
    return this.form.get(field)?.value ?? [];
  }

  toggleItem(field: string, item: string): void {
    const cur: string[] = this.getArray(field);
    this.form.patchValue({
      [field]: cur.includes(item) ? cur.filter((v: string) => v !== item) : [...cur, item],
    });
  }

  isSelected(field: string, item: string): boolean {
    return this.getArray(field).includes(item);
  }

  addSlot(): void {
    this.disponibilidadSlots.push({ dia: 'Lun', horaInicio: '08:00', horaFin: '17:00' });
  }

  removeSlot(i: number): void {
    this.disponibilidadSlots.splice(i, 1);
  }

  nextStep(): void {
    if (this.step === 1) {
      this.f['tituloProfesional'].markAsTouched();
      this.f['presentacion'].markAsTouched();
      if (this.f['tituloProfesional'].invalid || this.f['presentacion'].invalid) return;
    }
    if (this.step === 2) {
      this.submitted = true;
      if (!this.getArray('especialidades').length || !this.getArray('servicios').length) return;
      this.submitted = false;
    }
    this.step++;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    if (!this.disponibilidadSlots.length) return;

    const user = this.authSvc.getAuthUser();
    if (!user) {
      this.errorMsg = 'Sesión expirada.';
      return;
    }

    this.loading = true;

    const dto: CreateSpecialistDto = {
      userId: user.userId,
      tituloProfesional: this.form.value.tituloProfesional,
      presentacion: this.form.value.presentacion,
      especialidades: this.getArray('especialidades'),
      servicios: this.getArray('servicios'),
      disponibilidad: stringifyDisponibilidad(this.disponibilidadSlots),
    };

    this.specialistSvc.createSpecialist(dto).subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
        this.close();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err?.error?.message ?? 'Error al guardar. Intenta de nuevo.';
      },
    });
  }

  close(): void {
    this.closed.emit();
  }
}
