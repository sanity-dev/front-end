import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthHelperService } from './auth-helper.service';
import {
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
  CreateAppointmentDto,
  Appointment,
} from '../models/specialist.model';

const API = 'http://localhost:8080/api/services';

@Injectable({ providedIn: 'root' })
export class SpecialistService {
  private http = inject(HttpClient);
  private auth = inject(AuthHelperService);

  getAllSpecialists(): Observable<Specialist[]> {
    return this.http
      .get<Specialist[]>(`${API}/specialist`)
      .pipe(catchError(() => of([])));
  }

  getMyProfile(): Observable<Specialist | null> {
    const user = this.auth.getAuthUser();
    if (!user) return of(null);
    return this.http
      .get<Specialist>(`${API}/specialist/${user.userId}`)
      .pipe(catchError(() => of(null)));
  }

  createSpecialist(dto: CreateSpecialistDto): Observable<Specialist> {
    return this.http
      .post<Specialist>(`${API}/specialist`, dto)
      .pipe(catchError(err => throwError(() => err)));
  }

  updateSpecialist(dto: UpdateSpecialistDto): Observable<Specialist> {
    const user = this.auth.getAuthUser();
    if (!user) return throwError(() => new Error('No autenticado'));
    return this.http
      .put<Specialist>(`${API}/specialist/${user.userId}`, dto)
      .pipe(catchError(err => throwError(() => err)));
  }

  createAppointment(dto: CreateAppointmentDto): Observable<Appointment> {
    return this.http
      .post<Appointment>(`${API}/appointment`, dto)
      .pipe(catchError(err => throwError(() => err)));
  }
}