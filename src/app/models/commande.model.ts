import { UserDTO } from './user.model';

export interface Commande {
  id: string;  // ID MongoDB
  dateCommande: string;
  status: string;
  userId: string;
  menuIds: string[];
  paymentStatus?: string;
  paymentIntentId?: string;
  user: UserDTO;  // Changed from optional to required since it's accessed directly in the template
}