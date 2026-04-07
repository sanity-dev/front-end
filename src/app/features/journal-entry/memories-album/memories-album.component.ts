import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../../core/services/journal.service';

@Component({
  selector: 'app-memories-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memories-album.component.html',
  styleUrls: ['./memories-album.component.css']
})
export class MemoriesAlbumComponent implements OnInit {
  recuerdos: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  selectedRecuerdo: any | null = null;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.cargarRecuerdos();
  }

  cargarRecuerdos() {
    this.isLoading = true;
    this.error = null;
    this.journalService.getRecuerdos().subscribe({
      next: (data) => {
        this.recuerdos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando recuerdos', err);
        this.error = 'No pudimos cargar tus recuerdos en este momento.';
        this.isLoading = false;
      }
    });
  }

  openRecuerdo(recuerdo: any) {
    this.selectedRecuerdo = recuerdo;
  }

  closeRecuerdo() {
    this.selectedRecuerdo = null;
  }
}
