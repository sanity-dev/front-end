import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interfaces que representan los datos del backend ---

export interface Diario {
  id: string;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
  };
}

export interface DiarioRequest {
  titulo: string;
  contenido: string;
}

export interface BitacoraEmocional {
  id: string;
  emocionPrincipal: string;
  descripcion: string;
  intensidad: number;
  fechaRegistro: string;
}

export interface BitacoraRequest {
  emocionPrincipal: string;
  descripcion: string;
  intensidad: number;
}

export interface ArchivoMultimedia {
  id: string;
  nombreArchivo: string;
  tipoArchivo: string;
  url: string;
}

export interface ArchivoMultimediaRequest {
  nombreArchivo: string;
  tipoArchivo: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  // URL del microservicio-diario (puerto 8081)
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // ==================== DIARIOS ====================

  /** Obtener todos los diarios del usuario autenticado */
  obtenerDiarios(): Observable<Diario[]> {
    return this.http.get<Diario[]>(`${this.apiUrl}/diarios`);
  }

  /** Crear un nuevo diario */
  crearDiario(data: DiarioRequest): Observable<Diario> {
    return this.http.post<Diario>(`${this.apiUrl}/diarios`, data);
  }

  /** Obtener un diario por su ID */
  obtenerDiario(id: string): Observable<Diario> {
    return this.http.get<Diario>(`${this.apiUrl}/diarios/${id}`);
  }

  /** Editar un diario existente */
  editarDiario(id: string, data: DiarioRequest): Observable<Diario> {
    return this.http.put<Diario>(`${this.apiUrl}/diarios/${id}`, data);
  }

  /** Eliminar un diario */
  eliminarDiario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/diarios/${id}`);
  }

  // ==================== BITÁCORAS EMOCIONALES ====================

  /** Listar las emociones de un diario */
  listarBitacoras(diarioId: string): Observable<BitacoraEmocional[]> {
    return this.http.get<BitacoraEmocional[]>(`${this.apiUrl}/diarios/${diarioId}/bitacoras`);
  }

  /** Agregar una emoción a un diario */
  agregarBitacora(diarioId: string, data: BitacoraRequest): Observable<BitacoraEmocional> {
    return this.http.post<BitacoraEmocional>(`${this.apiUrl}/diarios/${diarioId}/bitacoras`, data);
  }

  // ==================== ARCHIVOS MULTIMEDIA ====================

  /** Listar archivos de un diario */
  listarArchivos(diarioId: string): Observable<ArchivoMultimedia[]> {
    return this.http.get<ArchivoMultimedia[]>(`${this.apiUrl}/diarios/${diarioId}/archivos`);
  }

  /** Agregar un archivo a un diario */
  agregarArchivo(diarioId: string, data: ArchivoMultimediaRequest): Observable<ArchivoMultimedia> {
    return this.http.post<ArchivoMultimedia>(`${this.apiUrl}/diarios/${diarioId}/archivos`, data);
  }
}
