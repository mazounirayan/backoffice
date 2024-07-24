import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UploadDocumentProps {
  userId: string | null;
  token: string | null;
  currentFolderId: number | null;
  onFileUploaded: (newFile: any) => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  userId,
  token,
  currentFolderId,
  onFileUploaded
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userId && token) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);

      try {
        // Première requête : upload du fichier
        const uploadResponse = await axios.post(
          `https://pa-api-0tcm.onrender.com/upload-document/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Deuxième requête : obtenir l'ID du token
        console.log(file)
        const idTokenResponse = await axios.post(
          `https://pa-api-0tcm.onrender.com/idToken/${userId}`,
          
           { name: file.name ,token},
           {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

       
console.log(idTokenResponse.data.idToken[0].id)
          const fileId=idTokenResponse.data.idToken[0].id
          console.log(fileId)
          console.log(   currentFolderId)
        const placeFileResponse = await axios.post(
          'https://pa-api-0tcm.onrender.com/dossiers',
          {
            nom: file.name,
            user: userId,
            token: fileId,
            dossier: currentFolderId || undefined
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success(`Fichier ${file.name} téléchargé et placé avec succès !`);
        onFileUploaded({
          nomFichier: file.name,
          id: placeFileResponse.data.id,
          Type: 'fichier'
        });
      } catch (error) {
        console.error('Error uploading or placing file:', error);
        toast.error('Erreur lors du téléchargement ou du placement du fichier.');
      }
    }
  };

  return (
    <div className="upload-document">
      <input type="file" onChange={handleFileChange} />
      <ToastContainer />
    </div>
  );
};

export default UploadDocument;