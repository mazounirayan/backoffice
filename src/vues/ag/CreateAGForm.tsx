import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../../components/theme/theme';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const CreateAGForm: React.FC<{ onAGCreated: (ag: any) => void }> = ({ onAGCreated }) => {
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('normal');
  const [quorum, setQuorum] = useState(1);
  const [description, setDescription] = useState('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();


  const fetchEmails = async () => {
    try {
      const response = await axios.post('https://pa-api-0tcm.onrender.com/usersEmail');
  
      return response.data[0].emails; 

      
    } catch (error) {
      Toastify({
        text: "Erreur lors de la récupération des e-mails.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return '';
    }
  };


  const sendEmails = async (emails: string) => {
    try {
      const response = await axios.post('https://mehdikit.app.n8n.cloud/webhook/c1a02914-bb9b-411b-b900-a1604a833947', {
        mail: emails,
        date: date
      });
      Toastify({
        text: "E-mails envoyés avec succès",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
    } catch (error) {
      Toastify({
        text: "Erreur lors de l'envoi des e-mails.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom || !date || !type || !quorum || !description) {
      Toastify({
        text: "Tous les champs sont requis.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return;
    }

    try {
      const ag = { nom, date, type, quorum, description };
      const response = await axios.post('https://pa-api-0tcm.onrender.com/ags', ag);
      onAGCreated(response.data);

      Toastify({
        text: "AG créée avec succès !",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();

      const emails = await fetchEmails();

      
      await sendEmails(emails);

      navigate(`/createProposition/${response.data.id}`);
    } catch (error) {
      Toastify({
        text: "Erreur lors de la création de l'AG.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
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
        required
      />
      <TextField
        fullWidth
        type="date"
        variant="outlined"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        sx={{ marginBottom: '20px' }}
        required
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
        required
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
        required
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ marginBottom: '20px' }}
        required
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
