import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reclamation-stats',
  templateUrl: './reclamation-stats.component.html',
  styleUrls: ['./reclamation-stats.component.css']
})
export class ReclamationStatsComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  loading = false;
  error: string | null = null;
  chart: Chart | null = null;
  private statsData: { labels: string[], values: number[] } | null = null;

  constructor(
    public reclamationService: ReclamationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Delay the initial load to allow the view to initialize
    setTimeout(() => {
      this.loadStats();
    });
  }

  loadStats(): void {
    this.loading = true;
    this.cdr.detectChanges(); // Force view update

    this.reclamationService.getReclamationStats().subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data);
        
        if (!data || Object.keys(data).length === 0) {
          this.error = "Aucune donnée disponible";
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.statsData = {
          labels: Object.keys(data).map(key => this.reclamationService.getStatusLabel(key)),
          values: Object.values(data) as number[]
        };

        // Wait for next frame to ensure canvas is ready
        requestAnimationFrame(() => {
          if (this.chartCanvas && this.chartCanvas.nativeElement) {
            this.initChart();
          } else {
            console.error('Canvas still not available after animation frame');
          }
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats:', err);
        this.error = "Erreur lors du chargement des statistiques";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initChart(): void {
    try {
      if (!this.chartCanvas) {
        console.error('Canvas reference not found');
        return;
      }
  
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (!ctx || !this.statsData) {
        console.error('Canvas context or data not available');
        return;
      }
  
      // Force canvas dimensions
      canvas.style.width = '100%';
      canvas.style.height = '400px';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
  
      // Destroy existing chart if any
      if (this.chart) {
        this.chart.destroy();
      }
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.statsData.labels,
          datasets: [{
            label: 'Nombre de réclamations',
            data: this.statsData.values,
            backgroundColor: [
              'rgba(255, 193, 7, 0.5)',
              'rgba(23, 162, 184, 0.5)',
              'rgba(40, 167, 69, 0.5)',
              'rgba(220, 53, 69, 0.5)'
            ],
            borderColor: [
              'rgb(255, 193, 7)',
              'rgb(23, 162, 184)',
              'rgb(40, 167, 69)',
              'rgb(220, 53, 69)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error initializing chart:', error);
      this.error = "Erreur lors de l'initialisation du graphique";
      this.cdr.detectChanges();
    }
  }
}
