import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EuphoriaService, MensajeResponse, HistorialItem, ConversationResponse } from '../../../core/services/euphoria.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

interface Mensaje {
  texto: string;
  textoHtml?: SafeHtml;
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
  @ViewChild('textarea') private textarea!: ElementRef;

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
    private dashboardService: DashboardService,
    private sanitizer: DomSanitizer
  ) { }

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
          this.mensajes = respuesta.historial.map((item: HistorialItem) => {
            const mensaje: Mensaje = {
              texto: item.mensaje,
              textoHtml: this.procesarMarkdown(item.mensaje),
              esUsuario: item.rol === 'usuario',
              timestamp: new Date(this.normalizarTimestamp(item.timestamp))
            };
            return mensaje;
          });
          this.debeHacerScroll = true;
        } else {
          this.mensajes = [];
        }
      },
      error: () => { }
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

  enviarMensaje(): void {
    if (!this.mensajeActual.trim() || this.cargando || this.chatSoloLectura) return;

    this.mensajes.push({ 
      texto: this.mensajeActual, 
      textoHtml: this.procesarMarkdown(this.mensajeActual),
      esUsuario: true, 
      timestamp: new Date() 
    });
    const textoMensaje = this.mensajeActual;
    this.mensajeActual = '';
    this.resetearTextarea();
    this.cargando = true;
    this.debeHacerScroll = true;

    this.euphoriaService.enviarMensaje(textoMensaje).subscribe({
      next: (respuesta: MensajeResponse) => {
        this.mensajes.push({
          texto: respuesta.respuesta,
          textoHtml: this.procesarMarkdown(respuesta.respuesta),
          esUsuario: false,
          timestamp: new Date(this.normalizarTimestamp(respuesta.timestamp)),
          emociones: respuesta.emociones_detectadas
        });
        this.cargando = false;
        this.debeHacerScroll = true;

        if (this.mensajes.length <= 2 && this.userId) {
          this.cargarConversaciones();
        }
      },
      error: () => {
        const mensajeError = 'Lo siento, hubo un problema. Verifica que el servidor esté corriendo.';
        this.mensajes.push({
          texto: mensajeError,
          textoHtml: this.procesarMarkdown(mensajeError),
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
    } catch { }
  }

  volverAtras(): void { }
  obtenerIniciales(): string { return 'Tú'; }

  /**
   * Garantiza que el string de fecha del backend sea interpretado como UTC.
   * El backend manda timestamps sin 'Z' (ej: "2026-03-27T20:02:00"),
   * el navegador los parsea como hora local. Agregamos 'Z' para forzar UTC.
   */
  private normalizarTimestamp(ts: string): string {
    if (!ts) return ts;
    // Si ya tiene zona horaria (Z, +00:00, -05:00, etc.) no tocamos nada
    if (/[Zz]$/.test(ts) || /[+-]\d{2}:\d{2}$/.test(ts)) return ts;
    return ts + 'Z';
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  private resetearTextarea(): void {
    if (this.textarea && this.textarea.nativeElement) {
      const element = this.textarea.nativeElement;
      element.style.height = 'auto';
      element.style.height = '1.5rem';
    }
  }

  private procesarMarkdown(texto: string): SafeHtml {
    // Procesar **texto** a <strong>texto</strong>
    let html = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Procesar *texto* a <em>texto</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Procesar saltos de línea a <br>
    html = html.replace(/\n/g, '<br>');
    
    // Procesar listas con ** o *
    html = html.replace(/• (.*?)(?=<br>|$)/g, '<li style="margin-left: 1.25rem;">$1</li>');
    
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

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