import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Diario {
    id?: string;
    fechaCreacion?: string;
    usuario?: any;
}

export interface BitacoraRequestDTO {
    emocionPrincipal: string;
    nivelIntensidad: number;
    notas: string;
}

export interface BitacoraEmocional {
    id: string;
    emocionPrincipal: string;
    nivelIntensidad: number;
    notas: string;
    fechaRegistro: string;
}

@Injectable({
    providedIn: 'root'
})
export class DiarioService {
    private apiUrl = 'http://localhost:8080/api/diarios'; // API Gateway route

    constructor(private http: HttpClient) { }

    // Obtener o crear un diario principal para el usuario autenticado
    // (Assuming there's an endpoint for this, e.g., POST /api/diarios)
    crearDiario(): Observable<Diario> {
        return this.http.post<Diario>(`${this.apiUrl}`, {});
    }

    // Listar diarios del usuario
    obtenerMisDiarios(): Observable<Diario[]> {
        return this.http.get<Diario[]>(`${this.apiUrl}/mis-diarios`); // Ajustar según backend
    }

    // Guardar una nueva bitácora (entrada de diario)
    guardarEntrada(diarioId: string, bitacora: BitacoraRequestDTO): Observable<BitacoraEmocional> {
        return this.http.post<BitacoraEmocional>(`${this.apiUrl}/${diarioId}/bitacoras`, bitacora);
    }

    // Obtener historial de entradas
    obtenerHistorial(diarioId: string): Observable<BitacoraEmocional[]> {
        return this.http.get<BitacoraEmocional[]>(`${this.apiUrl}/${diarioId}/bitacoras`);
    }
}
