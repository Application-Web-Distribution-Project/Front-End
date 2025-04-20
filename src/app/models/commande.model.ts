import { UserDTO } from './user.model';

export interface Commande {
  id: string;  // ID MongoDB
  dateCommande: string;
  status: string;
  userId: string;
  menuIds: string[];
  paymentStatus?: string;
  paymentIntentId?: string;
  user?: UserDTO;  // Ajout de l'utilisateur enrichi
}