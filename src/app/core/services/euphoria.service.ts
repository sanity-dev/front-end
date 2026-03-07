import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

@Injectable({ providedIn: 'root' })
export class EuphoriaService {

  private readonly apiUrl = 'http://localhost:8080/api/euphoria';
  private sessionId       = this.obtenerSessionId();
  private conexionEstado  = new BehaviorSubject<boolean>(true);
  public  conexionEstado$ = this.conexionEstado.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.verificarConexion();
  }

  // ── Session ID ────────────────────────────────────────────────────────────

  private obtenerSessionId(): string {
    let id = localStorage.getItem('euphoria_session_id');
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('euphoria_session_id', id);
    }
    return id;
  }

  obtenerSessionIdActual(): string { return this.sessionId; }

  nuevaSesion(): void {
    localStorage.removeItem('euphoria_session_id');
    this.sessionId = this.obtenerSessionId();
  }

  // ── Endpoints ─────────────────────────────────────────────────────────────

  enviarMensaje(mensaje: string): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(
      `${this.apiUrl}/chat`,
      { mensaje: mensaje.trim(), session_id: this.sessionId },
      this.httpOptions
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );
  }

  obtenerHistorial(): Observable<HistorialResponse> {
    return this.http.get<HistorialResponse>(
      `${this.apiUrl}/historial/${this.sessionId}`,
      this.httpOptions
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );
  }

  limpiarMemoria(): Observable<StatusResponse> {
    return this.http.delete<StatusResponse>(
      `${this.apiUrl}/sesion/${this.sessionId}`,
      this.httpOptions
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );
  }

  verificarConexion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`, this.httpOptions).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(err => {
        this.conexionEstado.next(false);
        return throwError(() => err);
      })
    );
  }

  // ── Error handler ─────────────────────────────────────────────────────────

  private manejarError(error: HttpErrorResponse): Observable<never> {
    this.conexionEstado.next(false);
    let msg = 'Error desconocido';
    if (error.status === 0)        msg = 'No se puede conectar con el servidor.';
    else if (error.status === 400) msg = 'Solicitud inválida';
    else if (error.status === 500) msg = 'Error en el servidor';
    else msg = `Error ${error.status}: ${error.error?.detail || error.message}`;
    return throwError(() => new Error(msg));
  }
}