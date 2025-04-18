import { Commande } from './commande.model';
import { User } from './user.model';

export interface Reclamation {
    id: number;
    userId: number;
    commandeId: string;  // Changé de number à string pour correspondre au MongoDB ID
    description: string;
    status: string;
    dateCreation: string;
    dateResolution: string;
    commande?: Commande;  // Ajout de la propriété commande optionnelle
    user?: User;         // Ajout de la propriété user optionnelle
  }