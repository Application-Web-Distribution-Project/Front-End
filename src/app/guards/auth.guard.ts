import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Vérifier si l'utilisateur est authentifié
    if (this.userService.isAuthenticated()) {
      return true;
    }

    // Stocker l'URL de redirection pour y retourner après connexion
    const returnUrl = state.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }
}