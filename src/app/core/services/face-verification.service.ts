import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ============================================
// INTERFACES
// ============================================

export interface FaceVerificationResult {
  success: boolean;
  faceMatch: boolean;
  similarity: number;
  estado: string;
  message: string;
  selfieUrl: string;
}

export interface FaceVerificationStatus {
  status: string;
  documents: FaceDocumentStatus[];
  faceVerification: string;
}

export interface FaceDocumentStatus {
  type: string;
  status: string;
  uploadedAt: string;
  motivoRechazo: string;
  verificacionFacial: string;
  selfieUrl: string;
}

// ============================================
// SERVICIO
// ============================================

@Injectable({
  providedIn: 'root'
})
export class FaceVerificationService {

  private readonly apiUrl = `${environment.apiUrl}/api/documents`;

  constructor(private http: HttpClient) { }

  /**
   * Envía la selfie al backend para comparar con el documento de identidad.
   * @param selfieBlob Blob de la imagen capturada desde la webcam
   */
  verifyFace(selfieBlob: Blob): Observable<FaceVerificationResult> {
    const formData = new FormData();
    formData.append('selfie', selfieBlob, 'selfie.jpg');
    return this.http.post<FaceVerificationResult>(
      `${this.apiUrl}/verify-face`,
      formData
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Obtiene el estado de verificación del terapeuta (incluye estado facial).
   */
  getVerificationStatus(): Observable<FaceVerificationStatus> {
    return this.http.get<FaceVerificationStatus>(
      `${this.apiUrl}/verification-status`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // ============================================
  // MANEJO DE ERRORES
  // ============================================

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido en la verificación facial';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Imagen inválida o no se detectó un rostro.';
      } else if (error.status === 404) {
        errorMessage = 'No se encontró documento de identidad. Sube tu identificación primero.';
      } else if (error.status === 413) {
        errorMessage = 'La imagen es demasiado grande.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor al procesar la verificación.';
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }

    console.error('❌ Error de verificación facial:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
