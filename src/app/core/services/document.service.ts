import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// ============================================
// INTERFACES
// ============================================

export interface DocumentUploadResponse {
    success: boolean;
    message: string;
    documentId?: string;
}

export interface VerificationStatus {
    status: 'pending' | 'verified' | 'rejected';
    details?: string;
    documents?: {
        type: string;
        status: string;
        uploadedAt?: string;
    }[];
}

// ============================================
// SERVICIO
// ============================================

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    private readonly apiUrl = 'http://localhost:8080/api/documents';

    constructor(private http: HttpClient) { }

    /**
     * Sube un documento al backend
     * @param file - Archivo a subir (PDF, JPG, PNG)
     * @param documentType - Tipo: 'tarjeta_profesional', 'titulos', 'identificacion'
     */
    uploadDocument(file: File, documentType: string): Observable<DocumentUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        // No se envía Content-Type, el navegador lo asigna automáticamente con el boundary para multipart
        return this.http.post<DocumentUploadResponse>(
            `${this.apiUrl}/upload`,
            formData
        ).pipe(
            tap(response => console.log(`✅ Documento '${documentType}' subido:`, response)),
            catchError(this.handleError.bind(this))
        );
    }

    /**
     * Consulta el estado de verificación de los documentos del terapeuta
     */
    getVerificationStatus(): Observable<VerificationStatus> {
        return this.http.get<VerificationStatus>(
            `${this.apiUrl}/verification-status`
        ).pipe(
            tap(response => console.log('✅ Estado de verificación:', response)),
            catchError(this.handleError.bind(this))
        );
    }

    // ============================================
    // MANEJO DE ERRORES
    // ============================================

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Error desconocido al subir el documento';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            if (error.status === 0) {
                errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
            } else if (error.status === 400) {
                errorMessage = error.error?.message || 'Archivo inválido o no soportado.';
            } else if (error.status === 413) {
                errorMessage = 'El archivo es demasiado grande.';
            } else if (error.status === 500) {
                errorMessage = 'Error interno del servidor al procesar el documento.';
            } else {
                errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
            }
        }

        console.error('❌ Error de documento:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
