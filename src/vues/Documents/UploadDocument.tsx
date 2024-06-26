import React, { useState, useEffect } from 'react';
import axios from 'axios';

type UploadProps = {
  userId: number;
  token: string|null;
};

const UploadDocument: React.FC<UploadProps> = ({ userId, token }) => {
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState<string>('');



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };



  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    if (!token) {
        alert('Token is required');
        return;
      }

  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token); // Ajoutez le token ici
  
    try {
      const response = await axios.post(`/upload-document/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // If needed for authentication
        },
      });
      console.log(response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file.');
    }
  };
  
  return (
    <div className="upload-document">
      <h3>Upload Document</h3>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} required />
      
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadDocument;
