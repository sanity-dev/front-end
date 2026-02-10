import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  telefono?: string;
  cedula?: string;
  tipoUsuario?: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Cambia la URL según tu backend
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión con email y contraseña
   */
  login(credentials: LoginPayload): Observable<AuthResponse> {
    // Mapear a los campos que espera el backend: correo, contraseña
    const payload = {
      correo: credentials.email,
      contraseña: credentials.password
    } as any;

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  /**
   * Registra un nuevo usuario
   */
  register(data: RegisterPayload): Observable<AuthResponse> {
    // Mapear a los campos que espera el backend: nombre, correo, contraseña, telefono, cedula, tipoUsuario
    const payload: any = {
      nombre: data.name,
      correo: data.email,
      contraseña: data.password
    };

    if (data.telefono) payload.telefono = data.telefono;
    if (data.cedula) payload.cedula = data.cedula;
    if (data.tipoUsuario) payload.tipoUsuario = data.tipoUsuario;

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  /**
   * Inicia sesión con Google
   */
  loginWithGoogle(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, { token }).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  /**
   * Cierra la sesión
   */
  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Guarda el token en localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Elimina el token del localStorage
   */
  private removeToken(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Verifica si hay un token guardado
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
