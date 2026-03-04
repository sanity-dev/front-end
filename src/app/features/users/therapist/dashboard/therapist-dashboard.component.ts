import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-therapist-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col gap-5 px-4 py-5">

      <!-- Saludo -->
      <div>
        <h1 class="text-2xl font-extrabold text-text-primary tracking-tight">Buen día, Dr. Alejandro</h1>
        <p class="text-sm text-gray-500 mt-1">Hoy tienes 6 sesiones programadas.</p>
      </div>

      <!-- Tarjetas de resumen -->
      <div class="flex gap-3">
        <div class="flex-1 bg-secondary-background rounded-2xl p-4 flex flex-col justify-between min-h-[110px]">
          <div class="flex items-start justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="text-white text-[10px] font-bold uppercase tracking-wide">Mes</span>
          </div>
          <div>
            <p class="text-white/80 text-xs font-medium">Citas programadas</p>
            <p class="text-white text-4xl font-extrabold leading-tight">12</p>
          </div>
        </div>
       
        <!-- Citas restantes -->
        <div class="flex-1 bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[110px] border border-gray-100 shadow-sm">
          <div class="flex items-start justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="text-text-secondary text-[10px] font-bold uppercase tracking-wide">Hoy</span>
          </div>
          <div>
            <p class="text-gray-500 text-xs font-medium">Citas restantes</p>
            <p class="text-text-primary text-4xl font-extrabold leading-tight">4</p>
          </div>
        </div>
      </div>
      


      <!-- Citas para Hoy -->
      <div>
        <h2 class="text-base font-bold text-text-primary mb-3">Citas para Hoy</h2>
        <div class="flex flex-col gap-2">
          <button
            *ngFor="let appointment of appointments"
            (click)="onAppointmentClick(appointment)"
            class="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100 shadow-sm w-full text-left hover:bg-gray-50 transition-colors active:scale-95"
          >
            <!-- Hora -->
            <div class="flex flex-col items-center w-10 shrink-0">
              <span class="text-sm font-extrabold text-text-secondary">{{ appointment.hour }}</span>
              <span class="text-[10px] text-gray-400 font-medium uppercase">{{ appointment.period }}</span>
            </div>

            <div class="w-px h-8 bg-gray-200 shrink-0"></div>

            <!-- Info -->
            <div class="flex-1">
              <p class="text-sm font-bold text-text-primary">{{ appointment.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ appointment.type }}</p>
            </div>

            <!-- Acción -->
            <div class="shrink-0">
              <span
                *ngIf="!appointment.isNext"
                class="text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
              
            </div>
          </button>
        </div>
      </div>

      <!-- Calendario mensual -->
      <div>
        <h2 class="text-base font-bold text-gray-800 mb-3">Citas del mes</h2>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

          <!-- Navegación mes -->
          <div class="flex items-center justify-between mb-4">
            <button
              (click)="prevMonth()"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <span class="text-sm font-bold text-gray-800 capitalize">{{ currentMonthLabel }}</span>
            <button
              (click)="nextMonth()"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- Encabezados días semana -->
          <div class="grid grid-cols-7 mb-2">
            <div
              *ngFor="let d of dayLabels"
              class="text-center text-[10px] font-bold text-gray-400 uppercase"
            >{{ d }}</div>
          </div>

          <!-- Días del mes -->
          <div class="grid grid-cols-7 gap-y-1">
            <!-- Celdas vacías para alinear el primer día -->
            <div *ngFor="let empty of emptyStartCells"></div>

            <!-- Días -->
            <div
              *ngFor="let day of calendarDays"
              class="flex items-center justify-center"
            >
              <span
                class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors"
                [class.bg-blue-500]="hasAppointment(day) && !isToday(day)"
                [class.text-white]="hasAppointment(day) || isToday(day)"
                [class.bg-orange-500]="isToday(day)"
                [class.text-gray-700]="!hasAppointment(day) && !isToday(day)"
              >{{ day }}</span>
            </div>
          </div>

          <!-- Leyenda -->
          <div class="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
              <span class="text-[10px] text-gray-500">Hoy</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span class="text-[10px] text-gray-500">Cita agendada</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
    styles: []
})
export class TherapistDashboardComponent {
    private router = inject(Router);

    patientAlerts = [
        {
            name: 'Sofía Méndez',
            message: 'Marcadores de ansiedad elevados en el diario matutino. Sugerido adelantar sesión.'
        }
    ];

    appointments = [
        { hour: '10:00', period: 'AM', name: 'Ricardo Alarcón', type: 'Terapia Cognitivo-Conductual', isNext: false },
        { hour: '11:30', period: 'AM', name: 'Elena Portillo', type: 'Seguimiento quincenal', isNext: false },
        { hour: '02:00', period: 'PM', name: 'Javier Ruiz', type: 'En espera', isNext: false },
    ];

    appointmentDays: number[] = [3, 7, 10, 14, 17, 21, 24, 28];

    dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    private today = new Date();
    currentYear = this.today.getFullYear();
    currentMonth = this.today.getMonth(); // 0-indexed

    get currentMonthLabel(): string {
        return new Date(this.currentYear, this.currentMonth, 1)
            .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }

    get calendarDays(): number[] {
        const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => i + 1);
    }

    get emptyStartCells(): null[] {
        // lunes=0 ... domingo=6
        let firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1; // ajustar para semana L-D
        return Array(firstDay).fill(null);
    }

    hasAppointment(day: number): boolean {
        return this.appointmentDays.includes(day);
    }

    isToday(day: number): boolean {
        return (
            day === this.today.getDate() &&
            this.currentMonth === this.today.getMonth() &&
            this.currentYear === this.today.getFullYear()
        );
    }

    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
    }

    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
    }

    onAppointmentClick(appointment: any) {
        if (appointment.isNext) {
            this.router.navigate(['/users/therapist/session']);
        }
    }
}