import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export interface Notification {
    id: number;
    usuarioId: string;
    titulo: string;
    mensaje: string;
    tipo: string;       // PUSH, EMAIL, SISTEMA
    estado: string;     // PENDIENTE, ENVIADO, LEIDO, FALLIDO
    fechaCreacion: string;
    fechaEnvio: string | null;
    leida: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';
    private unreadCountSubject = new BehaviorSubject<number>(0);

    /** Observable del conteo de no leídas para mostrar badges */
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    /**
     * Obtener las notificaciones del usuario autenticado
     */
    getMyNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}/me`).pipe(
            tap(notifications => {
                const unread = notifications.filter(n => !n.leida).length;
                this.unreadCountSubject.next(unread);
            })
        );
    }

    /**
     * Obtener una notificación por ID
     */
    getNotificationById(id: number): Observable<Notification> {
        return this.http.get<Notification>(`${this.apiUrl}/${id}`);
    }

    /**
     * Marcar una notificación como leída
     */
    markAsRead(id: number): Observable<Notification> {
        return this.http.put<Notification>(`${this.apiUrl}/${id}/leer`, {}).pipe(
            tap(() => {
                // Decrementar el conteo de no leídas
                const current = this.unreadCountSubject.value;
                if (current > 0) {
                    this.unreadCountSubject.next(current - 1);
                }
            })
        );
    }

    /**
     * Eliminar una notificación
     */
    deleteNotification(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtener solo las notificaciones no leídas (filtro local)
     */
    getUnreadNotifications(): Observable<Notification[]> {
        return this.getMyNotifications().pipe(
            map(notifications => notifications.filter(n => !n.leida))
        );
    }
}
