import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiarioService, Diario } from '../../core/services/diario.service';

@Component({
    selector: 'app-journal-entry',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './journal-entry.component.html',
    styleUrl: './journal-entry.component.css'
})
export class JournalEntryComponent implements OnInit {
    emotions = ['Felicidad', 'Tristeza', 'Ansiedad'];
    diarios: Diario[] = [];
    nuevoContenido: string = '';

    constructor(private diarioService: DiarioService) { }

    ngOnInit(): void {
        this.cargarDiarios();
    }

    cargarDiarios() {
        this.diarioService.obtenerDiarios().subscribe({
            next: (data) => {
                this.diarios = data;
            },
            error: (err) => {
                console.error('Error al cargar diarios:', err);
            }
        });
    }

    guardar() {
        if (!this.nuevoContenido.trim()) return;

        // Título automático (ej: "Entrada del 25/07/2024")
        const titulo = `Entrada del ${new Date().toLocaleDateString()}`;

        this.diarioService.crearDiario({
            titulo: titulo,
            contenido: this.nuevoContenido
        }).subscribe({
            next: (nuevoDiario) => {
                console.log('Diario creado:', nuevoDiario);
                this.nuevoContenido = ''; // Limpiar textarea
                this.cargarDiarios(); // Recargar la lista
            },
            error: (err) => {
                console.error('Error al guardar diario:', err);
            }
        });
    }
}
