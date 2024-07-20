import React from 'react';
import axios from 'axios';

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
      try {
        const response = await axios.post(`https://pa-api-0tcm.onrender.com/generate-sas-url/${userId}`, {
          blobName: file.name,
          token
        });
        const sasUrl = response.data.sasUrl;
        await axios.put(sasUrl, file, {
          headers: { 'x-ms-blob-type': 'BlockBlob' }
        });
        onFileUploaded({ nomFichier: file.name, id: Date.now(), Type: 'fichier' });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="upload-document">
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default UploadDocument;
