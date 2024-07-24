import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FolderView from './Folderview';
import './Documents.css';
import Modal from 'react-modal';
import { useAuth } from '../../services/AuthService';
import Toastify from 'toastify-js';

Modal.setAppElement('#root');

const DocumentsContainer: React.FC = () => {
  const { handleAccessForbidden } = useAuth();
  const [loader, setLoader] = useState<boolean>(false);
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
    setLoader(true);
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
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        handleAccessForbidden();
      } else {
        console.error('Error fetching root items:', error);
      }
    } finally {
      setLoader(false);
    }
  };

  const handleItemClick = async (item: any) => {
    if (item.Type === 'dossier') {
      setLoader(true);
      try {
        const response = await axios.post(
          `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
          { token, dossierId: item.id  },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(response.data.arboDossier || []);
        setBreadcrumbs([...breadcrumbs, item]);
        setCurrentFolder(item);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          handleAccessForbidden();
        } else {
          console.error('Error fetching folder contents:', error);
        }
      } finally {
        setLoader(false);
      }
    } else {
      await handleFileClick(item);
    }
  };

  const handleFileClick = async (file: any) => {
    setLoader(true);
    try {
      console.log(file)
        const response = await axios.post(
        `https://pa-api-0tcm.onrender.com/generate-sas-url/${userId}`,
        {
          blobName: file.nomFichier ||file.Nom ,
          token,
        }, {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const fileUrl = response.data.sasUrl;
      setFileUrl(fileUrl);
      setIsPopupOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        handleAccessForbidden();
      } else {
        console.error('Error generating file URL:', error);
      }
    } finally {
      setLoader(false);
    }
  };

  const handleBreadcrumbClick = async (index: number) => {
    setLoader(true);
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
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          handleAccessForbidden();
        } else {
          Toastify({
            text: 'Erreur lors d\'ouvrire  le contenue du dossier .',
            duration: 3000,
            backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
          }).showToast();
        //  console.error('Error fetching folder contents:', error);
        }
      } finally {
        setLoader(false);
      }
    }
  };

  const handleNewFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    try {
   
      const response = await axios.post(
        'https://pa-api-0tcm.onrender.com/dossiers',
        {
          nom: newFolderName,
          user: userId,
          dossier:  currentFolder   ? currentFolder.id : undefined,
          
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newFolder = {
        ...response.data,
        Type: 'dossier',
      };
      setItems([...items, newFolder]);
      setShowNewFolderForm(false);
      setNewFolderName('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        handleAccessForbidden();
      } else {
        console.error('Error creating new folder:', error);
      }
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteItem = async (item: any) => {
    setLoader(true);
    try {
      let deleteUrl = '';
      if (item.Type === 'fichier') {
        deleteUrl = `https://pa-api-0tcm.onrender.com/delete-document/${userId}`;
        await axios.post(deleteUrl, {
          blobName: item.nomFichier,
          token,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (item.Type === 'dossier') {
        const id = item.dossierId || item.id;

        deleteUrl = `https://pa-api-0tcm.onrender.com/dossiers/${id}`;
        await axios.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        console.error('Unknown item type.');
        return;
      }
  
      if (currentFolder && item.id === currentFolder.id) {
        await fetchRootItems();
        setBreadcrumbs([]);
        setCurrentFolder(null);
      } else {
        if (currentFolder) {
          const response = await axios.post(
            `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
            { token, Id: currentFolder.id },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setItems(response.data.arboDossier || []);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        handleAccessForbidden();
      } else {
        console.error('Error deleting item:', error);
      }
    } finally {
      setLoader(false);
    }
  };

  if(loader){
    return <div className="loader">
    <div className="justify-content-center jimu-primary-loading"></div>
  </div>
  }

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
        onDeleteItem={handleDeleteItem} 
      />

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
