import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, Habit } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-4 px-4 py-5">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-extrabold text-text-secondary">Todos mis habitos</h1>
        <span class="text-xs font-semibold text-gray-500" *ngIf="!isLoading">{{ habits.length }} registrados</span>
      </div>

      <div *ngIf="isLoading" class="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500">Cargando habitos...</p>
      </div>

      <div *ngIf="!isLoading && habits.length === 0" class="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500">Aun no tienes habitos registrados.</p>
      </div>

      <div *ngIf="!isLoading && habits.length > 0" class="flex flex-col gap-3">
        <article
          *ngFor="let habit of habits"
          class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-text-secondary">{{ habit.label }}</h2>
              <p class="text-sm text-gray-500" *ngIf="habit.description; else noDescription">{{ habit.description }}</p>
              <ng-template #noDescription>
                <p class="text-sm text-gray-400">Sin descripcion disponible.</p>
              </ng-template>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {{ habit.progress }}%
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="rounded-xl bg-gray-50 p-2.5">
              <p class="text-gray-400 uppercase tracking-wide mb-1">Horario</p>
              <p class="font-semibold text-gray-700">{{ formatTime(habit.time) }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-2.5">
              <p class="text-gray-400 uppercase tracking-wide mb-1">Frecuencia</p>
              <p class="font-semibold text-gray-700">{{ formatFrequency(habit.frequency) }}</p>
            </div>
          </div>

          <div *ngIf="habit.reminderDays && habit.reminderDays.length > 0" class="flex flex-wrap gap-1.5">
            <span
              *ngFor="let day of habit.reminderDays"
              class="text-[11px] font-semibold px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700"
            >
              {{ day }}
            </span>
          </div>

          <p *ngIf="habit.createdAt" class="text-[11px] text-gray-400">
            Creado: {{ formatDate(habit.createdAt) }}
          </p>
        </article>
      </div>

      <button
        (click)="goBack()"
        class="mt-1 text-sm font-semibold text-text-secondary self-start"
      >
        Volver al dashboard
      </button>
    </div>
  `,
  styles: []
})
export class HabitListComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  habits: Habit[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadHabits();
  }

  private loadHabits(): void {
    this.dashboardService.getUserInfo().subscribe(user => {
      if (!user) {
        this.isLoading = false;
        this.habits = [];
        return;
      }

      this.dashboardService.getHabits(user.idPersona).subscribe(habits => {
        this.habits = habits;
        this.isLoading = false;
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }

  formatTime(time: string | null | undefined): string {
    if (!time) return 'No definido';

    try {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return time;
    }
  }

  formatFrequency(frequency: string | null | undefined): string {
    if (!frequency) return 'No definida';

    const key = frequency.toLowerCase();
    const map: Record<string, string> = {
      daily: 'Diaria',
      semanal: 'Semanal',
      weekly: 'Semanal',
      mensual: 'Mensual',
      monthly: 'Mensual'
    };

    return map[key] || frequency;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
