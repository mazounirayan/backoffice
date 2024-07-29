import React from 'react';

interface BreadcrumbsProps {
  breadcrumbs: any[];
  onBreadcrumbClick: (index: number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, onBreadcrumbClick }) => {

  return (
    <div className="breadcrumbs">
      <span onClick={() => onBreadcrumbClick(-1)}>Files</span>
      {  breadcrumbs.map((folder, index) => (
        
        <React.Fragment key={folder.id || folder.dossierId}>
          <span> &gt; </span>
          <span onClick={() => onBreadcrumbClick(index)}>{folder.nom ||folder.Nom||folder.nomFichier}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
