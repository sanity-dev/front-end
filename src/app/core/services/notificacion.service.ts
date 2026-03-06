import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// ============================================
// INTERFACES
// ============================================

export interface Notificacion {
  id: number;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: 'PUSH' | 'EMAIL' | 'SISTEMA';
  estado: 'PENDIENTE' | 'ENVIADO' | 'LEIDO' | 'FALLIDO';
  fechaCreacion: string;
  fechaEnvio: string | null;
  leida: boolean;
}

export interface CrearNotificacionPayload {
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: 'PUSH' | 'EMAIL' | 'SISTEMA';
}

// ============================================
// SERVICIO DE NOTIFICACIONES
// ============================================

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  // URL del API Gateway (port 8080 en lugar de microservicio directo 8082)
  private readonly apiUrl = 'http://localhost:8080/api/notifications';

  // BehaviorSubject para emitir cambios en las notificaciones
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();

  // Contador de no leídas
  private noLeidasSubject = new BehaviorSubject<number>(0);
  public noLeidas$ = this.noLeidasSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('✅ NotificacionService inicializado');
  }

  // ============================================
  // ENDPOINTS
  // ============================================

  /**
   * Obtener las notificaciones del usuario autenticado (vía JWT)
   */
  obtenerMisNotificaciones(): Observable<Notificacion[]> {
    console.log('📬 Obteniendo notificaciones del usuario logueado');

    return this.http.get<Notificacion[]>(`${this.apiUrl}/me`).pipe(
      tap(notificaciones => {
        console.log(`✅ ${notificaciones.length} notificaciones recibidas`);
        this.notificacionesSubject.next(notificaciones);
        this.actualizarContadorNoLeidas(notificaciones);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  /**
   * Obtener todas las notificaciones de un usuario específico (por ID)
   */
  obtenerPorUsuario(usuarioId: string): Observable<Notificacion[]> {
    console.log('📬 Obteniendo notificaciones del usuario:', usuarioId);

    return this.http.get<Notificacion[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      tap(notificaciones => {
        console.log(`✅ ${notificaciones.length} notificaciones recibidas`);
        this.notificacionesSubject.next(notificaciones);
        this.actualizarContadorNoLeidas(notificaciones);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  /**
   * Obtener una notificación por su ID
   */
  obtenerPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`✅ Notificación ${id} obtenida`)),
      catchError(this.manejarError.bind(this))
    );
  }

  /**
   * Crear una nueva notificación
   */
  crear(payload: CrearNotificacionPayload): Observable<Notificacion> {
    console.log('📝 Creando notificación:', payload.titulo);

    return this.http.post<Notificacion>(this.apiUrl, payload).pipe(
      tap(notificacion => {
        console.log('✅ Notificación creada con ID:', notificacion.id);
        // Agregar al listado local
        const current = this.notificacionesSubject.value;
        this.notificacionesSubject.next([notificacion, ...current]);
        this.actualizarContadorNoLeidas(this.notificacionesSubject.value);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  /**
   * Marcar una notificación como leída
   */
  marcarComoLeida(id: number): Observable<Notificacion> {
    console.log('👁️ Marcando como leída:', id);

    return this.http.put<Notificacion>(`${this.apiUrl}/${id}/leer`, {}).pipe(
      tap(notificacion => {
        console.log('✅ Notificación marcada como leída');
        // Actualizar en el listado local
        const current = this.notificacionesSubject.value.map(n =>
          n.id === id ? { ...n, leida: true, estado: 'LEIDO' as const } : n
        );
        this.notificacionesSubject.next(current);
        this.actualizarContadorNoLeidas(current);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  /**
   * Eliminar una notificación
   */
  eliminar(id: number): Observable<void> {
    console.log('🗑️ Eliminando notificación:', id);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('✅ Notificación eliminada');
        // Remover del listado local
        const current = this.notificacionesSubject.value.filter(n => n.id !== id);
        this.notificacionesSubject.next(current);
        this.actualizarContadorNoLeidas(current);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  // ============================================
  // UTILIDADES
  // ============================================

  private actualizarContadorNoLeidas(notificaciones: Notificacion[]): void {
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    this.noLeidasSubject.next(noLeidas);
  }

  // ============================================
  // MANEJO DE ERRORES
  // ============================================

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
      console.error('❌ Error del cliente:', error.error.message);
    } else {
      mensajeError = `Error ${error.status}: ${error.message}`;
      console.error(`❌ Error del backend (${error.status}):`, error.error);

      if (error.status === 0) {
        mensajeError = '❌ No se puede conectar con el microservicio de notificaciones. ¿Está corriendo en http://localhost:8082?';
      } else if (error.status === 404) {
        mensajeError = 'Notificación no encontrada';
      } else if (error.status === 500) {
        mensajeError = 'Error interno del servidor de notificaciones';
      }
    }

    return throwError(() => new Error(mensajeError));
  }
}
