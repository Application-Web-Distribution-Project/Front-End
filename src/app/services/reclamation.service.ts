import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, retry, timeout, map } from 'rxjs/operators';
import { Reclamation } from '../models/reclamation.model';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8082/reclamations';
  private readonly TIMEOUT = 10000;
  private readonly RETRY_ATTEMPTS = 1;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllReclamations(): Observable<Reclamation[]> {
    console.log('🔄 Fetching reclamations from:', this.apiUrl);
    return this.http.get<Reclamation[]>(this.apiUrl, {
      headers: this.httpOptions.headers
    }).pipe(
      timeout(this.TIMEOUT),
      catchError((error: HttpErrorResponse) => {
        console.error('🔴 Error details:', error);
        return throwError(() => error);
      })
    );
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`, {
      headers: this.httpOptions.headers
    }).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  createReclamation(reclamation: Reclamation): Observable<Reclamation> {
    console.log('📝 Creating reclamation:', reclamation);
    const payload = {
      ...reclamation,
      dateCreation: new Date().toISOString(),
      commandeId: Number(reclamation.commandeId)
    };

    return this.http.post<Reclamation>(this.apiUrl, payload, {
      headers: this.httpOptions.headers
    }).pipe(
      timeout(this.TIMEOUT),
      catchError(error => {
        console.error('Creation error details:', error);
        return this.handleError(error);
      })
    );
  }

  deleteReclamation(id: number): Observable<void> {
    console.log(`🗑️ Attempting to delete reclamation ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
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
    const payload = { newStatus, comment };
    return this.http.put<Reclamation>(url, payload, this.httpOptions).pipe(
      timeout(this.TIMEOUT),
      catchError(this.handleError)
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

    switch (status.toUpperCase()) {
      case 'EN_ATTENTE': return '⏳ En attente';
      case 'EN_COURS': return '🔄 En cours';
      case 'RESOLUE': return '✅ Résolue';
      case 'REJETEE': return '❌ Rejetée';
      default: return status;
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
