import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, TimeoutError, of } from 'rxjs';
import { catchError, retry, timeout, map, debounceTime } from 'rxjs/operators';
import { Reclamation } from '../models/reclamation.model';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl: string;
  private readonly TIMEOUT = 15000; // Increased timeout for Docker network
  private readonly RETRY_ATTEMPTS = 3; // Increased retries

  constructor(private http: HttpClient) {
    // Use relative URL to work with proxy
    this.apiUrl = '/reclamations';
  }

  // Méthode pour obtenir les headers avec le token JWT
  private getHttpOptions() {
    // Récupérer le token depuis localStorage avec la bonne clé JWT_TOKEN
    const token = localStorage.getItem('JWT_TOKEN');
    
    // Créer les headers avec le token si disponible
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });

    return { headers };
  }

  getAllReclamations(): Observable<Reclamation[]> {
    console.log('🔄 Fetching reclamations from:', this.apiUrl);
    return this.http.get<Reclamation[]>(this.apiUrl, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError.bind(this))
    );
  }

  searchReclamations(query: string): Observable<Reclamation[]> {
    console.log('🔍 Searching reclamations with query:', query);
    if (!query.trim()) {
      // Si la requête est vide, retourner toutes les réclamations
      return this.getAllReclamations();
    }
    
    // Créer les paramètres de recherche
    const params = new HttpParams().set('query', query);
    
    // Solution alternative est de rechercher côté client:
    return this.getAllReclamations().pipe(
      map(reclamations => {
        const lowercaseQuery = query.toLowerCase();
        return reclamations.filter(reclamation => 
          (reclamation.description?.toLowerCase().includes(lowercaseQuery)) ||
          (reclamation.status?.toLowerCase().includes(lowercaseQuery))
        );
      })
    );
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  createReclamation(reclamation: Reclamation): Observable<Reclamation> {
    console.log('📝 Creating reclamation:', reclamation);
    
    const payload = {
      ...reclamation,
      dateCreation: new Date().toISOString()
    };

    return this.http.post<Reclamation>(this.apiUrl, payload, this.getHttpOptions()).pipe(
      timeout(this.TIMEOUT),
      catchError(error => {
        console.error('Creation error details:', error);
        return this.handleError(error);
      })
    );
  }

  deleteReclamation(id: number): Observable<void> {
    console.log(`🗑️ Attempting to delete reclamation ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHttpOptions().headers,
      responseType: 'text'
    }).pipe(
      map(() => {
        console.log('✅ Delete successful');
        return;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Delete error:', error);
        return throwError(() => new Error('Failed to delete reclamation'));
      })
    );
  }

  updateReclamationStatus(id: number, newStatus: string ): Observable<Reclamation> {
    const url = `${this.apiUrl}/${id}/status`;
    const params = new HttpParams()
      .set('newStatus', newStatus)
      .set('dateResolution', new Date().toISOString());

    return this.http.put<Reclamation>(url, null, { 
      headers: this.getHttpOptions().headers,
      params: params
    }).pipe(
      timeout(this.TIMEOUT),
      catchError(error => {
        console.error('Status update error:', error);
        return this.handleError(error);
      })
    );
  }

  getReclamationStats(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/stats`).pipe(
      map(stats => {
        // Assurer que tous les statuts sont présents avec au moins 0 comme valeur
        const completeStats = {
          'EN_ATTENTE': 0,
          'EN_COURS': 0,
          'RESOLU': 0,
          ...stats
        };
        return completeStats;
      })
    );
  }

  getStatusBadgeClass(status: string): string {
    if (!status) return 'badge bg-secondary';

    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'badge bg-warning';
      case 'EN_COURS': return 'badge bg-info';
      case 'RESOLUE': 
      case 'RESOLU': return 'badge bg-success';
      case 'REJETEE': 
      case 'REJETE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours de traitement',
      'RESOLU': 'Résolu'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'EN_ATTENTE': '#ffc107', // jaune
      'EN_COURS': '#17a2b8',   // bleu
      'RESOLU': '#28a745'      // vert
    };
    return colors[status] || '#6c757d'; // gris par défaut
  }

  formatDate(date: string): string {
    if (!date) return '';

    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ✅ Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue.';

    if (error.status === 0) {
      console.error('Connection Details:', {
        error: error,
        url: this.apiUrl,
        headers: this.getHttpOptions().headers
      });
      errorMessage = 'Erreur de connexion - Vérifiez que:\n' +
        '1. L\'API Gateway est démarré (port 8081)\n' +
        '2. Le service de réclamations est enregistré\n' +
        '3. CORS est correctement configuré';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée ou non authentifiée. Veuillez vous reconnecter.';
      // Rediriger vers la page de login si nécessaire
      // this.router.navigate(['/login']);
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else {
      errorMessage = `Erreur ${error.status}: ${error.error?.message || error.message}`;
    }

    // Log détaillé de l'erreur
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
