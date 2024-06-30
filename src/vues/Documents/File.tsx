import React, { useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

type FileProps = {
  name: string;
  userId: number;
  token: string;
  type: string;
};

const File: React.FC<FileProps> = ({ name, userId, token, type }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const fetchSasUrl = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3006/generate-sas-url/${userId}`,
        { blobName: name, token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data.sasUrl;
    } catch (error) {
      console.error('Error fetching SAS URL:', error);
      return null;
    }
  };

  const handleFileClick = async () => {
    const url = await fetchSasUrl();
    if (!url) {
      console.error('Failed to fetch SAS URL');
      return;
    }

    // if (type === 'pdf' ) {
      setFileUrl(url);
    // } else {
    //   try {
    //     const response = await axios.get(url, {
    //       responseType: 'blob',
    //     });
    //     const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = downloadUrl;
    //     link.setAttribute('download', name);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    //   } catch (error) {
    //     console.error('Error fetching the file:', error);
    //   }
    // }
  };

  return (
    <div onClick={handleFileClick} className="file">
      📄 {name}
      {fileUrl && type === 'pdf' && (
        <div className="pdf-viewer">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} />
          </Worker>
        </div>
      )}
      {fileUrl  && (
        <div className="image-viewer">
          <img src={fileUrl} alt={name} />
        </div>
      )}
    </div>
  );
};

export default File;
