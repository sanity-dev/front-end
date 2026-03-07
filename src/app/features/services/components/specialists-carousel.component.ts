import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specialist, parseDisponibilidad } from '../models/specialist.model';

@Component({
  selector: 'app-specialists-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pb-28">

      <!-- Header -->
      <div class="mb-5">
        <p class="text-[10px] font-bold uppercase tracking-widest text-secondary-background mb-1">Directorio</p>
        <h1 class="text-2xl font-bold text-text-primary">Terapeutas disponibles</h1>
        <p class="text-gray-400 text-sm mt-0.5">Encuentra el especialista ideal para ti</p>
      </div>

      <!-- Filtros -->
      <div class="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <button *ngFor="let f of filtros" (click)="filtroActivo = f"
          class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all border"
          [class]="filtroActivo === f
            ? 'bg-secondary-background text-white border-secondary-background'
            : 'bg-white text-text-primary border-white-sanity'">
          {{ f }}
        </button>
      </div>

      <!-- Empty -->
      <div *ngIf="!filteredList.length" class="flex flex-col items-center py-16 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-4">🔍</div>
        <p class="font-semibold text-text-primary">Sin terapeutas disponibles</p>
        <p class="text-gray-400 text-sm mt-1">Prueba con otro filtro</p>
      </div>

      <!-- Cards -->
      <div class="space-y-4">
        <div *ngFor="let s of filteredList; trackBy: trackById"
          class="bg-white rounded-3xl border border-white-sanity/60 overflow-hidden">

          <!-- Top -->
          <div class="p-5 flex items-start gap-4 bg-gradient-to-r from-secondary-background/5 to-third-background/5">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                 style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)">
              🧑‍⚕️
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-text-primary truncate">{{ s.nombre || 'Terapeuta' }}</h3>
              <p class="text-xs font-semibold text-third-background truncate mt-0.5">{{ s.tituloProfesional }}</p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span *ngFor="let esp of s.especialidades.slice(0, 2)"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-third-background/10 text-third-background">
                  {{ esp }}
                </span>
                <span *ngIf="s.especialidades.length > 2"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500">
                  +{{ s.especialidades.length - 2 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Presentación -->
          <div class="px-5 py-3 border-b border-white-sanity/40">
            <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">{{ s.presentacion }}</p>
          </div>

          <!-- Servicios -->
          <div class="px-5 py-3 border-b border-white-sanity/40">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Servicios</p>
            <div class="flex flex-wrap gap-1">
              <span *ngFor="let srv of s.servicios.slice(0, 3)"
                class="px-2 py-1 rounded-lg text-[10px] font-bold bg-secondary-background/8 text-secondary-background border border-secondary-background/30">
                {{ srv }}
              </span>
              <span *ngIf="s.servicios.length > 3"
                class="px-2 py-1 rounded-lg text-[10px] font-bold bg-gray-50 text-gray-400">
                +{{ s.servicios.length - 3 }} más
              </span>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 py-4 flex items-center justify-between gap-3">
            <div class="flex flex-wrap gap-1 flex-1 min-w-0">
              <span *ngFor="let slot of getSlots(s).slice(0, 3)"
                class="px-2 py-1 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-600">
                {{ slot.dia }}
              </span>
              <span *ngIf="getSlots(s).length > 3"
                class="px-2 py-1 rounded-lg text-[10px] bg-gray-100 text-gray-400">
                +{{ getSlots(s).length - 3 }}
              </span>
            </div>
            <button (click)="book.emit(s)"
              class="flex-shrink-0 px-5 py-3 rounded-xl text-white text-xs font-bold active:scale-[0.97] transition-all"
              style="background: linear-gradient(135deg, #4C9EEB, #4CA1AF)">
              Agendar cita
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class SpecialistsCarouselComponent {
  @Input() set specialists(val: Specialist[]) {
    this._list = val;
    const esp = val.flatMap(s => s.especialidades);
    this.filtros = ['Todos', ...Array.from(new Set(esp))];
  }
  private _list: Specialist[] = [];
  @Output() book = new EventEmitter<Specialist>();

  filtroActivo = 'Todos';
  filtros: string[] = ['Todos'];

  get filteredList() {
    return this.filtroActivo === 'Todos'
      ? this._list
      : this._list.filter(s => s.especialidades.includes(this.filtroActivo));
  }

  getSlots(s: Specialist) { return parseDisponibilidad(s.disponibilidad ?? '[]'); }
  trackById(_: number, s: Specialist) { return s.userId; }
}