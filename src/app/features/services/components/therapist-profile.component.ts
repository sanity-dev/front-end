import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, stagger, query } from '@angular/animations';
import { Specialist, parseDisponibilidad } from '../models/specialist.model';

@Component({
  selector: 'app-therapist-profile',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(55, animate('280ms ease', style({ opacity: 1, transform: 'translateY(0)' }))),
        ], { optional: true }),
      ]),
    ]),
  ],
  template: `
    <div @fadeSlide class="space-y-4 pb-24">

      <!-- Hero -->
      <div class="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl"
        style="background: linear-gradient(135deg, #2C3E50, #4CA1AF)">
        <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none"></div>
        <div class="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none"></div>

        <div class="relative flex items-center gap-4 mb-5">
          <div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl flex-shrink-0">
            🧑‍⚕️
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white/60 text-[10px] font-bold uppercase tracking-widest">Perfil activo</p>
            <h2 class="text-xl font-bold leading-tight truncate">{{ specialist.nombre || 'Terapeuta' }}</h2>
            <p class="text-white/80 text-sm mt-0.5 line-clamp-1">{{ specialist.tituloProfesional }}</p>
          </div>
        </div>

        <div class="relative grid grid-cols-2 gap-2">
          <div class="bg-white/15 rounded-2xl p-3 text-center">
            <p class="text-2xl font-bold">{{ specialist.especialidades.length }}</p>
            <p class="text-[10px] text-white/70 mt-0.5">especialidades</p>
          </div>
          <div class="bg-white/15 rounded-2xl p-3 text-center">
            <p class="text-2xl font-bold">{{ specialist.citas?.length || 0 }}</p>
            <p class="text-[10px] text-white/70 mt-0.5">citas agendadas</p>
          </div>
        </div>
      </div>

      <!-- Presentación -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D9D9D9]/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sobre mí</p>
        <p class="text-[#1d1d1d] text-sm leading-relaxed">{{ specialist.presentacion }}</p>
      </div>

      <!-- Especialidades -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D9D9D9]/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Especialidades</p>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let esp of specialist.especialidades"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border"
            style="background: #4CA1AF1A; color: #4CA1AF; border-color: #4CA1AF33">
            {{ esp }}
          </span>
        </div>
      </div>

      <!-- Servicios -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D9D9D9]/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Servicios</p>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let srv of specialist.servicios"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border"
            style="background: #4C9EEB1A; color: #4C9EEB; border-color: #4C9EEB33">
            {{ srv }}
          </span>
        </div>
      </div>

      <!-- Disponibilidad -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D9D9D9]/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Disponibilidad</p>
        <div @stagger class="space-y-2" [attr.data-len]="slots.length">
          <div *ngFor="let slot of slots"
            class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-[#D9D9D9]/60">
            <span class="font-bold text-[#1d1d1d] text-sm w-10 flex-shrink-0">{{ slot.dia }}</span>
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold px-2 py-1 rounded-lg"
                style="background: #4CA1AF1A; color: #4CA1AF">{{ slot.horaInicio }}</span>
              <span class="text-[#D9D9D9]">→</span>
              <span class="font-bold px-2 py-1 rounded-lg"
                style="background: #4CA1AF1A; color: #4CA1AF">{{ slot.horaFin }}</span>
            </div>
          </div>
          <p *ngIf="slots.length === 0" class="text-center text-gray-400 text-sm py-3">
            Sin disponibilidad configurada
          </p>
        </div>
      </div>

      <!-- Citas -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D9D9D9]/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Citas agendadas ({{ specialist.citas?.length || 0 }})
        </p>

        <ng-container *ngIf="specialist.citas && specialist.citas.length > 0; else noCitas">
          <div class="space-y-2">
            <div *ngFor="let cita of specialist.citas.slice(0, 5)"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-[#D9D9D9]/60">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
                style="background: #4C9EEB">
                {{ cita.fecha | date:'dd' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-[#1d1d1d]">
                  {{ cita.fecha | date:'EEEE, dd MMM':'':'es' }}
                </p>
                <p class="text-xs text-gray-400 truncate">{{ cita.tipoSesion }}</p>
              </div>
              <span class="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0"
                style="background: #4CA1AF1A; color: #4CA1AF">
                {{ cita.fecha | date:'HH:mm' }}
              </span>
            </div>
          </div>
        </ng-container>

        <ng-template #noCitas>
          <div class="text-center py-6">
            <p class="text-3xl mb-2">📅</p>
            <p class="text-gray-500 text-sm">Aún no tienes citas agendadas</p>
            <p class="text-gray-400 text-xs mt-1">Los pacientes te encontrarán en el directorio</p>
          </div>
        </ng-template>
      </div>

      <!-- Editar -->
      <button (click)="edit.emit()"
        class="w-full py-4 rounded-2xl border-2 border-dashed font-semibold text-sm
               hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        style="border-color: #4C9EEB; color: #4C9EEB">
        ✏️ Editar mis servicios
      </button>

    </div>
  `,
})
export class TherapistProfileComponent {
  @Input() specialist!: Specialist;
  @Output() edit = new EventEmitter<void>();

  get slots() { return parseDisponibilidad(this.specialist?.disponibilidad ?? '[]'); }
}