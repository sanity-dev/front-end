import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface MensajeDiarioDTO {
  id: string;
  contenido: string;
  tipo: string;
  fechaEnvio: string;
}

export interface NuevoMensajeDTO {
  contenido: string;
  tipo: string;
}

export interface Diario {
  id: string;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = `${environment.apiUrl}/api/diary`;

  constructor(private http: HttpClient) {}

  private normalizarTimestamp(ts: string): string {
    if (!ts) return ts;
    if (/[Zz]$/.test(ts) || /[+-]\d{2}:\d{2}$/.test(ts)) return ts;
    return ts + 'Z';
  }

  // Obtener lista de diarios (historial de chats)
  getDiarios(): Observable<Diario[]> {
    return this.http.get<Diario[]>(this.apiUrl).pipe(
      map(diarios => diarios.map(d => ({
        ...d,
        fechaCreacion: this.normalizarTimestamp(d.fechaCreacion),
        fechaActualizacion: this.normalizarTimestamp(d.fechaActualizacion)
      })))
    );
  }

  // Crear un nuevo diario vacio
  crearDiario(titulo: string): Observable<Diario> {
    return this.http.post<Diario>(this.apiUrl, { titulo, contenido: 'Chat de Diario' }).pipe(
      map(d => ({
        ...d,
        fechaCreacion: this.normalizarTimestamp(d.fechaCreacion),
        fechaActualizacion: this.normalizarTimestamp(d.fechaActualizacion)
      }))
    );
  }

  // Obtener todos los mensajes de un diario específico
  getMensajes(diarioId: string): Observable<MensajeDiarioDTO[]> {
    return this.http.get<MensajeDiarioDTO[]>(`${this.apiUrl}/${diarioId}/mensajes`).pipe(
      map(mensajes => mensajes.map(m => ({
        ...m,
        fechaEnvio: this.normalizarTimestamp(m.fechaEnvio)
      })))
    );
  }

  // Enviar un nuevo mensaje o momento a un diario
  agregarMensaje(diarioId: string, mensaje: NuevoMensajeDTO): Observable<MensajeDiarioDTO> {
    return this.http.post<MensajeDiarioDTO>(`${this.apiUrl}/${diarioId}/mensajes`, mensaje).pipe(
      map(m => ({
        ...m,
        fechaEnvio: this.normalizarTimestamp(m.fechaEnvio)
      }))
    );
  }

  // Subir imagen a Google Cloud y guardarla como un mensaje de diario
  subirImagenMensaje(diarioId: string, file: File): Observable<MensajeDiarioDTO> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Obtenemos el userId del local storage para enviarlo al backend
    const userId = localStorage.getItem('userId') || 'default';
    formData.append('usuarioId', userId);

    return this.http.post<MensajeDiarioDTO>(`${this.apiUrl}/${diarioId}/mensajes/upload`, formData).pipe(
      map(m => ({
        ...m,
        fechaEnvio: this.normalizarTimestamp(m.fechaEnvio)
      }))
    );
  }

  // Obtener todas las imágenes guardadas en el Álbum de Recuerdos
  getRecuerdos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recuerdos`).pipe(
      map(recuerdos => recuerdos.map(r => ({
        ...r,
        fecha: this.normalizarTimestamp(r.fecha)
      })))
    );
  }
}
