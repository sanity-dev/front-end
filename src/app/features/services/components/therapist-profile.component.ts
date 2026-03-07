import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specialist, parseDisponibilidad } from '../models/specialist.model';

@Component({
  selector: 'app-therapist-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 pb-28">

      <!-- Hero -->
      <div class="relative overflow-hidden rounded-3xl p-6 text-white"
           style="background: linear-gradient(135deg, #2C3E50, #4CA1AF)">
        <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"></div>
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
            🧑‍⚕️
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white/60 text-[10px] font-bold uppercase tracking-widest">Perfil activo</p>
            <h2 class="text-lg font-bold truncate">{{ specialist.nombre || 'Terapeuta' }}</h2>
            <p class="text-white/80 text-sm truncate">{{ specialist.tituloProfesional }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white/15 rounded-2xl p-3 text-center">
            <p class="text-2xl font-bold">{{ specialist.especialidades.length }}</p>
            <p class="text-[10px] text-white/70">especialidades</p>
          </div>
          <div class="bg-white/15 rounded-2xl p-3 text-center">
            <p class="text-2xl font-bold">{{ specialist.citas?.length || 0 }}</p>
            <p class="text-[10px] text-white/70">citas agendadas</p>
          </div>
        </div>
      </div>

      <!-- Presentación -->
      <div class="bg-white rounded-2xl p-5 border border-white-sanity/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sobre mí</p>
        <p class="text-text-primary text-sm leading-relaxed">{{ specialist.presentacion }}</p>
      </div>

      <!-- Especialidades -->
      <div class="bg-white rounded-2xl p-5 border border-white-sanity/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Especialidades</p>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let esp of specialist.especialidades"
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-third-background/10 text-third-background border border-third-background/30">
            {{ esp }}
          </span>
        </div>
      </div>

      <!-- Servicios -->
      <div class="bg-white rounded-2xl p-5 border border-white-sanity/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Servicios</p>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let srv of specialist.servicios"
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary-background/10 text-secondary-background border border-secondary-background/30">
            {{ srv }}
          </span>
        </div>
      </div>

      <!-- Disponibilidad -->
      <div class="bg-white rounded-2xl p-5 border border-white-sanity/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Disponibilidad</p>
        <div class="space-y-2">
          <div *ngFor="let slot of slots"
            class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-white-sanity/60">
            <span class="font-bold text-text-primary text-sm w-10">{{ slot.dia }}</span>
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold px-2 py-1 rounded-lg bg-third-background/10 text-third-background">{{ slot.horaInicio }}</span>
              <span class="text-white-sanity">→</span>
              <span class="font-bold px-2 py-1 rounded-lg bg-third-background/10 text-third-background">{{ slot.horaFin }}</span>
            </div>
          </div>
          <p *ngIf="!slots.length" class="text-center text-gray-400 text-sm py-3">Sin disponibilidad</p>
        </div>
      </div>

      <!-- Citas -->
      <div class="bg-white rounded-2xl p-5 border border-white-sanity/60">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Citas ({{ specialist.citas?.length || 0 }})
        </p>
        <ng-container *ngIf="specialist.citas?.length; else noCitas">
          <div class="space-y-2">
            <div *ngFor="let cita of specialist.citas!.slice(0, 5)"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-white-sanity/60">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white bg-secondary-background flex-shrink-0">
                {{ cita.fecha | date:'dd' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-text-primary">{{ cita.fecha | date:'EEE dd MMM' }}</p>
                <p class="text-xs text-gray-400 truncate">{{ cita.tipoSesion }}</p>
              </div>
              <span class="text-xs font-bold px-2 py-1 rounded-lg bg-third-background/10 text-third-background flex-shrink-0">
                {{ cita.fecha | date:'HH:mm' }}
              </span>
            </div>
          </div>
        </ng-container>
        <ng-template #noCitas>
          <div class="text-center py-6">
            <p class="text-3xl mb-2">📅</p>
            <p class="text-gray-500 text-sm">Aún no tienes citas</p>
          </div>
        </ng-template>
      </div>

      <!-- Editar -->
      <button (click)="edit.emit()"
        class="w-full py-4 rounded-2xl border-2 border-dashed border-secondary-background text-secondary-background font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2">
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