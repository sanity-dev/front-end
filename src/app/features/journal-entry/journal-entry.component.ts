import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService, Diario, MensajeDiarioDTO, NuevoMensajeDTO } from '../../core/services/journal.service';

@Component({
  selector: 'app-journal-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal-entry.component.html',
  styleUrl: './journal-entry.component.css'
})
export class JournalEntryComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  diarios: Diario[] = [];
  mensajes: MensajeDiarioDTO[] = [];
  
  activeDiarioId: string | null = null;
  nuevoMensaje: string = '';
  isSidebarOpen: boolean = false;
  isLoading: boolean = false;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.cargarDiarios();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  cargarDiarios() {
    this.journalService.getDiarios().subscribe({
      next: (data) => {
        this.diarios = data;
        // Si hay diarios y no hemos seleccionado ninguno, seleccionar el primero
        if (this.diarios.length > 0 && !this.activeDiarioId) {
          this.seleccionarDiario(this.diarios[0].id);
        }
      },
      error: (err) => console.error('Error al cargar diarios:', err)
    });
  }

  crearNuevoDiario() {
    const titulo = `Diario ${new Date().toLocaleDateString()}`;
    this.journalService.crearDiario(titulo).subscribe({
      next: (nuevoDiario) => {
        this.diarios.unshift(nuevoDiario); // agregar al inicio
        this.seleccionarDiario(nuevoDiario.id);
        if(window.innerWidth < 768) {
           this.isSidebarOpen = false;
        }
      },
      error: (err) => console.error('Error al crear diario:', err)
    });
  }

  seleccionarDiario(id: string) {
    this.activeDiarioId = id;
    this.isLoading = true;
    this.mensajes = []; // Clear current messages
    
    // Close sidebar on mobile when an item is selected
    if(window.innerWidth < 768) {
       this.isSidebarOpen = false;
    }

    this.journalService.getMensajes(id).subscribe({
      next: (data) => {
        this.mensajes = data;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
        this.isLoading = false;
      }
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.activeDiarioId) return;

    const msg: NuevoMensajeDTO = {
      contenido: this.nuevoMensaje,
      tipo: 'TEXTO' // Por defecto TEXTO
    };

    // Optimistic UI Update
    const optimisticMsg: MensajeDiarioDTO = {
      id: 'temp-' + Date.now(),
      contenido: this.nuevoMensaje,
      tipo: 'TEXTO',
      fechaEnvio: new Date().toISOString()
    };
    this.mensajes.push(optimisticMsg);
    
    const textoEnviado = this.nuevoMensaje;
    this.nuevoMensaje = ''; // Limpiar input

    this.journalService.agregarMensaje(this.activeDiarioId, msg).subscribe({
      next: (savedMsg) => {
        // Replace temp msg with real msg
        const index = this.mensajes.findIndex(m => m.id === optimisticMsg.id);
        if (index !== -1) {
          this.mensajes[index] = savedMsg;
        }
      },
      error: (err) => {
        console.error('Error enviando mensaje:', err);
        // Podríamos remover el optimisticMsg de aquí o mostrar error
      }
    });
  }

  triggerImageUpload() {
    // Si tienes un input type file oculto:
    const fileInput = document.getElementById('cameraInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.activeDiarioId) {
      // Create a local temporary URL for immediate preview
      const tempUrl = URL.createObjectURL(file);
        
      const optimisticMsg: MensajeDiarioDTO = {
        id: 'temp-img-' + Date.now(),
        contenido: tempUrl,
        tipo: 'IMAGEN',
        fechaEnvio: new Date().toISOString()
      };
      this.mensajes.push(optimisticMsg);

      this.journalService.subirImagenMensaje(this.activeDiarioId!, file).subscribe({
        next: (savedMsg) => {
          const index = this.mensajes.findIndex(m => m.id === optimisticMsg.id);
          if (index !== -1) {
            this.mensajes[index] = savedMsg;
            URL.revokeObjectURL(tempUrl); // Free memory
          }
        },
        error: (err) => {
          console.error('Error subiendo imagen:', err);
          URL.revokeObjectURL(tempUrl); // Free memory
          // We could remove the optimistic message on error:
          this.mensajes = this.mensajes.filter(m => m.id !== optimisticMsg.id);
        }
      });
    }
    event.target.value = null; // reset input
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
