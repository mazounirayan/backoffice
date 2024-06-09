// src/services/api.ts
import axios from 'axios';

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    age?: number;
    phone?: string;
    adress? : string;
    dateInscription? : Date ;
    estBenevole? : boolean;
    parrainId? : number;
  }




const api = axios.create({
  baseURL: 'http://localhost:3006', // Remplacez par l'URL de votre API
});

export const getUsers = async () : Promise<User[]> => {
    try {
        const response = await api.get('/users', { mode: 'no-cors' } as any ); // Ajoutez l'option mode: 'no-cors'
        return response.data;
      } catch (error) {
        console.error('Error fetching data', error);
        throw error;
      }
};





export const handleViewDocument = async (documentId: number ,token:string) => {
    try {
      const response = await axios.get(`http://localhost:3006/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.content); // Affiche le contenu du document dans une alerte
    } catch (error) {
      console.error('Failed to fetch document', error);
      alert('Failed to fetch document. Please try again later.');
    }
  };