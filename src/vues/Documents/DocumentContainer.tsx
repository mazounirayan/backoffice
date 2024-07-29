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
  const token = localStorage.getItem('token')|| "";
  const user =  JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const userId = user.id;

  useEffect(() => {
    fetchRootItems();
  }, []);

  const fetchRootItems = async () => {
    setLoader(true);
    try {
      const { data } = await axios.post(
        `https://pa-api-0tcm.onrender.com/racine/${userId}`,
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('data racine',data)
      setItems(data.racine || []);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        //handleAccessForbidden();
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
        console.log("arboDossier",userId , "token")
        const { data } = await axios.post(
          `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
          { token, dossierId: item.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(data.arboDossier || []);
        setBreadcrumbs([...breadcrumbs, item]);
        setCurrentFolder(item);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
         // handleAccessForbidden();
        } else {
          console.error('Error fetching folder contents:', error);
        }
      } finally {
        setLoader(false);
      }
    } else {
      if (item.isNewUpload) {
        setItems(prevItems => [...prevItems, item]);
      }
      await handleFileClick(item);
      
    }
  };
  const refreshCurrentFolder = async () => {
    if (currentFolder) {
      try {
        const { data } = await axios.post(
          `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
          { token, dossierId: currentFolder.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(data.arboDossier || []);
      } catch (error) {
        console.error('Error refreshing folder contents:', error);
      }
    } else {
      await fetchRootItems();
    }
  };
  
  const handleFileClick = async (file: any) => {
    setLoader(true);
    try {
      console.log(file)
      const { data } = await axios.post(
        `https://pa-api-0tcm.onrender.com/generate-sas-url/${userId}`,
        { blobName: file.nomFichier || file.Nom|| file.nom, token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFileUrl(data.sasUrl);
      setIsPopupOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
       // handleAccessForbidden();
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
        const { data } = await axios.post(
          `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
          { token, dossierId: clickedFolder.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(data.arboDossier || []);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        setCurrentFolder(clickedFolder);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
         // handleAccessForbidden();
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
      
      const { data } = await axios.post(
        'https://pa-api-0tcm.onrender.com/dossiers',
        { nom: newFolderName, user: userId, dossier: currentFolder?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newFolder = { ...data, Type: 'dossier' };
      console.log(newFolder)
      console.log(items)
      
      setItems([...items, newFolder]);
      setShowNewFolderForm(false);
      setNewFolderName(newFolder.nom);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
       // handleAccessForbidden();
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
        await axios.post(deleteUrl, { blobName: item.nomFichier, token }, { headers: { Authorization: `Bearer ${token}` } });
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
      setItems(prevItems => prevItems.filter(i => i.id !== item.id));


      // if (currentFolder && item.id === currentFolder.id) {
      //   await fetchRootItems();
      //   setBreadcrumbs([]);
      //   setCurrentFolder(null);
      // } else {
      //   if (currentFolder) {
      //     const response = await axios.post(
      //       `https://pa-api-0tcm.onrender.com/arboDossier/${userId}`,
      //       { token, Id: currentFolder.id },
      //       {
      //         headers: { Authorization: `Bearer ${token}` },
      //       }
      //     );
      //     setItems(response.data.arboDossier || []);
      //   }
      // }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
      //  handleAccessForbidden();
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
        onToggleNewFolderForm={() => setShowNewFolderForm(prev => !prev)}
        onItemClick={handleItemClick}
        onDeleteItem={handleDeleteItem} 
        refreshCurrentFolder={refreshCurrentFolder} 
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
