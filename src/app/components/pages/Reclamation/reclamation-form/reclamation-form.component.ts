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
  // Properties for footer styling
  classname = "footer-dark";
  ftlogo = "assets/img/logo.png";

  reclamation: Reclamation = {
    id: 0,
    description: '',
    commandeId: '', // Changé de 0 à '' (empty string) pour correspondre au type string
    userId: 0,
    status: 'EN_ATTENTE',
    dateCreation: new Date().toISOString(),
    dateResolution: ''
  };

  commandes: any[] = []; // Liste des commandes réelles depuis le service

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
    // 1. Récupération de l'utilisateur
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log("✅ Utilisateur récupéré :", user);
        this.reclamation.userId = user.id;
        
        // 2. Récupération de toutes les commandes
        this.loadAllCommandes();
      },
      error: (error) => {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
        alert("❌ Erreur : Impossible de récupérer l'utilisateur.");
        
        // Même en cas d'erreur de récupération de l'utilisateur, charger les commandes
        this.loadAllCommandes();
      }
    });
  }

  loadAllCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        console.log("✅ Commandes récupérées :", commandes);
        this.commandes = commandes;
      },
      error: (error) => {
        console.error("❌ Erreur lors de la récupération des commandes :", error);
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
        alert("❌ Erreur lors de la création de la réclamation : " + (error.message || "Erreur inconnue"));
      }
    });
  }
}
