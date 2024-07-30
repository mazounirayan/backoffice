import React from 'react';

interface BreadcrumbsProps {
  breadcrumbs: any[];
  onBreadcrumbClick: (index: number) => void;
  onBreadcrumbDrop: (item: any, targetFolderId: number) => void; // Nouvelle méthode pour gérer le drop
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, onBreadcrumbClick, onBreadcrumbDrop }) => {

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: number) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    onBreadcrumbDrop(item, targetFolderId);
  };

  return (
    <div className="breadcrumbs">
      <span
        onClick={() => onBreadcrumbClick(-1)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 0)} // 0 pour la racine
      >
        Files
      </span>
      {breadcrumbs.map((folder, index) => (
        <React.Fragment key={folder.id || folder.dossierId}>
          <span> &gt; </span>
          <span
            onClick={() => onBreadcrumbClick(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, folder.id || folder.dossierId)}
          >
            {folder.nom || folder.Nom || folder.nomFichier}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
