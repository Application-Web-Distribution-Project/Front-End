import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { User } from '../models/user.model';

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
  userId: string;  // ID de l'utilisateur qui a passé la commande
  user?: User;     // Information de l'utilisateur
  dateCommande: string;
  status: string;
  menuIds: string[];
  paymentStatus?: string;
  paymentIntentId?: string;
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
  commandeApiUrl = 'http://localhost:8083/commandes';
  userApiUrl = 'http://localhost:8083/users';  // URL pour l'API des utilisateurs
  emailApiUrl = 'http://localhost:8083/emails'; // URL pour l'API d'envoi d'emails
  Status = Status;
  statusValues = Object.values(Status);
  currentLivreurId = 1; // À remplacer par l'ID réel du livreur connecté

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadLivraisons();
  }

  formatCoordinate(coord: number): string {
    return coord?.toFixed(5) ?? '';
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
        
        // Si la commande a un utilisateur associé, charger les détails de l'utilisateur
        if (commande.userId) {
          this.loadUserDetails(commande);
        }
      },
      (error) => {
        console.error(`Erreur lors du chargement des détails de la commande ${livraison.commandeId}`, error);
      }
    );
  }

  loadUserDetails(commande: Commande): void {
    this.http.get<User>(`${this.userApiUrl}/${commande.userId}`).subscribe(
      (user) => {
        commande.user = user;
      },
      (error) => {
        console.error(`Erreur lors du chargement des détails de l'utilisateur ${commande.userId}`, error);
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

  markAsDelivered(livraison: Livraison): void {
    if (livraison.status !== Status.EN_COURS_DE_LIVRAISON) {
      alert('Seules les livraisons en cours peuvent être marquées comme livrées');
      return;
    }
  
    if (confirm('Confirmez-vous que cette livraison a été complétée ?')) {
      // Mettre à jour le statut de la livraison
      this.changeStatus(livraison, Status.LIVREE);
      
      // Envoyer un email de confirmation à l'utilisateur
      if (livraison.commande && livraison.commande.user) {
        this.sendDeliveryConfirmationEmail(livraison);
      } else if (livraison.commande && livraison.commande.userId) {
        // Si l'utilisateur n'est pas encore chargé, nous le récupérons d'abord
        this.http.get<User>(`${this.userApiUrl}/${livraison.commande.userId}`).subscribe(
          (user) => {
            if (livraison.commande) {
              livraison.commande.user = user;
              this.sendDeliveryConfirmationEmail(livraison);
            }
          },
          (error) => {
            console.error(`Erreur lors du chargement de l'utilisateur pour envoyer l'email`, error);
          }
        );
      } else {
        console.warn('Impossible d\'envoyer un email: Aucune information utilisateur disponible');
      }
    }
  }

  sendDeliveryConfirmationEmail(livraison: Livraison): void {
    // Assurez-vous que les informations nécessaires sont disponibles
    if (!livraison.commande || !livraison.commande.user) {
      console.error('Informations manquantes pour envoyer l\'email');
      return;
    }

    const user = livraison.commande.user;
    const commandeRef = livraison.commande.reference;
    const emailData = {
      to: user.email,
      subject: `Votre commande #${commandeRef} a été livrée`,
      content: `
        <h2>Confirmation de livraison</h2>
        <p>Bonjour ${user.nom},</p>
        <p>Nous vous confirmons que votre commande #${commandeRef} a bien été livrée.</p>
        <p>Montant total : ${this.formatPrice(livraison.commande.montant)}</p>
        <p>Date de livraison : ${new Date().toLocaleString('fr-FR')}</p>
        <p>Merci de votre confiance et à bientôt !</p>
      `
    };

    this.http.post(`${this.emailApiUrl}/send`, emailData).subscribe(
      () => {
        console.log(`Email de confirmation envoyé à ${user.email}`);
      },
      (error) => {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation', error);
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