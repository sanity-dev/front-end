import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private apiUrl = `${environment.apiUrl}/api/diarios`;

  constructor(private http: HttpClient) {}

  // Obtener lista de diarios (historial de chats)
  getDiarios(): Observable<Diario[]> {
    return this.http.get<Diario[]>(this.apiUrl);
  }

  // Crear un nuevo diario vacio
  crearDiario(titulo: string): Observable<Diario> {
    return this.http.post<Diario>(this.apiUrl, { titulo, contenido: 'Chat de Diario' });
  }

  // Obtener todos los mensajes de un diario específico
  getMensajes(diarioId: string): Observable<MensajeDiarioDTO[]> {
    return this.http.get<MensajeDiarioDTO[]>(`${this.apiUrl}/${diarioId}/mensajes`);
  }

  // Enviar un nuevo mensaje o momento a un diario
  agregarMensaje(diarioId: string, mensaje: NuevoMensajeDTO): Observable<MensajeDiarioDTO> {
    return this.http.post<MensajeDiarioDTO>(`${this.apiUrl}/${diarioId}/mensajes`, mensaje);
  }
}
