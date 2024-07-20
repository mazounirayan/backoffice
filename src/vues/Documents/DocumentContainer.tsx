import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FolderView from './Folderview';
import './Documents.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Assurez-vous que l'élément racine est correctement ciblé

const DocumentsContainer: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<any | null>(null);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const userId = user.id;

  useEffect(() => {
    fetchRootItems();
  }, []);

  const fetchRootItems = async () => {
    try {
      const response = await axios.post(
        `https://pa-api-0tcm.onrender.com/racine/${userId}`,
        { token },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems(response.data.racine || []);
    } catch (error) {
      console.error('Error fetching root items:', error);
    }
  };

  const handleItemClick = async (item: any) => {
    if (item.Type === 'dossier') {
      try {
        const response = await axios.post(
          `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
          { token, dossierId: item.id || item.dossierId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(response.data.arboDossier || []);
        setBreadcrumbs([...breadcrumbs, item]);
        setCurrentFolder(item);
      } catch (error) {
        console.error('Error fetching folder contents:', error);
      }
    } else {
      await handleFileClick(item);
    }
  };

  const handleFileClick = async (file: any) => {
    try {
      const response = await axios.post(
        `https://pa-api-0tcm.onrender.com/generate-sas-url/${userId}`,
        {
          blobName: file.nomFichier,
          token,
        }, {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const fileUrl = response.data.sasUrl;
      setFileUrl(fileUrl);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error generating file URL:', error);
    }
  };

  const handleBreadcrumbClick = async (index: number) => {
    if (index === -1) {
      await fetchRootItems();
      setBreadcrumbs([]);
      setCurrentFolder(null);
    } else {
      try {
        const clickedFolder = breadcrumbs[index];
        const response = await axios.post(
          `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
          { token, dossierId: clickedFolder.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(response.data.arboDossier || []);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        setCurrentFolder(clickedFolder);
      } catch (error) {
        console.error('Error fetching folder contents:', error);
      }
    }
  };

  const handleNewFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://pa-api-0tcm.onrender.com/dossiers',
        {
          nom: newFolderName,
          user: userId,
          dossier: currentFolder ? currentFolder.dossierId : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newFolder = {
        ...response.data,
        Type: 'dossier', // Ajoute le type 'dossier'
      };
      setItems([...items, newFolder]);
      setShowNewFolderForm(false);
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating new folder:', error);
    }
  };

  return (
    <div className="documents-container">
      <FolderView
        items={items}
        breadcrumbs={breadcrumbs}
        currentFolder={currentFolder}
        showNewFolderForm={showNewFolderForm}
        newFolderName={newFolderName}
        onBreadcrumbClick={handleBreadcrumbClick}
        onNewFolderSubmit={handleNewFolderSubmit}
        onNewFolderNameChange={setNewFolderName}
        onToggleNewFolderForm={() => setShowNewFolderForm(!showNewFolderForm)}
        onItemClick={handleItemClick}
      />

      {/* Modal pour afficher les fichiers */}
      <Modal
        isOpen={isPopupOpen}
        onRequestClose={() => setIsPopupOpen(false)}
        contentLabel="File Preview"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="modal-close" onClick={() => setIsPopupOpen(false)}>X</button>
        {fileUrl && (
          <iframe
            src={fileUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title="File Preview"
          />
        )}
      </Modal>
    </div>
  );
};

export default DocumentsContainer;
