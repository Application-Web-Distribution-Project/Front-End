import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout, tap } from 'rxjs/operators';
import { Commande } from '../models/reclamation.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = '/commandes';
  private readonly TIMEOUT = 15000; // Timeout pour Docker
  private readonly RETRY_ATTEMPTS = 2;

  constructor(private http: HttpClient) { }

  // Récupération des headers avec le token JWT
  private getHttpOptions() {
    // Utiliser uniquement la clé JWT_TOKEN pour la cohérence avec les autres services
    const token = localStorage.getItem('JWT_TOKEN');
    
    // Afficher un avertissement si aucun token n'est trouvé
    if (!token) {
      console.warn('⚠️ Aucun token JWT trouvé dans le localStorage');
    } else {
      console.log('🔑 Token JWT récupéré avec succès');
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return { headers };
  }

  // Récupérer toutes les commandes
  getAllCommandes(): Observable<Commande[]> {
    console.log('🔄 Récupération des commandes...');
    
    // Récupération via getHttpOptions() qui utilise déjà la clé JWT_TOKEN
    return this.http.get<Commande[]>(this.apiUrl, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      tap(commandes => {
        console.log(`✅ ${commandes.length} commandes récupérées avec succès`);
      }),
      catchError(error => {
        console.error('❌ Erreur lors de la récupération des commandes:', error);
        if (error.status === 401) {
          console.warn('⚠️ Erreur d\'authentification, vérifiez votre token JWT');
        }
        return this.handleError(error);
      })
    );
  }

  // Récupérer les commandes de l'utilisateur connecté
  getMyCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/me`, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  // Récupérer une commande par son ID
  getCommandeById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
    );
  }

  // Création d'une commande
  createCommande(commande: any): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
    );
  }

  // Mise à jour d'une commande
  updateCommande(id: string, commande: any): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}`, commande, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
    );
  }

  // Mise à jour du statut d'une commande
  updateCommandeStatus(id: string, status: string): Observable<Commande> {
    return this.http.patch<Commande>(
      `${this.apiUrl}/${id}/status`, 
      { status }, 
      this.getHttpOptions()
    ).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
    );
  }

  // Annulation d'une commande
  cancelCommande(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
    );
  }

  // Obtenir la classe CSS pour le statut
  getStatusClass(status: string): string {
    if (!status) return 'badge bg-secondary';

    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'badge bg-warning';
      case 'EN_PREPARATION': return 'badge bg-info';
      case 'PRET': return 'badge bg-success';
      case 'LIVREE': return 'badge bg-primary';
      case 'ANNULEE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  // Obtenir le libellé pour le statut
  getStatusLabel(status: string): string {
    if (!status) return 'Inconnu';

    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return '⏳ En attente';
      case 'EN_PREPARATION': return '🍳 En préparation';
      case 'PRET': return '✅ Prêt';
      case 'LIVREE': return '🚚 Livrée';
      case 'ANNULEE': return '❌ Annulée';
      default: return status;
    }
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.status === 0) {
      errorMessage = 'Erreur de connexion au serveur';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      errorMessage = 'Commande non trouvée';
    } else {
      errorMessage = `Erreur ${error.status}: ${error.error?.message || error.message}`;
    }

    console.error('API Error:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url,
      error: error.error
    });

    return throwError(() => new Error(errorMessage));
  }
}
