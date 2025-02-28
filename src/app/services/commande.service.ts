import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Commande } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  constructor() {}

  // ✅ Simule des commandes pour l'utilisateur avec ID 1
  getUserCommandes(userId: number): Observable<Commande[]> {
    console.log(`📡 Mock: Récupération des commandes pour userId: ${userId}`);
    
    // 👇 Simulation de commandes
    const commandes: Commande[] = [
      { id: 101, reference: 'CMD101', montant: 29.99 },
      { id: 102, reference: 'CMD102', montant: 45.50 }
    ];

    return of(commandes); // 👈 On retourne ces commandes simulées
  }
}
