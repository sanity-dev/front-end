import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificacionService, Notificacion } from '../../core/services/notificacion.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

      <!-- Header -->
      <header class="sticky top-0 z-10 flex items-center px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
        <button (click)="goBack()" class="p-2 rounded-full hover:bg-slate-100 transition-colors mr-3 text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-slate-800">Notificaciones</h1>
        <div class="ml-auto flex items-center gap-2">
          <button (click)="goToPreferences()" class="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500" title="Preferencias">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full">

        <!-- Loading -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
          <div class="w-10 h-10 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="text-sm text-slate-500 mt-4">Cargando notificaciones...</p>
        </div>

        <!-- Error -->
        <div *ngIf="error && !loading" class="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto text-red-300 mb-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p class="text-sm text-red-700">{{ error }}</p>
          <button (click)="cargarNotificaciones()" class="mt-4 px-4 py-2 bg-white border border-red-200 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
            Reintentar
          </button>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && !error && notificaciones.length === 0" class="flex flex-col items-center justify-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16 text-slate-300 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <p class="text-sm text-slate-500 font-medium">No tienes notificaciones</p>
          <p class="text-xs text-slate-400 mt-1">Cuando tengas nuevas notificaciones aparecerán aquí</p>
        </div>

        <!-- Notification list -->
        <div *ngIf="!loading && !error && notificaciones.length > 0" class="space-y-3">
          <div
            *ngFor="let notif of notificaciones; trackBy: trackById"
            (click)="abrirNotificacion(notif)"
            class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all duration-200 flex items-start gap-3"
            [class.bg-slate-50]="notif.leida"
            [class.opacity-70]="notif.leida"
          >
            <!-- Icon -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                 [ngClass]="{
                   'bg-blue-50': notif.tipo === 'SISTEMA',
                   'bg-emerald-50': notif.tipo === 'PUSH',
                   'bg-purple-50': notif.tipo === 'EMAIL'
                 }">
              <!-- Bell icon for SISTEMA -->
              <svg *ngIf="notif.tipo === 'SISTEMA'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <!-- Push icon -->
              <svg *ngIf="notif.tipo === 'PUSH'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <!-- Email icon -->
              <svg *ngIf="notif.tipo === 'EMAIL'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-sm font-semibold text-slate-800 truncate" [class.font-normal]="notif.leida">{{ notif.titulo }}</h3>
                <span *ngIf="!notif.leida" class="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></span>
              </div>
              <p class="text-xs text-slate-600 mt-0.5" [class.line-clamp-2]="!notif.leida">{{ notif.mensaje }}</p>
              <p class="text-[10px] text-slate-400 mt-1.5">{{ formatearFecha(notif.fechaCreacion) }}</p>
            </div>

            <!-- Delete button -->
            <button
              (click)="eliminarNotificacion($event, notif.id)"
              class="p-1.5 rounded-full hover:bg-red-50 transition-colors shrink-0 self-center"
              title="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-300 hover:text-red-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationListComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private notificacionService: NotificacionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    this.loading = true;
    this.error = null;

    this.notificacionService.obtenerMisNotificaciones().subscribe({
      next: (data) => {
        this.notificaciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "No se pudieron cargar las notificaciones. Verifica tu conexión.";
        this.loading = false;
        console.error('Error al cargar notificaciones', err);
      }
    });
  }

  abrirNotificacion(notif: Notificacion): void {
    if (!notif.leida) {
      this.notificacionService.marcarComoLeida(notif.id).subscribe({
        next: (updated) => {
          // Actualizar localmente
          const idx = this.notificaciones.findIndex(n => n.id === notif.id);
          if (idx !== -1) {
            this.notificaciones[idx] = { ...this.notificaciones[idx], leida: true };
          }
        },
        error: (err) => console.error('Error al marcar como leída', err)
      });
    }
  }

  eliminarNotificacion(event: Event, id: number): void {
    event.stopPropagation();
    this.notificacionService.eliminar(id).subscribe({
      next: () => {
        this.notificaciones = this.notificaciones.filter(n => n.id !== id);
      },
      error: (err) => console.error('Error al eliminar', err)
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHrs < 24) return `Hace ${diffHrs}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }

  trackById(_: number, notif: Notificacion): number {
    return notif.id;
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }

  goToPreferences(): void {
    this.router.navigate(['/user/notifications/preferences']);
  }

  private getUsuarioId(): string {
    // Intentar decodificar el JWT para obtener el userId
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || payload.id || '';
      } catch {
        return '';
      }
    }
    return '';
  }
}
