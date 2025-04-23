import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

export enum Status {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS_DE_LIVRAISON = 'EN_COURS',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export interface Commande {
  id: number;
  reference: string;
  montant: number;
}

export interface Livraison {
  id: number;
  commandeId: number;
  commande?: Commande; // Ajout de la commande complète
  livreurId: number;
  adresseLivraison: string;
  status: Status;
  dateHeureCommande: string;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-livraison-list',
  templateUrl: './livraison-list.component.html',
  styleUrls: ['./livraison-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class LivraisonListComponent implements OnInit {
  
  livraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  selectedLivraison: Livraison | null = null;
  selectedStatus: Status | null = null;
  apiUrl = 'http://localhost:8083/livraisons';
  commandeApiUrl = 'http://localhost:8083/commandes'; // Ajout d'un URL pour l'API des commandes
  Status = Status;
  statusValues = Object.values(Status);
  currentLivreurId = 1; // À remplacer par l'ID réel du livreur connecté

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadLivraisons();
  }

  formatTime(date: any): string {
    return new Date(date).toLocaleTimeString();
  }

  printDetails(livraison: Livraison): void {
    console.log('Impression des détails de livraison', livraison);
    // Ajoutez votre logique d'impression
  }

  loadLivraisons(): void {
    this.http.get<Livraison[]>(this.apiUrl).subscribe(
      (data) => {
        // Filtrer les livraisons pour ne garder que celles du livreur courant ou non assignées
        this.livraisons = data.filter(livraison => 
          livraison.livreurId === this.currentLivreurId || 
          livraison.livreurId === 0
        );
        
        // Pour chaque livraison, on récupère les informations de la commande associée
        this.livraisons.forEach(livraison => {
          this.loadCommandeDetails(livraison);
        });
        
        this.filterLivraisons();
      },
      (error) => {
        console.error('Erreur lors du chargement des livraisons', error);
      }
    );
  }

  loadCommandeDetails(livraison: Livraison): void {
    this.http.get<Commande>(`${this.commandeApiUrl}/${livraison.commandeId}`).subscribe(
      (commande) => {
        livraison.commande = commande;
      },
      (error) => {
        console.error(`Erreur lors du chargement des détails de la commande ${livraison.commandeId}`, error);
      }
    );
  }

  toggleStatusFilter(status: Status): void {
    this.selectedStatus = this.selectedStatus === status ? null : status;
    this.filterLivraisons();
  }

  filterLivraisons(): void {
    if (this.selectedStatus) {
      this.filteredLivraisons = this.livraisons.filter(l => l.status === this.selectedStatus);
    } else {
      this.filteredLivraisons = [...this.livraisons];
    }
  }

  resetFilters(): void {
    this.selectedStatus = null;
    this.filterLivraisons();
  }

  viewDetails(livraison: Livraison): void {
    this.selectedLivraison = livraison;
  }

  hideDetails(): void {
    this.selectedLivraison = null;
  }

  assignToMe(livraison: Livraison): void {
    if (livraison.status !== Status.EN_ATTENTE) {
      alert('Seules les livraisons en attente peuvent être assignées');
      return;
    }

    this.http.put<Livraison>(`${this.apiUrl}/${livraison.id}/assign?livreurId=${this.currentLivreurId}`, {}).subscribe(
      (data) => {
        livraison.livreurId = data.livreurId;
        livraison.status = data.status;
        this.changeStatus(livraison, Status.EN_COURS_DE_LIVRAISON);
      },
      (error) => {
        console.error('Erreur lors de l\'assignation', error);
      }
    );
  }

  changeStatus(livraison: Livraison, newStatus: Status): void {
    this.http.put<Livraison>(`${this.apiUrl}/${livraison.id}/statut?statut=${newStatus}`, {}).subscribe(
      (data) => {
        livraison.status = data.status;
        this.filterLivraisons();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    );
  }

  getStatusColor(status: Status): string {
    switch(status) {
      case Status.EN_ATTENTE: return '#FF9F1C'; // Orange vif
      case Status.EN_COURS_DE_LIVRAISON: return '#7209B7'; // Violet
      case Status.LIVREE: return '#2EC4B6'; // Turquoise
      case Status.ANNULEE: return '#F94144'; // Rouge
      default: return '#8D99AE'; // Gris
    }
  }

  getStatusCount(status: Status): number {
    return this.livraisons.filter(l => l.status === status).length;
  }

  formatStatus(status: Status): string {
    return status.toString().replace(/_/g, ' ').toLowerCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(montant: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  }

  nextStatusOptions(currentStatus: Status): Status[] {
    switch(currentStatus) {
      case Status.EN_ATTENTE:
        return [Status.EN_COURS_DE_LIVRAISON, Status.ANNULEE];
      case Status.EN_COURS_DE_LIVRAISON:
        return [Status.LIVREE, Status.ANNULEE];
      default:
        return [];
    }
  }

  getStatusIcon(status: Status): string {
    switch(status) {
      case Status.EN_ATTENTE: return 'hourglass_empty';
      case Status.EN_COURS_DE_LIVRAISON: return 'directions_bike';
      case Status.LIVREE: return 'check_circle';
      case Status.ANNULEE: return 'cancel';
      default: return 'help';
    }
  }

  markAsDelivered(livraison: Livraison): void {
    if (livraison.status !== Status.EN_COURS_DE_LIVRAISON) {
      alert('Seules les livraisons en cours peuvent être marquées comme livrées');
      return;
    }
  
    if (confirm('Confirmez-vous que cette livraison a été complétée ?')) {
      this.changeStatus(livraison, Status.LIVREE);
    }
  }

  calculateEstimatedDeliveryTime(orderTime: string): string {
    if (!orderTime) return '';
    
    // Créer une date basée sur l'heure de commande
    const orderDate = new Date(orderTime);
    
    // Ajouter un délai estimé (par exemple, 45 minutes)
    const estimatedDate = new Date(orderDate);
    estimatedDate.setMinutes(orderDate.getMinutes() + 45);
    
    // Formater l'heure estimée
    return estimatedDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}