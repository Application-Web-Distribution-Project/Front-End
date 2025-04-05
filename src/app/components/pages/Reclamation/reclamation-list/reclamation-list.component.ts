import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router'; // ✅ Ajout du Router pour la navigation
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  modalContent: Reclamation | null = null; //

  settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    prevArrow: '.slider-prev',
    nextArrow: '.slider-next'
  };

  constructor(
    private reclamationService: ReclamationService,
    private modalService: NgbModal,
    private router: Router //
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  // ✅ Charger la liste des réclamations
  loadReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des réclamations :', error);
        this.errorMessage = 'Impossible de charger les réclamations. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  // ✅ Supprimer une réclamation avec confirmation
  deleteReclamation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          console.log('✅ Réclamation supprimée avec succès');
          this.reclamations = this.reclamations.filter(r => r.id !== id);
        },
        error: (error) => {
          console.error('Delete failed:', error);
          alert('La suppression a échoué. Veuillez réessayer.');
        }
      });
    }
  }

  // ✅ Afficher les détails d'une réclamation dans le modal
  viewReclamation(reclamation: Reclamation, content: any): void {
    if (!reclamation) {
      console.error('Réclamation invalide');
      return;
    }
    this.modalContent = reclamation;
    this.modalService.open(content, { size: 'lg' });
  }

  // ✅ Ajouter une nouvelle réclamation (redirection)
  addReclamation(): void {
    this.router.navigate(['/reclamations/new']);
  }

  // Add utility methods
  getStatusBadgeClass(status: string): string {
    return this.reclamationService.getStatusBadgeClass(status);
  }

  getStatusLabel(status: string): string {
    return this.reclamationService.getStatusLabel(status);
  }

  formatDate(date: string): string {
    return this.reclamationService.formatDate(date);
  }

  updateStatus(id: number, newStatus: string): void {
    const comment = prompt('Ajouter un commentaire (optionnel):');
    
    this.reclamationService.updateReclamationStatus(id, newStatus, comment || '')
      .subscribe({
        next: () => {
          alert('Statut mis à jour avec succès!');
          this.loadReclamations(); // Recharge la liste
        },
        error: (error) => {
          console.error('Erreur mise à jour statut:', error);
          alert('Erreur lors de la mise à jour du statut');
        }
      });
  }
}
