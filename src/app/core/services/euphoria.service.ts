// ============================================
// EUPHORIA SERVICE - VERSIÓN FINAL
// ============================================
// Ubicación: FRONTEND-END/src/app/core/services/euphoria.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// ============================================
// INTERFACES
// ============================================

export interface MensajeRequest {
  mensaje: string;
  session_id?: string;
}

export interface MensajeResponse {
  respuesta: string;
  emociones_detectadas: string[];
  timestamp: string;
  session_id: string;
  mensaje_numero?: number;
}

export interface HistorialItem {
  rol: string;
  mensaje: string;
  timestamp: string;
}

export interface HistorialResponse {
  historial: HistorialItem[];
  session_id: string;
  total_mensajes: number;
}

export interface StatusResponse {
  status: string;
  mensaje?: string;
  timestamp: string;
}

// ============================================
// SERVICIO
// ============================================

@Injectable({
  providedIn: 'root'
})
export class EuphoriaService {

  private readonly apiUrl = 'http://localhost:8000';
  private sessionId: string;
  private conexionEstado = new BehaviorSubject<boolean>(true);
  public conexionEstado$ = this.conexionEstado.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.sessionId = this.obtenerSessionId();
    console.log('✅ EuphoriaService inicializado');
    console.log(`📱 Session ID: ${this.sessionId}`);
    this.verificarConexion();
  }

  // ============================================
  // SESSION ID
  // ============================================

  private obtenerSessionId(): string {
    let sessionId = localStorage.getItem('euphoria_session_id');

    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('euphoria_session_id', sessionId);
      console.log('🆕 Nuevo session ID:', sessionId);
    }

    return sessionId;
  }

  public obtenerSessionIdActual(): string {
    return this.sessionId;
  }

  public nuevaSesion(): void {
    localStorage.removeItem('euphoria_session_id');
    this.sessionId = this.obtenerSessionId();
    console.log('🔄 Nueva sesión iniciada');
  }

  // ============================================
  // ENDPOINTS
  // ============================================

  enviarMensaje(mensaje: string): Observable<MensajeResponse> {
    const request: MensajeRequest = {
      mensaje: mensaje.trim(),
      session_id: this.sessionId
    };

    console.log('📤 Enviando:', mensaje.substring(0, 50) + '...');

    return this.http.post<MensajeResponse>(
      `${this.apiUrl}/chat`,
      request,
      this.httpOptions
    ).pipe(
      tap(response => {
        console.log('✅ Respuesta recibida');
        this.conexionEstado.next(true);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  obtenerHistorial(): Observable<HistorialResponse> {
    console.log('📜 Obteniendo historial...');

    return this.http.get<HistorialResponse>(
      `${this.apiUrl}/historial/${this.sessionId}`,
      this.httpOptions
    ).pipe(
      tap(response => {
        console.log(`✅ Historial: ${response.total_mensajes} mensajes`);
        this.conexionEstado.next(true);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  limpiarMemoria(): Observable<StatusResponse> {
    console.log('🔄 Limpiando memoria...');

    return this.http.delete<StatusResponse>(
      `${this.apiUrl}/sesion/${this.sessionId}`,
      this.httpOptions
    ).pipe(
      tap(() => {
        console.log('✅ Memoria limpiada');
        this.conexionEstado.next(true);
      }),
      catchError(this.manejarError.bind(this))
    );
  }

  verificarConexion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`, this.httpOptions).pipe(
      tap(response => {
        console.log('✅ API conectada:', response);
        this.conexionEstado.next(true);
      }),
      catchError(error => {
        console.error('❌ Error de conexión:', error);
        this.conexionEstado.next(false);
        return throwError(() => error);
      })
    );
  }

  // ============================================
  // MANEJO DE ERRORES
  // ============================================

  private manejarError(error: HttpErrorResponse): Observable<never> {
    this.conexionEstado.next(false);

    let mensajeError = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
      console.error('❌ Error del cliente:', error.error.message);
    } else {
      mensajeError = `Error ${error.status}: ${error.error?.detail || error.message}`;
      console.error(`❌ Error del backend (${error.status}):`, error.error);

      if (error.status === 0) {
        mensajeError = '❌ No se puede conectar con el servidor. ¿Está corriendo en http://localhost:8000?';
      } else if (error.status === 400) {
        mensajeError = 'Solicitud inválida';
      } else if (error.status === 500) {
        mensajeError = 'Error en el servidor';
      }
    }

    return throwError(() => new Error(mensajeError));
  }
}