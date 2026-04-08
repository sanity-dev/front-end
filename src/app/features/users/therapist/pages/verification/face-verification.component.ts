import { Component, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceVerificationService, FaceVerificationResult } from '../../../../../core/services/face-verification.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-face-verification',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  host: { class: 'block w-full' },
  template: `
    <div class="w-full">

      <!-- ==================== PASO 1: INTRO ==================== -->
      @if (currentStep === 'intro') {
        <div class="flex flex-col items-center text-center animate-fade-in">

          <!-- Icon -->
          <div class="w-20 h-20 rounded-full bg-linear-to-br from-secondary-background to-third-background
                      flex items-center justify-center mb-4 shadow-lg shadow-secondary-background/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
          </div>

          <h2 class="text-xl font-bold text-text-primary mb-2">Verificación Facial</h2>
          <p class="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
            Confirma tu identidad comparando tu rostro con la foto de tu documento de identificación.
          </p>

          <!-- Requisitos -->
          <div class="w-full space-y-2 mb-6">
            <div class="flex items-center gap-3 px-4 py-3 bg-blue-50/80 rounded-xl text-sm text-gray-700 text-left">
              <span class="text-base shrink-0">📄</span>
              <span>Asegúrate de haber subido tu identificación primero</span>
            </div>
            <div class="flex items-center gap-3 px-4 py-3 bg-blue-50/80 rounded-xl text-sm text-gray-700 text-left">
              <span class="text-base shrink-0">💡</span>
              <span>Busca un lugar con buena iluminación</span>
            </div>
            <div class="flex items-center gap-3 px-4 py-3 bg-blue-50/80 rounded-xl text-sm text-gray-700 text-left">
              <span class="text-base shrink-0">🎭</span>
              <span>No uses gafas de sol ni gorros</span>
            </div>
            <div class="flex items-center gap-3 px-4 py-3 bg-blue-50/80 rounded-xl text-sm text-gray-700 text-left">
              <span class="text-base shrink-0">📱</span>
              <span>Mira directamente a la cámara</span>
            </div>
          </div>

          <app-button variant="gradient" [fullWidth]="true" (click)="startVerification()">
            <div class="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/>
              </svg>
              <span>Iniciar Verificación</span>
            </div>
          </app-button>
        </div>
      }

      <!-- ==================== PASO 2: CÁMARA ==================== -->
      @if (currentStep === 'camera') {
        <div class="flex flex-col items-center text-center animate-fade-in">
          <h2 class="text-lg font-bold text-text-primary mb-1">Toma una selfie</h2>
          <p class="text-sm text-gray-500 mb-4">Coloca tu rostro dentro del marco y presiona capturar.</p>

          <!-- Error de cámara -->
          @if (cameraError) {
            <div class="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{{ cameraError }}</span>
            </div>
          }

          <!-- Video de la cámara -->
          @if (!cameraError) {
            <div class="relative w-full max-w-sm rounded-2xl overflow-hidden bg-black shadow-xl mb-5">
              <video #videoElement autoplay playsinline class="w-full block scale-x-[-1]"></video>

              <!-- Face guide overlay -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-44 h-56 border-[3px] border-dashed border-white/50 rounded-full animate-pulse-guide"></div>
              </div>

              <!-- Countdown overlay -->
              @if (countdown !== null) {
                <div class="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span class="text-7xl font-extrabold text-white drop-shadow-lg animate-count-pulse">{{ countdown }}</span>
                </div>
              }
            </div>

            <canvas #canvasElement class="hidden"></canvas>

            <div class="flex items-center justify-center gap-6 w-full">
              <app-button variant="outline" (click)="resetVerification()">Cancelar</app-button>
              <button
                class="w-[68px] h-[68px] rounded-full border-4 border-secondary-background bg-transparent flex items-center justify-center
                       cursor-pointer transition-all duration-300 hover:border-third-background disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="countdown !== null"
                (click)="captureWithCountdown()">
                <div class="w-[52px] h-[52px] rounded-full bg-linear-to-br from-secondary-background to-third-background
                            transition-transform duration-200 hover:scale-90"></div>
              </button>
              <div class="w-24"></div>
            </div>
          }
        </div>
      }

      <!-- ==================== PASO 3: PREVIEW ==================== -->
      @if (currentStep === 'preview') {
        <div class="flex flex-col items-center text-center animate-fade-in">
          <h2 class="text-lg font-bold text-text-primary mb-1">¿Se ve bien tu foto?</h2>
          <p class="text-sm text-gray-500 mb-4">Asegúrate de que tu rostro sea visible y esté bien iluminado.</p>

          <div class="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl mb-5">
            <img [src]="capturedImage" alt="Selfie capturada" class="w-full block" />
          </div>

          <div class="flex gap-3 w-full">
            <app-button variant="outline" [fullWidth]="true" (click)="retakePhoto()">
              <div class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                <span>Tomar otra</span>
              </div>
            </app-button>
            <app-button variant="gradient" [fullWidth]="true" (click)="submitForVerification()">
              <div class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Verificar identidad</span>
              </div>
            </app-button>
          </div>
        </div>
      }

      <!-- ==================== PASO 4: VERIFICANDO ==================== -->
      @if (currentStep === 'verifying') {
        <div class="flex flex-col items-center text-center animate-fade-in py-8">
          <!-- Scan animation -->
          <div class="relative w-28 h-28 mb-5">
            <div class="absolute inset-0 flex items-center justify-center text-secondary-background">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </div>
            <div class="absolute w-full h-[3px] bg-linear-to-r from-transparent via-secondary-background to-transparent rounded animate-scan-line"></div>
          </div>

          <h2 class="text-lg font-bold text-text-primary mb-2">Verificando tu identidad...</h2>
          <p class="text-sm text-gray-500 mb-4">Comparando tu selfie con el documento de identidad.</p>

          <!-- Loading dots -->
          <div class="flex gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary-background animate-dot-bounce [animation-delay:-0.32s]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-secondary-background animate-dot-bounce [animation-delay:-0.16s]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-secondary-background animate-dot-bounce"></span>
          </div>
        </div>
      }

      <!-- ==================== PASO 5: RESULTADO ==================== -->
      @if (currentStep === 'result') {
        <div class="flex flex-col items-center text-center animate-fade-in">

          <!-- Éxito -->
          @if (verificationResult?.faceMatch) {
            <div class="w-full p-6 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 mb-5">
              <div class="text-emerald-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-emerald-800 mb-2">¡Verificación exitosa!</h2>
              <p class="text-sm text-emerald-700 mb-4">{{ verificationResult!.message }}</p>

              <!-- Similarity bar -->
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div class="h-full bg-linear-to-r from-secondary-background to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                     [style.width.%]="verificationResult!.similarity"></div>
              </div>
              <span class="text-xs font-semibold text-emerald-600">
                Similitud: {{ verificationResult!.similarity | number:'1.1-1' }}%
              </span>
            </div>
          }

          <!-- Fallo -->
          @if (verificationResult && !verificationResult.faceMatch) {
            <div class="w-full p-6 rounded-2xl bg-linear-to-br from-red-50 to-rose-50 border border-red-200 mb-5">
              <div class="text-red-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-red-800 mb-2">Verificación no exitosa</h2>
              <p class="text-sm text-red-700">{{ verificationResult.message }}</p>
            </div>
          }

          <div class="flex gap-3 w-full">
            <app-button variant="outline" [fullWidth]="true" (click)="resetVerification()">
              Intentar de nuevo
            </app-button>
            @if (verificationResult?.faceMatch) {
              <app-button variant="gradient" [fullWidth]="true" (click)="onVerificationComplete.emit()">
                Continuar
              </app-button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class FaceVerificationComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @Output() onVerificationComplete = new EventEmitter<void>();

  // Estados del componente
  currentStep: 'intro' | 'camera' | 'preview' | 'verifying' | 'result' = 'intro';

  // Stream de la cámara
  private mediaStream: MediaStream | null = null;
  cameraError: string | null = null;

  // Selfie capturada
  capturedImage: string | null = null;
  capturedBlob: Blob | null = null;

  // Resultado de verificación
  verificationResult: FaceVerificationResult | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  // Contador
  countdown: number | null = null;
  private countdownInterval: any;

  constructor(private faceVerificationService: FaceVerificationService) {}

  ngOnDestroy(): void {
    this.stopCamera();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  /**
   * Inicia el proceso de verificación facial
   */
  startVerification(): void {
    this.currentStep = 'camera';
    this.cameraError = null;
    this.errorMessage = null;
    this.startCamera();
  }

  /**
   * Inicia la cámara del usuario
   */
  async startCamera(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.mediaStream;
        }
      }, 100);
    } catch (error: any) {
      console.error('Error al acceder a la cámara:', error);
      if (error.name === 'NotAllowedError') {
        this.cameraError = 'Debes permitir el acceso a la cámara para la verificación facial.';
      } else if (error.name === 'NotFoundError') {
        this.cameraError = 'No se encontró ninguna cámara en tu dispositivo.';
      } else {
        this.cameraError = 'Error al acceder a la cámara: ' + error.message;
      }
    }
  }

  /**
   * Captura con cuenta regresiva
   */
  captureWithCountdown(): void {
    this.countdown = 3;
    this.countdownInterval = setInterval(() => {
      if (this.countdown !== null) {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval);
          this.countdown = null;
          this.captureImage();
        }
      }
    }, 1000);
  }

  /**
   * Captura inmediatamente
   */
  captureImage(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);

      this.capturedImage = canvas.toDataURL('image/jpeg', 0.9);

      canvas.toBlob((blob) => {
        if (blob) {
          this.capturedBlob = blob;
          this.currentStep = 'preview';
          this.stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  }

  /**
   * Retomar la foto
   */
  retakePhoto(): void {
    this.capturedImage = null;
    this.capturedBlob = null;
    this.currentStep = 'camera';
    this.startCamera();
  }

  /**
   * Envía la selfie al backend
   */
  submitForVerification(): void {
    if (!this.capturedBlob) {
      this.errorMessage = 'No se ha capturado ninguna imagen.';
      return;
    }

    this.currentStep = 'verifying';
    this.isLoading = true;
    this.errorMessage = null;

    this.faceVerificationService.verifyFace(this.capturedBlob).subscribe({
      next: (result) => {
        this.verificationResult = result;
        this.isLoading = false;
        this.currentStep = 'result';
      },
      error: (error) => {
        console.error('Error en verificación facial:', error);
        this.isLoading = false;
        this.currentStep = 'result';
        this.verificationResult = {
          success: false,
          faceMatch: false,
          similarity: 0,
          estado: 'ERROR',
          message: error.message || 'Error de conexión con el servidor. Intenta nuevamente.',
          selfieUrl: ''
        };
      }
    });
  }

  /**
   * Reiniciar todo
   */
  resetVerification(): void {
    this.stopCamera();
    this.capturedImage = null;
    this.capturedBlob = null;
    this.verificationResult = null;
    this.errorMessage = null;
    this.currentStep = 'intro';
  }

  /**
   * Detiene la cámara
   */
  private stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }
}
