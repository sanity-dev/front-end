import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-patient-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      (click)="closed.emit()"
    >
      <div class="bg-white rounded-t-3xl w-full mb-[68px]" (click)="$event.stopPropagation()">

        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 rounded-full bg-gray-200"></div>
        </div>

        <!-- Cargando -->
        <div *ngIf="loading" class="flex flex-col items-center py-10 gap-3">
          <div class="w-20 h-20 rounded-full bg-gray-100 animate-pulse"></div>
          <div class="h-4 w-36 bg-gray-100 rounded animate-pulse"></div>
          <div class="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
        </div>

        <!-- Info paciente -->
        <div
          *ngIf="!loading && paciente"
          class="flex flex-col items-center px-6 py-5 pb-6 gap-4"
        >
          <!-- Foto -->
          <div
            class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
            style="background: linear-gradient(135deg, #4C9EEB22, #4CA1AF22); border: 3px solid #4CA1AF40"
          >
            <img
              *ngIf="paciente.fotoPerfilUrl"
              [src]="paciente.fotoPerfilUrl"
              class="w-full h-full object-cover"
              alt="foto paciente"
            />
            <span *ngIf="!paciente.fotoPerfilUrl" style="font-size: 3rem">🌱</span>
          </div>

          <!-- Nombre, correo y teléfono -->
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Paciente</p>
            <h3 class="text-xl font-bold text-gray-900">{{ paciente.nombre }}</h3>
            <p class="text-sm text-gray-400 mt-0.5">{{ paciente.correo }}</p>
            <a
              *ngIf="paciente.telefono"
              [href]="'tel:' + paciente.telefono"
              class="text-sm font-semibold mt-1 block"
              style="color: #27ae60"
            >
              📞 {{ paciente.telefono }}
            </a>
          </div>

          <!-- Detalle cita -->
          <div
            *ngIf="cita"
            class="w-full rounded-2xl flex items-center justify-between"
            style="background: #4CA1AF0D; border: 1px solid #4CA1AF20; padding: 0.875rem 1rem"
          >
            <div>
              <p class="text-xs font-bold text-gray-500">{{ cita.tipoSesion }}</p>
              <p class="text-sm font-bold" style="color: #4CA1AF">
                {{ cita.fecha | date: 'EEE dd MMM · HH:mm':'UTC' }}
              </p>
            </div>
            <span style="font-size: 1.5rem">📅</span>
          </div>

          <!-- Cerrar -->
          <button
            (click)="closed.emit()"
            class="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 active:scale-[0.98] transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  `,
})
export class PatientToastComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() cita: any = null;
  @Output() closed = new EventEmitter<void>();

  private http = inject(HttpClient);

  paciente: any = null;
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true && this.cita?.pacienteID) {
      this.load(this.cita.pacienteID);
    }
    if (changes['isOpen']?.currentValue === false) {
      this.paciente = null;
    }
  }

  private load(id: number): void {
    this.loading  = true;
    this.paciente = null;
    this.http.get<any>(`${environment.apiUrl}/api/personas/${id}`).subscribe({
      next:  (p) => { this.paciente = p; this.loading = false; },
      error: ()  => {
        this.paciente = { nombre: 'Paciente desconocido', correo: '', telefono: null, fotoPerfilUrl: null };
        this.loading  = false;
      },
    });
  }
}