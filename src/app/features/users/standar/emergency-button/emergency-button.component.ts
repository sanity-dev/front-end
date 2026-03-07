import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';

interface EmergencyConfig {
  contactName: string;
  contactInfo: string;
  message: string;
  alternatePhone: string;
}

@Component({
  selector: 'app-emergency-button',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, TextareaComponent],
  template: `
    <div class="min-h-full px-5 py-4 pb-8">
      <div class="flex flex-col gap-5">

        <!-- Contacto de Emergencia -->
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-extrabold text-text-secondary m-0">Contacto de Emergencia</h2>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Nombre del Contacto</label>
            <app-input
              type="text"
              placeholder="Nombre"
              [(ngModel)]="config.contactName"
            ></app-input>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Número de Teléfono o Correo Electrónico</label>
            <app-input
              type="text"
              placeholder="Teléfono o Correo"
              [(ngModel)]="config.contactInfo"
            ></app-input>
          </div>
        </section>

        <!-- Mensaje de Emergencia -->
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-extrabold text-text-secondary m-0">Mensaje de Emergencia</h2>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Mensaje</label>
            <app-textarea
              placeholder="Escribe tu mensaje de emergencia..."
              [(ngModel)]="config.message"
              [rows]="4"
            ></app-textarea>
          </div>
        </section>

        <!-- Línea de Apoyo Alternativa -->
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-extrabold text-text-secondary m-0">Línea de Apoyo Alternativa</h2>

          <div class="flex flex-col gap-1">
            <label class="text-[0.8rem] font-semibold text-text-primary">Número de Teléfono</label>
            <app-input
              type="tel"
              placeholder="Teléfono"
              [(ngModel)]="config.alternatePhone"
            ></app-input>
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
