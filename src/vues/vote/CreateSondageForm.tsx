import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

type CreateSondageFormProps = {
  agId: number; // ID de l'AG à laquelle associer le sondage
  onSondageSubmit: (nom: string, date: string, description: string) => void; // Callback pour soumettre le sondage
};

const CreateSondageForm: React.FC<CreateSondageFormProps> = ({ agId, onSondageSubmit }) => {
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSondageSubmit(nom, date, description);
    setNom('');
    setDate('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom du sondage"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Créer Sondage
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateSondageForm;
