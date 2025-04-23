import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LivraisonService } from '../services/livraison.service';
import { MapboxService } from '../services/mapbox.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking-component.component.html',
  styleUrls: ['./tracking-component.component.css'],
})
export class TrackingComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private subs: Subscription[] = [];
  public livraisonId: number;
  public status = 'Chargement...';
  public estimatedTime = 'Calcul en cours...';
  public errorMessage: string | null = null;
  public mapLoaded = false;

  constructor(
    private livraisonService: LivraisonService,
    private mapboxService: MapboxService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.livraisonId = +this.route.snapshot.paramMap.get('id');
  }

  initTracking(): void {
    this.errorMessage = null;
    this.initializeMap();
  }

  async initializeMap(): Promise<void> {
    try {
      const mapEl = document.getElementById('map');
      if (!mapEl) {
        throw new Error('Conteneur de carte introuvable');
      }

      // S'assurer que le conteneur a une hauteur
      if (mapEl.clientHeight === 0) {
        mapEl.style.height = '400px';
      }

      await this.mapboxService.initializeMap('map');
      this.mapLoaded = true;

      const userPosition = await this.getUserPosition();
      this.mapboxService.addUserMarker(userPosition);
      this.startTracking(userPosition);
    } catch (err) {
      console.error('Erreur initialisation:', err);
      this.errorMessage = 'Impossible de charger la carte';
    }
  }

  private waitForContainer(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (document.getElementById('map')) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  private async getUserPosition(): Promise<[number, number]> {
    try {
      // 1. Vérification si on est en mode développement
      if (!environment.production) {
        console.log('Mode développement - Utilisation position de test');
        return [10.1815, 36.8065] as [number, number]; // Tunis
      }

      // 2. Vérification de la disponibilité de la géolocalisation
      if (!navigator.geolocation) {
        throw new Error('Votre navigateur ne supporte pas la géolocalisation');
      }

      // 3. Configuration précise pour la géolocalisation
      const options: PositionOptions = {
        enableHighAccuracy: true, // Demande la meilleure précision possible
        timeout: 15000, // 15 secondes maximum
        maximumAge: 0, // Ne pas utiliser de position en cache
      };

      // 4. Réessayer plusieurs fois en cas d'échec
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const position = await this.getPositionPromise(options);
          console.log('Position obtenue avec succès:', position);

          // Validation des coordonnées
          if (this.isValidPosition(position[0], position[1])) {
            return position;
          } else {
            throw new Error('Coordonnées invalides reçues');
          }
        } catch (error) {
          attempts++;
          console.warn(`Tentative ${attempts}/${maxAttempts} échouée:`, error);

          if (attempts >= maxAttempts) {
            throw error; // Relancer l'erreur après toutes les tentatives
          }

          // Attendre avant de réessayer (1s, puis 2s, puis 3s)
          await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
        }
      }

      // On ne devrait jamais arriver ici à cause du throw dans la boucle
      throw new Error("Impossible d'obtenir votre position");
    } catch (error) {
      // Journaliser l'erreur
      console.error('Erreur de géolocalisation finale:', error);

      // Informer l'utilisateur
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Impossible de déterminer votre position. Position par défaut utilisée.';

      // Position de repli
      return [10.1815, 36.8065] as [number, number]; // Tunis comme fallback
    }
  }

  // Méthode séparée pour transformer getCurrentPosition en Promise
  private getPositionPromise(
    options: PositionOptions
  ): Promise<[number, number]> {
    return new Promise<[number, number]>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extraire et transformer les coordonnées
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          // Vérifier si les coordonnées sont de bons types et valeurs
          if (typeof lng !== 'number' || typeof lat !== 'number') {
            reject(new Error('Coordonnées de type invalide'));
            return;
          }

          // Arrondir à 6 décimales pour plus de stabilité (≈10cm de précision)
          const roundedLng = parseFloat(lng.toFixed(6));
          const roundedLat = parseFloat(lat.toFixed(6));

          resolve([roundedLng, roundedLat] as [number, number]);
        },
        (error) => {
          // Message d'erreur détaillé
         console.log('Erreur de géolocalisation:', error);
        },
        options
      );
    });
  }

  
  // Dans votre composant
  async checkGeolocationPermission(): Promise<boolean> {
    try {
      // Ceci ne fonctionne que sur certains navigateurs modernes
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({
          name: 'geolocation',
        });

        if (result.state === 'denied') {
          this.errorMessage =
            "L'accès à votre position a été refusé. Veuillez l'activer dans les paramètres de votre navigateur.";
          return false;
        }

        if (result.state === 'prompt') {
          this.errorMessage =
            "Veuillez autoriser l'accès à votre position lorsque demandé.";
        }

        return result.state === 'granted';
      }

      return true; // Pas de moyen de vérifier, on suppose que c'est ok
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return true; // On continue malgré l'erreur
    }
  }

  // Méthode helper pour valider les coordonnées
  private isValidPosition(lng: number, lat: number): boolean {
    return (
      !isNaN(lng) &&
      !isNaN(lat) &&
      lng >= -180 &&
      lng <= 180 &&
      lat >= -90 &&
      lat <= 90
    );
  }

  // Méthode helper pour les messages d'erreur

  ngAfterViewInit(): void {
    // Démarrer l'initialisation après le rendu du DOM
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  private startTracking(userPosition: [number, number]): void {
    // 1. Position initiale du livreur (à 500m max du client)
    const initialDeliveryPos: [number, number] = [
      userPosition[0] + (Math.random() * 0.01 - 0.005),
      userPosition[1] + (Math.random() * 0.01 - 0.005),
    ];

    // 2. Afficher la position initiale
    this.mapboxService.updateDeliveryPosition(initialDeliveryPos);
    this.mapboxService.updateRoute(userPosition, initialDeliveryPos);

    // 3. Simuler le mouvement
    const sub = this.livraisonService.simulateDelivery(userPosition).subscribe({
      next: (deliveryPos) => {
        this.status = 'EN_COURS';
        this.estimatedTime = this.calculateETA(userPosition, deliveryPos);
        this.mapboxService.updateDeliveryPosition(deliveryPos);
        this.mapboxService.updateRoute(userPosition, deliveryPos);
      },
      error: (err) => {
        console.error('Tracking error:', err);
        this.errorMessage = 'Problème de suivi en temps réel';
      },
    });

    this.subs.push(sub);
  }

  private calculateETA(
    userPos: [number, number],
    deliveryPos: [number, number]
  ): string {
    const distance = this.mapboxService.calculateDistance(userPos, deliveryPos);
    const minutes = Math.max(1, Math.round(distance / 50)); // 50m/min ≈ 3km/h
    return `${minutes} min`;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  retry(): void {
    this.errorMessage = null;
    this.initializeMap();
  }
}
