import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import cartitem from '../../../data/cartlist.json';

@Component({
  selector: 'app-headertwo',
  templateUrl: './headertwo.component.html',
  styleUrls: ['./headertwo.component.css']
})
export class HeadertwoComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  // navigation
  navmethod: boolean = true;
  toggleNav() {
    this.navmethod = !this.navmethod;
  }
  // Cart
  cartmethod: boolean = true;
  cartToggle() {
    this.cartmethod = !this.cartmethod;
  }
  // Search
  searchmethod: boolean = true;
  searchToggle() {
    this.searchmethod = !this.searchmethod;
  }
  // Cart
  public cart: { id: number }[] = cartitem;

  ngOnInit(): void {
    // Vérifier immédiatement si l'utilisateur est connecté
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // S'abonner aux changements d'état d'authentification
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  // Fonction de déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
