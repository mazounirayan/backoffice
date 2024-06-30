import React, { useState } from 'react';
import axios from 'axios';
import './Documents.css';
import File from './File';

type FolderProps = {
  id: number;
  name: string;
  token: string|null;
};

const Folder: React.FC<FolderProps> = ({ id, name, token }) => {
  const [contents, setContents] = useState<{ Nom: string; dossierId: number | null; Type: string; fileType: string }[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  const fetchContents = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3006/arboDossier/1',
        { dossierId: id, token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.arboDossier && response.data.arboDossier.length > 0) {
        setContents(response.data.arboDossier);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
        setContents([]);
      }
      setIsOpen(true);
      setIsLoaded(true);
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu du dossier:', error);
      setContents([]);
      setIsEmpty(true);
      setIsLoaded(true);
    }
  };

  const toggleOpen = () => {
    if (!isOpen && !isLoaded) {
      fetchContents();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleNewFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  const handleNewFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3006/dossiers',
        { nom: newFolderName, dossier: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newFolder = response.data; // The API response
      setContents((prevContents) =>
        prevContents
          ? [...prevContents, { Nom: newFolder.nom, dossierId: newFolder.id, Type: 'dossier', fileType: '' }]
          : [{ Nom: newFolder.nom, dossierId: newFolder.id, Type: 'dossier', fileType: '' }]
      );
      setNewFolderName('');
      setShowNewFolderForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);
    }
  };

  return (
    <div className="folder">
      <div className="folder-header" onClick={toggleOpen}>
        <div className={`triangle ${isOpen ? 'open' : ''}`}></div>
        📁 {name}
      </div>
      {isOpen && (
        <div className="folder-contents">
          {contents !== null && contents.length > 0 ? (
            contents.map((content) => (
              <div key={`${content.Type}-${content.dossierId}`}>
                {content.Type === 'dossier' ? (
                  <Folder id={content.dossierId!} name={content.Nom} token={token} />
                ) : (
                  <File name={content.Nom} userId={id} token={token || ''} type={content.fileType} />
                )}
              </div>
            ))
          ) : (
            <div className="empty-folder">Ce dossier est vide</div>
          )}
          <button onClick={() => setShowNewFolderForm(!showNewFolderForm)}>Créer un nouveau dossier</button>
          {showNewFolderForm && (
            <form onSubmit={handleNewFolderSubmit}>
              <input
                type="text"
                value={newFolderName}
                onChange={handleNewFolderChange}
                placeholder="Nom du nouveau dossier"
                required
              />
              <button type="submit">Créer</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
