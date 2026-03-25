import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

interface PatientAppointment {
  id: number;
  serviceType: string;
  date: string;
  time: string;
  modality: string;
  notes: string | null;
}

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col px-5 pb-8">

      <!-- Cabecera del paciente -->
      <section class="flex items-center gap-4 py-5">
        <div class="w-14 h-14 rounded-full shrink-0 overflow-hidden border-2 border-secondary-background/30 shadow-md">
          <img
            [src]="patientPhoto || 'assets/icons/usuario.svg'"
            [alt]="patientName"
            class="w-full h-full object-cover"
            [class.p-2.5]="!patientPhoto"
            [class.bg-gradient-to-br]="!patientPhoto"
            [class.from-blue-50]="!patientPhoto"
            [class.to-blue-100]="!patientPhoto"
          />
        </div>
        <div>
          <h2 class="text-lg font-extrabold text-text-primary m-0">{{ patientName }}</h2>
          <p class="text-xs text-gray-400 m-0 mt-0.5">Paciente</p>
        </div>
      </section>

      <!-- Divider -->
      <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent mb-4"></div>

      <!-- Historial de Citas -->
      <h3 class="text-base font-bold text-text-primary mb-3">Historial de Citas</h3>

      <!-- Loading -->
      <div *ngIf="isLoading" class="flex flex-col gap-3">
        <div *ngFor="let i of [1,2,3]" class="bg-white rounded-2xl px-4 py-4 flex items-center gap-4 border border-gray-100 shadow-sm animate-pulse">
          <div class="w-10 h-10 rounded-xl bg-gray-200 shrink-0"></div>
          <div class="flex-1 flex flex-col gap-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Lista de citas -->
      <div *ngIf="!isLoading && appointments.length > 0" class="flex flex-col gap-2.5">
        <div
          *ngFor="let apt of appointments; trackBy: trackByAppointment"
          class="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <!-- Ícono de calendario -->
          <div class="w-10 h-10 rounded-xl bg-secondary-background/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-secondary-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>

          <!-- Info de la cita -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-text-primary truncate">{{ apt.serviceType }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(apt.date) }}</p>
          </div>

          <!-- Badge modalidad -->
          <span
            class="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
            [ngClass]="{
              'bg-emerald-50 text-emerald-600': apt.modality === 'Online',
              'bg-blue-50 text-blue-600': apt.modality !== 'Online'
            }"
          >
            {{ apt.modality }}
          </span>
        </div>
      </div>

      <!-- Sin citas -->
      <div *ngIf="!isLoading && appointments.length === 0" class="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p class="text-gray-400 text-sm">No hay citas registradas con este paciente</p>
      </div>

      <!-- Notas del Terapeuta -->
      <div *ngIf="!isLoading && therapistNotes" class="mt-6">
        <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent mb-4"></div>
        <h3 class="text-base font-bold text-text-primary mb-3">Notas del Terapeuta</h3>
        <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ therapistNotes }}</p>
        </div>
      </div>

    </div>
  `,
  styles: []
})
export class PatientHistoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  patientId: number = 0;
  patientName: string = '';
  patientPhoto: string | null = null;
  appointments: PatientAppointment[] = [];
  therapistNotes: string | null = null;
  isLoading = true;

  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = +params['patientId'];
    });

    this.route.queryParams.subscribe(query => {
      this.patientName = query['nombre'] || 'Paciente';
      this.patientPhoto = query['foto'] || null;
    });

    this.loadPatientHistory();
  }

  private loadPatientHistory(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload?.sub || payload?.email || '';

      if (!email) {
        this.isLoading = false;
        return;
      }

      this.loadAppointmentsWithPatient(email);
    } catch {
      this.isLoading = false;
    }
  }

  private loadAppointmentsWithPatient(email: string): void {
    const headers = new HttpHeaders({ 'x-user-email': email });

    this.http.get<any[]>(`${this.apiUrl}/api/appointment/my-appointments`, { headers }).subscribe({
      next: (allAppointments) => {
        // Filtrar las citas que correspondan al paciente seleccionado
        const toDate = (appointment: any) => {
          const baseDate = appointment.date || appointment.fecha || appointment.fechaCita;
          const time = appointment.time || appointment.hora || appointment.horaCita;

          if (!baseDate) return new Date('');

          if (time && typeof baseDate === 'string' && !baseDate.includes('T')) {
            return new Date(`${baseDate}T${time}`);
          }

          return new Date(baseDate);
        };

        const patientAppointments = allAppointments
          .filter(a => {
            const pid = a.patientId || a.idPaciente || a.pacienteID || a.patient?.idPersona;
            return Number(pid) === this.patientId;
          })
          .map(a => ({
            id: a.id || a.idCita,
            serviceType: a.serviceType || a.tipoServicio || 'Consulta',
            date: a.date || a.fecha,
            time: a.time || a.hora || '',
            modality: a.modality || a.modalidad || 'Online',
            notes: a.notes || a.notas || null
          }))
          .sort((a, b) => {
            const dateA = toDate(a).getTime();
            const dateB = toDate(b).getTime();
            return dateB - dateA;
          });

        this.appointments = patientAppointments;

        // Combinar notas de todas las citas
        const allNotes = patientAppointments
          .filter(a => a.notes)
          .map(a => a.notes)
          .join('\n\n');
        this.therapistNotes = allNotes || null;

        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  trackByAppointment(_: number, apt: PatientAppointment): number {
    return apt.id;
  }
}
