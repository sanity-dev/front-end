import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Specialist, parseDisponibilidad } from '../models/specialist.model';
import { MembershipService, MembershipStatus } from '../membership.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-therapist-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; padding-bottom: 7rem">
      <!-- ── BANNER MEMBRESÍA ─────────────────────────────────────────── -->

      <!-- TRIAL activo -->
      <div
        *ngIf="membership && membership.isTrial && membership.daysLeft > 0"
        class="flex items-center justify-between rounded-2xl"
        style="padding: 0.75rem 1rem; background: #FFF8E7; border: 1px solid #FDE68A"
      >
        <div>
          <p class="font-semibold text-xs" style="color: #92400E">🎁 Prueba gratuita</p>
          <p style="font-size: 11px; color: #B45309; margin-top: 0.125rem">
            Te quedan <strong>{{ membership!.daysLeft }} días</strong> gratis
          </p>
          <div
            class="rounded-full overflow-hidden"
            style="height: 3px; margin-top: 0.375rem; width: 120px; background: #FDE68A"
          >
            <div
              class="h-full rounded-full transition-all"
              style="background: #F59E0B"
              [style.width]="trialProgress + '%'"
            ></div>
          </div>
        </div>
        <button
          (click)="onPagar()"
          class="font-bold rounded-xl text-xs"
          style="padding: 0.5rem 0.875rem; background: #F59E0B; color: white; white-space: nowrap; border: none"
        >
          Activar $70.000
        </button>
      </div>

      <!-- ACTIVO -->
      <div
        *ngIf="membership?.status === 'ACTIVE'"
        class="flex items-center justify-between rounded-2xl"
        style="padding: 0.75rem 1rem; background: #F0FDF4; border: 1px solid #BBF7D0"
      >
        <div>
          <p class="font-semibold text-xs" style="color: #166534">✅ Membresía activa</p>
          <p style="font-size: 11px; color: #15803D; margin-top: 0.125rem">
            Vence el {{ membership!.expiresAt | date: 'dd/MM/yyyy' }} ·
            {{ membership!.daysLeft }} días restantes
          </p>
        </div>
        <span
          class="font-bold rounded-xl text-xs"
          style="padding: 0.375rem 0.75rem; background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0"
        >
          ✓ Pro
        </span>
      </div>

      <!-- EXPIRADO -->
      <div
        *ngIf="membership?.status === 'EXPIRED'"
        class="rounded-2xl border-2 text-red-700"
        style="background: #FEF2F2; border-color: #FECACA; padding: 1rem 1.25rem"
      >
        <p class="font-bold text-sm">⚠️ Membresía expirada</p>
        <p class="text-red-500" style="font-size: 11px; margin-top: 0.25rem">
          Ya no apareces en el directorio de pacientes. Renueva tu membresía para volver a ser
          visible.
        </p>
        <button
          (click)="onPagar()"
          class="w-full rounded-xl text-white font-bold text-sm"
          style="margin-top: 0.75rem; padding: 0.75rem; background: linear-gradient(135deg, #EF4444, #DC2626)"
        >
          🔄 Renovar por $70.000 COP
        </button>
      </div>

      <!-- Cargando membresía -->
      <div
        *ngIf="!membership"
        class="rounded-2xl animate-pulse"
        style="background: #E5E7EB; height: 4rem"
      ></div>

      <!-- ── HERO ─────────────────────────────────────────────────────── -->
      <div
        class="relative overflow-hidden rounded-3xl text-white"
        style="background: linear-gradient(135deg, #2C3E50, #4CA1AF); padding: 1.5rem"
      >
        <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10"></div>
        <div class="flex items-center" style="gap: 1rem; margin-bottom: 1rem">
          <div
            class="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center"
            style="flex-shrink: 0; background: rgba(255,255,255,0.2)"
          >
            <img
              *ngIf="fotoTerapeuta"
              [src]="fotoTerapeuta"
              class="w-full h-full object-cover"
              alt="foto perfil"
            />
            <span *ngIf="!fotoTerapeuta" style="font-size: 2rem">🩺</span>
          </div>
          <div style="flex: 1; min-width: 0">
            <p
              class="text-white/60 font-bold uppercase"
              style="font-size: 10px; letter-spacing: 0.1em"
            >
              Perfil activo
            </p>
            <h2 class="text-lg font-bold truncate">
              {{ nombreTerapeuta || specialist.nombre || 'Terapeuta' }}
            </h2>
            <p class="text-white/80 text-sm truncate">{{ specialist.tituloProfesional }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2" style="gap: 0.5rem">
          <div class="bg-white/15 rounded-2xl text-center" style="padding: 0.75rem">
            <p class="text-2xl font-bold">{{ specialist.especialidades.length }}</p>
            <p class="text-white/70" style="font-size: 10px">especialidades</p>
          </div>
          <div class="bg-white/15 rounded-2xl text-center" style="padding: 0.75rem">
            <p class="text-2xl font-bold">{{ specialist.citas?.length || 0 }}</p>
            <p class="text-white/70" style="font-size: 10px">citas agendadas</p>
          </div>
        </div>
      </div>

      <!-- ── PRESENTACIÓN ──────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100" style="padding: 1.25rem">
        <p
          class="font-bold text-gray-400 uppercase"
          style="font-size: 10px; letter-spacing: 0.1em; margin-bottom: 0.5rem"
        >
          Sobre mí
        </p>
        <p class="text-gray-800 text-sm leading-relaxed">{{ specialist.presentacion }}</p>
      </div>

      <!-- ── ESPECIALIDADES ────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100" style="padding: 1.25rem">
        <p
          class="font-bold text-gray-400 uppercase"
          style="font-size: 10px; letter-spacing: 0.1em; margin-bottom: 0.75rem"
        >
          Especialidades
        </p>
        <div class="flex flex-wrap" style="gap: 0.5rem">
          <span
            *ngFor="let esp of specialist.especialidades"
            class="rounded-lg text-xs font-bold"
            style="padding: 0.375rem 0.75rem; background: #4CA1AF1A; color: #4CA1AF; border: 1px solid #4CA1AF30"
          >
            {{ esp }}
          </span>
        </div>
      </div>

      <!-- ── SERVICIOS ─────────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100" style="padding: 1.25rem">
        <p
          class="font-bold text-gray-400 uppercase"
          style="font-size: 10px; letter-spacing: 0.1em; margin-bottom: 0.75rem"
        >
          Servicios
        </p>
        <div class="flex flex-wrap" style="gap: 0.5rem">
          <span
            *ngFor="let srv of specialist.servicios"
            class="rounded-lg text-xs font-bold"
            style="padding: 0.375rem 0.75rem; background: #4C9EEB1A; color: #4C9EEB; border: 1px solid #4C9EEB30"
          >
            {{ srv }}
          </span>
        </div>
      </div>

      <!-- ── DISPONIBILIDAD ────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100" style="padding: 1.25rem">
        <p
          class="font-bold text-gray-400 uppercase"
          style="font-size: 10px; letter-spacing: 0.1em; margin-bottom: 0.75rem"
        >
          Disponibilidad
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
          <div
            *ngFor="let slot of slots"
            class="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-100"
            style="padding: 0.75rem 1rem"
          >
            <span class="font-bold text-gray-800 text-sm" style="width: 2.5rem">{{
              slot.dia
            }}</span>
            <div class="flex items-center" style="gap: 0.5rem; font-size: 12px">
              <span
                class="font-bold rounded-lg"
                style="padding: 0.25rem 0.5rem; background: #4CA1AF1A; color: #4CA1AF"
              >
                {{ slot.horaInicio }}
              </span>
              <span class="text-gray-400">→</span>
              <span
                class="font-bold rounded-lg"
                style="padding: 0.25rem 0.5rem; background: #4CA1AF1A; color: #4CA1AF"
              >
                {{ slot.horaFin }}
              </span>
            </div>
          </div>
          <p
            *ngIf="!slots.length"
            class="text-center text-gray-400 text-sm"
            style="padding: 0.75rem 0"
          >
            Sin disponibilidad
          </p>
        </div>
      </div>

      <!-- ── CITAS ─────────────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100" style="padding: 1.25rem">
        <p
          class="font-bold text-gray-400 uppercase"
          style="font-size: 10px; letter-spacing: 0.1em; margin-bottom: 0.75rem"
        >
          Citas ({{ specialist.citas?.length || 0 }})
        </p>

        <ng-container *ngIf="specialist.citas?.length; else noCitas">
          <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <div
              *ngFor="let cita of specialist.citas!.slice(0, 5)"
              class="flex items-center bg-gray-50 rounded-xl border border-gray-100"
              style="gap: 0.75rem; padding: 0.75rem"
            >
              <!-- Día — al hacer clic abre info del paciente -->
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                style="background: #4C9EEB; cursor: pointer"
                (click)="verPaciente(cita)"
              >
                {{ cita.fecha | date: 'dd' }}
              </div>

              <!-- Info -->
              <div style="flex: 1; min-width: 0; cursor: pointer" (click)="verPaciente(cita)">
                <p class="text-xs font-semibold text-gray-800">
                  {{ cita.fecha | date: 'EEE dd MMM' }}
                </p>
                <p class="text-xs text-gray-400 truncate">{{ cita.tipoSesion }}</p>
              </div>

              <!-- Hora -->
              <span
                class="text-xs font-bold rounded-lg flex-shrink-0"
                style="padding: 0.25rem 0.5rem; background: #4CA1AF1A; color: #4CA1AF; cursor: pointer"
                (click)="verPaciente(cita)"
              >
                {{ cita.fecha | date: 'HH:mm' }}
              </span>

              <!-- ── BOTÓN CANCELAR (basurita) ── -->
              <button
                (click)="abrirModalCancelar(cita); $event.stopPropagation()"
                class="flex items-center justify-center rounded-xl transition-all active:scale-[0.92] flex-shrink-0"
                style="width: 2rem; height: 2rem; background: #FEF2F2; border: 1px solid #FECACA; cursor: pointer"
                title="Cancelar cita"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </button>
            </div>
          </div>
        </ng-container>

        <ng-template #noCitas>
          <div class="text-center" style="padding: 1.5rem 0">
            <p style="font-size: 2rem; margin-bottom: 0.5rem">📅</p>
            <p class="text-gray-400 text-sm">Aún no tienes citas</p>
          </div>
        </ng-template>
      </div>

      <!-- ── EDITAR ────────────────────────────────────────────────────── -->
      <button
        (click)="edit.emit()"
        class="w-full rounded-2xl border-2 border-dashed font-bold text-sm flex items-center justify-center"
        style="padding: 1rem; border-color: #4C9EEB; color: #4C9EEB; gap: 0.5rem; transition: opacity 0.2s"
      >
        ✏️ Editar mis servicios
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         MODAL: VER PACIENTE
    ══════════════════════════════════════════════════════════════ -->
    <div
      *ngIf="showPacienteToast"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      (click)="cerrarToast()"
    >
      <div class="bg-white rounded-t-3xl w-full" (click)="$event.stopPropagation()">
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 rounded-full bg-gray-200"></div>
        </div>

        <div *ngIf="loadingPaciente" class="flex flex-col items-center py-10 gap-3">
          <div class="w-20 h-20 rounded-full bg-gray-100 animate-pulse"></div>
          <div class="h-4 w-36 bg-gray-100 rounded animate-pulse"></div>
          <div class="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
        </div>

        <div
          *ngIf="!loadingPaciente && pacienteSeleccionado"
          class="flex flex-col items-center px-6 py-5 pb-10 gap-4"
        >
          <div
            class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
            style="background: linear-gradient(135deg, #4C9EEB22, #4CA1AF22); border: 3px solid #4CA1AF40"
          >
            <img
              *ngIf="pacienteSeleccionado.fotoPerfilUrl"
              [src]="pacienteSeleccionado.fotoPerfilUrl"
              class="w-full h-full object-cover"
              alt="foto paciente"
            />
            <span *ngIf="!pacienteSeleccionado.fotoPerfilUrl" style="font-size: 3rem">🌱</span>
          </div>

          <div class="text-center">
            <p
              class="font-bold uppercase tracking-widest text-gray-400 mb-1"
              style="font-size: 10px"
            >
              Paciente
            </p>
            <h3 class="text-xl font-bold text-gray-900">{{ pacienteSeleccionado.nombre }}</h3>
            <p class="text-sm text-gray-400 mt-0.5">{{ pacienteSeleccionado.correo }}</p>
          </div>

          <div
            *ngIf="citaSeleccionada"
            class="w-full rounded-2xl flex items-center justify-between"
            style="background: #4CA1AF0D; border: 1px solid #4CA1AF20; padding: 0.875rem 1rem"
          >
            <div>
              <p class="text-xs font-bold text-gray-500">{{ citaSeleccionada.tipoSesion }}</p>
              <p class="text-sm font-bold" style="color: #4CA1AF">
                {{ citaSeleccionada.fecha | date: 'EEE dd MMM · HH:mm' }}
              </p>
            </div>
            <span style="font-size: 1.5rem">📅</span>
          </div>

          <button
            (click)="cerrarToast()"
            class="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 active:scale-[0.98] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         MODAL: CANCELAR CITA
    ══════════════════════════════════════════════════════════════ -->
    <div
      *ngIf="showCancelarModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      (click)="cerrarModalCancelar()"
    >
      <div
        class="bg-white rounded-t-3xl w-full"
        style="max-height: 85vh; overflow-y: auto"
        (click)="$event.stopPropagation()"
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div class="w-10 h-1 rounded-full bg-gray-200"></div>
        </div>

        <div class="px-5 pb-10 pt-1" style="display: flex; flex-direction: column; gap: 1.25rem">
          <!-- Header -->
          <div class="flex items-start justify-between" style="gap: 0.75rem">
            <div class="flex items-center" style="gap: 0.75rem">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style="background: #FEF2F2; border: 1px solid #FECACA"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900" style="font-size: 15px">Cancelar cita</h3>
                <p class="text-gray-400" style="font-size: 11px">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <!-- X cerrar -->
            <button
              (click)="cerrarModalCancelar()"
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style="background: #F3F4F6; margin-top: 0.125rem"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Info cita a cancelar -->
          <div
            *ngIf="citaACancelar"
            class="rounded-2xl flex items-center"
            style="background: #FEF2F2; border: 1px solid #FECACA; padding: 0.875rem 1rem; gap: 0.75rem"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
              style="background: #EF4444"
            >
              {{ citaACancelar.fecha | date: 'dd' }}
            </div>
            <div style="flex: 1; min-width: 0">
              <p class="font-bold text-gray-800 text-sm">
                {{ citaACancelar.fecha | date: 'EEEE dd MMMM · HH:mm' }}
              </p>
              <p class="text-xs" style="color: #EF4444; margin-top: 0.125rem">
                {{ citaACancelar.tipoSesion }}
              </p>
            </div>
          </div>

          <!-- Motivo de cancelación -->
          <div>
            <label class="block font-semibold text-gray-800 mb-2" style="font-size: 13px">
              Motivo de cancelación *
            </label>

            <!-- Opciones rápidas -->
            <div class="flex flex-wrap" style="gap: 0.5rem; margin-bottom: 0.75rem">
              <button
                type="button"
                *ngFor="let opcion of motivosRapidos"
                (click)="seleccionarMotivoRapido(opcion)"
                class="rounded-xl font-semibold transition-all active:scale-[0.96]"
                style="padding: 0.375rem 0.75rem; font-size: 11px"
                [style]="
                  motivoCancelacion === opcion
                    ? 'background: #EF44441A; color: #EF4444; border: 1.5px solid #EF4444'
                    : 'background: #F9FAFB; color: #6B7280; border: 1px solid #E5E7EB'
                "
              >
                {{ opcion }}
              </button>
            </div>

            <!-- Textarea -->
            <textarea
              [(ngModel)]="motivoCancelacion"
              placeholder="Describe el motivo de la cancelación..."
              class="w-full rounded-2xl text-sm text-gray-800 resize-none focus:outline-none transition-all"
              style="
                padding: 0.875rem 1rem;
                border: 1.5px solid #E5E7EB;
                background: #F9FAFB;
                min-height: 90px;
                font-family: inherit;
                line-height: 1.5
              "
              [class.border-red-300]="motivoCancelacion.trim().length > 0"
              [class.bg-red-50]="motivoCancelacion.trim().length > 0"
            ></textarea>

            <p
              *ngIf="!motivoCancelacion.trim() && cancelarSubmitted"
              class="text-red-400 mt-1"
              style="font-size: 11px"
            >
              Por favor escribe un motivo de cancelación
            </p>
          </div>

          <!-- Error -->
          <div
            *ngIf="cancelarError"
            class="rounded-xl px-3 py-2 text-xs"
            style="background: #FEF2F2; border: 1px solid #FECACA; color: #EF4444"
          >
            {{ cancelarError }}
          </div>

          <!-- Botones -->
          <div style="display: flex; flex-direction: column; gap: 0.625rem">
            <button
              (click)="confirmarCancelacion()"
              [disabled]="cancelandoCita"
              class="w-full rounded-2xl font-bold text-sm text-white active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center"
              style="padding: 0.9rem; background: linear-gradient(135deg, #EF4444, #DC2626); gap: 0.5rem"
            >
              <span *ngIf="!cancelandoCita">🗑️ Sí, cancelar cita</span>
              <span *ngIf="cancelandoCita" class="flex items-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Cancelando...
              </span>
            </button>

            <button
              (click)="cerrarModalCancelar()"
              class="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 active:scale-[0.98] transition-all"
            >
              Mantener cita
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TherapistProfileComponent implements OnInit {
  @Input() specialist!: Specialist;
  @Output() edit = new EventEmitter<void>();
  @Output() citaCancelada = new EventEmitter<number>();

  membership: MembershipStatus | null = null;

  // Modal ver paciente
  showPacienteToast = false;
  loadingPaciente = false;
  pacienteSeleccionado: any = null;
  citaSeleccionada: any = null;

  // Modal cancelar cita
  showCancelarModal = false;
  citaACancelar: any = null;
  motivoCancelacion = '';
  cancelarSubmitted = false;
  cancelandoCita = false;
  cancelarError = '';

  fotoTerapeuta: string | null = null;
  nombreTerapeuta: string | null = null;

  readonly motivosRapidos = [
    'Emergencia personal',
    'Enfermedad',
    'Conflicto de agenda',
    'Solicitud del paciente',
    'Fuerza mayor',
  ];

  private membershipSvc = inject(MembershipService);
  private http = inject(HttpClient);

  get slots() {
    return parseDisponibilidad(this.specialist?.disponibilidad ?? '[]');
  }

  get trialProgress(): number {
    if (!this.membership?.isTrial) return 0;
    return Math.round((this.membership.daysLeft / 7) * 100);
  }

  ngOnInit(): void {
    this.membershipSvc.getStatus().subscribe({
      next: (m) => (this.membership = m),
      error: () => (this.membership = null),
    });

    if (this.specialist?.email) {
      this.http.get<any[]>(`${environment.apiUrl}/api/personas`).subscribe({
        next: (personas) => {
          const persona = personas.find((p) => p.correo === this.specialist.email);
          if (persona) {
            this.fotoTerapeuta = persona.fotoPerfilUrl || null;
            this.nombreTerapeuta = persona.nombre || null;
          }
        },
        error: () => {},
      });
    }
  }

  // ── Ver paciente ────────────────────────────────────────────────
  verPaciente(cita: any): void {
      console.log('CITA COMPLETA:', cita);
  console.log('pacienteID:', cita.pacienteID);
    this.citaSeleccionada = cita;
    this.showPacienteToast = true;
    this.loadingPaciente = true;
    this.pacienteSeleccionado = null;

    this.http.get<any[]>(`${environment.apiUrl}/api/personas`).subscribe({
      next: (personas) => {
        const found = personas.find((p) => p.idPersona === cita.pacienteID);
        this.pacienteSeleccionado = found || {
          nombre: 'Paciente desconocido',
          correo: '',
          telefono: '',
          fotoPerfilUrl: null,
        };
        this.loadingPaciente = false;
      },
      error: () => {
        this.pacienteSeleccionado = {
          nombre: 'Paciente desconocido',
          correo: '',
          telefono: '',
          fotoPerfilUrl: null,
        };
        this.loadingPaciente = false;
      },
    });
  }

  cerrarToast(): void {
    this.showPacienteToast = false;
    this.pacienteSeleccionado = null;
    this.citaSeleccionada = null;
  }

  // ── Cancelar cita ───────────────────────────────────────────────
  abrirModalCancelar(cita: any): void {
    this.citaACancelar = cita;
    this.motivoCancelacion = '';
    this.cancelarSubmitted = false;
    this.cancelarError = '';
    this.cancelandoCita = false;
    this.showCancelarModal = true;
  }

  cerrarModalCancelar(): void {
    if (this.cancelandoCita) return;
    this.showCancelarModal = false;
    this.citaACancelar = null;
    this.motivoCancelacion = '';
    this.cancelarError = '';
  }

  seleccionarMotivoRapido(opcion: string): void {
    this.motivoCancelacion = opcion;
  }

  confirmarCancelacion(): void {
    this.cancelarSubmitted = true;
    if (!this.motivoCancelacion.trim()) return;

    this.cancelandoCita = true;
    this.cancelarError = '';

    const citaId = this.citaACancelar?.id;

    this.http
      .delete(`${environment.apiUrl}/api/appointment/${citaId}`, {
        body: { motivo: this.motivoCancelacion.trim() },
      })
      .subscribe({
        next: () => {
          this.cancelandoCita = false;
          this.showCancelarModal = false;
          // Eliminar la cita localmente para actualizar la vista inmediatamente
          if (this.specialist.citas) {
            this.specialist.citas = this.specialist.citas.filter((c: any) => c.id !== citaId);
          }
          // Notificar al componente padre si necesita refrescar
          this.citaCancelada.emit(citaId);
        },
        error: (err) => {
          this.cancelandoCita = false;
          this.cancelarError = err?.error?.message ?? 'No se pudo cancelar. Intenta de nuevo.';
        },
      });
  }

  onPagar(): void {
    this.membershipSvc.checkout().subscribe({
      next: ({ checkoutUrl }) => window.open(checkoutUrl, '_blank'),
      error: () => alert('No se pudo conectar con el sistema de pagos. Intenta de nuevo.'),
    });
  }
}
