import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specialist, parseDisponibilidad } from '../models/specialist.model';
import { MembershipService, MembershipStatus } from '../membership.service';

@Component({
  selector: 'app-therapist-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; padding-bottom: 7rem">
      <!-- ── BANNER MEMBRESÍA ─────────────────────────────────────────── -->

      <!-- TRIAL activo — días restantes -->
      <div *ngIf="membership && membership.isTrial && membership.daysLeft > 0">
        <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10"></div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold text-sm">⏳ Prueba gratuita</p>
            <p class="text-white/80" style="font-size: 11px; margin-top: 0.125rem">
              Te quedan <strong>{{ membership!.daysLeft }} días</strong> gratis
            </p>
          </div>
          <button
            (click)="onPagar()"
            class="bg-white font-bold rounded-xl text-xs"
            style="padding: 0.5rem 0.875rem; color: #F59E0B; white-space: nowrap"
          >
            Activar $70.000
          </button>
        </div>
        <!-- barra de progreso -->
        <div
          class="rounded-full bg-white/20 overflow-hidden"
          style="height: 4px; margin-top: 0.75rem"
        >
          <div
            class="h-full rounded-full bg-white transition-all"
            [style.width]="trialProgress + '%'"
          ></div>
        </div>
      </div>

      <!-- ACTIVO — membresía pagada -->
      <div
        *ngIf="membership?.status === 'ACTIVE'"
        class="rounded-2xl text-white"
        style="background: linear-gradient(135deg, #059669, #10B981); padding: 1rem 1.25rem"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold text-sm">✅ Membresía activa</p>
            <p class="text-white/80" style="font-size: 11px; margin-top: 0.125rem">
              Vence el {{ membership!.expiresAt | date: 'dd/MM/yyyy' }} —
              {{ membership!.daysLeft }} días restantes
            </p>
          </div>
          <span class="bg-white/20 font-bold rounded-xl text-xs" style="padding: 0.375rem 0.75rem">
            ✓ Pro
          </span>
        </div>
      </div>

      <!-- EXPIRADO — advertencia -->
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
            class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl"
            style="flex-shrink: 0"
          >
            🩺
          </div>
          <div style="flex: 1; min-width: 0">
            <p
              class="text-white/60 font-bold uppercase"
              style="font-size: 10px; letter-spacing: 0.1em"
            >
              Perfil activo
            </p>
            <h2 class="text-lg font-bold truncate">{{ specialist.nombre || 'Terapeuta' }}</h2>
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
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                style="background: #4C9EEB; flex-shrink: 0"
              >
                {{ cita.fecha | date: 'dd' }}
              </div>
              <div style="flex: 1; min-width: 0">
                <p class="text-xs font-semibold text-gray-800">
                  {{ cita.fecha | date: 'EEE dd MMM' }}
                </p>
                <p class="text-xs text-gray-400 truncate">{{ cita.tipoSesion }}</p>
              </div>
              <span
                class="text-xs font-bold rounded-lg"
                style="padding: 0.25rem 0.5rem; background: #4CA1AF1A; color: #4CA1AF; flex-shrink: 0"
              >
                {{ cita.fecha | date: 'HH:mm' }}
              </span>
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
  `,
})
export class TherapistProfileComponent implements OnInit {
  @Input() specialist!: Specialist;
  @Output() edit = new EventEmitter<void>();

  membership: MembershipStatus | null = null;

  private membershipSvc = inject(MembershipService);

  get slots() {
    return parseDisponibilidad(this.specialist?.disponibilidad ?? '[]');
  }

  // Progreso del trial — 100% = inicio, 0% = expirado
  get trialProgress(): number {
    if (!this.membership?.isTrial) return 0;
    return Math.round((this.membership.daysLeft / 7) * 100);
  }

  ngOnInit(): void {
    this.membershipSvc.getStatus().subscribe({
      next: (m) => (this.membership = m),
      error: () => (this.membership = null),
    });
  }

  onPagar(): void {
    this.membershipSvc.checkout().subscribe({
      next: ({ checkoutUrl }) => window.open(checkoutUrl, '_blank'),
      error: () => alert('No se pudo conectar con el sistema de pagos. Intenta de nuevo.'),
    });
  }
}
