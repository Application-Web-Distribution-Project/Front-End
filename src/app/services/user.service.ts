import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    this.loadUserFromStorage();
  }

  // Charge l'utilisateur depuis le localStorage
  private loadUserFromStorage() {
    const userJson = localStorage.getItem('USER_DATA') || localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Erreur de parsing du user stocké:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('USER_DATA');
      }
    }
  }

  // Récupère le token depuis le localStorage
  private getToken(): string | null {
    // Utiliser uniquement la clé JWT_TOKEN pour la cohérence avec AuthService
    return localStorage.getItem('JWT_TOKEN');
  }

  // Configure les headers HTTP avec le token
  private getHttpOptions() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return { headers };
  }

  // Authentification et stockage du token
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // Stocker le token avec la clé JWT_TOKEN pour être cohérent avec AuthService
          localStorage.setItem('JWT_TOKEN', response.token);
          
          if (response.user) {
            // Stocker l'utilisateur dans les deux formats pour la compatibilité
            localStorage.setItem('USER_DATA', JSON.stringify(response.user));
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // Inscription d'un nouvel utilisateur
  register(userData: { nom: string, prenom: string, email: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, userData).pipe(
      tap(response => {
        console.log('✅ Inscription réussie:', response);
      }),
      catchError(this.handleError)
    );
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('user');
    localStorage.removeItem('USER_DATA');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Récupère les informations de l'utilisateur connecté
  getCurrentUser(): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      // Si l'utilisateur est déjà en mémoire, le retourner directement
      return of(currentUser);
    }

    // Si l'utilisateur n'est pas en mémoire, essayer de le récupérer depuis le localStorage
    const userJson = localStorage.getItem('USER_DATA') || localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        return of(user);
      } catch (e) {
        console.error('Erreur de parsing du user stocké:', e);
      }
    }

    // En dernier recours, faire un appel API
    return this.getUserProfile();
  }

  // Récupère un utilisateur par son ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  // Charge le profil utilisateur depuis l'API
  getUserProfile(): Observable<User> {
    console.log('🔄 Chargement du profil utilisateur depuis l\'API...');
    return this.http.get<User>(`${this.apiUrl}/profile`, this.getHttpOptions()).pipe(
      map((response: any) => {
        // S'assurer que la réponse est conforme au type User
        const user: User = {
          id: response.id || '',
          nom: response.nom || '',
          prenom: response.prenom || '',
          email: response.email || '',
          role: response.role || '',
          // Ajouter d'autres champs si nécessaires
        };
        
        // Stocker l'utilisateur dans le localStorage et dans le BehaviorSubject
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('USER_DATA', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        return user;
      }),
      catchError(error => {
        console.error('❌ Erreur lors du chargement du profil:', error);
        return throwError(() => new Error('Erreur lors du chargement du profil utilisateur'));
      })
    );
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Gère les erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur s\'est produite';

    if (error.status === 0) {
      // Erreur client ou réseau
      errorMessage = 'Problème de connexion au serveur. Vérifiez votre connexion internet.';
    } else if (error.status === 401) {
      // Non autorisé
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      localStorage.removeItem('token');
      localStorage.removeItem('JWT_TOKEN');
      localStorage.removeItem('user');
      localStorage.removeItem('USER_DATA');
    } else if (error.status === 403) {
      // Accès refusé
      errorMessage = 'Vous n\'avez pas les permissions nécessaires.';
    } else {
      // Erreur serveur
      errorMessage = `Erreur: ${error.error?.message || error.statusText}`;
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
