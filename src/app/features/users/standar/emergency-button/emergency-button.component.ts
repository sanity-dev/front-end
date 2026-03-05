import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

interface EmergencyConfig {
  contactName: string;
  contactInfo: string;
  message: string;
  alternatePhone: string;
}

@Component({
  selector: 'app-emergency-button',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="min-h-full bg-linear-to-b from-[#e1e1e1] via-[#e0e0e0] to-[#f9f9f9] px-5 py-4 pb-8">
      <div class="flex flex-col gap-5">

        <!-- Contacto de Emergencia -->
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-extrabold text-text-primary m-0">Contacto de Emergencia</h2>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Nombre del Contacto</label>
            <input
              type="text"
              class="w-full shadow-sm py-3 px-4 border-none rounded-xl bg-white text-[0.9rem] text-gray-700 outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.5)] placeholder:text-slate-400"
              placeholder="Nombre"
              [(ngModel)]="config.contactName"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Número de Teléfono o Correo Electrónico</label>
            <input
              type="text"
              class="w-full shadow-sm py-3 px-4 border-none rounded-xl bg-white text-[0.9rem] text-gray-700 outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.5)] placeholder:text-slate-400"
              placeholder="Teléfono o Correo"
              [(ngModel)]="config.contactInfo"
            />
          </div>
        </section>

        <!-- Mensaje de Emergencia -->
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-extrabold text-text-primary m-0">Mensaje de Emergencia</h2>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Mensaje</label>
            <textarea
              class="w-full shadow-sm py-3 px-4 border-none rounded-xl bg-white text-[0.9rem] text-gray-700 outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.5)] placeholder:text-slate-400 resize-y min-h-[100px] font-[inherit]"
              placeholder="Escribe tu mensaje de emergencia..."
              [(ngModel)]="config.message"
              rows="4"
            ></textarea>
          </div>
        </section>

        <!-- Línea de Apoyo Alternativa -->
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-extrabold text-text-primary m-0">Línea de Apoyo Alternativa</h2>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Número de Teléfono</label>
            <input
              type="tel"
              class="w-full shadow-sm py-3 px-4 border-none rounded-xl bg-white text-[0.9rem] text-gray-700 outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.5)] placeholder:text-slate-400"
              placeholder="Teléfono"
              [(ngModel)]="config.alternatePhone"
            />
          </div>
        </section>

        <!-- Botón Guardar -->
        <div class="mt-2">
          <app-button
            variant="gradient"
            [fullWidth]="true"
            [disabled]="isSaving"
            (click)="save()"
          >
            {{ isSaving ? 'Guardando...' : 'Guardar' }}
          </app-button>
        </div>

        <!-- Status message -->
        <div
          *ngIf="statusMessage"
          class="text-center py-3 px-4 rounded-xl text-sm font-semibold animate-[fadeIn_0.3s_ease]"
          [ngClass]="{
            'bg-white/85 text-emerald-600 border border-emerald-300': statusType === 'success',
            'bg-white/85 text-red-600 border border-red-300': statusType === 'error'
          }"
        >
          {{ statusMessage }}
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class EmergencyButtonComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  config: EmergencyConfig = {
    contactName: '',
    contactInfo: '',
    message: '',
    alternatePhone: ''
  };

  isSaving = false;
  statusMessage = '';
  statusType: 'success' | 'error' = 'success';

  private apiUrl = 'http://localhost:8080/api/personas';
  private userId: number | null = null;

  ngOnInit(): void {
    this.loadEmergencyConfig();
  }

  private loadEmergencyConfig(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub;

      this.http.get<any[]>(this.apiUrl).subscribe({
        next: (personas) => {
          const user = personas.find(p => p.correo === email);
          if (user) {
            this.userId = user.idPersona;
            this.config = {
              contactName: user.contactoEmergencia || '',
              contactInfo: user.telefonoContactoEmergencia || '',
              message: user.mensajeEmergencia || '',
              alternatePhone: user.telefonoApoyoAlternativo || ''
            };
          }
        },
        error: (err) => console.error('Error cargando configuración:', err)
      });
    } catch (e) {
      console.error('Error decodificando token:', e);
    }
  }

  save(): void {
    if (!this.config.contactName || !this.config.contactInfo) {
      this.showStatus('error', 'Por favor completa el nombre y contacto de emergencia.');
      return;
    }

    if (!this.userId) {
      this.showStatus('error', 'No se pudo identificar al usuario.');
      return;
    }

    this.isSaving = true;

    const payload = {
      contactoEmergencia: this.config.contactName,
      telefonoContactoEmergencia: this.config.contactInfo,
      mensajeEmergencia: this.config.message,
      telefonoApoyoAlternativo: this.config.alternatePhone
    };

    this.http.put<any>(`${this.apiUrl}/${this.userId}/usuario`, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.showStatus('success', '✓ Configuración guardada correctamente');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error guardando configuración:', err);
        this.showStatus('error', err.error?.message || 'Error al guardar la configuración');
      }
    });
  }

  private showStatus(type: 'success' | 'error', message: string): void {
    this.statusType = type;
    this.statusMessage = message;
    setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }
}
