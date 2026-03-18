import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EuphoriaService, MensajeResponse, HistorialItem, ConversationResponse } from '../../../core/services/euphoria.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

interface Mensaje {
  texto: string;
  esUsuario: boolean;
  timestamp: Date;
  emociones?: string[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('cameraInput') private cameraInput!: ElementRef;

  mensajes: Mensaje[] = [];
  mensajeActual: string = '';
  cargando: boolean = false;
  errorConexion: boolean = false;
  navOculto = false;
  private vpHandler?: () => void;
  private debeHacerScroll: boolean = false;

  // Sidebar e historial
  mostrarSidebar: boolean = false;
  historialConversaciones: ConversationResponse[] = [];
  cargandoHistorial: boolean = false;
  chatSoloLectura: boolean = false;
  userId: number | null = null;
  sesionActualId: string = '';

  constructor(
    private euphoriaService: EuphoriaService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // 1. Obtener UserID
    this.dashboardService.getUserInfo().subscribe(user => {
      if (user && user.idPersona) {
        this.userId = user.idPersona;
        this.cargarConversaciones();
      }
    });

    // 2. Iniciar siempre en una nueva sesión en blanco al entrar a la vista
    this.iniciarNuevaSesion(false);

    this.verificarConexion();
    this.detectarTeclado();

    this.euphoriaService.conexionEstado$.subscribe(estado => {
      this.errorConexion = !estado;
    });
  }

  ngAfterViewChecked(): void {
    if (this.debeHacerScroll) {
      this.scrollAlFinal();
      this.debeHacerScroll = false;
    }
  }

  verificarConexion(): void {
    this.euphoriaService.verificarConexion().subscribe({
      next: () => this.errorConexion = false,
      error: () => this.errorConexion = true
    });
  }

  cargarHistorial(sessionId?: string): void {
    this.euphoriaService.obtenerHistorial(sessionId).subscribe({
      next: (respuesta) => {
        if (respuesta.historial?.length > 0) {
          this.mensajes = respuesta.historial.map((item: HistorialItem) => ({
            texto: item.mensaje,
            esUsuario: item.rol === 'usuario',
            timestamp: new Date(item.timestamp)
          }));
          this.debeHacerScroll = true;
        } else {
          this.mensajes = [];
        }
      },
      error: () => {}
    });
  }

  cargarConversaciones(): void {
    if (!this.userId) return;
    this.cargandoHistorial = true;
    this.euphoriaService.obtenerConversacionesUsuario(this.userId).subscribe({
      next: (res) => {
        this.historialConversaciones = res.conversations;
        this.cargandoHistorial = false;
      },
      error: () => {
        this.cargandoHistorial = false;
      }
    });
  }

  iniciarNuevaSesion(cerrarSidebar: boolean = true): void {
    this.euphoriaService.nuevaSesion();
    this.sesionActualId = this.euphoriaService.obtenerSessionIdActual();
    this.mensajes = [];
    this.chatSoloLectura = false;
    if (cerrarSidebar) {
      this.mostrarSidebar = false;
    }
  }

  cargarSesion(sessionId: string): void {
    this.euphoriaService.cargarSesionAnterior(sessionId);
    this.sesionActualId = sessionId;

    const conv = this.historialConversaciones.find(c => c.session_id === sessionId);
    this.chatSoloLectura = conv ? !conv.is_active : false;

    this.cargarHistorial(sessionId);
    this.mostrarSidebar = false;
  }

  abrirSidebar(): void {
    this.mostrarSidebar = true;
    this.cargarConversaciones();
  }

  esSesionActual(sessionId: string): boolean {
    return this.sesionActualId === sessionId;
  }

  formatFechaCorta(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  async enviarMensaje(): Promise<void> {
    if (!this.mensajeActual.trim() || this.cargando || this.chatSoloLectura) return;

    this.mensajes.push({ texto: this.mensajeActual, esUsuario: true, timestamp: new Date() });
    const textoMensaje = this.mensajeActual;
    this.mensajeActual = '';
    this.cargando = true;
    this.debeHacerScroll = true;

    this.euphoriaService.enviarMensaje(textoMensaje).subscribe({
      next: (respuesta: MensajeResponse) => {
        this.mensajes.push({
          texto: respuesta.respuesta,
          esUsuario: false,
          timestamp: new Date(respuesta.timestamp),
          emociones: respuesta.emociones_detectadas
        });
        this.cargando = false;
        this.debeHacerScroll = true;

        if (this.mensajes.length <= 2 && this.userId) {
          this.cargarConversaciones();
        }
      },
      error: () => {
        this.mensajes.push({
          texto: 'Lo siento, hubo un problema. Verifica que el servidor esté corriendo.',
          esUsuario: false,
          timestamp: new Date()
        });
        this.cargando = false;
        this.errorConexion = true;
        this.debeHacerScroll = true;
      }
    });
  }

  triggerCamera(): void {
    this.cameraInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.userId) return;

    const file = input.files[0];
    
    // Validar tipo y tamaño si es necesario
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('La imagen es demasiado grande (máx 10MB)');
      return;
    }

    this.cargando = true;
    
    this.euphoriaService.uploadMoment(file, this.userId).subscribe({
      next: (res) => {
        if (res.success && res.url) {
          // Notificar al agente para que invoque su tool
          const mensajeAuto = `He capturado este momento para mi diario: ${res.url}`;
          
          // Enviamos como mensaje invisible o visible?
          // El usuario dice "cuando el usuario solicite guardar un mensaje o una foto... el agente invoca la tool"
          // Así que enviamos el mensaje al agente.
          this.mensajeActual = mensajeAuto;
          this.enviarMensaje();
        } else {
          console.error('Error en respuesta de subida:', res.message);
          this.cargando = false;
        }
      },
      error: (err) => {
        console.error('Error subiendo imagen:', err);
        this.cargando = false;
        alert('Error al capturar el momento: ' + err.message);
      }
    });
    
    // Limpiar input para permitir seleccionar la misma foto
    input.value = '';
  }

  limpiarConversacion(): void {
    if (!confirm('¿Iniciar nueva conversación? Este chat se guardará en tu historial.')) return;
    this.euphoriaService.limpiarMemoria().subscribe({
      next: () => this.iniciarNuevaSesion(false),
      error: () => alert('Hubo un problema cerrando la sesión')
    });
  }

  manejarEnter(evento: KeyboardEvent): void {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      this.enviarMensaje();
    }
  }

  private scrollAlFinal(): void {
    try {
      const el = this.chatContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }

  volverAtras(): void {}
  obtenerIniciales(): string { return 'Tú'; }

  ngOnDestroy(): void {
    if (this.vpHandler && window.visualViewport)
      window.visualViewport.removeEventListener('resize', this.vpHandler);
  }

  private detectarTeclado(): void {
    if (!window.visualViewport) return;
    const base = window.visualViewport.height;
    this.vpHandler = () => {
      this.navOculto = window.visualViewport!.height < base - 100;
    };
    window.visualViewport.addEventListener('resize', this.vpHandler);
  }
}