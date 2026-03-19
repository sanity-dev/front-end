import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

export interface TherapistRegisterPayload {
  name: string;
  email: string;
  password: string;
  documentNumber: string;
  phoneNumber: string;
  professionalLicenseNumber: string;
}

export interface AuthResponse {
  token?: string;
  tipo?: string;
  persona?: {
    idPersona: number;
    nombre: string;
    correo: string;
    telefono: string;
    cedula: string;
    tipoUsuario: string;
    fotoPerfilUrl: string | null;
    tarjetaProfesional?: string;
  };
  message?: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión con email y contraseña
   */
  login(credentials: LoginPayload): Observable<AuthResponse> {
    const payload = {
      correo: credentials.email,
      contraseña: credentials.password,
    } as any;

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          if (response.persona?.tipoUsuario) {
            localStorage.setItem('userType', response.persona.tipoUsuario);
          }
          this.isAuthenticatedSubject.next(true);
        }
      }),
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
      contraseña: data.password,
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
      }),
    );
  }

  /**
   * Registra un nuevo terapeuta
   */
  registerTherapist(data: TherapistRegisterPayload): Observable<AuthResponse> {
    // Mapear a los campos que espera el backend
    const payload: any = {
      nombre: data.name,
      correo: data.email,
      contraseña: data.password,
      cedula: data.documentNumber,
      tarjetaProfesional: data.professionalLicenseNumber,
      telefono: data.phoneNumber,
      tipoUsuario: 'terapeuta',
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register-therapist`, payload).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      }),
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
          if (response.persona?.tipoUsuario) {
            localStorage.setItem('userType', response.persona.tipoUsuario);
          }
          this.isAuthenticatedSubject.next(true);
        }
      }),
    );
  }
  /**
   * envia enlace para recuperar contraseña
   */
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { correo: email });
  }
  /**
   * Cierra la sesión
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('persona'); 
    localStorage.removeItem('euphoria_session_id'); 
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
    localStorage.removeItem('userType');
    localStorage.removeItem('persona'); 
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

  /**
   * Obtiene el tipo de usuario almacenado
   */
  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  /**
   * Retorna la URL de redirección según el tipo de usuario
   */
  getRedirectUrl(): string {
    const userType = this.getUserType();
    switch (userType?.toUpperCase()) {
      case 'TERAPEUTA':
        return '/users/therapist/dashboard';
      case 'USUARIO':
      default:
        return '/user/dashboard';
    }
  }
}
