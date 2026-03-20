import {
  Component, EventEmitter, Output, Input, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { SpecialistService } from '../services/specialist.service';
import { AuthHelperService } from '../services/auth-helper.service';
import {
  Specialist, CreateSpecialistDto, DisponibilidadSlot, stringifyDisponibilidad,
} from '../models/specialist.model';

@Component({
  selector: 'app-specialist-form-toast',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [
    trigger('sheet', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('360ms cubic-bezier(0.32,0.72,0,1)', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease', style({ opacity: 0 }))]),
    ]),
  ],
  template: `
    <div @fade class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" (click)="close()"></div>

    <div @sheet class="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
      style="max-height: 93vh">

      <!-- Handle -->
      <div class="flex justify-center shrink-0" style="padding: 0.75rem 0 0.25rem">
        <div class="w-10 h-1 rounded-full bg-gray-200"></div>
      </div>

      <!-- Header -->
      <div class="border-b border-gray-100 flex items-center justify-between shrink-0"
        style="padding: 0.5rem 1.5rem 1rem">
        <div>
          <h2 class="text-xl font-bold text-gray-900" style="font-family: Manrope, sans-serif">
            {{ isEditing ? 'Editar servicios' : 'Ofrece tus servicios' }}
          </h2>
          <p class="text-xs" style="color: #4C9EEB; margin-top: 0.125rem">
            {{ isEditing ? 'Actualiza tu información' : 'Tu perfil será visible para los pacientes' }}
          </p>
        </div>
        <button (click)="close()"
          class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Steps -->
      <div class="flex items-center shrink-0" style="padding: 0.75rem 1.5rem; gap: 0.5rem">
        <ng-container *ngFor="let s of [1,2,3]; let i = index">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            [style.background]="step > i + 1 ? '#4CA1AF' : step === i + 1 ? '#EFF6FF' : '#F3F4F6'"
            [style.color]="step > i + 1 ? 'white' : step === i + 1 ? '#4C9EEB' : '#9CA3AF'"
            [style.border]="step === i + 1 ? '2px solid #4C9EEB' : 'none'">
            <span *ngIf="step > i + 1">✓</span>
            <span *ngIf="step <= i + 1">{{ s }}</span>
          </div>
          <div *ngIf="i < 2" class="h-0.5 flex-1 rounded transition-all duration-300"
            [style.background]="step > i + 1 ? '#4CA1AF' : '#E5E7EB'">
          </div>
        </ng-container>
        <span class="text-xs text-gray-400" style="margin-left: 0.25rem">{{ step }}/3</span>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto"
        style="padding: 0 1.5rem 7rem">

        <!-- PASO 1 -->
        <div *ngIf="step === 1" style="padding-top: 1rem; display: flex; flex-direction: column; gap: 1.25rem">
          <p class="text-sm font-bold text-gray-800">Información profesional</p>

          <div style="display: flex; flex-direction: column; gap: 0.25rem">
            <label class="text-xs font-semibold text-gray-600">Título profesional *</label>
            <input formControlName="tituloProfesional"
              placeholder="Ej: Psicólogo Clínico - Universidad Nacional"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 text-sm transition"
              style="padding: 0.75rem 1rem; outline: none"/>
            <p *ngIf="f['tituloProfesional'].invalid && f['tituloProfesional'].touched"
               class="text-red-400 text-xs">Mínimo 5 caracteres</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.25rem">
            <label class="text-xs font-semibold text-gray-600">Presentación *</label>
            <textarea formControlName="presentacion" rows="4"
              placeholder="Describe tu enfoque, experiencia y cómo puedes ayudar..."
              class="w-full rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none transition"
              style="padding: 0.75rem 1rem; outline: none"></textarea>
            <div class="flex justify-between">
              <p *ngIf="f['presentacion'].invalid && f['presentacion'].touched"
                 class="text-red-400 text-xs">Mínimo 30 caracteres</p>
              <p class="text-xs text-gray-400 ml-auto">{{ f['presentacion'].value?.length || 0 }}/600</p>
            </div>
          </div>

          <button type="button" (click)="nextStep()"
            class="w-full rounded-2xl text-white font-bold text-sm"
            style="padding: 1rem; background: linear-gradient(135deg, #4C9EEB, #4CA1AF)">
            Continuar →
          </button>
        </div>

        <!-- PASO 2 -->
        <div *ngIf="step === 2" style="padding-top: 1rem; display: flex; flex-direction: column; gap: 1.25rem">
          <p class="text-sm font-bold text-gray-800">Especialidades y servicios</p>

          <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <label class="text-xs font-semibold text-gray-600">Especialidades *</label>
            <div class="flex flex-wrap" style="gap: 0.5rem">
              <button type="button" *ngFor="let esp of especialidadesOpciones"
                (click)="toggleItem('especialidades', esp)"
                class="rounded-xl border text-xs font-semibold transition-all"
                style="padding: 0.5rem 0.75rem"
                [style.background]="isSelected('especialidades', esp) ? '#4CA1AF' : 'white'"
                [style.color]="isSelected('especialidades', esp) ? 'white' : '#374151'"
                [style.borderColor]="isSelected('especialidades', esp) ? '#4CA1AF' : '#E5E7EB'">
                {{ esp }}
              </button>
            </div>
            <p *ngIf="submitted && !getArray('especialidades').length" class="text-red-400 text-xs">
              Selecciona al menos una
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <label class="text-xs font-semibold text-gray-600">Servicios que ofreces *</label>
            <div class="flex flex-wrap" style="gap: 0.5rem">
              <button type="button" *ngFor="let srv of serviciosOpciones"
                (click)="toggleItem('servicios', srv)"
                class="rounded-xl border text-xs font-semibold transition-all"
                style="padding: 0.5rem 0.75rem"
                [style.background]="isSelected('servicios', srv) ? '#4C9EEB' : 'white'"
                [style.color]="isSelected('servicios', srv) ? 'white' : '#374151'"
                [style.borderColor]="isSelected('servicios', srv) ? '#4C9EEB' : '#E5E7EB'">
                {{ srv }}
              </button>
            </div>
            <p *ngIf="submitted && !getArray('servicios').length" class="text-red-400 text-xs">
              Selecciona al menos uno
            </p>
          </div>

          <div class="flex" style="gap: 0.75rem">
            <button type="button" (click)="step = 1"
              class="flex-1 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
              style="padding: 1rem">← Atrás</button>
            <button type="button" (click)="nextStep()"
              class="rounded-2xl text-white font-bold text-sm"
              style="flex: 2; padding: 1rem; background: linear-gradient(135deg, #4C9EEB, #4CA1AF)">
              Continuar →
            </button>
          </div>
        </div>

        <!-- PASO 3 -->
        <div *ngIf="step === 3" style="padding-top: 1rem; display: flex; flex-direction: column; gap: 1rem">
          <p class="text-sm font-bold text-gray-800">Disponibilidad</p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem">
            <div *ngFor="let slot of disponibilidadSlots; let i = index"
              class="bg-gray-50 rounded-2xl border border-gray-200" style="padding: 1rem">

              <div class="flex items-center flex-wrap" style="gap: 0.375rem; margin-bottom: 0.75rem">
                <button type="button" *ngFor="let dia of dias" (click)="slot.dia = dia"
                  class="rounded-lg border font-bold transition-all"
                  style="padding: 0.375rem 0.625rem; font-size: 11px"
                  [style.background]="slot.dia === dia ? '#4CA1AF' : 'white'"
                  [style.color]="slot.dia === dia ? 'white' : '#374151'"
                  [style.borderColor]="slot.dia === dia ? '#4CA1AF' : '#E5E7EB'">
                  {{ dia }}
                </button>
                <button type="button" (click)="removeSlot(i)"
                  class="ml-auto w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-xs hover:bg-red-100 transition-colors">
                  ✕
                </button>
              </div>

              <div class="grid grid-cols-2" style="gap: 0.75rem">
                <div style="display: flex; flex-direction: column; gap: 0.25rem">
                  <label class="font-semibold text-gray-500" style="font-size: 11px">Inicio</label>
                  <input type="time" [(ngModel)]="slot.horaInicio" [ngModelOptions]="{standalone: true}"
                    class="w-full rounded-xl border border-gray-200 bg-white text-sm"
                    style="padding: 0.5rem 0.75rem; outline: none"/>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.25rem">
                  <label class="font-semibold text-gray-500" style="font-size: 11px">Fin</label>
                  <input type="time" [(ngModel)]="slot.horaFin" [ngModelOptions]="{standalone: true}"
                    class="w-full rounded-xl border border-gray-200 bg-white text-sm"
                    style="padding: 0.5rem 0.75rem; outline: none"/>
                </div>
              </div>
            </div>
          </div>

          <button type="button" (click)="addSlot()"
            class="w-full rounded-2xl border-2 border-dashed text-sm font-semibold flex items-center justify-center hover:bg-blue-50 transition-all"
            style="padding: 0.75rem; border-color: #4C9EEB; color: #4C9EEB; gap: 0.5rem">
            + Agregar día
          </button>

          <p *ngIf="submitted && !disponibilidadSlots.length" class="text-red-400 text-xs">
            Agrega al menos un horario
          </p>

          <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 rounded-xl text-sm text-red-500"
            style="padding: 0.75rem 1rem">
            {{ errorMsg }}
          </div>

          <div class="flex" style="gap: 0.75rem; padding-top: 0.25rem">
            <button type="button" (click)="step = 2"
              class="flex-1 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
              style="padding: 1rem">← Atrás</button>
            <button type="submit"
              class="rounded-2xl text-white font-bold text-sm flex items-center justify-center"
              style="flex: 2; padding: 1rem; background: linear-gradient(135deg, #4C9EEB, #4CA1AF)"
              [style.opacity]="loading ? '0.6' : '1'">
              <span *ngIf="!loading">{{ isEditing ? 'Guardar cambios ✨' : 'Publicar servicios ✨' }}</span>
              <span *ngIf="loading" class="flex items-center" style="gap: 0.5rem">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
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
  @Output() saved  = new EventEmitter<void>();
  @Input()  existingProfile: Specialist | null = null;

  form!: FormGroup;
  step      = 1;
  loading   = false;
  submitted = false;
  errorMsg  = '';
  disponibilidadSlots: DisponibilidadSlot[] = [];

  dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  especialidadesOpciones = [
    'Psicología clínica', 'Psicología cognitivo-conductual', 'Terapia familiar y de pareja',
    'Psicoterapia gestáltica', 'Neuropsicología', 'Psicología infantil y adolescente',
    'Psicoanálisis', 'Mindfulness y bienestar', 'Terapia de duelo', 'Manejo del estrés y ansiedad',
  ];

  serviciosOpciones = [
    'Consulta individual', 'Terapia de pareja', 'Terapia familiar', 'Terapia grupal',
    'Evaluación psicológica', 'Orientación vocacional', 'Sesión de emergencia', 'Seguimiento mensual',
  ];

  get isEditing() { return !!this.existingProfile; }
  get f()         { return this.form.controls; }

  constructor(
    private fb:            FormBuilder,
    private specialistSvc: SpecialistService,
    private authSvc:       AuthHelperService,
  ) {}

  ngOnInit(): void {
    const p = this.existingProfile;
    this.form = this.fb.group({
      tituloProfesional: [p?.tituloProfesional ?? '', [Validators.required, Validators.minLength(5)]],
      presentacion:      [p?.presentacion      ?? '', [Validators.required, Validators.minLength(30), Validators.maxLength(600)]],
      especialidades:    [p?.especialidades    ?? []],
      servicios:         [p?.servicios         ?? []],
    });
    if (p?.disponibilidad) {
      try { this.disponibilidadSlots = JSON.parse(p.disponibilidad); }
      catch { this.addSlot(); }
    } else {
      this.addSlot();
    }
  }

  getArray(field: string): string[]  { return this.form.get(field)?.value ?? []; }
  isSelected(field: string, item: string): boolean { return this.getArray(field).includes(item); }
  addSlot():             void { this.disponibilidadSlots.push({ dia: 'Lun', horaInicio: '08:00', horaFin: '17:00' }); }
  removeSlot(i: number): void { this.disponibilidadSlots.splice(i, 1); }

  toggleItem(field: string, item: string): void {
    const cur = this.getArray(field);
    this.form.patchValue({
      [field]: cur.includes(item) ? cur.filter(v => v !== item) : [...cur, item],
    });
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
    this.errorMsg  = '';
    if (!this.disponibilidadSlots.length) return;
    const user = this.authSvc.getAuthUser();
    if (!user) { this.errorMsg = 'Sesión expirada.'; return; }
    this.loading = true;
    const dto: CreateSpecialistDto = {
      userId:            user.userId,
      tituloProfesional: this.form.value.tituloProfesional,
      presentacion:      this.form.value.presentacion,
      especialidades:    this.getArray('especialidades'),
      servicios:         this.getArray('servicios'),
      disponibilidad:    stringifyDisponibilidad(this.disponibilidadSlots),
    };
    const req$ = this.isEditing
      ? this.specialistSvc.updateSpecialist(dto)
      : this.specialistSvc.createSpecialist(dto);
    req$.subscribe({
      next:  () => { this.loading = false; this.saved.emit(); this.close(); },
      error: (err: any) => { this.loading = false; this.errorMsg = err?.error?.message ?? 'Error al guardar.'; },
    });
  }

  close(): void { this.closed.emit(); }
}