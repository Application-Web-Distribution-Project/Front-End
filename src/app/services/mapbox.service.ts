import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private map: mapboxgl.Map | null = null;
  private userMarker: mapboxgl.Marker | null = null;
  private deliveryMarker: mapboxgl.Marker | null = null;
  private routeLayerId: string | null = null;
  style = 'mapbox://styles/mapbox/streets-v11';

  constructor(private http: HttpClient) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  // mapbox.service.ts (version simplifiée)
// Dans MapboxService
initializeMap(containerId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Conteneur ${containerId} introuvable`);
      }
      
      // Vérifier les dimensions du conteneur
      console.log(`Dimensions du conteneur: ${container.clientWidth}x${container.clientHeight}`);
      
      // Forcer une hauteur minimale
      if (container.clientHeight < 200) {
        container.style.height = '400px';
        console.warn('Hauteur du conteneur forcée à 400px');
      }
      
      // Nettoyer une carte existante
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      
      // Initialiser la carte avec des paramètres optimisés
      this.map = new mapboxgl.Map({
        container: containerId,
        style: this.style,
        center: [0, 0], // Position neutre au départ
        zoom: 2,        // Zoom mondial au départ 
        fadeDuration: 0,// Transitions instantanées
        attributionControl: false, // Pas d'attribution (plus propre)
        preserveDrawingBuffer: true // Meilleur pour les captures d'écran
      });
      
      // Écouter les événements de la carte
      this.map.once('load', () => {
        console.log('Carte chargée avec succès');
        
        // Ajouter un contrôle de navigation par défaut
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        resolve();
      });
      
      this.map.on('error', (e) => {
        console.error('Erreur Mapbox:', e);
        reject(e);
      });
      
    } catch (error) {
      console.error('Échec d\'initialisation de la carte:', error);
      reject(error);
    }
  });
}

  addUserMarker(position: [number, number]): void {
    if (!this.map) throw new Error('Map not initialized');

    this.clearUserMarker();

    this.userMarker = new mapboxgl.Marker({
      color: '#4285F4',
      scale: 1.2,
    })
      .setLngLat(position)
      .addTo(this.map);
  }

  updateDeliveryPosition(position: [number, number]): void {
    if (!this.map) throw new Error('Map not initialized');

    if (!this.deliveryMarker) {
      this.deliveryMarker = new mapboxgl.Marker({
        color: '#FBBC05',
        scale: 1.2,
      })
        .setLngLat(position)
        .addTo(this.map);
    } else {
      this.deliveryMarker.setLngLat(position);
    }
  }

  async updateRoute(
    start: [number, number],
    end: [number, number]
  ): Promise<void> {
    if (!this.map) throw new Error('Map not initialized');

    // 1. Supprimer l'ancienne route
    this.clearRoute();

    try {
      // 2. Calculer la route via API Mapbox
      const profile = 'walking'; // ou 'driving'
      const coords = `${start[0]},${start[1]};${end[0]},${end[1]}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}?geometries=geojson&access_token=${environment.mapbox.accessToken}`;

      const response: any = await this.http.get(url).toPromise();
      const route = response.routes[0].geometry;

      // 3. Ajouter la nouvelle route
      this.routeLayerId = 'route-' + Date.now();

      this.map.addSource(this.routeLayerId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route,
        },
      });

      this.map.addLayer({
        id: this.routeLayerId,
        type: 'line',
        source: this.routeLayerId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FF6D00',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });

      // 4. Ajuster la vue
      this.fitBounds(start, end);
    } catch (error) {
      console.error('Error fetching route:', error);
      this.drawStraightLine(start, end);
    }
  }

  private drawStraightLine(
    start: [number, number],
    end: [number, number]
  ): void {
    if (!this.map) return;

    this.routeLayerId = 'route-fallback-' + Date.now();

    this.map.addSource(this.routeLayerId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [start, end],
        },
      },
    });

    this.map.addLayer({
      id: this.routeLayerId,
      type: 'line',
      source: this.routeLayerId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#FF6D00',
        'line-width': 3,
        'line-dasharray': [2, 2],
      },
    });
  }

  private clearRoute(): void {
    if (this.map && this.routeLayerId) {
      if (this.map.getLayer(this.routeLayerId))
        this.map.removeLayer(this.routeLayerId);
      if (this.map.getSource(this.routeLayerId))
        this.map.removeSource(this.routeLayerId);
      this.routeLayerId = null;
    }
  }

  private clearUserMarker(): void {
    if (this.userMarker) this.userMarker.remove();
  }

  fitBounds(pos1: [number, number], pos2: [number, number]): void {
    if (!this.map) return;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(pos1);
    bounds.extend(pos2);
    this.map.fitBounds(bounds, { padding: 100, maxZoom: 16 });
  }

  calculateDistance(pos1: [number, number], pos2: [number, number]): number {
    // Formule haversine pour calculer la distance en mètres
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (pos1[1] * Math.PI) / 180;
    const φ2 = (pos2[1] * Math.PI) / 180;
    const Δφ = ((pos2[1] - pos1[1]) * Math.PI) / 180;
    const Δλ = ((pos2[0] - pos1[0]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
