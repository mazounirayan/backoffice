import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Documents.css';
import UploadDocument from './UploadDocument';
import Folder from './Folder';
import File from './File';

type Item = {
  nomFichier: string;
  id: number;
  Type: string;
  fileType: string;
};

const Documents: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showItems, setShowItems] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const token = localStorage.getItem('token');
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  const fetchItems = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3006/racine/${loggedInUser.id}`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItems(response.data.racine);
      setShowItems(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  };

  return (
    <div className="documents-container">
      <div className="document-card comptabilite" onClick={fetchItems}>
        <div className="document-icon">📊</div>
        <div className="document-title">MA COMPTABILITÉ</div>
      </div>
      <button onClick={() => setShowUploadForm(!showUploadForm)}>Upload Document</button>
      {showUploadForm && <UploadDocument userId={loggedInUser.id} token={token} />}
      {showItems && (
        <div className="documents-list">
          <h3>MA COMPTABILITÉ</h3>
          <div className="documents-sublist">
            {items.map((item) => (
              <div key={`${item.Type}-${item.id}`}>
                {item.Type === 'dossier' ? (
                  <Folder id={item.id} name={item.nomFichier} token={token} />
                ) : (
                  <File
                    name={item.nomFichier}
                    userId={loggedInUser.id}
                    token={token||""}
                    type={item.fileType}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
