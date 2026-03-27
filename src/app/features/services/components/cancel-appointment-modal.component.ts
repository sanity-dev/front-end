import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancel-appointment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      (click)="onClose()"
    >
      <div
        class="bg-white rounded-t-3xl w-full mb-[68px]"
        style="max-height: 85vh; overflow-y: auto"
        (click)="$event.stopPropagation()"
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2 shrink-0">
          <div class="w-10 h-1 rounded-full bg-gray-200"></div>
        </div>

        <div class="px-5 pb-6 pt-1 flex flex-col gap-5">

          <!-- Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style="background: #FEF2F2; border: 1px solid #FECACA"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900" style="font-size: 15px">Cancelar cita</h3>
                <p class="text-gray-400" style="font-size: 11px">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <!-- X cerrar -->
            <button
              (click)="onClose()"
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style="background: #F3F4F6"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#6B7280" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Info cita -->
          <div
            *ngIf="cita"
            class="rounded-2xl flex items-center gap-3"
            style="background: #FEF2F2; border: 1px solid #FECACA; padding: 0.875rem 1rem"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
              style="background: #EF4444"
            >
              {{ cita.fecha | date:'dd':'UTC' }}
            </div>
            <div style="flex: 1; min-width: 0">
              <p class="font-bold text-gray-800 text-sm">{{ cita.fecha | date:'EEEE dd MMMM · HH:mm':'UTC' }}</p>
              <p class="text-xs mt-0.5" style="color: #EF4444">{{ cita.tipoSesion }}</p>
            </div>
          </div>

          <!-- Motivo -->
          <div>
            <label class="block font-semibold text-gray-800 mb-2" style="font-size: 13px">
              Motivo de cancelación *
            </label>

            <!-- Opciones rápidas (configurables) -->
            <div class="flex flex-wrap gap-2 mb-3" *ngIf="motivos.length">
              <button
                type="button"
                *ngFor="let opcion of motivos"
                (click)="motivoSeleccionado = opcion"
                class="rounded-xl font-semibold transition-all active:scale-[0.96]"
                style="padding: 0.375rem 0.75rem; font-size: 11px"
                [style]="motivoSeleccionado === opcion
                  ? 'background:#EF44441A;color:#EF4444;border:1.5px solid #EF4444'
                  : 'background:#F9FAFB;color:#6B7280;border:1px solid #E5E7EB'"
              >{{ opcion }}</button>
            </div>

            <!-- Textarea -->
            <textarea
              [(ngModel)]="motivoSeleccionado"
              placeholder="Describe el motivo de la cancelación..."
              class="w-full rounded-2xl text-sm text-gray-800 resize-none focus:outline-none transition-all"
              style="padding:0.875rem 1rem;border:1.5px solid #E5E7EB;background:#F9FAFB;min-height:80px;font-family:inherit;line-height:1.5"
              [class.border-red-300]="motivoSeleccionado.trim().length > 0"
              [class.bg-red-50]="motivoSeleccionado.trim().length > 0"
            ></textarea>

            <p *ngIf="!motivoSeleccionado.trim() && submitted" class="text-red-400 mt-1" style="font-size:11px">
              Por favor escribe un motivo de cancelación
            </p>
          </div>

          <!-- Error -->
          <div *ngIf="errorMsg"
            class="rounded-xl px-3 py-2 text-xs"
            style="background:#FEF2F2;border:1px solid #FECACA;color:#EF4444"
          >{{ errorMsg }}</div>

          <!-- Botones -->
          <div class="flex flex-col gap-2.5">
            <button
              (click)="onConfirmar()"
              [disabled]="loading || !!errorMsg"
              class="w-full rounded-2xl font-bold text-sm text-white active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style="padding:0.9rem;background:linear-gradient(135deg,#EF4444,#DC2626)"
            >
              <span *ngIf="!loading">🗑️ Sí, cancelar cita</span>
              <span *ngIf="loading" class="flex items-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Cancelando...
              </span>
            </button>
            <button
              (click)="onClose()"
              class="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 active:scale-[0.98] transition-all"
            >Mantener cita</button>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class CancelAppointmentModalComponent implements OnChanges {
  /** Controla la visibilidad del modal */
  @Input() isOpen = false;

  /** Cita a cancelar — debe tener `fecha` y `tipoSesion` */
  @Input() cita: any = null;

  /** Lista de motivos rápidos mostrados como chips seleccionables */
  @Input() motivos: string[] = [
    'Emergencia personal',
    'Enfermedad',
    'Conflicto de agenda',
    'Solicitud del paciente',
    'Fuerza mayor',
  ];

  /** Emite el motivo de cancelación cuando el usuario confirma */
  @Output() confirmed = new EventEmitter<string>();

  /** Emite cuando el usuario cierra/cancela sin confirmar */
  @Output() closed = new EventEmitter<void>();

  motivoSeleccionado = '';
  submitted = false;
  loading = false;
  errorMsg = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      // Reset al abrir
      this.motivoSeleccionado = '';
      this.submitted = false;
      this.loading = false;
      this.errorMsg = '';
    }
  }

  onClose(): void {
    if (this.loading) return;
    this.closed.emit();
  }

  onConfirmar(): void {
    this.submitted = true;
    if (!this.motivoSeleccionado.trim()) return;
    this.confirmed.emit(this.motivoSeleccionado.trim());
  }

  /** Llamar desde el padre para indicar que la petición está en curso */
  setLoading(value: boolean): void {
    this.loading = value;
  }

  /** Llamar desde el padre si el API devuelve un error */
  setError(msg: string): void {
    this.errorMsg = msg;
    this.loading = false;
  }
}
