import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  // ✅ Simule un utilisateur connecté avec ID 1
  getCurrentUser(): Observable<{ id: number; username: string }> {
    console.log("📡 Mock: Récupération de l'utilisateur connecté...");
    return of({ id: 1, username: 'mock_user' }); // 👈 Utilisateur simulé
  }
}
