import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
    @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('frequencyChart') frequencyChartRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('intensityChart') intensityChartRef!: ElementRef<HTMLCanvasElement>;

    selectedFilter: string = 'Semana';
    filters = ['Semana', 'Mes', 'Año'];

    // Chart instances
    private trendChart?: Chart;
    private frequencyChart?: Chart;
    private intensityChart?: Chart;

    ngOnInit() {
        // Initialize after view is ready
        setTimeout(() => this.initCharts(), 100);
    }

    selectFilter(filter: string) {
        this.selectedFilter = filter;
        // Here you would reload chart data based on filter
    }

    private initCharts() {
        this.createTrendChart();
        this.createFrequencyChart();
        this.createIntensityChart();
    }

    private createTrendChart() {
        const ctx = this.trendChartRef.nativeElement.getContext('2d');
        if (!ctx) return;

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    data: [30, 45, 35, 50, 40, 65, 45],
                    borderColor: '#ffffff',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1e293b',
                        bodyColor: '#1e293b',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: '#ffffff', font: { size: 10 } }
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                }
            }
        });
    }

    private createFrequencyChart() {
        const ctx = this.frequencyChartRef.nativeElement.getContext('2d');
        if (!ctx) return;

        this.frequencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Felicidad', 'Tristeza', 'Enojo', 'Ansiedad'],
                datasets: [{
                    data: [55, 45, 35, 50],
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: '#ffffff', font: { size: 10 } }
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                }
            }
        });
    }

    private createIntensityChart() {
        const ctx = this.intensityChartRef.nativeElement.getContext('2d');
        if (!ctx) return;

        this.intensityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Baja', 'Media', 'Alta'],
                datasets: [{
                    data: [85, 45, 25],
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    barThickness: 30
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        display: false,
                        grid: { display: false }
                    },
                    y: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: '#ffffff', font: { size: 11 } }
                    }
                }
            }
        });
    }

    ngOnDestroy() {
        // Clean up charts
        this.trendChart?.destroy();
        this.frequencyChart?.destroy();
        this.intensityChart?.destroy();
    }
}
