import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

export interface EditFieldConfig {
  field: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'tel' | 'password';
}

@Component({
  selector: 'app-edit-field-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <!-- Backdrop -->
    <div
      *ngIf="visible"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center transition-opacity duration-300"
      [class.opacity-0]="!animateIn"
      (click)="onBackdropClick($event)"
    >
      <!-- Bottom Sheet -->
      <div
        class="bg-white w-full max-w-md rounded-2xl px-6 pt-6 pb-8 mx-4 transition-transform duration-300 ease-out"
        [class.translate-y-full]="!animateIn"
        [class.translate-y-0]="animateIn"
        (click)="$event.stopPropagation()"
      >
        <!-- Handle -->
        <div class="flex justify-center mb-4">
          <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-text-primary mb-4">
          {{ isPasswordMode ? 'Cambiar contraseña' : 'Editar ' + config.label.toLowerCase() }}
        </h3>

        <!-- Single field edit -->
        <div *ngIf="!isPasswordMode" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">{{ config.label }}</label>
            <input
              [type]="config.type"
              [(ngModel)]="editValue"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base text-text-primary outline-none transition-all duration-200 focus:border-secondary-background focus:ring-2 focus:ring-secondary-background/20"
              [placeholder]="'Ingresa tu ' + config.label.toLowerCase()"
            />
          </div>
        </div>

        <!-- Password change fields -->
        <div *ngIf="isPasswordMode" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Contraseña actual</label>
            <input
              type="password"
              [(ngModel)]="currentPassword"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base text-text-primary outline-none transition-all duration-200 focus:border-secondary-background focus:ring-2 focus:ring-secondary-background/20"
              placeholder="Ingresa tu contraseña actual"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Nueva contraseña</label>
            <input
              type="password"
              [(ngModel)]="newPassword"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base text-text-primary outline-none transition-all duration-200 focus:border-secondary-background focus:ring-2 focus:ring-secondary-background/20"
              placeholder="Ingresa la nueva contraseña"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              [(ngModel)]="confirmPassword"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base text-text-primary outline-none transition-all duration-200 focus:border-secondary-background focus:ring-2 focus:ring-secondary-background/20"
              placeholder="Confirma la nueva contraseña"
            />
          </div>
        </div>

        <!-- Error message -->
        <div *ngIf="errorMessage" class="mt-3 text-sm text-red-500 font-medium">
          {{ errorMessage }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-6">
          <app-button
            variant="outline"
            [fullWidth]="true"
            (click)="close()"
          >
            Cancelar
          </app-button>
          <app-button
            variant="primary"
            [fullWidth]="true"
            [disabled]="isSaving"
            (click)="save()"
          >
            {{ isSaving ? 'Guardando...' : 'Guardar' }}
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EditFieldModalComponent {
  @Input() visible = false;
  @Input() config: EditFieldConfig = { field: '', label: '', value: '', type: 'text' };
  @Input() isSaving = false;

  @Output() save$ = new EventEmitter<Record<string, string>>();
  @Output() close$ = new EventEmitter<void>();

  editValue = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  animateIn = false;

  get isPasswordMode(): boolean {
    return this.config.field === 'contraseña';
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.editValue = this.config.value || '';
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
      // Trigger animation
      setTimeout(() => this.animateIn = true, 10);
    } else {
      this.animateIn = false;
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.animateIn = false;
    setTimeout(() => this.close$.emit(), 200);
  }

  save(): void {
    this.errorMessage = '';

    if (this.isPasswordMode) {
      if (!this.currentPassword) {
        this.errorMessage = 'Ingresa tu contraseña actual';
        return;
      }
      if (!this.newPassword) {
        this.errorMessage = 'Ingresa la nueva contraseña';
        return;
      }
      if (this.newPassword.length < 6) {
        this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }
      this.save$.emit({
        contraseña: this.newPassword,
        contraseñaActual: this.currentPassword
      });
    } else {
      if (!this.editValue.trim()) {
        this.errorMessage = `El campo ${this.config.label.toLowerCase()} no puede estar vacío`;
        return;
      }
      this.save$.emit({ [this.config.field]: this.editValue.trim() });
    }
  }
}
