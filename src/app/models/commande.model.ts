export interface Commande {
    id: string;  // Changé de number à string pour correspondre au MongoDB ID
    reference: string;
    montant: number;
    dateCommande?: string;  // Ajout des nouveaux champs du modèle MongoDB
    status?: string;
    userId?: string;
    menuIds?: string[];
  }