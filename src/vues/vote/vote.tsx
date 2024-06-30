import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import CreateSondageForm from './CreateSondageForm';
import AddPropositionForm from './AddPropositionForm';
// import PropositionsList from './PropositionsList'; // Assuming you have a component for listing propositions

const VotePage: React.FC = () => {
  // Function to handle submission of new sondage
  const handleSondageSubmit = (nom: string, date: string, description: string) => {
    // Implement logic to submit new sondage to backend
    console.log(`Submitting new sondage: ${nom}, ${date}, ${description}`);
  };

  // Function to handle submission of new proposition
  const handlePropositionSubmit = (question: string, choix: string, type: string, agId: number, sondageId: number) => {
    // Implement logic to submit new proposition to backend
    console.log(`Submitting new proposition: ${question}, ${choix}, ${type}, ${agId}, ${sondageId}`);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Créer un nouveau Sondage
        </Typography>
        <CreateSondageForm agId={1} onSondageSubmit={handleSondageSubmit} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Ajouter une Proposition à un Sondage
        </Typography>
        <AddPropositionForm agId={1} sondageId={3} onPropositionSubmit={handlePropositionSubmit} />
      </Grid>
      {/* <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Liste des Propositions
        </Typography>
        <PropositionsList /> 
      </Grid> */}
    </Grid>
  );
};

export default VotePage;
