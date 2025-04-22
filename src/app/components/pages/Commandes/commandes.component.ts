import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommandeService } from '../../../services/commande.service';
import { Commande } from '../../../models/commande.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css'],
})
export class CommandesComponent implements OnInit {
  // Footer style
  classname = 'ct-footer footer-dark';
  ftlogo = 'assets/img/logo-light.png';

  // Component state
  commandes: Commande[] = [];
  selectedCommande: Commande | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private modalService: NgbModal,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.loadCommandes(); // Fetch commands when the component is initialized
  }

  // Fetch orders from the API
  loadCommandes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.commandeService
      .getMyCommandes()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          console.log('✅ Commandes récupérées:', data);
          this.commandes = data; // Update the commandes array with the latest data
        },
        error: (error) => {
          console.error(
            '❌ Erreur lors de la récupération des commandes:',
            error
          );
          this.errorMessage = `Impossible de charger les commandes: ${error.message}`;
        },
      });
  }

  // Open modal with order details
  openDetails(content, commande: Commande): void {
    this.selectedCommande = commande;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // Cancel an order
  cancelOrder(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.commandeService.updateCommandeStatus(id, 'ANNULEE').subscribe({
        next: () => {
          // Update local data after successful cancellation
          const index = this.commandes.findIndex((c) => c.id === id);
          if (index !== -1) {
            this.commandes[index].status = 'ANNULEE';
          }
        },
        error: (error) => {
          console.error(
            "❌ Erreur lors de l'annulation de la commande:",
            error
          );
          alert(`Impossible d'annuler la commande: ${error.message}`);
        },
      });
    }
  }

  // Delete an order
  deleteCommande(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.cancelCommande(id).subscribe({
        next: () => {
          this.commandes = this.commandes.filter(
            (commande) => commande.id !== id
          );
          alert('Commande supprimée avec succès.');
        },
        error: (error) => {
          console.error(
            '❌ Erreur lors de la suppression de la commande:',
            error
          );
          alert(`Impossible de supprimer la commande: ${error.message}`);
        },
      });
    }
  }

  // Edit an order
  editCommande(commande: Commande): void {
    this.selectedCommande = { ...commande }; // Create a copy to avoid direct mutation
    this.modalService.open('editCommandeModal', { centered: true });
  }

  saveEditedCommande(modal: any): void {
    if (this.selectedCommande) {
      this.commandeService
        .updateCommande(this.selectedCommande.id, this.selectedCommande)
        .subscribe({
          next: (updatedCommande) => {
            const index = this.commandes.findIndex(
              (c) => c.id === updatedCommande.id
            );
            if (index !== -1) {
              this.commandes[index] = updatedCommande; // Update the local list
            }
            alert('Commande mise à jour avec succès.');
            modal.close();
          },
          error: (error) => {
            console.error(
              '❌ Erreur lors de la mise à jour de la commande:',
              error
            );
            alert(`Impossible de mettre à jour la commande: ${error.message}`);
          },
        });
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  // Get class for status badge
  getStatusBadgeClass(status: string): string {
    return this.commandeService.getStatusClass(status);
  }

  // Get friendly status label
  getStatusLabel(status: string): string {
    return this.commandeService.getStatusLabel(status);
  }

  // Check if status can be cancelled
  canBeCancelled(status: string): boolean {
    if (!status) return false;

    const upperStatus = status.toUpperCase();
    return upperStatus === 'EN_ATTENTE' || upperStatus === 'EN_PREPARATION';
  }

  // Orders can be reordered if they are delivered or cancelled
  canBeReordered(status: string): boolean {
    if (!status) return false;

    const upperStatus = status.toUpperCase();
    return upperStatus === 'LIVREE' || upperStatus === 'ANNULEE';
  }

  openEditModal(content: any, commande: Commande): void {
    this.selectedCommande = { ...commande }; // Create a copy to avoid direct mutation
    this.modalService.open(content, { centered: true });
  }
}
