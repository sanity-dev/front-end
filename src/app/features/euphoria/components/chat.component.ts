import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EuphoriaService, MensajeResponse, HistorialItem } from '../../../core/services/euphoria.service';
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
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  mensajes: Mensaje[] = [];
  mensajeActual: string = '';
  cargando: boolean = false;
  errorConexion: boolean = false;
  navOculto = false;
  private vpHandler?: () => void;
  private debeHacerScroll: boolean = false;

  constructor(private euphoriaService: EuphoriaService) { }

  ngOnInit(): void {
    this.verificarConexion();
    this.cargarHistorial();
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
      next:  () => this.errorConexion = false,
      error: () => this.errorConexion = true
    });
  }

  cargarHistorial(): void {
    this.euphoriaService.obtenerHistorial().subscribe({
      next: (respuesta) => {
        if (respuesta.historial && respuesta.historial.length > 0) {
          console.log(`📜 Cargando ${respuesta.total_mensajes} mensajes`);

          this.mensajes = respuesta.historial.map((item: HistorialItem) => ({
            texto: item.mensaje,
            esUsuario: item.rol === 'usuario',
            timestamp: new Date(item.timestamp)
          }));
          this.debeHacerScroll = true;
        }
      },
      error: () => {}
    });
  }

  enviarMensaje(): void {
    if (!this.mensajeActual.trim() || this.cargando) {
      return;
    }

    const mensajeUsuario: Mensaje = {
      texto: this.mensajeActual,
      esUsuario: true,
      timestamp: new Date()
    };

    this.mensajes.push(mensajeUsuario);

    const textoMensaje = this.mensajeActual;
    this.mensajeActual = '';
    this.cargando = true;
    this.debeHacerScroll = true;

    console.log('📤 Enviando mensaje...');

    this.euphoriaService.enviarMensaje(textoMensaje).subscribe({
      next: (respuesta: MensajeResponse) => {
        console.log('✅ Respuesta recibida');

        const mensajeEuphoria: Mensaje = {
          texto: respuesta.respuesta,
          esUsuario: false,
          timestamp: new Date(respuesta.timestamp),
          emociones: respuesta.emociones_detectadas
        };

        this.mensajes.push(mensajeEuphoria);
        this.cargando = false;
        this.debeHacerScroll = true;
      },
      error: (error) => {
        console.error('❌ Error:', error);

        const mensajeError: Mensaje = {
          texto: 'Lo siento, hubo un problema. Verifica que el servidor esté corriendo en http://localhost:8000',
          esUsuario: false,
          timestamp: new Date()
        };

        this.mensajes.push(mensajeError);
        this.cargando = false;
        this.errorConexion = true;
        this.debeHacerScroll = true;
      }
    });
  }

  limpiarConversacion(): void {
    const confirmacion = confirm(
      '¿Iniciar nueva conversación? Se perderá el historial actual.'
    );

    if (confirmacion) {
      console.log('🔄 Limpiando...');

      this.euphoriaService.limpiarMemoria().subscribe({
        next: () => {
          console.log('✅ Conversación limpiada');
          this.mensajes = [];
        },
        error: (error) => {
          console.error('❌ Error:', error);
          alert('No se pudo limpiar la conversación');
        }
      });
    }
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

  volverAtras(): void {
    console.log('Volver atrás');
  }

  obtenerIniciales(): string {
    return 'Tú';
  }
}