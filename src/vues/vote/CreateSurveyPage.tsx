import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Sondages {
  id: number;
  nom: string;
  date: string;
  description: string;
}

interface CreateSurveyPageProps {
  onBack: () => void;
  onSurveyCreated: (newSurvey: Sondages) => void;
}

const CreateSurveyPage: React.FC<CreateSurveyPageProps> = ({ onBack, onSurveyCreated }) => {
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateSurvey = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const newSurvey: Omit<Sondages, 'id'> = {
      nom,
      date,
      description,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/sondages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSurvey),
      });
      const data: Sondages = await response.json();
      onSurveyCreated(data);
    } catch (error) {
      console.error('Erreur lors de la création du sondage', error);
    }
  };

  return (
    <Box>
      <Button onClick={onBack}>Retour</Button>
      <Typography variant="h4" gutterBottom>
        Créer un nouveau Sondage
      </Typography>
      <form onSubmit={handleCreateSurvey}>
        <TextField
          label="Nom du sondage"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <TextField
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Créer Sondage
        </Button>
      </form>
    </Box>
  );
};

export default CreateSurveyPage;
