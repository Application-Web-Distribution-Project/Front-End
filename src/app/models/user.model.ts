export interface User {
    id: string; // Changé de number à string pour correspondre à MongoDB ID
    nom: string;
    prenom: string; // Ajouté pour correspondre au backend
    email: string;
    role: string; // Ajouté pour les autorisations
}