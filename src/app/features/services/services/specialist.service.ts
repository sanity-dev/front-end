import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import {
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
  CreateAppointmentDto,
  Appointment,
} from '../models/specialist.model';
import { environment } from '../../../../environments/environment';

const API = `${environment.apiUrl}/api`;

@Injectable({ providedIn: 'root' })
export class SpecialistService {
  private http = inject(HttpClient);

  getAllSpecialists(): Observable<Specialist[]> {
    return forkJoin({
      specialists: this.http.get<Specialist[]>(`${API}/specialist`).pipe(catchError(() => of([]))),
      personas:    this.http.get<any[]>(`${API}/personas`).pipe(catchError(() => of([]))),
    }).pipe(
      map(({ specialists, personas }) => {
        return specialists.map((s) => {
          const persona = personas.find((p) => p.correo === s.email);
          return { ...s, fotoPerfilUrl: persona?.fotoPerfilUrl || null, nombre: persona?.nombre || null, };
        });
      }),
      catchError(() => of([])),
    );
  }

  getMyProfile(): Observable<Specialist | null> {
    return this.http.get<Specialist>(`${API}/specialist/me`).pipe(catchError(() => of(null)));
  }

  createSpecialist(dto: CreateSpecialistDto): Observable<Specialist> {
    return this.http
      .post<Specialist>(`${API}/specialist`, dto)
      .pipe(catchError((err) => throwError(() => err)));
  }

  updateSpecialist(dto: UpdateSpecialistDto): Observable<Specialist> {
    return this.http
      .put<Specialist>(`${API}/specialist/me`, dto)
      .pipe(catchError((err) => throwError(() => err)));
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    return this.http
      .post<Appointment>(`${API}/appointment`, dto)
      .pipe(catchError((err) => throwError(() => err)));
  }
}