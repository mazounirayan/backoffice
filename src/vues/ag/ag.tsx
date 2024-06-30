import React, { useState } from 'react';
import AGForm from './CreateAGForm';
import PropositionForm from './propostions';

const Ag: React.FC = () => {
  const [currentAG, setCurrentAG] = useState<number | null>(null);

  const handleAGCreated = (ag: any) => {
    setCurrentAG(ag.id);
  };

  return (
    <div>
      <h1>Créer une Assemblée Générale (AG)</h1>
      <AGForm onAGCreated={handleAGCreated} />
      {currentAG && (
        <>
          <h2>Créer une Proposition pour l'AG {currentAG}</h2>
          <PropositionForm agId={currentAG} />
        </>
      )}
    </div>
  );
};
export default Ag;