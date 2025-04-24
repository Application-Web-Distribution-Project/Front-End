import { User } from './user.model';

export interface JwtResponse {
    token: string;
    type: string;
    id: string;
    nom: string;
    email: string;
    role: string;
    message: string;
    user?: any; // Champ optionnel pour maintenir la compatibilité avec le code existant
}