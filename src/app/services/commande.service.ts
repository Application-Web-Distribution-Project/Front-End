import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { Commande } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl: string;
  private readonly TIMEOUT = 15000; // Increased timeout for Docker
  private readonly RETRY_ATTEMPTS = 3; // More retry attempts

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Utiliser une URL relative pour fonctionner avec le proxy
    this.apiUrl = '/commandes';
  }

  // Récupérer toutes les commandes (remplace getUserCommandes)
  getAllCommandes(): Observable<Commande[]> {
    console.log(`🔄 Récupération de toutes les commandes`);
    
    return this.http.get<Commande[]>(`${this.apiUrl}`, this.httpOptions).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  // Récupérer une commande par ID
  getCommandeById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      timeout(this.TIMEOUT),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue.';
    
    if (error.status === 0) {
      errorMessage = 'Erreur de connexion - Vérifiez que le service est disponible';
    } else if (error.error instanceof Error) {
      // Client-side error or parsing error
      errorMessage = `Erreur du client: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Erreur ${error.status}: ${error.error?.message || error.message}`;
      
      // Check if the response is HTML instead of JSON
      if (error.error && typeof error.error === 'string' && error.error.includes('<!doctype html>')) {
        errorMessage = 'Erreur: le serveur a répondu avec une page HTML au lieu de JSON.';
        console.error('Erreur de format de réponse: réponse HTML reçue', error);
      }
    }
    
    console.error('❌ API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
