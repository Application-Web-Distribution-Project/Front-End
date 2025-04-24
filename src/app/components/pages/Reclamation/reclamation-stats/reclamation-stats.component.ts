import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-reclamation-stats',
  templateUrl: './reclamation-stats.component.html',
  styleUrls: ['./reclamation-stats.component.css']
})
export class ReclamationStatsComponent implements AfterViewInit {
  // Properties for footer styling
  classname = "footer-dark";
  ftlogo = "assets/img/logo.png";
  
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

  // Changer de private à public
  public loadStats(): void {
    this.loading = true;
    this.cdr.detectChanges();

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

  /**
   * Exporte les statistiques des réclamations au format PDF
   * Crée un document PDF professionnel avec un tableau des données, 
   * le graphique et des informations complémentaires
   */
  exportToPDF(): void {
    if (!this.statsData || !this.chartCanvas) {
      alert('Aucune donnée disponible pour l\'exportation');
      return;
    }

    // Création d'un nouveau document PDF au format A4
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    let currentY = 20; // Position verticale initiale

    // Ajouter un en-tête au document
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    pdf.text('Rapport des Réclamations', pageWidth / 2, currentY, { align: 'center' });
    
    // Ajouter la date du rapport
    currentY += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    pdf.text(`Généré le ${dateStr}`, pageWidth / 2, currentY, { align: 'center' });

    // Ajouter une description
    currentY += 15;
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Ce rapport présente la répartition des réclamations par statut.', 20, currentY);

    // Ajouter un tableau des statistiques
    currentY += 15;
    const tableData = this.statsData.labels.map((label, index) => {
      return [label, this.statsData!.values[index].toString()];
    });

    autoTable(pdf, {
      startY: currentY,
      head: [['Statut', 'Nombre de réclamations']],
      body: tableData,
      headStyles: {
        fillColor: [255, 126, 0], // Couleur orange pour l'en-tête
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      styles: {
        fontSize: 11,
        cellPadding: 5
      }
    });

    // Mettre à jour la position Y après le tableau
    currentY = (pdf as any).lastAutoTable.finalY + 20;

    // Ajouter le graphique
    const canvas = this.chartCanvas.nativeElement;
    const chartImage = canvas.toDataURL('image/png', 1.0);
    
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Graphique de répartition', pageWidth / 2, currentY, { align: 'center' });
    
    // Ajouter l'image du graphique
    currentY += 10;
    const imgWidth = 160; // Largeur de l'image dans le PDF
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(chartImage, 'PNG', (pageWidth - imgWidth) / 2, currentY, imgWidth, imgHeight);

    // Ajouter un pied de page
    // Utiliser une alternative à getNumberOfPages() pour éviter l'erreur TypeScript
    const pageCount = pdf.internal.pages.length - 1; // -1 car l'index commence à 0
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} sur ${pageCount}`, pageWidth - 20, pdf.internal.pageSize.height - 10, { align: 'right' });
      pdf.text('Restaurant - Système de gestion des réclamations', 20, pdf.internal.pageSize.height - 10);
    }

    // Enregistrer le PDF
    pdf.save('rapport_reclamations.pdf');
  }

  private initChart(): void {
    try {
      if (!this.chartCanvas || !this.statsData) {
        return;
      }

      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return;
      }

      if (this.chart) {
        this.chart.destroy();
      }

      // Define default colors for different status types
      const statusColors = {
        'EN_ATTENTE': '#FFA500',  // Orange
        'EN_COURS': '#3498DB',    // Blue
        'RESOLUE': '#2ECC71',     // Green
        'REJETEE': '#E74C3C'      // Red
      };

      // Create background colors with transparency
      const backgroundColors = this.statsData.labels.map(label => {
        const baseColor = statusColors[this.getStatusKeyFromLabel(label)] || '#999999';
        return this.addAlpha(baseColor, 0.5);
      });

      // Create border colors (solid)
      const borderColors = this.statsData.labels.map(label => 
        statusColors[this.getStatusKeyFromLabel(label)] || '#999999'
      );

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.statsData.labels,
          datasets: [{
            label: 'Nombre de réclamations',
            data: this.statsData.values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw as number;
                  return `${value} réclamation${value > 1 ? 's' : ''}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error initializing chart:', error);
      this.error = "Erreur lors de l'initialisation du graphique";
    }
  }

  // Helper function to get status key from label
  private getStatusKeyFromLabel(label: string): string {
    switch (label.toUpperCase()) {
      case 'EN ATTENTE':
        return 'EN_ATTENTE';
      case 'EN COURS':
        return 'EN_COURS';
      case 'RÉSOLUE':
      case 'RESOLUE':
        return 'RESOLUE';
      case 'REJETÉE':
      case 'REJETEE':
        return 'REJETEE';
      default:
        return '';
    }
  }

  // Helper function to add alpha channel to color
  private addAlpha(color: string, alpha: number): string {
    // If color is in hex format, convert it to RGB
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }
}
