import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-standard-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col gap-5 px-4 py-5">

      <!-- Saludo -->
      <div>
        <h1 class="text-2xl font-extrabold text-text-primary tracking-tight">¡Hola, Alejandro!</h1>
      </div>

      <!-- ¿Cómo te sientes hoy? -->
      <div>
        <h2 class="text-base font-bold text-text-primary mb-3">¿Cómo te sientes hoy?</h2>
        <div class="flex justify-between items-center">
          <button
            *ngFor="let mood of moods"
            (click)="selectMood(mood.key)"
            class="flex flex-col items-center gap-1 group"
          >
            <span
              class="text-3xl transition-transform duration-200 group-hover:scale-110"
              [class.scale-125]="selectedMood === mood.key"
            >{{ mood.emoji }}</span>
            <span
              class="text-[10px] font-semibold uppercase tracking-wide transition-colors"
              [class.text-text-secondary]="selectedMood === mood.key"
              [class.text-gray-400]="selectedMood !== mood.key"
            >{{ mood.label }}</span>
          </button>
        </div>
      </div>

      <!-- Próxima cita -->
      <div class="bg-gray-900 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Próxima Cita</span>
          <h3 class="text-white font-extrabold text-lg leading-tight">Dra. Marta Jiménez</h3>
          <p class="text-gray-400 text-sm">Terapia Cognitivo-Conductual</p>
          <div class="flex items-center gap-3 mt-1">
            <div class="flex items-center gap-1 text-gray-300 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Mañana, 10:00 AM
            </div>
            <div class="flex items-center gap-1 text-text-secondary text-xs font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
              Online
            </div>
          </div>
        </div>
        <div class="bg-gray-800 rounded-xl p-3 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>

      <!-- Progreso de Hábitos -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-bold text-text-primary">Progreso de Hábitos</h2>
          <button class="text-text-secondary text-sm font-semibold">Ver todos</button>
        </div>
        <div class="flex gap-4">
          <div
            *ngFor="let habit of habits"
            class="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100"
          >
            <!-- Círculo de progreso -->
            <div class="relative w-16 h-16">
              <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#f3f4f6" stroke-width="6"/>
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke="#4C9EEB" stroke-width="6"
                  stroke-linecap="round"
                  [attr.stroke-dasharray]="163"
                  [attr.stroke-dashoffset]="163 - (163 * habit.progress / 100)"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-gray-800">
                {{ habit.progress }}%
              </span>
            </div>
            <span class="text-xs font-semibold text-gray-600 text-center">{{ habit.label }}</span>
          </div>
        </div>
      </div>

      <!-- Botón de Emergencia -->
      <button
        (click)="onEmergency()"
        class="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-2xl px-4 py-4 w-full hover:bg-orange-100 transition-colors active:scale-95"
      >
        <div class="flex items-center gap-3">
          <div class="bg-orange-500 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <div class="text-left">
            <p class="text-sm font-bold text-text-primary">Botón de Emergencia</p>
            <p class="text-xs text-gray-500">Si te sientes en riesgo, estamos aquí.</p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

    </div>
  `,
    styles: []
})
export class StandardDashboardComponent {
    private router = inject(Router);

    selectedMood: string = 'feliz';

    moods = [
        { key: 'triste', emoji: '😔', label: 'Triste' },
        { key: 'neutral', emoji: '😐', label: 'Neutral' },
        { key: 'feliz', emoji: '😊', label: 'Feliz' },
        { key: 'calma', emoji: '😌', label: 'Calma' },
        { key: 'ansioso', emoji: '😰', label: 'Ansioso' },
    ];

    habits = [
        { label: 'Meditación', progress: 75 },
        { label: 'Hidratación', progress: 40 },
    ];

    selectMood(key: string) {
        this.selectedMood = key;
    }

    onEmergency() {
        this.router.navigate(['/emergency']);
    }
}