// src/components/CreateAGForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../../components/theme/theme';

const CreateAGForm: React.FC<{ onAGCreated: (ag: any) => void }> = ({ onAGCreated }) => {
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('normal');
  const [quorum, setQuorum] = useState(1);
  const [description, setDescription] = useState('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Utiliser le hook useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ag = { nom, date, type, quorum, description };
      const response = await axios.post('https://pa-api-0tcm.onrender.com/ags', ag);
      onAGCreated(response.data); // Appel de la fonction onAGCreated avec les données de l'AG créé
      navigate(`/createProposition/${response.data.id}`); // Redirection vers la page de création de propositions avec l'ID de l'AG
    } catch (error) {
      console.error('Erreur lors de la création de l\'AG', error);
    }
  };
  

  return (
    <Box
      sx={{
        width: '50%',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: colors.primary[500],
        marginTop: '120px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Create an AG
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        type="date"
        variant="outlined"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        SelectProps={{
          native: true,
        }}
        sx={{ marginBottom: '20px' }}
      >
        <option value="normal">Normal</option>
        <option value="extraordinaire">Extraordinaire</option>
      </TextField>
      <TextField
        fullWidth
        type="number"
        variant="outlined"
        label="Quorum"
        value={quorum}
        onChange={(e) => setQuorum(parseInt(e.target.value))}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <Box sx={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
        <Button
          sx={{ bgcolor: colors.greenAccent[500] }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Create AG
        </Button>
      </Box>
    </Box>
  );
};

export default CreateAGForm;
