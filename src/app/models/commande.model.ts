import { User } from "./user.model";
export interface Commande {
  id: number;
  reference: string;
  montant: number;
  dateCommande: string;
  status: string;
  userId: string;
  menuIds: string[];
  paymentStatus?: string;
  paymentIntentId?: string;
  user?: User; 
}
