import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbService, Breadcrumb } from 'angular-crumbs';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Location, {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ]
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title, private breadcrumbService: BreadcrumbService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbChanged.subscribe(crumbs => {
      this.titleService.setTitle(this.createTitle(crumbs));
    });

    // Vérifier l'authentification au démarrage
    this.checkAuthentication();

    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthentication();
    });
  }

  onActivate(event){
    window.scroll(0,0);
  }

  private createTitle(routesCollection: Breadcrumb[]) {
    const title = 'Slices Angular';
    const titles = routesCollection.filter((route) => route.displayName);

    if (!titles.length) { return title; }

    const routeTitle = this.titlesToString(titles);
    return `${routeTitle} ${title}`;
  }

  private titlesToString(titles) {
    return titles.reduce((prev, curr) => {
      return `${curr.displayName} - ${prev}`;
    }, '');
  }

  private checkAuthentication() {
    const currentUrl = this.router.url;
    const isLoggedIn = this.authService.isLoggedIn();
    
    // Si l'utilisateur est sur la page login/register mais est déjà connecté
    if (isLoggedIn && (currentUrl === '/login' || currentUrl === '/register')) {
      this.router.navigate(['/home']);
    }
    
    // Si l'utilisateur n'est pas connecté et n'est pas sur login/register
    if (!isLoggedIn && currentUrl !== '/login' && currentUrl !== '/register' 
        && !currentUrl.startsWith('/about') && !currentUrl.startsWith('/menu')
        && !currentUrl.startsWith('/blog') && currentUrl !== '/contact'
        && currentUrl !== '/locations' && currentUrl !== '/legal') {
      this.router.navigate(['/login']);
    }
  }
}
