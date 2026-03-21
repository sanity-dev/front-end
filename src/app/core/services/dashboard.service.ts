import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ============================================
// INTERFACES
// ============================================

export interface UserInfo {
    idPersona: number;
    nombre: string;
    correo: string;
}

export interface Appointment {
    id: number;
    therapistName: string;
    serviceType: string;
    date: string;
    time: string;
    modality: string; // 'Online' | 'Presencial'
}

export interface Habit {
    id: number;
    label: string;
    progress: number; // 0-100
    time?: string | null;
    description?: string | null;
    frequency?: string | null;
    reminderDays?: string[];
    createdAt?: string | null;
}

export interface DiaryEntry {
    id: number;
    text: string;
    date: string;
    photoUrl?: string | null;
}

// ============================================
// SERVICE
// ============================================

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private readonly gatewayUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // ============================================
    // USER INFO (desde microservicio de Usuarios)
    // ============================================

    /**
     * Obtiene la info del usuario logueado decodificando el JWT
     * y buscando en /api/personas
     */
    getUserInfo(): Observable<UserInfo | null> {
        const token = localStorage.getItem('authToken');
        if (!token) return of(null);

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const email = payload.sub;

            return this.http.get<any[]>(`${this.gatewayUrl}/api/personas`).pipe(
                map(personas => {
                    const user = personas.find(p => p.correo === email);
                    if (!user) return null;
                    return {
                        idPersona: user.idPersona,
                        nombre: user.nombre,
                        correo: user.correo
                    } as UserInfo;
                }),
                catchError(() => of(null))
            );
        } catch {
            return of(null);
        }
    }

    // ============================================
    // APPOINTMENTS (desde microservicio de Servicios)
    // ============================================

    /**
     * Obtiene las citas del usuario desde /api/appointments/user/{userId}
     * Retorna la próxima cita (la más cercana en el futuro)
     */
    getNextAppointment(userId: number): Observable<Appointment | null> {
        return this.http.get<any[]>(`${this.gatewayUrl}/api/appointments/user/${userId}`).pipe(
            map(appointments => {
                if (!appointments || appointments.length === 0) return null;

                // Filtrar citas futuras y ordenar por fecha
                const now = new Date();
                const upcoming = appointments
                    .filter(a => new Date(a.date || a.fecha) > now)
                    .sort((a, b) => new Date(a.date || a.fecha).getTime() - new Date(b.date || b.fecha).getTime());

                if (upcoming.length === 0) return null;

                const next = upcoming[0];
                return {
                    id: next.id || next.idCita,
                    therapistName: next.therapistName || next.nombreTerapeuta || 'Terapeuta',
                    serviceType: next.serviceType || next.tipoServicio || 'Consulta',
                    date: next.date || next.fecha,
                    time: next.time || next.hora || '',
                    modality: next.modality || next.modalidad || 'Online'
                } as Appointment;
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Obtiene TODAS las citas del usuario desde /api/appointments/user/{userId}
     * Usado por el dashboard del terapeuta
     */
    getAllAppointments(userId: number): Observable<Appointment[]> {
        return this.http.get<any[]>(`${this.gatewayUrl}/api/appointments/user/${userId}`).pipe(
            map(appointments => {
                if (!appointments || appointments.length === 0) return [];
                return appointments.map(a => ({
                    id: a.id || a.idCita,
                    therapistName: a.therapistName || a.nombreTerapeuta || a.patientName || a.nombrePaciente || '',
                    serviceType: a.serviceType || a.tipoServicio || 'Consulta',
                    date: a.date || a.fecha,
                    time: a.time || a.hora || '',
                    modality: a.modality || a.modalidad || 'Online'
                }));
            }),
            catchError(() => of([]))
        );
    }

    // ============================================
    // HABITS (gestionado por EuphorIA/agente IA)
    // ============================================

    /**
     * Obtiene los hábitos del usuario desde /api/habits/user/{userId}
     */
    getHabits(userId: number): Observable<Habit[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        });

        return this.http.get<any>(`${this.gatewayUrl}/api/euphoria/reminders/${userId}`, {
            headers
        }).pipe(
            map(response => {
                if (!response?.reminders || response.reminders.length === 0) return [];
                return response.reminders.map((h: any) => ({
                    id: h.id,
                    label: h.habit_name,
                    progress: this.calcularProgreso(h),
                    time: h.reminder_time || null,
                    description: h.description || h.habit_description || null,
                    frequency: h.frequency || h.reminder_frequency || null,
                    reminderDays: Array.isArray(h.reminder_days) ? h.reminder_days : [],
                    createdAt: h.created_at || null
                }));
            }),
            catchError(() => of([]))
        );
    }

    private calcularProgreso(habit: any): number {
        if (habit.reminder_time) {
            const [hours, minutes] = habit.reminder_time.split(':').map(Number);
            const ahora = new Date();
            const horaHabito = hours * 60 + minutes;
            const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

            // Cuando llega o pasa la hora → 100%
            if (horaActual >= horaHabito) return 100;

            // Ej: hábito a las 9am, ahora son las 6am → (360/540) * 100 = 66%
            return Math.round((horaActual / horaHabito) * 100);
        }

        if (habit.created_at) {
            const creado = new Date(habit.created_at);
            const ahora = new Date();
            const diasTranscurridos = Math.floor(
                (ahora.getTime() - creado.getTime()) / (1000 * 60 * 60 * 24)
            );
            const meta = habit.frequency === 'semanal' ? 7 : 1;
            return Math.min(100, Math.round((diasTranscurridos % meta) / meta * 100));
        }

        return 0;
    }

    // ============================================
    // DIARY (desde microservicio de Diario)
    // ============================================

    /**
     * Obtiene las entradas del diario del usuario desde /api/diary/user/{userId}
     * Retorna la entrada más reciente
     */
    getLatestDiaryEntry(userId: number): Observable<DiaryEntry | null> {
        return this.http.get<any[]>(`${this.gatewayUrl}/api/diary/user/${userId}`).pipe(
            map(entries => {
                if (!entries || entries.length === 0) return null;

                // Ordenar por fecha descendente y tomar la más reciente
                const sorted = entries.sort((a, b) =>
                    new Date(b.date || b.fecha || b.createdAt).getTime() -
                    new Date(a.date || a.fecha || a.createdAt).getTime()
                );

                const latest = sorted[0];
                return {
                    id: latest.id || latest.idEntrada,
                    text: latest.text || latest.texto || latest.contenido || '',
                    date: latest.date || latest.fecha || latest.createdAt || '',
                    photoUrl: latest.photoUrl || latest.fotoUrl || latest.imageUrl || null
                } as DiaryEntry;
            }),
            catchError(() => of(null))
        );
    }
}
