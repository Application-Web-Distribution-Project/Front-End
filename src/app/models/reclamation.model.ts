import { User } from './user.model';

export interface Commande {
  id: string;
  userId: string;
  menuIds: string[];
  dateCommande: string;
  status: string;
  // Autres propriétés éventuelles
}

export interface Reclamation {
  id: number;
  userId: string;
  commandeId: string;
  description: string;
  status: string;
  dateCreation: string;
  dateResolution?: string;
  user?: User;
  commande?: Commande;
}