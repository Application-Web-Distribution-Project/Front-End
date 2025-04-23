import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, timeout } from 'rxjs/operators';
import { LoginRequest } from '../models/login-request.model';
import { JwtResponse } from '../models/jwt-response.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_DATA = 'USER_DATA';
  private readonly REQUEST_TIMEOUT = 15000; // 15 secondes de timeout
  
  // Fix the environment.apiUrl access
  private apiBaseUrl = ''; // Default to empty string for relative paths
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize API base URL
    this.apiBaseUrl = environment.apiUrl || '';
    
    // Initialiser l'utilisateur à partir du localStorage au démarrage
    const userData = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(userData);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    console.log('📡 Tentative de connexion avec:', loginRequest.email);
    return this.http.post<JwtResponse>('/users/login', loginRequest)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        tap(response => {
          console.log('✅ Connexion réussie:', response);
          if (response.token) {
            // Stocker le token et les données utilisateur
            this.storeToken(response.token);
            this.storeUserData(response.user);
            this.currentUserSubject.next(response.user);
            this.isLoggedInSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Supprimer les données du localStorage
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_DATA);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  // Décoder le token JWT pour extraire les informations
  decodeToken(token: string): any {
    try {
      // Le token JWT est au format: header.payload.signature
      // On récupère la partie "payload" qui contient les données
      const payload = token.split('.')[1];
      // Décoder le base64
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  // Obtenir les informations de l'utilisateur à partir du token
  getUserInfoFromToken(): any {
    const token = this.getToken();
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  private storeUserData(user: User): void {
    localStorage.setItem(this.USER_DATA, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }
  
  // Gestion des erreurs améliorée
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('⚠️ Erreur d\'authentification:', error);
    
    let errorMessage = 'Une erreur d\'authentification est survenue.';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client (réseau, etc.)
      errorMessage = `Erreur client: ${error.error.message}`;
    } else if (error.status === 0) {
      // Erreur de connexion ou CORS
      errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
    } else {
      // Messages spécifiques pour les erreurs d'authentification courantes
      switch (error.status) {
        case 400:
          errorMessage = 'Requête d\'authentification invalide.';
          break;
        case 401:
          errorMessage = 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
          break;
        case 403:
          errorMessage = 'Accès refusé. Votre compte pourrait être désactivé.';
          break;
        case 404:
          errorMessage = 'Service d\'authentification non disponible.';
          break;
        case 500:
          errorMessage = 'Le serveur d\'authentification a rencontré une erreur.';
          break;
        default:
          errorMessage = `Erreur d'authentification (${error.status}): ${error.message}`;
      }
      
      // Ajouter des détails supplémentaires si disponibles
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage += ` ${error.error}`;
        } else if (error.error.message) {
          errorMessage += ` ${error.error.message}`;
        }
      }
    }
    
    console.error('❌ Auth Service - Erreur formatée:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/users/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/users/reset-password/validate?token=${token}`)
      .pipe(catchError(this.handleError));
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/users/reset-password`, { 
      token, 
      newPassword,
      confirmPassword
    }).pipe(catchError(this.handleError));
  }
}