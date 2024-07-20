// src/types.ts
export interface Participation {
    id: number;
  }
  
  export interface Proposition {
    id: number;
    question: string;
    type: string;
    choix: string[];
  }
  
  export interface Ag {
    id: number;
    nom: string;
    date: string;
    type: string;
    quorum: number;
    description: string;
    participations: Participation[];
    propositions: Proposition[];
  }
  
  export interface AgsResponse {
    Ags: Ag[];
    totalCount: number;
  }
  