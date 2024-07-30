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
 if (!token){ const token =  localStorage.getItem('token')||""};

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const { data: folderContent } = await axios.post(
      `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
      { token, dossierId: currentFolderId || 0 },
      { headers: { Authorization: `Bearer ${token}` } }
    );




    const file = event.target.files?.[0];
    if (folderContent.arboDossier){
      console.log(file)
      console.log(folderContent.arboDossier )
      const fileExists = folderContent.arboDossier.some((item: any) => item.nomFichier === file!.name||file!.name ===item.Nom);
      if (fileExists) {
        toast.error('Le fichier existe déjà dans ce dossier.');
        setLoader(false);
        return;
      }
    }



  
    if (!file || !userId || !token) return;
      console.log(token)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);
      setLoader(true);
      try {
       
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
     
      
 
    
        console.log("file name " , file.name)
        const { data: idTokenResponse } = await axios.post(
          `https://pa-api-0tcm.onrender.com/idToken/${userId}`,
          { name: file.name, token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
       


        console.log( "id token reponse ",idTokenResponse)
        console.log( "currentFolderId"  ,currentFolderId)
        
        const fileId=idTokenResponse.idToken[0].id || undefined

          const { data: placeFileResponse } = await axios.post(
            'https://pa-api-0tcm.onrender.com/dossiers',
            { nom: file.name,  nomUtilisateur : file.name ,user: userId, token: fileId, dossier: currentFolderId || 0, type: 'Fichier' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(placeFileResponse)

        toast.success(`Fichier ${file.name} téléchargé et placé avec succès !`);
        onFileUploaded({
          nom: file.name,
          id: placeFileResponse.id,
          Type: 'fichier',
          isNewUpload: true
        });

      } catch (error) {
        console.error('Error uploading or placing file:', error);
        toast.error('Erreur lors du téléchargement ou du placement du fichier.');
      }finally{
        setLoader(false);
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