import axios from 'axios';

export interface Adherant {
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
  parrain?: Adherant;
  inscriptions?: { id: number }[];
  cotisations?: { id: number; type: string; Ajours: boolean; date: string }[];
}

export interface Cotisation {
  id: number;
  type: string;
  Ajours: boolean;
  date: string;
  montant: number;
  adherent: Adherant;
}

export interface Transaction {
  id: number;
  montant: number;
  type: string;
  methodePaiement: string | null;
  emailVisiteur: string;
  evenement: string | null;
  dateTransaction: string;
}

export const fetchAdherants = async (): Promise<Adherant[]> => {
  const response = await axios.get<{ Adherents: Adherant[] }>('https://pa-api-0tcm.onrender.com/adherents');
  return response.data.Adherents;
};

export const fetchCotisations = async (): Promise<Cotisation[]> => {
  const response = await axios.get<{ Cotisations: Cotisation[] }>('https://pa-api-0tcm.onrender.com/cotisations');
  return response.data.Cotisations;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<{ Transactions: Transaction[] }>('https://pa-api-0tcm.onrender.com/transactions');
  return response.data.Transactions;
};