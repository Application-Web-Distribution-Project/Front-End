import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Reclamation } from '../models/reclamation.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8082/reclamations'; // Utilisez localhost pour la machine locale

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les réclamations
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl).pipe(
      catchError(this.handleError) // 🔥 Gestion centralisée des erreurs
    );
  }

  // ✅ Récupérer une réclamation par ID
  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createReclamation(reclamation: Reclamation): Observable<any> {
    console.log("🚀 Envoi de la réclamation au backend :", reclamation);

    return this.http.post<Reclamation>(this.apiUrl, reclamation, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json' // Assurez-vous que cet en-tête est inclus
      }
    }).pipe(
      catchError((error) => {
        console.error("❌ Erreur API :", error);
        return throwError(() => new Error("Erreur API"));
      })
    );
  }



  // ✅ Supprimer une réclamation par ID
  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue.';

    if (error.error instanceof ErrorEvent) {
      // 🔥 Erreur côté client (ex: problème réseau)
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      // 🔥 Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }

    console.error('❌ API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
