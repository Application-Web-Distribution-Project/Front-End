import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token JWT du service d'authentification
    const token = this.authService.getToken();
    
    // Si le token existe, l'ajouter à l'en-tête Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Continuer avec la requête modifiée et gérer les erreurs
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si l'erreur est 401 Unauthorized, l'utilisateur n'est pas authentifié
        // ou le token a expiré
        if (error.status === 401) {
          console.warn('Session expirée ou non authentifiée');
          // Déconnectez l'utilisateur
          this.authService.logout();
          // Redirigez vers la page de connexion
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }
        
        return throwError(() => error);
      })
    );
  }
}