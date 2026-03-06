import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthHelperService } from './auth-helper.service';
import {
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
} from '../models/specialist.model';

const API = 'http://localhost:8080/api/services';

@Injectable({ providedIn: 'root' })
export class SpecialistService {
  private http = inject(HttpClient);
  private auth = inject(AuthHelperService);

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getBearerToken()}` });
  }

  /** Todos los terapeutas que ya registraron servicios → para USUARIO */
  getAllSpecialists(): Observable<Specialist[]> {
    return this.http
      .get<Specialist[]>(`${API}/specialists`, { headers: this.headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  /**
   * Perfil del TERAPEUTA autenticado.
   * 404 = aún no registró servicios → retorna null (flujo válido).
   */
  getMyProfile(): Observable<Specialist | null> {
    const user = this.auth.getAuthUser();
    if (!user) return throwError(() => new Error('No autenticado'));
    return this.http
      .get<Specialist>(`${API}/specialists/${user.userId}`, { headers: this.headers })
      .pipe(catchError(err => err?.status === 404 ? of(null) : throwError(() => err)));
  }

  /** Registra por primera vez los servicios del terapeuta */
  createSpecialist(dto: CreateSpecialistDto): Observable<Specialist> {
    return this.http
      .post<Specialist>(`${API}/specialists`, dto, { headers: this.headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** Actualiza los servicios del terapeuta */
  updateSpecialist(dto: UpdateSpecialistDto): Observable<Specialist> {
    const user = this.auth.getAuthUser();
    if (!user) return throwError(() => new Error('No autenticado'));
    return this.http
      .patch<Specialist>(`${API}/specialists/${user.userId}`, dto, { headers: this.headers })
      .pipe(catchError(err => throwError(() => err)));
  }
}