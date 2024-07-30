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
  onChangeName: (item: any, newName: string) => void; // Change the signature
}

const FolderView: React.FC<FolderViewProps> = ({
  items, breadcrumbs, currentFolder, showNewFolderForm, newFolderName,
  onBreadcrumbClick, onNewFolderSubmit, onNewFolderNameChange, onToggleNewFolderForm, onItemClick, onDeleteItem, refreshCurrentFolder, onChangeName
}) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '');
  const token = localStorage.getItem('token');

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState<{ [key: number]: string }>({}); // Changed to store names per item

  const handleNameChange = (item: any) => {
    console.log("item",item);
    setEditingItemId(item.id);
    setNewItemName(prevNames => ({ ...prevNames, [item.id]: item.nomFichier || item.Nom || '' }));
  };

  const handleNameSubmit = (item: any) => {
    onChangeName(item, newItemName[item.id]);
    setEditingItemId(null);
  };

  return (
    <div className="folder-view">
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={onBreadcrumbClick}
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
            <div key={`${item.Type}-${item.id}`} className="item-container">
              <div>
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
                      value={newItemName[item.id] || ''} // Get the name for the specific item
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
