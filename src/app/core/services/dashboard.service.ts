import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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
    pacienteID?: number;
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
        * Obtiene citas del usuario estándar desde /api/appointment/patient/{pacienteID}
        * y retorna la próxima cita (la más cercana en el futuro).
     */
    getNextAppointment(userId: number): Observable<Appointment | null> {
        const toDate = (a: any): Date => {
            const base = a.date || a.fecha || a.fechaCita || '';
            const time = a.time || a.hora || a.horaCita || '';
            if (!base) return new Date('');
            if (time && typeof base === 'string' && !base.includes('T')) {
                return new Date(`${base}T${time}`);
            }
            return new Date(base);
        };

        return this.http.get<any[]>(`${this.gatewayUrl}/api/appointment/patient/${userId}`).pipe(
            switchMap(appointments => {
                if (!appointments || appointments.length === 0) return of(null);

                const now = new Date();
                const upcoming = appointments
                    .filter(a => toDate(a) > now)
                    .sort((a, b) => toDate(a).getTime() - toDate(b).getTime());

                if (upcoming.length === 0) return of(null);

                const next = upcoming[0];

                // Si ya viene con nombre de terapeuta, úsalo directamente
                if (next.nombreTerapeuta || next.therapistName) {
                    return of({
                        id: next.id || next.idCita,
                        therapistName: next.nombreTerapeuta || next.therapistName,
                        serviceType: next.tipoSesion || next.serviceType || next.tipoServicio || 'Consulta',
                        date: next.date || next.fecha,
                        time: next.time || next.hora || '',
                        modality: next.modality || next.modalidad || 'Online'
                    } as Appointment);
                }

                // Resolver nombre del terapeuta via specialists + personas
                return forkJoin({
                    specialists: this.http.get<any[]>(`${this.gatewayUrl}/api/specialist/`).pipe(catchError(() => of([]))),
                    personas: this.http.get<any[]>(`${this.gatewayUrl}/api/personas`).pipe(catchError(() => of([])))
                }).pipe(
                    map(({ specialists, personas }) => {
                        const specialistUserId = next.specialistUserId || next.terapeutaId || null;
                        let therapistName = 'Terapeuta';

                        if (specialistUserId) {
                            const specialist = specialists.find((s: any) => s.id === specialistUserId || s.userId === specialistUserId);
                            if (specialist) {
                                const persona = personas.find((p: any) => p.correo === specialist.email);
                                if (persona) therapistName = persona.nombre;
                            }
                        }

                        return {
                            id: next.id || next.idCita,
                            therapistName,
                            serviceType: next.tipoSesion || next.serviceType || next.tipoServicio || 'Consulta',
                            date: next.date || next.fecha,
                            time: next.time || next.hora || '',
                            modality: next.modality || next.modalidad || 'Online'
                        } as Appointment;
                    })
                );
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Obtiene TODAS las citas del terapeuta desde /api/appointment/my-appointments
     * enviando el header x-user-email requerido por el backend.
     * Usado por el dashboard del terapeuta
     */
    getAllAppointments(userId: number): Observable<Appointment[]> {
        const token = localStorage.getItem('authToken');

        if (!token) return of([]);

        let email = '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            email = payload?.sub || payload?.email || '';
        } catch {
            return of([]);
        }

        if (!email) return of([]);

        const headers = new HttpHeaders({ 'x-user-email': email });

        return this.http.get<any[]>(`${this.gatewayUrl}/api/appointment/my-appointments`, { headers }).pipe(
            map(appointments => {
                if (!appointments || appointments.length === 0) return [];
                return appointments.map(a => ({
                    id: a.id || a.idCita,
                    therapistName: a.therapistName || a.nombreTerapeuta || a.patientName || a.nombrePaciente || '',
                    serviceType: a.serviceType || a.tipoServicio || 'Consulta',
                    date: a.date || a.fecha,
                    time: a.time || a.hora || '',
                    modality: a.modality || a.modalidad || 'Online',
                    pacienteID: a.pacienteID || a.idPaciente
                }));
            }),
            catchError(() => of([]))
        );
    }

    // ============================================
    // HABITS (gestionado por EuphorIA/agente IA)
    // ============================================

    /**
     * Obtiene los hábitos del usuario desde /api/euphoria/reminders{userId}
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
     * Obtiene las entradas del diario del usuario desde /api/diary/user/{userId}/mensajes
     * Retorna la entrada más reciente
     */
    getLatestDiaryEntry(userId: number): Observable<DiaryEntry | null> {
        return this.http.get<any[]>(`${this.gatewayUrl}/api/diary/user/${userId}/mensajes`).pipe(
            map(entries => {
                if (!entries || entries.length === 0) return null;

                // Ordenar por fecha descendente y tomar la más reciente
                const sorted = entries.sort((a, b) =>
                    new Date(b.fechaEnvio || b.date || b.fecha || b.createdAt).getTime() -
                    new Date(a.fechaEnvio || a.date || a.fecha || a.createdAt).getTime()
                );

                const latest = sorted[0];
                return {
                    id: latest.id,
                    text: latest.contenido || latest.text || latest.texto || '',
                    date: latest.fechaEnvio || latest.date || latest.fecha || latest.createdAt || '',
                    photoUrl: latest.tipo === 'image' ? latest.contenido : null
                } as DiaryEntry;
            }),
            catchError(() => of(null))
        );
    }
}
