import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { Reclamation } from 'src/app/models/reclamation.model';
import { UserService } from 'src/app/services/user.service';
import { CommandeService } from 'src/app/services/commande.service';
import { AuthService } from 'src/app/services/auth.service';

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
    userId: '',
    status: 'EN_ATTENTE',
    dateCreation: new Date().toISOString(),
    dateResolution: ''
  };

  commandes: any[] = []; // Liste des commandes réelles depuis le service
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private reclamationService: ReclamationService,
    private userService: UserService,
    private authService: AuthService, // Ajout du AuthService
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserAndCommandes();
  }

  // Méthode pour charger les données d'utilisateur et de commandes
  loadUserAndCommandes(): void {
    console.log('🔄 Chargement des données utilisateur et commandes...');
    this.isLoading = true;
    
    // Essayer d'abord de récupérer l'utilisateur depuis le token JWT
    const userFromToken = this.getUserFromToken();
    
    if (userFromToken && userFromToken.id) {
      console.log('✅ Utilisateur récupéré depuis le token:', userFromToken);
      this.reclamation.userId = userFromToken.id;
      this.loadCommandes();
    } else {
      // Sinon, essayer via le service utilisateur
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          console.log('✅ Utilisateur récupéré via service:', user);
          if (user && user.id) {
            this.reclamation.userId = user.id;
          } else {
            console.error('❌ Utilisateur récupéré sans ID');
            this.errorMessage = 'Impossible d\'identifier l\'utilisateur.';
          }
          this.loadCommandes();
        },
        error: (error) => {
          console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
          this.errorMessage = 'Impossible de récupérer votre profil.';
          
          // Malgré l'erreur, essayer de charger les commandes
          this.loadCommandes();
        }
      });
    }
  }
  
  // Récupération de l'utilisateur à partir du token JWT
  getUserFromToken(): any {
    // Utiliser authService pour décoder le token
    const token = localStorage.getItem('JWT_TOKEN');
    if (token) {
      const decodedToken = this.authService.decodeToken(token);
      console.log('🔄 Token décodé:', decodedToken);
      
      // Si le token contient les informations utilisateur, les utiliser
      if (decodedToken && decodedToken.sub) {
        const userJson = localStorage.getItem('user') || localStorage.getItem('USER_DATA');
        if (userJson) {
          try {
            return JSON.parse(userJson);
          } catch (e) {
            console.error('❌ Erreur de parsing du user stocké:', e);
          }
        }
        
        // Si pas de user dans localStorage, créer un minimum avec l'ID depuis le token
        return { 
          id: decodedToken.sub || decodedToken.id || decodedToken.userId,
          email: decodedToken.email || ''
        };
      }
    }
    return null;
  }

  // Méthode spécifique pour charger les commandes
  loadCommandes(): void {
    console.log('🔄 Chargement des commandes...');
    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        console.log('✅ Commandes récupérées:', commandes);
        this.commandes = commandes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des commandes:', error);
        this.errorMessage = 'Impossible de récupérer les commandes.';
        this.isLoading = false;
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
