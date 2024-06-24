// src/services/api.ts
import axios from 'axios';

export interface User {
    numTel: string;
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

export interface Document {
  fileName: string;
  
}

export const getDocumentName = async (token: string,iduser:number): Promise<Document[]> => {
  try {
    const response = await api.post(`/getFiles/${iduser}`, 
    { token }, 
    { headers: { Authorization: `Bearer ${token}` } })
    return response.data.blobName;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}
export interface DocumentLink {
  sasUrl: string;
  
}
export const getDocumentlien = async (blobName :string , token: string,iduser:number): Promise<DocumentLink> => {
  try {
    const response = await api.post(`/generate-sas-url/${iduser}`, 
    { blobName , token }, 
    { headers: { Authorization: `Bearer ${token}` } })
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}


// const filePath = '/home/r-mehdi/ESGI/java/exo_speedrun/exo-condition.pdf';
// const fs = require('fs');
// export const  uploadDocument = async (iduser:number, token:string, filePath:string): Promise<DocumentLink> => {
//   try {
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(filePath)); // Assuming 'fs' is the file system module
//     formData.append('token', token); // Optional, based on your server-side logic

//     const response = await axios.post(
//       `http://localhost:3006/upload-document/${iduser}`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data' // Important for file uploads
//         }
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error uploading document:', error);
//     throw error; // Re-throw for handling in the calling code
//   }
// };
//C:\Users\mazou\Desktop\dashbord-backoffice\Consignes RAPPORT D'ACTIVITE  (1)-1.pdf








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