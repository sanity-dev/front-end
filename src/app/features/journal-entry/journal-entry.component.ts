import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderWithIconsComponent } from "../../layout/header/header-with-icons.component";

@Component({
    selector: 'app-journal-entry',
    standalone: true,
    imports: [CommonModule, HeaderWithIconsComponent],
    templateUrl: './journal-entry.component.html',
    styleUrl: './journal-entry.component.css'
})
export class JournalEntryComponent {
    emotions = ['Felicidad', 'Tristeza', 'Ansiedad'];

    history = [
        {
            date: '22 de Julio, 2024',
            text: 'Hoy me sentí más tranquilo después de...',
            icon: 'calendar'
        },
        {
            date: '15 de Julio, 2024',
            text: 'Tuve una conversación difícil pero...',
            icon: 'calendar'
        }
    ];
}
