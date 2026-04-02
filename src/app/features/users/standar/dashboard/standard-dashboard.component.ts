import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardService, UserInfo, Appointment, Habit, DiaryEntry } from '../../../../core/services/dashboard.service';
import { EuphoriaService } from '../../../../core/services/euphoria.service';
import { CancelAppointmentModalComponent } from '../../../services/components/cancel-appointment-modal.component';
import { filter } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-standard-dashboard',
  standalone: true,
  imports: [CommonModule, CancelAppointmentModalComponent],
  template: `
    <div class="flex flex-col gap-5 px-4 py-5">

      <!-- Saludo -->
      <div>
        <h1 class="text-2xl font-extrabold text-text-primary tracking-tight">
          ¡Hola, {{ userName }}!
        </h1>
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

        <!-- Respuesta del Agente -->
        <div *ngIf="isAgentLoading || agentMessage" (click)="goToEuphoriaChat()" class="mt-5 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 flex gap-3 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md">
          <div class="bg-indigo-100 text-indigo-500 rounded-full p-2 h-fit shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-1">EuphorIA dice:</h3>
            <div *ngIf="isAgentLoading" class="flex gap-1 mt-2">
              <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.15s"></div>
              <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.3s"></div>
            </div>
            <p *ngIf="!isAgentLoading && agentMessage" class="text-sm text-indigo-800 leading-relaxed font-medium">
              {{ agentMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Próxima cita -->
      <div class="bg-gray-900 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div class="flex flex-col gap-1.5" *ngIf="nextAppointment; else noCita">
          <span class="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Próxima Cita</span>
          <h3 class="text-white font-extrabold text-lg leading-tight">{{ nextAppointment.therapistName }}</h3>
          <p class="text-text-secondary text-xs font-semibold">{{ nextAppointment.serviceType }}</p>

          <!-- Fecha y hora -->
          <div class="flex flex-col gap-1 mt-1">
            <div class="flex items-center gap-1.5 text-gray-300 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{{ formatAppointmentDate(nextAppointment.date) }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-text-secondary text-xs font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <span>{{ nextAppointment.date | date:'HH:mm':'UTC' }}</span>
              <span class="text-gray-600">·</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
              <span>{{ nextAppointment.modality }}</span>
            </div>
          </div>

          <!-- Cancelar cita -->
          <div class="mt-2">
            <button
              (click)="openCancelModal()"
              class="flex items-center gap-1.5 text-red-400 text-xs font-semibold active:opacity-70 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancelar cita
            </button>
            <p *ngIf="cancelBlockedMsg" class="text-orange-400 text-[10px] font-semibold mt-1 leading-tight">
              ⚠️ {{ cancelBlockedMsg }}
            </p>
          </div>
        </div>
        <ng-template #noCita>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Próxima Cita</span>
            <p class="text-gray-400 text-sm">No tienes citas próximas</p>
          </div>
        </ng-template>
        <div class="bg-gray-800 rounded-xl p-3 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>

      <!-- Modal cancelar cita -->
      <app-cancel-appointment-modal
        #cancelModal
        [isOpen]="cancelModalOpen"
        [cita]="citaParaCancelar"
        (confirmed)="onCancelConfirmed($event)"
        (closed)="cancelModalOpen = false"
      ></app-cancel-appointment-modal>

      <!-- Diario Destacado -->
      <div>
        <h2 class="text-base font-bold text-text-primary mb-3">Diario destacado</h2>

        <div *ngIf="diaryEntry; else noDiary">
          <!-- Tarjeta con imagen -->
          <div class="rounded-2xl overflow-hidden shadow-md bg-gray-900">
            <div *ngIf="diaryEntry.photoUrl" class="w-full aspect-[4/3] overflow-hidden">
              <img
                [src]="diaryEntry.photoUrl"
                alt="Momento destacado"
                class="w-full h-full object-cover"
              />
            </div>
            <!-- Frase -->
            <div class="p-4 flex flex-col gap-2">
              <p class="text-white text-sm font-medium leading-relaxed italic">
                "{{ truncateText(diaryEntry.text, 150) }}"
              </p>
              <span class="text-gray-400 text-[11px] font-medium">{{ formatDate(diaryEntry.date) }} · Mi Diario</span>
            </div>
          </div>
        </div>

        <ng-template #noDiary>
          <div class="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <p class="text-gray-400 text-sm">Aún no tienes momentos destacados en tu diario</p>
          </div>
        </ng-template>
      </div>


      <!-- Progreso de Hábitos -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-bold text-text-primary">Progreso de Hábitos</h2>
          <button (click)="goToHabits()" class="text-text-secondary text-sm font-semibold">Ver todos</button>
        </div>

        <ng-container *ngIf="habits.length > 0; else noHabits">

          <!-- Layout normal: ≤ 4 hábitos -->
          <div *ngIf="habits.length <= 4" class="flex gap-3">
            <div
              *ngFor="let habit of habits"
              class="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100 min-w-0"
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
              <span *ngIf="habit.time" class="text-[10px] text-gray-400 text-center">{{ habit.time }}</span>
              <span class="text-xs font-semibold text-gray-600 text-center">{{ habit.label }}</span>
            </div>
          </div>

          <!-- Carrusel: > 4 hábitos -->
          <div *ngIf="habits.length > 4">
            <!-- Track deslizable -->
            <div
              id="habitsCarouselTrack"
              class="habits-carousel"
              (scroll)="onCarouselScroll($event)"
            >
              <!-- Slide de 4 en 4 -->
              <div
                *ngFor="let slide of habitSlides; let i = index"
                class="habits-slide"
              >
                <div
                  *ngFor="let habit of slide"
                  class="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100"
                  style="min-width: 0;"
                >
                  <!-- Círculo de progreso -->
                  <div class="relative w-14 h-14">
                    <svg class="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#f3f4f6" stroke-width="6"/>
                      <circle
                        cx="32" cy="32" r="26" fill="none"
                        stroke="#4C9EEB" stroke-width="6"
                        stroke-linecap="round"
                        [attr.stroke-dasharray]="163"
                        [attr.stroke-dashoffset]="163 - (163 * habit.progress / 100)"
                      />
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-gray-800">
                      {{ habit.progress }}%
                    </span>
                  </div>
                  <span *ngIf="habit.time" class="text-[10px] text-gray-400 text-center">{{ habit.time }}</span>
                  <span class="text-[11px] font-semibold text-gray-600 text-center leading-tight">{{ habit.label }}</span>
                </div>
              </div>
            </div>

            <!-- Puntos de paginación -->
            <div class="flex justify-center gap-1.5 mt-3">
              <button
                *ngFor="let slide of habitSlides; let i = index"
                (click)="goToSlide(i)"
                [class]="i === carouselIndex ? 'w-5 h-2 rounded-full bg-blue-500 transition-all duration-300' : 'w-2 h-2 rounded-full bg-gray-300 transition-all duration-300'"
                [attr.aria-label]="'Ir a página ' + (i + 1)"
              ></button>
            </div>
          </div>

        </ng-container>

        <ng-template #noHabits>
          <div class="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <p class="text-gray-400 text-sm">Aún no tienes hábitos registrados</p>
          </div>
        </ng-template>
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
  styles: [`
    .habits-carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      gap: 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .habits-carousel::-webkit-scrollbar {
      display: none;
    }
    .habits-slide {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      min-width: 100%;
      scroll-snap-align: start;
      flex-shrink: 0;
    }
  `]
})
export class StandardDashboardComponent implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private euphoriaService = inject(EuphoriaService);
  private http = inject(HttpClient);

  @ViewChild('cancelModal') cancelModal!: CancelAppointmentModalComponent;

  userName: string = '';
  userId: number | null = null;
  selectedMood: string = 'feliz';
  nextAppointment: Appointment | null = null;
  habits: Habit[] = [];
  habitSlides: Habit[][] = [];
  carouselIndex: number = 0;
  diaryEntry: DiaryEntry | null = null;

  // Modal cancelar cita
  cancelModalOpen = false;
  citaParaCancelar: any = null;
  cancelBlockedMsg = '';

  agentMessage: string | null = null;
  isAgentLoading: boolean = false;

  moods = [
    { key: 'triste', emoji: '😔', label: 'Triste' },
    { key: 'neutral', emoji: '😐', label: 'Neutral' },
    { key: 'feliz', emoji: '😊', label: 'Feliz' },
    { key: 'calma', emoji: '😌', label: 'Calma' },
    { key: 'ansioso', emoji: '😰', label: 'Ansioso' },
  ];

  ngOnInit(): void {
    this.loadDashboard();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: any) => event.urlAfterRedirects.includes('/user/dashboard'))
    ).subscribe(() => {
      if (this.userId) {
        this.loadHabits(this.userId);
      }
    });
  }

  private loadDashboard(): void {
    // 1. Cargar info del usuario
    this.dashboardService.getUserInfo().subscribe(user => {
      if (user) {
        this.userName = user.nombre.split(' ')[0]; // Primer nombre
        this.userId = user.idPersona;

        // 2. Cargar citas, hábitos y diario una vez tenemos el userId
        this.loadAppointments(user.idPersona);
        this.loadHabits(user.idPersona);
        this.loadDiary(user.idPersona);
      } else {
        this.userName = 'Usuario';
      }
    });
  }

  private loadAppointments(userId: number): void {
    this.dashboardService.getNextAppointment(userId).subscribe(appointment => {
      this.nextAppointment = appointment;
    });
  }

  private loadHabits(userId: number): void {
    this.dashboardService.getHabits(userId).subscribe(habits => {
      this.habits = habits;
      // Agrupar en páginas de 4 para el carrusel
      this.habitSlides = [];
      for (let i = 0; i < habits.length; i += 4) {
        this.habitSlides.push(habits.slice(i, i + 4));
      }
      this.carouselIndex = 0;
    });
  }

  private loadDiary(userId: number): void {
    this.dashboardService.getLatestDiaryEntry(userId).subscribe(entry => {
      this.diaryEntry = entry;
    });
  }

  selectMood(key: string): void {
    this.selectedMood = key;
    this.agentMessage = null;
    this.isAgentLoading = true;

    this.euphoriaService.checkMood(key).subscribe({
      next: (response) => {
        this.agentMessage = response.respuesta;
        this.isAgentLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener mensaje de EuphorIA', err);
        this.agentMessage = "Siento que estés pasando por esto. Recuerda que estoy aquí para escucharte cuando lo necesites.";
        this.isAgentLoading = false;
      }
    });
  }

  onEmergency() {
    this.router.navigate(['user/emergency/confirm']);
  }

  goToHabits() {
    this.router.navigate(['user/habits']);
  }

  goToSlide(index: number): void {
    this.carouselIndex = index;
    const track = document.getElementById('habitsCarouselTrack');
    if (track) {
      track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
    }
  }

  onCarouselScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const slideWidth = el.clientWidth;
    if (slideWidth > 0) {
      this.carouselIndex = Math.round(el.scrollLeft / slideWidth);
    }
  }

  goToEuphoriaChat() {
    this.router.navigate(['euphoria/chat']);
  }

  formatDate(dateStr: string): string {
    try {
      let dStr = dateStr;
      if (dStr && dStr.length === 10 && dStr.includes('-')) {
        dStr += 'T00:00:00';
      }
      const date = new Date(dStr);
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === now.toDateString()) {
        return 'Hoy, ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      }
      if (date.toDateString() === tomorrow.toDateString()) {
        return 'Mañana, ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  /** Devuelve "Hoy · lun 30 mar" o "lun 30 mar 2026" */
  formatAppointmentDate(dateStr: string): string {
    try {
      let dStr = dateStr;
      if (dStr && dStr.length === 10 && dStr.includes('-')) {
        dStr += 'T00:00:00'; // Evita problemas de desfase horario obligando a zona local
      }
      const date = new Date(dStr);

      const dateLocalStr = date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const now        = new Date();
      const nowLocalStr  = now.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const tom        = new Date(now); tom.setDate(now.getDate() + 1);
      const tomLocalStr  = tom.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

      const dayLabel   = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

      if (dateLocalStr === nowLocalStr)  return `Hoy · ${dayLabel}`;
      if (dateLocalStr === tomLocalStr)  return `Mañana · ${dayLabel}`;
      return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  }

  /** Extrae la hora HH:mm del campo time o del ISO datestring */
  getAppointmentTime(appointment: any): string {
    try {
      if (appointment.time) {
        return appointment.time.split(':').slice(0, 2).join(':');
      }
      if (appointment.date?.includes('T')) {
        return new Date(appointment.date).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return '--:--';
    } catch { return '--:--'; }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  // ── Cancelar cita ──────────────────────────────────────────────────
  openCancelModal(): void {
    if (!this.nextAppointment) return;

    // Validar que falten al menos 24 horas
    const dateTime = this.nextAppointment.time
      ? `${this.nextAppointment.date}T${this.nextAppointment.time}`
      : this.nextAppointment.date;
    const appointmentDate = new Date(dateTime);
    const hoursUntil = (appointmentDate.getTime() - Date.now()) / 36e5; // ms → horas

    if (hoursUntil < 24) {
      this.cancelBlockedMsg = 'Solo puedes cancelar con al menos 24 h de anticipación.';
      return;
    }

    this.cancelBlockedMsg = '';
    this.citaParaCancelar = {
      id: this.nextAppointment.id,
      fecha: dateTime,
      tipoSesion: this.nextAppointment.serviceType,
    };
    this.cancelModalOpen = true;
  }

  onCancelConfirmed(motivo: string): void {
    const citaId = this.citaParaCancelar?.id;
    this.cancelModal.setLoading(true);

    this.http
      .delete(`${environment.apiUrl}/api/appointment/${citaId}`, {
        body: { motivo },
      })
      .subscribe({
        next: () => {
          this.cancelModal.setLoading(false);
          this.cancelModalOpen = false;
          this.nextAppointment = null;   // Limpiar la cita de la vista
        },
        error: (err) => {
          this.cancelModal.setError(
            err?.error?.message ?? 'No se pudo cancelar. Intenta de nuevo.'
          );
        },
      });
  }
}