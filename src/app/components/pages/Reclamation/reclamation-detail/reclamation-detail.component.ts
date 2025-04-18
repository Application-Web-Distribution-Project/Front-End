import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';

@Component({
  selector: 'app-reclamation-detail',
  templateUrl: './reclamation-detail.component.html',
  styleUrls: ['./reclamation-detail.component.css']
})
export class ReclamationDetailComponent implements OnInit {
  // Properties for footer styling
  classname = "footer-dark";
  ftlogo = "assets/img/logo.png";
  
  reclamation: Reclamation | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reclamationService.getReclamationById(+id).subscribe({
        next: (data) => {
          this.reclamation = data;
        },
        error: (error) => {
          console.error('Erreur API', error);
        }
      });
    }
  }

  updateStatus(newStatus: string): void {
    if (!this.reclamation) return;

    const comment = prompt('Ajouter un commentaire (optionnel):');
    
    this.reclamationService.updateReclamationStatus(this.reclamation.id, newStatus, comment || '')
      .subscribe({
        next: (updated) => {
          this.reclamation = updated;
          alert('Statut mis à jour avec succès!');
        },
        error: (error) => {
          console.error('Erreur mise à jour statut:', error);
          alert('Erreur lors de la mise à jour du statut');
        }
      });
  }

  // Nouvelle méthode pour obtenir la classe CSS du statut
  getStatusClass(status: string): string {
    if (!status) return '-secondary';
    
    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return '-warning';
      case 'EN_COURS': return '-info';
      case 'RESOLU': return '-success';
      case 'REJETEE': return '-danger';
      default: return '-secondary';
    }
  }

  // Adding missing method for status badge class
  getStatusBadgeClass(status: string): string {
    if (!status) return 'badge badge-secondary';
    
    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'badge badge-warning';
      case 'EN_COURS': return 'badge badge-info';
      case 'RESOLU': return 'badge badge-success';
      case 'REJETEE': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  }

  // Adding missing method for commande status class
  getCommandeStatusClass(status: string): string {
    if (!status) return 'badge badge-secondary';
    
    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'badge badge-warning';
      case 'EN_PREPARATION': return 'badge badge-info';
      case 'PRET': return 'badge badge-success';
      case 'LIVREE': return 'badge badge-primary';
      case 'ANNULEE': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  }

  // Nouvelle méthode pour supprimer une réclamation
  deleteReclamation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ? Cette action est irréversible.')) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          console.log('✅ Réclamation supprimée avec succès');
          alert('La réclamation a été supprimée avec succès.');
          this.router.navigate(['/reclamations']);
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression:', error);
          alert('La suppression a échoué. Veuillez réessayer.');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('❌ Erreur lors du formatage de la date:', e);
      return dateString;
    }
  }
}
