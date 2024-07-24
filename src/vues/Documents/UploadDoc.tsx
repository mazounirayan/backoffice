import React, { useState } from 'react';
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
  const [loader, setLoader] = useState<boolean>(false);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userId && token) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);

      try {
        setLoader(true);
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

      
 
        const idTokenResponse = await axios.post(
          `https://pa-api-0tcm.onrender.com/idToken/${userId}`,
          
           { name: file.name ,token},
           {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

       

          const fileId=idTokenResponse.data.idToken[0].id || undefined
        
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
          Type: 'fichier',
          isNewUpload: true
        });

      } catch (error) {
        console.error('Error uploading or placing file:', error);
        toast.error('Erreur lors du téléchargement ou du placement du fichier.');
      }finally{
        setLoader(false);
      }
    }
  };

  if(loader){
    return <div className="loader">
    <div className="justify-content-center jimu-primary-loading"></div>
  </div>
  }
  return (
    <div className="upload-document">
      <input type="file" onChange={handleFileChange} />
      <ToastContainer />
    </div>
  );
};

export default UploadDocument;