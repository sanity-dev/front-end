import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PaymentMethod {
    type: 'visa' | 'mastercard' | 'pse';
    last4: string;
    label: string;
}

interface Transaction {
    descripcion: string;
    fecha: string;
    monto: number;
    estado: 'pagado' | 'pendiente' | 'fallido';
}

interface SubscriptionInfo {
    plan: 'gratuito' | 'premium_mensual' | 'premium_anual';
    fechaRenovacion: string | null;
}

@Component({
    selector: 'app-gestionar-suscripcion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './manage-subscription.component.html',
    styles: []
})
export class GestionarSuscripcionComponent implements OnInit {
    private router = inject(Router);
    private http = inject(HttpClient);

    isLoading = false;

    subscription: SubscriptionInfo = {
        plan: 'gratuito',
        fechaRenovacion: null
    };

    paymentMethod: PaymentMethod | null = {
        type: 'visa',
        last4: '1234',
        label: 'Tarjeta de crédito'
    };

    transactions: Transaction[] = [
        { descripcion: 'Suscripción Premium', fecha: '15 de mayo de 2024', monto: 9.99, estado: 'pagado' },
        { descripcion: 'Suscripción Premium', fecha: '15 de abril de 2024', monto: 9.99, estado: 'pagado' },
        { descripcion: 'Suscripción Premium', fecha: '15 de marzo de 2024', monto: 9.99, estado: 'pagado' },
    ];

    private apiUrl = 'http://localhost:8080/api/terapeutas';

    get planLabel(): string {
        const labels: Record<string, string> = {
            gratuito: 'Plan Básico',
            premium_mensual: 'Premium Mensual',
            premium_anual: 'Premium Anual'
        };
        return labels[this.subscription.plan];
    }

    ngOnInit(): void {
        this.loadSubscription();
        this.loadTransactions();
    }

    loadSubscription(): void {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.idPersona;

            this.http.get<SubscriptionInfo>(`${this.apiUrl}/${userId}/suscripcion`).subscribe({
                next: (data) => this.subscription = data,
                error: (err) => console.error('Error al cargar suscripción:', err)
            });
        } catch (e) {
            console.error('Error al procesar token:', e);
        }
    }

    loadTransactions(): void {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.idPersona;
            this.isLoading = true;

            this.http.get<Transaction[]>(`${this.apiUrl}/${userId}/transacciones`).subscribe({
                next: (data) => {
                    this.transactions = data;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error al cargar transacciones:', err);
                    this.isLoading = false;
                }
            });
        } catch (e) {
            this.isLoading = false;
            console.error('Error al procesar token:', e);
        }
    }

    upgradePlan(plan: 'premium_mensual' | 'premium_anual'): void {
        this.router.navigate(['/users/therapist/settings/suscripcion/checkout'], {
            queryParams: { plan }
        });
    }

    cancelPlan(): void {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.idPersona;

            this.http.post(`${this.apiUrl}/${userId}/suscripcion/cancelar`, {}).subscribe({
                next: () => this.subscription = { plan: 'gratuito', fechaRenovacion: null },
                error: (err) => console.error('Error al cancelar suscripción:', err)
            });
        } catch (e) {
            console.error('Error al procesar token:', e);
        }
    }

    editPaymentMethod(): void {
        this.router.navigate(['/users/therapist/settings/suscripcion/metodo-pago']);
    }

    goBack(): void {
        this.router.navigate(['/users/therapist/settings']);
    }
}