// types.ts

export interface Adherent {
    id: number;
    motDePasse: string;
    estBanie: boolean;
    nom: string;
    prenom: string;
    email: string;
    age: number;
    numTel: string;
    adresse: string;
    profession: string;
    dateInscription: string;
    estBenevole: boolean;
  }
  
  export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    role: string;
    dateInscription: string;
    estBenevole: boolean;
    numTel: string;
    profession: string;
    estEnLigne: boolean;
  }
  
  export interface Cotisation {
    id: number;
    type: string;
    Ajours: boolean;
    date: string;
    user: User | null;
    adherent: Adherent | null;
  }
  
  export interface CotisationsResponse {
    Cotisations: Cotisation[];
    totalCount: number;
  }
  