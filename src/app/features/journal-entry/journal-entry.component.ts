import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderWithIconsComponent } from "../../layout/header/header-with-icons.component";
import { BottomNavComponent } from "../../shared/components/bottom-nav/bottom-nav.component";
import { DiarioService, BitacoraEmocional } from '../../core/services/diario.service';

@Component({
    selector: 'app-journal-entry',
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderWithIconsComponent, BottomNavComponent],
    templateUrl: './journal-entry.component.html',
    styleUrl: './journal-entry.component.css'
})
export class JournalEntryComponent implements OnInit {
    emotions = ['Felicidad', 'Tristeza', 'Ansiedad']; // Simulated emotions from ML service

    currentText = '';
    isSaving = false;
    saveMessage = '';

    // We assume the user has a main diary when they open this page
    diarioId: string = '123e4567-e89b-12d3-a456-426614174000'; // Replace with a real dynamic ID later if available

    history: any[] = [];

    constructor(private diarioService: DiarioService) { }

    ngOnInit() {
        // En una app real, aquí obtendríamos el diario ID del usuario actual primero
        // this.diarioService.obtenerMisDiarios().subscribe(...)
        // Por ahora simularemos la carga del historial
        this.loadHistory();
    }

    loadHistory() {
        this.diarioService.obtenerHistorial(this.diarioId).subscribe({
            next: (data: BitacoraEmocional[]) => {
                this.history = data.map(b => ({
                    date: new Date(b.fechaRegistro).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
                    text: b.notas || b.emocionPrincipal,
                    icon: 'calendar'
                }));
            },
            error: (err) => {
                console.error("No se pudo cargar historial", err);
                // Fallback a datos estáticos si falla
                this.history = [
                    { date: 'Hoy', text: 'Esperando integración completa...', icon: 'calendar' }
                ];
            }
        });
    }

    guardarEntrada() {
        if (!this.currentText.trim()) return;

        this.isSaving = true;
        this.saveMessage = '';

        const nuevaEntrada = {
            emocionPrincipal: this.emotions[0], // Simulamos que la NLP detectó Felicidad
            nivelIntensidad: 5,
            notas: this.currentText
        };

        this.diarioService.guardarEntrada(this.diarioId, nuevaEntrada).subscribe({
            next: (saved: BitacoraEmocional) => {
                this.isSaving = false;
                this.currentText = ''; // Limpiar el input
                this.saveMessage = '¡Entrada guardada con éxito!';
                this.loadHistory(); // Recargar la lista
                setTimeout(() => this.saveMessage = '', 3000);
            },
            error: (err) => {
                this.isSaving = false;
                console.error("Error al guardar:", err);
                this.saveMessage = 'Aún no conectado al backend real. (Simulación completada)';
                // Fake save feedback for now
                this.history.unshift({
                    date: 'Ahora',
                    text: this.currentText,
                    icon: 'calendar'
                });
                this.currentText = '';
                setTimeout(() => this.saveMessage = '', 3000);
            }
        });
    }
}
