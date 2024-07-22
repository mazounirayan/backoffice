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

const UploadDocument: React.FC<UploadDocumentProps> = ({ userId, token, currentFolderId, onFileUploaded }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userId && token) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token); 

      try {
        const response = await axios.post(`https://pa-api-0tcm.onrender.com/upload-document/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,  
          },
        });

 
        toast.success(`Fichier ${file.name} téléchargé avec succès !`);
 
        onFileUploaded({ nomFichier: file.name, id: Date.now(), Type: 'fichier' });
      } catch (error) {
        console.error('Error uploading file:', error);
      
        toast.error('Erreur lors du téléchargement du fichier.');
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
