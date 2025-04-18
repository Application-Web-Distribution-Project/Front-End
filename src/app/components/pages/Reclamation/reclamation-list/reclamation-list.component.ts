import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EMPTY, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit, OnDestroy {
  reclamations: Reclamation[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  modalContent: Reclamation | null = null;
  
  // Propriétés pour la recherche
  searchQuery: string = '';
  private searchTerms = new Subject<string>();
  private searchSubscription: Subscription | null = null;
  allReclamations: Reclamation[] = []; // Stocke toutes les réclamations pour la recherche côté client

  // Properties for footer styling
  classname = "footer-dark";
  ftlogo = "assets/img/logo.png";

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
    
    // Configuration de la recherche avec debounce pour éviter trop d'appels API
    this.searchSubscription = this.searchTerms.pipe(
      debounceTime(300), // Attend 300ms après chaque frappe
      distinctUntilChanged(), // Ignore si le terme de recherche est le même
      switchMap(term => {
        this.isLoading = true;
        return this.reclamationService.searchReclamations(term);
      }),
      catchError(error => {
        this.errorMessage = 'Erreur lors de la recherche: ' + error.message;
        this.isLoading = false;
        return EMPTY;
      })
    ).subscribe(results => {
      this.reclamations = results;
      this.isLoading = false;
    });
  }
  
  ngOnDestroy(): void {
    // Nettoyage des abonnements pour éviter les fuites de mémoire
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Méthode appelée à chaque frappe dans le champ de recherche
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // ✅ Charger la liste des réclamations
  loadReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.allReclamations = data; // Sauvegarde de toutes les réclamations
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

    // D'abord, récupérer les détails complets de la réclamation
    this.reclamationService.getReclamationById(reclamation.id).subscribe({
      next: (fullDetails) => {
        console.log('✅ Détails complets récupérés:', fullDetails);
        this.modalContent = fullDetails; 
        this.modalService.open(content, { size: 'lg' });
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des détails:', error);
        // En cas d'erreur, utiliser les données de base disponibles
        this.modalContent = reclamation;
        this.modalService.open(content, { size: 'lg' });
      }
    });
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
    
    console.log(`Updating status: ID=${id}, newStatus=${newStatus}, comment=${comment}`);
    
    this.reclamationService.updateReclamationStatus(id, newStatus, comment || '')
      .subscribe({
        next: (updated) => {
          console.log('Status updated successfully:', updated);
          alert('Statut mis à jour avec succès!');
          this.loadReclamations();
        },
        error: (error) => {
          console.error('Status update error:', error);
          alert('Erreur lors de la mise à jour du statut: ' + error.message);
        }
      });
  }

  // Nouvelle méthode pour obtenir la classe CSS de l'indicateur de statut
  getStatusClass(status: string): string {
    if (!status) return '';
    
    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'status-en-attente';
      case 'EN_COURS': return 'status-en-cours';
      case 'RESOLU': return 'status-resolu';
      case 'REJETEE': return 'status-rejete';
      default: return '';
    }
  }

  // Méthode pour récupérer la classe CSS appropriée pour le statut de la commande
  getCommandeStatusClass(status: string | undefined): string {
    if (!status) return 'secondary';
    
    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'warning';
      case 'EN_COURS': return 'info';
      case 'LIVREE': return 'success';
      case 'ANNULEE': return 'danger';
      default: return 'secondary';
    }
  }
}
