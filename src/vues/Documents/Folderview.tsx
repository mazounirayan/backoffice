import React, { useState } from 'react';
import Breadcrumbs from './Breadcrumbs';
import UploadDocument from './UploadDoc';

interface FolderViewProps {
  items: any;
  breadcrumbs: Array<{ id: number; nomFichier?: string; Nom?: string; }>;
  currentFolder: { id: number } | null;
  showNewFolderForm: boolean;
  newFolderName: string;
  onBreadcrumbClick: (index: number) => void;
  onNewFolderSubmit: (e: React.FormEvent) => void;
  onNewFolderNameChange: (name: string) => void;
  onToggleNewFolderForm: () => void;
  onItemClick: (item: any) => void;
  onDeleteItem: (item: any) => void;
  refreshCurrentFolder: () => void;
  onChangeName: (item: any, newName: string) => void;
  onMoveItem: (item: any, targetFolderId: number) => void; // Nouvelle méthode pour déplacer les éléments
}

const FolderView: React.FC<FolderViewProps> = ({
  items, breadcrumbs, currentFolder, showNewFolderForm, newFolderName,
  onBreadcrumbClick, onNewFolderSubmit, onNewFolderNameChange, onToggleNewFolderForm, onItemClick, onDeleteItem, refreshCurrentFolder, onChangeName, onMoveItem
}) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '');
  const token = localStorage.getItem('token');

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState<{ [key: number]: string }>({});

  const handleNameChange = (item: any) => {
    setEditingItemId(item.id);
    setNewItemName(prevNames => ({ ...prevNames, [item.id]: item.nomFichier || item.Nom || '' }));
  };

  const handleNameSubmit = (item: any) => {
    onChangeName(item, newItemName[item.id]);
    setEditingItemId(null);
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: number, itemType: string) => {
    const item = JSON.parse(e.dataTransfer.getData('item'));
    if (itemType === 'dossier' && item.id !== targetFolderId) {
      onMoveItem(item, targetFolderId);
    }
  };

  const handleEmptyDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Action à effectuer lorsqu'un élément est déposé dans le vide (peut-être une alerte ou rien)
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleBreadcrumbDrop = (item: any, targetFolderId: number) => {
    if (item.id !== targetFolderId) {
      console.log('Déplacer', item, 'dans', targetFolderId);
      onMoveItem(item, targetFolderId);
    }
  };

  return (
    <div className="folder-view" onDrop={handleEmptyDrop} onDragOver={handleDragOver}>
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={onBreadcrumbClick}
        onBreadcrumbDrop={handleBreadcrumbDrop} // Passer la nouvelle méthode
      />
      <div className="folder-actions">
        <button onClick={onToggleNewFolderForm}>New Folder</button>
        <UploadDocument 
          userId={user.id} 
          token={token} 
          currentFolderId={currentFolder?.id ?? null}
          onFileUploaded={(newFile) => {
            onItemClick(newFile);
            refreshCurrentFolder();
          }}
        />
      </div>
      {showNewFolderForm && (
        <form onSubmit={onNewFolderSubmit}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => onNewFolderNameChange(e.target.value)}
            placeholder="New folder name"
            required
          />
          <button type="submit">Create</button>
        </form>
      )}
      <div className="folder-contents">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <div 
              key={`${item.Type}-${item.id}`} 
              className="item-container" 
              draggable 
              onDragStart={(e) => handleDragStart(e, item)}
              onDrop={(e) => handleDrop(e, item.id, item.Type)} 
              onDragOver={handleDragOver}
            >
              <div onClick={() => onItemClick(item)}>
                {item.Type === 'dossier' ? (
                  <div className="folder">
                    <span role="img" aria-label="folder">📁</span> {item.nomFichier || item.Nom || item.nom}
                  </div>
                ) : (
                  <div className="file">
                    <span role="img" aria-label="file">📄</span> {item.nomFichier || item.Nom}
                  </div>
                )}
              </div>
              {editingItemId === item.id ? (
                <div>
                  <input 
                    type="text" 
                    value={newItemName[item.id] || ''} 
                    onChange={(e) => setNewItemName(prevNames => ({ ...prevNames, [item.id]: e.target.value }))} 
                    placeholder="New name"
                  />
                  <button onClick={() => handleNameSubmit(item)}>Save</button>
                  <button onClick={() => setEditingItemId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <button onClick={() => onDeleteItem(item)}>Delete</button>
                  <button onClick={() => handleNameChange(item)}>Change de nom</button>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="empty-folder">
            <div className="empty-folder-icon">📁</div>
            <p>le dossier est vide</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderView;
