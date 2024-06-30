import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';

type AddPropositionFormProps = {
  agId: number; // ID de l'AG à laquelle associer la proposition
  sondageId: number; // ID du sondage auquel ajouter la proposition
  onPropositionSubmit: (question: string, choix: string, type: string, agId: number, sondageId: number) => void; // Callback pour soumettre la proposition
};

const AddPropositionForm: React.FC<AddPropositionFormProps> = ({ agId, sondageId, onPropositionSubmit }) => {
  const [question, setQuestion] = useState('');
  const [choix, setChoix] = useState('');
  const [type, setType] = useState('radio'); // Par défaut, type radio

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onPropositionSubmit(question, choix, type, agId, sondageId);
    setQuestion('');
    setChoix('');
    setType('radio'); // Réinitialisation du type à radio après soumission
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Choix"
            value={choix}
            onChange={(e) => setChoix(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
          >
            <MenuItem value="radio">Radio</MenuItem>
            <MenuItem value="checkbox">Checkbox</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter Proposition
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddPropositionForm;
