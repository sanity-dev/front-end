import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface MensajeRequest {
  mensaje: string;
  session_id?: string;
  user_id?: number;
}

export interface MensajeResponse {
  respuesta: string;
  emociones_detectadas: string[];
  timestamp: string;
  session_id: string;
  mensaje_numero?: number;
  acciones_realizadas?: string[];
}

export interface HistorialItem {
  rol: string;
  mensaje: string;
  timestamp: string;
}

export interface ConversationResponse {
  session_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  title: string;
}

export interface ConversationListResponse {
  conversations: ConversationResponse[];
  total: number;
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

export interface MoodCheckResponse {
  respuesta: string;
  emociones_detectadas: string[];
  timestamp: string;
  session_id: string;
  acciones_realizadas?: string[];
}

export interface MomentUploadResponse {
  success: boolean;
  message: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class EuphoriaService {

  private readonly apiUrl = `${environment.apiUrl}/api/euphoria`;
  private readonly personasUrl = `${environment.apiUrl}/api/personas`;

  private sessionId = this.obtenerSessionId();

  private conexionEstado = new BehaviorSubject<boolean>(true);
  public conexionEstado$ = this.conexionEstado.asObservable();

  private cachedUserId: number | null = null;

  constructor(private http: HttpClient) {
    this.verificarConexion().subscribe();
  }

  private obtenerEmailDelToken(): string | null {
    try {

      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = JSON.parse(atob(payload));

      return decoded.sub || decoded.email || decoded.correo || null;

    } catch {
      return null;
    }
  }

  private obtenerUserIdDelToken(): Observable<number | null> {

    if (this.cachedUserId !== null) {
      return of(this.cachedUserId);
    }

    const email = this.obtenerEmailDelToken();
    if (!email) return of(null);

    return this.http.get<any[]>(this.personasUrl, { headers: this.getAuthHeaders() }).pipe(

      map(personas => {

        const user = personas?.find(p => p.correo === email);

        if (user?.idPersona) {
          this.cachedUserId = user.idPersona;
          return user.idPersona;
        }

        return null;

      }),

      catchError(err => {
        console.error('Error obteniendo userId:', err);
        return of(null);
      })

    );

  }

  private obtenerSessionId(): string {

    const email = this.obtenerEmailDelToken();

    if (email) return email;

    let id = localStorage.getItem('euphoria_session_id');

    if (!id) {

      const emailPrefix = email ? email.split('@')[0] : 'guest';

      id = `session_${emailPrefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      localStorage.setItem('euphoria_session_id', id);

    }

    return id;

  }

  obtenerSessionIdActual(): string {
    return this.sessionId;
  }

  refrescarSesion(): void {
    this.sessionId = this.obtenerSessionId();
    this.cachedUserId = null;
  }

  nuevaSesion(): void {

    const email = this.obtenerEmailDelToken() || 'guest';

    const newId = `session_${email}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    localStorage.setItem('euphoria_session_id', newId);

    this.sessionId = newId;

  }

  cargarSesionAnterior(sessionId: string): void {
    this.sessionId = sessionId;
  }

  private getAuthHeaders(): HttpHeaders {

    const token = localStorage.getItem('authToken');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;

  }

  enviarMensaje(mensaje: string, customSessionId?: string): Observable<MensajeResponse> {

    return this.obtenerUserIdDelToken().pipe(

      switchMap(userId => {

        const body: MensajeRequest = {

          mensaje: mensaje.trim(),
          session_id: customSessionId || this.sessionId,
          ...(userId ? { user_id: userId } : {})

        };

        console.log('[EuphoriaService] Enviando mensaje:', body);

        return this.http.post<MensajeResponse>(

          `${this.apiUrl}/chat`,
          body,
          { headers: this.getAuthHeaders() }

        );

      }),

      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))

    );

  }

  triggerEmergencyCall(): Observable<any> {
  return this.obtenerUserIdDelToken().pipe(
    switchMap(userId => {
      const body = {
        mensaje: 'emergency',
        session_id: this.sessionId,
        ...(userId ? { user_id: userId } : {})
      };
      return this.http.post(
        `${this.apiUrl}/emergency-call`,
        body,
        { headers: this.getAuthHeaders() }
      );
    }),
    catchError(this.manejarError.bind(this))
  );
}

  checkMood(mood: string): Observable<MoodCheckResponse> {

    return this.obtenerUserIdDelToken().pipe(

      switchMap(userId => {

        const body: MensajeRequest = {

          mensaje: `El usuario se siente ${mood}`,
          session_id: `mood_check_${userId || 'guest'}_${Date.now()}`,
          ...(userId ? { user_id: userId } : {})

        };

        console.log('[EuphoriaService] Mood check:', body);

        return this.http.post<MoodCheckResponse>(
          `${this.apiUrl}/mood-check`,
          body,
          { headers: this.getAuthHeaders() }
        );

      }),

      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))

    );

  }

  obtenerHistorial(sessionId?: string): Observable<HistorialResponse> {

    const idToUse = sessionId || this.sessionId;

    return this.http.get<HistorialResponse>(
      `${this.apiUrl}/historial/${idToUse}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );

  }

  obtenerConversacionesUsuario(userId: number): Observable<ConversationListResponse> {

    return this.http.get<ConversationListResponse>(
      `${this.apiUrl}/conversaciones/${userId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );

  }

  limpiarMemoria(): Observable<StatusResponse> {

    return this.http.delete<StatusResponse>(
      `${this.apiUrl}/sesion/${this.sessionId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );

  }

  uploadMoment(file: File, userId: number): Observable<MomentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    console.log(`[EuphoriaService] Subiendo momento para usuario ${userId}`);

    // Nota: Usamos el endpoint de la API de personas o uno específico para diario si existe.
    // Según instrucciones, seguimos la lógica de foto-perfil.
    return this.http.post<MomentUploadResponse>(
      `${environment.apiUrl}/api/diary/moments/upload`,
      formData,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }) }
    ).pipe(
      tap(() => this.conexionEstado.next(true)),
      catchError(this.manejarError.bind(this))
    );
  }

  verificarConexion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {

    this.conexionEstado.next(false);

    let msg = 'Error desconocido';

    if (error.status === 0) msg = 'No se puede conectar con el servidor.';
    else if (error.status === 400) msg = 'Solicitud inválida';
    else if (error.status === 401 || error.status === 403) msg = 'No autorizado. Por favor, inicia sesión nuevamente.';
    else if (error.status === 500) msg = 'Error en el servidor';
    else msg = `Error ${error.status}: ${error.error?.detail || error.message}`;

    return throwError(() => new Error(msg));

  }

}