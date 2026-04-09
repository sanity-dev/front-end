import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  private readonly apiUrl = `${environment.apiUrl}/api/notifications`;

  // BehaviorSubject para emitir cambios en las notificaciones
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();

  // Contador de no leídas
  private noLeidasSubject = new BehaviorSubject<number>(0);
  public noLeidas$ = this.noLeidasSubject.asObservable();

  constructor(private http: HttpClient) {

  }

  // ============================================
  // ENDPOINTS
  // ============================================

  /**
   * Obtener las notificaciones del usuario autenticado (vía JWT)
   */
  obtenerMisNotificaciones(): Observable<Notificacion[]> {


    let usuarioId = '';
    try {
      const personaStr = localStorage.getItem('persona');
      if (personaStr) {
        const p = JSON.parse(personaStr);
        if (p && p.idPersona) {
          usuarioId = p.idPersona.toString();
        }
      }
    } catch (e) {

    }

    const endpoint = usuarioId ? `${this.apiUrl}/usuario/${usuarioId}` : `${this.apiUrl}/me`;

    return this.http.get<Notificacion[]>(endpoint).pipe(
      tap(notificaciones => {

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


    return this.http.get<Notificacion[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      tap(notificaciones => {

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
      tap(() => {}),
      catchError(this.manejarError.bind(this))
    );
  }

  /**
   * Crear una nueva notificación
   */
  crear(payload: CrearNotificacionPayload): Observable<Notificacion> {


    return this.http.post<Notificacion>(this.apiUrl, payload).pipe(
      tap(notificacion => {

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


    return this.http.put<Notificacion>(`${this.apiUrl}/${id}/leer`, {}).pipe(
      tap(notificacion => {

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


    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {

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
  // SSE PUSH NOTIFICATIONS
  // ============================================

  private abortController: AbortController | null = null;

  /**
   * Conectar al stream de Eventos (SSE) para recibir notificaciones push en tiempo real.
   */
  conectarSSE(usuarioId: string): void {
    if (this.abortController) {
      return;
    }

    const token = localStorage.getItem('authToken');
    const sseUrl = `${this.apiUrl}/stream/${usuarioId}`;
    this.abortController = new AbortController();

    fetch(sseUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal: this.abortController.signal
    }).then(async response => {
      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let eventName = 'message';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
           if (line.startsWith('event:')) {
               eventName = line.replace('event:', '').trim();
           } else if (line.startsWith('data:')) {
               const dataStr = line.substring(5).trim();
               if(dataStr && eventName === 'notification') {
                   try {
                     const nuevaNotificacion: Notificacion = JSON.parse(dataStr);
                     const current = this.notificacionesSubject.value;
                     this.notificacionesSubject.next([nuevaNotificacion, ...current]);
                     this.actualizarContadorNoLeidas(this.notificacionesSubject.value);
                   } catch (error) {
                     console.error('Error parseando notificación push', error);
                   }
               }
           }
        }
      }
    }).catch(error => {
      if (error.name !== 'AbortError') {
        this.desconectarSSE();
        // Simple exp backoff / retry strategy could be implemented here
      }
    });

  }

  /**
   * Cierra la conexión SSE activa. Útil al hacer logout.
   */
  desconectarSSE(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // ============================================
  // MANEJO DE ERRORES
  // ============================================

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;

    } else {
      mensajeError = `Error ${error.status}: ${error.message}`;


      if (error.status === 0) {
        mensajeError = 'No se puede conectar con el servicio de notificaciones. Inténtalo más tarde.';
      } else if (error.status === 404) {
        mensajeError = 'Notificación no encontrada';
      } else if (error.status === 500) {
        mensajeError = 'Error interno del servidor de notificaciones';
      }
    }

    return throwError(() => new Error(mensajeError));
  }
}
