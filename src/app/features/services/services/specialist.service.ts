import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
  CreateAppointmentDto,
  Appointment,
} from '../models/specialist.model';

const API = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class SpecialistService {
  private http = inject(HttpClient);

  getAllSpecialists(): Observable<Specialist[]> {
    return this.http.get<Specialist[]>(`${API}/specialist`).pipe(catchError(() => of([])));
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
