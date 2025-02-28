import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';
import { UserService } from 'src/app/services/user.service';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-reclamation-form',
  templateUrl: './reclamation-form.component.html',
  styleUrls: ['./reclamation-form.component.css']
})
export class ReclamationFormComponent implements OnInit {
  reclamation: Reclamation = {
    id: 0,
    description: '',
    commandeId: 0,
    userId: 0,
    status: 'EN_ATTENTE',
    dateCreation: new Date().toISOString(),
    dateResolution: ''
  };

  commandes: any[] = []; // Liste des commandes mockées

  constructor(
    private reclamationService: ReclamationService,
    private userService: UserService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserAndCommandes();
  }

  loadUserAndCommandes(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log("✅ Utilisateur mock récupéré :", user);
        this.reclamation.userId = user.id;
        this.loadCommandes(user.id);
      },
      error: () => {
        alert("❌ Erreur : Impossible de récupérer l'utilisateur.");
      }
    });
  }

  loadCommandes(userId: number): void {
    this.commandeService.getUserCommandes(userId).subscribe({
      next: (commandes) => {
        console.log("✅ Commandes mock récupérées :", commandes);
        this.commandes = commandes;
      },
      error: () => {
        alert("❌ Erreur : Impossible de récupérer les commandes.");
      }
    });
  }

  onSubmit(): void {
    if (!this.reclamation.commandeId || !this.reclamation.description) {
      alert("❌ Veuillez sélectionner une commande et saisir une description.");
      return;
    }

    console.log("📤 Tentative d'envoi de la réclamation :", JSON.stringify(this.reclamation, null, 2));

    this.reclamationService.createReclamation(this.reclamation).subscribe({
      next: (response) => {
        console.log("✅ Réclamation envoyée avec succès :", response);
        alert("✅ Réclamation créée avec succès !");
        this.router.navigate(['/reclamations']);
      },
      error: (error) => {
        console.error("❌ Erreur lors de l'envoi de la réclamation :", error);
        alert("❌ Erreur lors de la création de la réclamation.");
      }
    });
  }

}
