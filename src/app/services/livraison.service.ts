// livraison.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, delay, retryWhen, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8083/livraisons';
  private simulatedPosition = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Simulation du déplacement du livreur
  simulateDeliveryMovement(
    clientPosition: { lat: number; lng: number },
    livraisonId: number
  ): void {
    // Position initiale aléatoire à moins de 500m du client (pour la démo)
    let livreurLat = clientPosition.lat + (Math.random() * 0.005 - 0.0025);
    let livreurLng = clientPosition.lng + (Math.random() * 0.005 - 0.0025);

    // Mettre à jour toutes les 3 secondes
    const intervalId = setInterval(() => {
      // Déplacer vers le client (10% de la distance à chaque fois)
      livreurLat = livreurLat + (clientPosition.lat - livreurLat) * 0.1;
      livreurLng = livreurLng + (clientPosition.lng - livreurLng) * 0.1;

      // Calculer la distance
      const distance = this.calculateDistance(
        clientPosition.lat,
        clientPosition.lng,
        livreurLat,
        livreurLng
      );

      // Arrêter quand à moins de 30m
      if (distance < 30) {
        clearInterval(intervalId);
      }

      this.simulatedPosition.next({
        livreurPosition: { lat: livreurLat, lng: livreurLng },
        status: distance < 30 ? 'LIVRE' : 'EN_COURS',
        estimatedTime: Math.round(distance / 20) + ' min', // 20m/min ≈ 1.2km/h
      });
    }, 3000);
  }

  // livraison.service.ts
  simulateDelivery(userPos: [number, number]): Observable<[number, number]> {
    return new Observable((subscriber) => {
      let pos: [number, number] = [userPos[0] + 0.01, userPos[1] + 0.01];

      const interval = setInterval(() => {
        pos = [
          pos[0] + (userPos[0] - pos[0]) * 0.1,
          pos[1] + (userPos[1] - pos[1]) * 0.1,
        ];

        subscriber.next(pos);

        if (
          Math.abs(pos[0] - userPos[0]) < 0.0001 &&
          Math.abs(pos[1] - userPos[1]) < 0.0001
        ) {
          clearInterval(interval);
          subscriber.complete();
        }
      }, 2000);

      return () => clearInterval(interval);
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distance en mètres
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getSimulatedPosition(): Observable<any> {
    return this.simulatedPosition.asObservable();
  }

  // Pour la production réelle (à garder)
  getTrackingInfo(livraisonId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${livraisonId}/tracking`).pipe(
      catchError((error) => {
        console.error('Error fetching tracking info:', error);
        return of(null);
      })
    );
  }
}
