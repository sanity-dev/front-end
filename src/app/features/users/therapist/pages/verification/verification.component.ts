import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { DocumentService, DocumentUploadResponse } from '../../../../../core/services/document.service';
import { FaceVerificationComponent } from './face-verification.component';
import { FaceVerificationService } from '../../../../../core/services/face-verification.service';

interface DocumentItem {
  type: string;
  label: string;
  description: string;
  icon: string;
  file: File | null;
  fileName: string;
  status: 'idle' | 'selected' | 'uploading' | 'verifying' | 'uploaded' | 'verified' | 'rejected' | 'error';
  errorMessage: string;
  verificationStatus: string;
  motivoRechazo: string;
}

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FaceVerificationComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-linear-to-b from-[#ececec] to-[#ffffff]/60">

      <!-- Content -->
      <div class="flex-1 px-6 pt-4 pb-8">

        <!-- ========== SECCIÓN 1: DOCUMENTOS ========== -->
        <h2 class="text-2xl font-bold text-text-primary mb-2">Envía tus documentos</h2>
        <p class="text-text-primary text-sm mb-8">
          Para completar tu perfil y empezar a atender pacientes, necesitamos verificar tus credenciales profesionales. Tus documentos serán verificados automáticamente.
        </p>

        <!-- Document List -->
        <div class="space-y-4 mb-8">
          @for (doc of documents; track doc.type; let i = $index) {
            <div
              class="flex items-start p-4 rounded-xl backdrop-blur-sm transition-all duration-300"
              [class]="getCardClasses(doc)">

              <!-- Icon -->
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm shrink-0"
                   [class.text-gray-600]="doc.status === 'idle'"
                   [class.text-blue-500]="doc.status === 'selected'"
                   [class.text-amber-500]="doc.status === 'uploading' || doc.status === 'verifying'"
                   [class.text-green-500]="doc.status === 'uploaded' || doc.status === 'verified'"
                   [class.text-red-500]="doc.status === 'error' || doc.status === 'rejected'">

                <!-- Spinner when uploading/verifying -->
                @if (doc.status === 'uploading' || doc.status === 'verifying') {
                  <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                <!-- Check icon when verified -->
                @else if (doc.status === 'verified' || doc.status === 'uploaded') {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                }
                <!-- X icon when rejected -->
                @else if (doc.status === 'rejected') {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
                <!-- Error icon -->
                @else if (doc.status === 'error') {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                }
                <!-- Document icon (default / selected) -->
                @else {
                  <ng-container [ngSwitch]="doc.icon">
                    <ng-container *ngSwitchCase="'document'">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </ng-container>
                    <ng-container *ngSwitchCase="'academic'">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </ng-container>
                    <ng-container *ngSwitchCase="'id'">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                      </svg>
                    </ng-container>
                  </ng-container>
                }
              </div>

              <!-- Text -->
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 text-sm">{{ doc.label }}</h3>
                <p class="text-xs text-gray-600">{{ doc.description }}</p>

                <!-- File name display -->
                @if (doc.fileName) {
                  <p class="text-xs mt-1 truncate"
                     [class.text-blue-600]="doc.status === 'selected'"
                     [class.text-green-600]="doc.status === 'uploaded' || doc.status === 'verified'"
                     [class.text-amber-600]="doc.status === 'uploading' || doc.status === 'verifying'"
                     [class.text-red-600]="doc.status === 'error' || doc.status === 'rejected'">
                    📎 {{ doc.fileName }}
                  </p>
                }

                <!-- Verification status labels -->
                @if (doc.status === 'verifying') {
                  <p class="text-xs text-amber-600 mt-1 font-medium">🔍 Verificando documento con IA...</p>
                }
                @if (doc.status === 'verified') {
                  <p class="text-xs text-green-600 mt-1 font-medium">✅ Documento verificado correctamente</p>
                }
                @if (doc.status === 'rejected') {
                  <div class="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <p class="text-xs text-red-700 font-medium mb-1">❌ Verificación fallida</p>
                    <p class="text-xs text-red-600">{{ doc.motivoRechazo }}</p>
                  </div>
                }

                <!-- Error message -->
                @if (doc.status === 'error' && doc.errorMessage) {
                  <p class="text-xs text-red-500 mt-1">{{ doc.errorMessage }}</p>
                }
              </div>

              <!-- Upload button -->
              <button
                class="p-2 ml-2 rounded-full shadow-sm transition-all duration-200 cursor-pointer shrink-0"
                [class]="getButtonClasses(doc)"
                [disabled]="doc.status === 'uploading' || doc.status === 'verifying'"
                (click)="triggerFileInput(i)">

                @if (doc.status === 'uploaded' || doc.status === 'verified' || doc.status === 'rejected') {
                  <!-- Re-upload icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 14.652" />
                  </svg>
                } @else {
                  <!-- Upload icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                }
              </button>

              <!-- Hidden file input -->
              <input
                #fileInput
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                class="hidden"
                (change)="onFileSelected($event, i)" />
            </div>
          }
        </div>

        <!-- Global message -->
        @if (globalMessage) {
          <div class="mb-4 p-3 rounded-lg text-sm text-center transition-all duration-300"
               [class.bg-green-100]="globalMessageType === 'success'"
               [class.text-green-700]="globalMessageType === 'success'"
               [class.bg-red-100]="globalMessageType === 'error'"
               [class.text-red-700]="globalMessageType === 'error'"
               [class.bg-amber-100]="globalMessageType === 'warning'"
               [class.text-amber-700]="globalMessageType === 'warning'">
            {{ globalMessage }}
          </div>
        }

        <!-- Button -->
        <div class="w-full mb-8">
          <app-button
            [fullWidth]="true"
            [disabled]="!hasSelectedFiles() || isUploading"
            (click)="uploadAll()">
            {{ isUploading ? 'Subiendo y verificando...' : 'Subir Documentos' }}
          </app-button>
        </div>

        <!-- ========== DIVIDER ========== -->
        <div class="relative my-8">
          <div class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f3f3f3] px-4">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paso 2</span>
          </div>
        </div>

        <!-- ========== SECCIÓN 2: VERIFICACIÓN FACIAL ========== -->
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-2">
            <h2 class="text-2xl font-bold text-text-primary">Verificación Facial</h2>
            @if (faceVerificationState === 'VERIFICADO') {
              <span class="text-xs font-semibold text-white bg-emerald-500 px-2.5 py-0.5 rounded-full">Completada</span>
            }
          </div>
          <p class="text-text-primary text-sm mb-6">
            Confirma tu identidad tomándote una selfie. Compararemos tu rostro con la foto de tu documento de identificación.
          </p>
        </div>

        <!-- Face verification status badge (si ya fue verificado) -->
        @if (faceVerificationState === 'VERIFICADO') {
          <div class="flex items-center gap-3 p-4 rounded-xl bg-green-50/80 ring-2 ring-green-300 mb-6">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <h3 class="font-bold text-gray-900 text-sm">Identidad verificada</h3>
              <p class="text-xs text-green-600 font-medium">✅ Tu rostro coincide con tu documento de identidad</p>
            </div>
          </div>
        } @else {
          <!-- Face verification component -->
          <app-face-verification (onVerificationComplete)="onFaceVerificationDone()"></app-face-verification>
        }

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class VerificationComponent implements OnInit {
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  globalMessage = '';
  globalMessageType: 'success' | 'error' | 'warning' = 'success';
  isUploading = false;

  // Face verification
  faceVerificationState: 'PENDIENTE' | 'VERIFICADO' | 'NO_VERIFICADO' = 'NO_VERIFICADO';

  documents: DocumentItem[] = [
    {
      type: 'tarjeta_profesional',
      label: 'Tarjeta profesional',
      description: 'Tarjeta profesional vigente',
      icon: 'document',
      file: null,
      fileName: '',
      status: 'idle',
      errorMessage: '',
      verificationStatus: '',
      motivoRechazo: ''
    },
    {
      type: 'titulos',
      label: 'Títulos',
      description: 'Títulos académicos relevantes',
      icon: 'academic',
      file: null,
      fileName: '',
      status: 'idle',
      errorMessage: '',
      verificationStatus: '',
      motivoRechazo: ''
    },
    {
      type: 'identificacion',
      label: 'Identificación',
      description: 'Documento de identidad oficial',
      icon: 'id',
      file: null,
      fileName: '',
      status: 'idle',
      errorMessage: '',
      verificationStatus: '',
      motivoRechazo: ''
    }
  ];

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private faceVerificationService: FaceVerificationService
  ) { }

  ngOnInit(): void {
    this.loadFaceVerificationStatus();
  }

  /**
   * Carga el estado de verificación facial desde el backend
   */
  loadFaceVerificationStatus(): void {
    this.faceVerificationService.getVerificationStatus().subscribe({
      next: (response) => {
        if (response.faceVerification === 'VERIFICADO') {
          this.faceVerificationState = 'VERIFICADO';
        } else if (response.faceVerification === 'PENDIENTE') {
          this.faceVerificationState = 'PENDIENTE';
        } else {
          this.faceVerificationState = 'NO_VERIFICADO';
        }
      },
      error: () => {
        this.faceVerificationState = 'NO_VERIFICADO';
      }
    });
  }

  /**
   * Callback cuando la verificación facial se completa exitosamente
   */
  onFaceVerificationDone(): void {
    this.faceVerificationState = 'VERIFICADO';
  }

  /**
   * Abre el file picker para el documento en el índice dado
   */
  triggerFileInput(index: number): void {
    const inputs = this.fileInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.click();
    }
  }

  /**
   * Maneja la selección de archivo
   */
  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.documents[index].status = 'error';
        this.documents[index].errorMessage = 'El archivo excede el tamaño máximo de 10MB';
        this.documents[index].file = null;
        this.documents[index].fileName = '';
        return;
      }

      this.documents[index].file = file;
      this.documents[index].fileName = file.name;
      this.documents[index].status = 'selected';
      this.documents[index].errorMessage = '';
      this.documents[index].motivoRechazo = '';
      this.documents[index].verificationStatus = '';
      this.globalMessage = '';
    }
  }

  /**
   * Verifica si hay al menos un archivo seleccionado listo para subir
   */
  hasSelectedFiles(): boolean {
    return this.documents.some(doc => doc.file !== null &&
      doc.status !== 'uploaded' && doc.status !== 'verified');
  }

  /**
   * Sube todos los documentos seleccionados y muestra resultado de verificación
   */
  async uploadAll(): Promise<void> {
    const docsToUpload = this.documents.filter(doc =>
      doc.file && doc.status !== 'uploaded' && doc.status !== 'verified');

    if (docsToUpload.length === 0) return;

    this.isUploading = true;
    this.globalMessage = '';
    let verifiedCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;
    let errorCount = 0;

    for (const doc of docsToUpload) {
      doc.status = 'uploading';

      try {
        await new Promise<void>((resolve, reject) => {
          this.documentService.uploadDocument(doc.file!, doc.type).subscribe({
            next: (response: DocumentUploadResponse) => {
              doc.verificationStatus = response.verificationStatus || '';
              doc.motivoRechazo = response.motivoRechazo || '';

              // Determinar estado visual según verificación
              if (response.verificationStatus === 'VERIFICADO') {
                doc.status = 'verified';
                doc.errorMessage = '';
                verifiedCount++;
              } else if (response.verificationStatus === 'RECHAZADO') {
                doc.status = 'rejected';
                doc.errorMessage = '';
                rejectedCount++;
              } else {
                // PENDIENTE u otro
                doc.status = 'uploaded';
                doc.errorMessage = '';
                pendingCount++;
              }
              resolve();
            },
            error: (error) => {
              doc.status = 'error';
              doc.errorMessage = error.message || 'Error al subir el documento';
              errorCount++;
              resolve();
            }
          });
        });
      } catch {
        doc.status = 'error';
        doc.errorMessage = 'Error inesperado';
        errorCount++;
      }
    }

    this.isUploading = false;

    // Construir mensaje global
    if (errorCount === 0 && rejectedCount === 0) {
      if (verifiedCount > 0) {
        this.globalMessage = `✅ ${verifiedCount} documento(s) verificado(s) exitosamente.`;
        this.globalMessageType = 'success';
      } else {
        this.globalMessage = `⏳ ${pendingCount} documento(s) subido(s). Serán revisados manualmente.`;
        this.globalMessageType = 'warning';
      }
    } else if (rejectedCount > 0) {
      this.globalMessage = `⚠️ ${rejectedCount} documento(s) no pasaron la verificación. Revisa los detalles y sube documentos correctos.`;
      this.globalMessageType = 'error';
    } else {
      this.globalMessage = '❌ No se pudieron subir los documentos. Verifica tu conexión e intenta de nuevo.';
      this.globalMessageType = 'error';
    }
  }

  /**
   * Clases CSS para la tarjeta según el estado
   */
  getCardClasses(doc: DocumentItem): string {
    const base = 'flex items-start p-4 rounded-xl backdrop-blur-sm transition-all duration-300';
    switch (doc.status) {
      case 'selected':
        return `${base} bg-blue-50/80 ring-2 ring-blue-300`;
      case 'uploading':
      case 'verifying':
        return `${base} bg-amber-50/80 ring-2 ring-amber-300`;
      case 'uploaded':
      case 'verified':
        return `${base} bg-green-50/80 ring-2 ring-green-300`;
      case 'rejected':
        return `${base} bg-red-50/80 ring-2 ring-red-300`;
      case 'error':
        return `${base} bg-red-50/80 ring-2 ring-red-300`;
      default:
        return `${base} bg-white/80`;
    }
  }

  /**
   * Clases CSS para el botón de subida según el estado
   */
  getButtonClasses(doc: DocumentItem): string {
    const base = 'p-2 ml-2 rounded-full shadow-sm transition-all duration-200 cursor-pointer shrink-0';
    switch (doc.status) {
      case 'selected':
        return `${base} bg-blue-100 text-blue-600 hover:bg-blue-200`;
      case 'uploading':
      case 'verifying':
        return `${base} bg-amber-100 text-amber-600 cursor-not-allowed`;
      case 'uploaded':
      case 'verified':
        return `${base} bg-green-100 text-green-600 hover:bg-green-200`;
      case 'rejected':
        return `${base} bg-red-100 text-red-600 hover:bg-red-200`;
      case 'error':
        return `${base} bg-red-100 text-red-600 hover:bg-red-200`;
      default:
        return `${base} bg-white text-blue-500 hover:bg-gray-50`;
    }
  }

  goBack() {
    this.router.navigate(['/users/therapist/profile-ready']);
  }
}
