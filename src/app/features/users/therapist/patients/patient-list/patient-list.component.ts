import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

interface Patient {
  idPersona: number;
  nombre: string;
  fotoPerfilUrl: string | null;
}

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col px-5 pb-8">

      <!-- Barra de búsqueda -->
      <section class="py-4">
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar pacientes"
            [(ngModel)]="searchQuery"
            class="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-text-primary placeholder-gray-400 shadow-sm focus:outline-none focus:border-secondary-background focus:ring-1 focus:ring-secondary-background/30 transition-all duration-200"
          />
          <!-- Botón limpiar -->
          <button
            *ngIf="searchQuery"
            (click)="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- Título -->
      <h3 class="text-base font-bold text-text-primary mb-3">Lista de pacientes</h3>

      <!-- Loading -->
      <div *ngIf="isLoading" class="flex flex-col gap-3">
        <div *ngFor="let i of [1,2,3,4]" class="bg-white rounded-2xl px-4 py-4 flex items-center gap-4 border border-gray-100 shadow-sm animate-pulse">
          <div class="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
          <div class="flex-1 flex flex-col gap-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Lista de pacientes -->
      <div *ngIf="!isLoading" class="flex flex-col gap-2.5">
        <button
          *ngFor="let patient of filteredPatients; trackBy: trackByPatient"
          (click)="goToPatientHistory(patient)"
          class="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 border border-gray-100 shadow-sm w-full text-left hover:bg-gray-50 hover:shadow-md active:scale-[0.98] transition-all duration-200 group"
        >
          <!-- Foto de perfil -->
          <div class="w-12 h-12 rounded-full shrink-0 overflow-hidden border-2 border-secondary-background/30 shadow-sm">
            <img
              [src]="patient.fotoPerfilUrl || 'assets/icons/usuario.svg'"
              [alt]="patient.nombre"
              class="w-full h-full object-cover"
              [class.p-2]="!patient.fotoPerfilUrl"
              [class.bg-gradient-to-br]="!patient.fotoPerfilUrl"
              [class.from-blue-50]="!patient.fotoPerfilUrl"
              [class.to-blue-100]="!patient.fotoPerfilUrl"
            />
          </div>

          <!-- Nombre -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-text-primary truncate group-hover:text-secondary-background transition-colors duration-200">
              {{ patient.nombre }}
            </p>
          </div>

          <!-- Chevron -->
          <div class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </button>
      </div>

      <!-- Sin resultados de búsqueda -->
      <div *ngIf="!isLoading && filteredPatients.length === 0 && searchQuery" class="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <p class="text-gray-400 text-sm">No se encontraron pacientes con "<span class="font-semibold">{{ searchQuery }}</span>"</p>
      </div>

      <!-- Sin pacientes -->
      <div *ngIf="!isLoading && patients.length === 0 && !searchQuery" class="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p class="text-gray-400 text-sm">Aún no tienes pacientes registrados</p>
      </div>

    </div>
  `,
  styles: []
})
export class PatientListComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  patients: Patient[] = [];
  searchQuery = '';
  isLoading = true;

  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.loadPatients();
  }

  get filteredPatients(): Patient[] {
    if (!this.searchQuery.trim()) return this.patients;
    const q = this.searchQuery.toLowerCase().trim();
    return this.patients.filter(p => p.nombre.toLowerCase().includes(q));
  }

  loadPatients(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      JSON.parse(atob(token.split('.')[1]));
      this.loadTherapistPatients();
    } catch {
      this.isLoading = false;
    }
  }

  private loadTherapistPatients(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.isLoading = false;
      return;
    }

    let email = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      email = payload?.sub || payload?.email || '';
    } catch {
      this.isLoading = false;
      return;
    }

    if (!email) {
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({ 'x-user-email': email });

    this.http.get<any[]>(`${this.apiUrl}/api/appointment/my-appointments`, { headers }).subscribe({
      next: (appointments) => {
        // Extraer pacientes únicos de las citas
        const patientMap = new Map<number, Patient>();

        for (const apt of appointments) {
          const patientId = apt.patientId || apt.idPaciente;
          const patientName = apt.patientName || apt.nombrePaciente || '';
          const patientPhoto = apt.patientPhotoUrl || apt.fotoPacienteUrl || null;

          if (patientId && !patientMap.has(patientId)) {
            patientMap.set(patientId, {
              idPersona: patientId,
              nombre: patientName,
              fotoPerfilUrl: patientPhoto
            });
          }
        }

        this.patients = Array.from(patientMap.values())
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  goToPatientHistory(patient: Patient): void {
    this.router.navigate(['/users/therapist/patients', patient.idPersona], {
      queryParams: { nombre: patient.nombre, foto: patient.fotoPerfilUrl || '' }
    });
  }

  trackByPatient(_: number, patient: Patient): number {
    return patient.idPersona;
  }
}
