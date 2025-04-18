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

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Use relative URL to work with proxy
    this.apiUrl = '/reclamations';
  }

  getAllReclamations(): Observable<Reclamation[]> {
    console.log('🔄 Fetching reclamations from:', this.apiUrl);
    return this.http.get<Reclamation[]>(this.apiUrl, this.httpOptions).pipe(
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
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
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

    return this.http.post<Reclamation>(this.apiUrl, payload, this.httpOptions).pipe(
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
      headers: this.httpOptions.headers,
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

  updateReclamationStatus(id: number, newStatus: string, comment: string): Observable<Reclamation> {
    const url = `${this.apiUrl}/${id}/status`;
    const params = new HttpParams()
      .set('newStatus', newStatus)
      .set('comment', comment || '');

    return this.http.put<Reclamation>(url, null, { 
      headers: this.httpOptions.headers,
      params: params
    }).pipe(
      timeout(this.TIMEOUT),
      catchError(error => {
        console.error('Status update error:', error);
        return this.handleError(error);
      })
    );
  }

  getReclamationStats(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/stats`).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
    );
  }

  getStatusBadgeClass(status: string): string {
    if (!status) return 'badge bg-secondary';

    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return 'badge bg-warning';
      case 'EN_COURS': return 'badge bg-info';
      case 'RESOLUE': return 'badge bg-success';
      case 'REJETEE': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    if (!status) return 'Inconnu';

    try {
      switch (status.toUpperCase()) {
        case 'EN_ATTENTE': return '⏳ En attente';
        case 'EN_COURS': return '🔄 En cours';
        case 'RESOLUE': 
        case 'RESOLU': return '✅ Résolue';
        case 'REJETEE': 
        case 'REJETE': return '❌ Rejetée';
        default: return status;
      }
    } catch (error) {
      console.error('Error in getStatusLabel:', error);
      return 'Inconnu';
    }
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
        headers: this.httpOptions.headers
      });
      errorMessage = 'Erreur de connexion - Vérifiez que:\n' +
        '1. L\'API Gateway est démarré (port 8081)\n' +
        '2. Le service de réclamations est enregistré\n' +
        '3. CORS est correctement configuré';
    } else {
      errorMessage = `Erreur ${error.status}: ${error.error?.message || error.message}`;
    }

    console.error('❌ API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
