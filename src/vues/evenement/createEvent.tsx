import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Box, Container, Paper,useTheme } from '@mui/material';
import axios from 'axios';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { tokens } from '../../components/theme/theme';
const EvenementsPage: React.FC = () => {
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('2024-11-09');
  const [description, setDescription] = useState('');
  const [lieu, setLieu] = useState('');
  const [estReserve, setEstReserve] = useState(true);
  const [nbPlace, setNbPlace] = useState(3);
  const [ressources, setRessources] = useState<any[]>([]);
  const [selectedRessource, setSelectedRessource] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [evenementId, setEvenementId] = useState<string | null>(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    fetchRessources();
    fetchUsers();
  }, []);

  const fetchRessources = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/ressources');
      setRessources(Array.isArray(response.data.Ressources) ? response.data.Ressources : []);
    } catch (error) {
      console.error('Error fetching ressources:', error);
      setRessources([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/users');
      setUsers(Array.isArray(response.data.Users) ? response.data.Users : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchEmailsAndSendPost = async () => {
    try {
      const response = await axios.post('https://pa-api-0tcm.onrender.com/visiteursEmail');
      const emails = response.data[0]?.emails;
      if (emails) {
        await axios.post('https://mehdikit.app.n8n.cloud/webhook/a7f0a253-cc6d-4b77-8111-35746db35f99', {
          mail: emails,
          evenement: 'Gala Annuel',
          date: '29/07/2024',
          lieu: 'Salle des fêtes'
        });
        Toastify({
          text: 'Emails envoyés avec succès.',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
        }).showToast();
      }
    } catch (error) {
      console.error('Error fetching emails or sending post:', error);
      Toastify({
        text: 'Erreur lors de l\'envoi des emails.',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  };

  const handleCreateEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://pa-api-0tcm.onrender.com/evenements', {
        nom,
        date,
        description,
        lieu,
        estReserve,
        nbPlace
      });
      const eventId = response.data.id;
      setEvenementId(eventId);
      Toastify({
        text: 'Événement créé avec succès. Vous pouvez maintenant accorder des ressources et des utilisateurs.',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      }).showToast();
      fetchEmailsAndSendPost();  
    } catch (error) {
      console.error('Error creating event:', error);
      Toastify({
        text: 'Erreur lors de la création de l\'événement.',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  };

  const handleAccorderRessource = async () => {
    if (!evenementId || !selectedRessource) return;
    try {
      await axios.post('https://pa-api-0tcm.onrender.com/evenement-ressources', {
        evenement: evenementId,
        ressource: selectedRessource
      });
      Toastify({
        text: 'Ressource accordée avec succès',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      }).showToast();
    } catch (error) {
      console.error('Error accordering resource:', error);
      Toastify({
        text: 'Erreur lors de l\'attribution de la ressource.',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  };

  const handleAccorderUtilisateur = async () => {
    if (!evenementId || !selectedUser) return;
    try {
      await axios.post('https://pa-api-0tcm.onrender.com/evenement-users', {
        evenement: evenementId,
        user: selectedUser
      });
      Toastify({
        text: 'Utilisateur ajouté avec succès',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      }).showToast();
    } catch (error) {
      console.error('Error accordering user:', error);
      Toastify({
        text: 'Erreur lors de l\'ajout de l\'utilisateur.',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  };

  return (
    <Container>
       <Box sx={{ padding: 3, backgroundColor: '#e0e0e0' }}>
        <Paper sx={{ padding: 3, backgroundColor: '#e0e0e0', borderRadius: 2 }}>
          <Box component="form"
           onSubmit={handleCreateEvent} 
           sx={{      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            backgroundColor: colors.primary[500],
            padding: 3, borderRadius: 2 }}>
            <TextField
              label="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={estReserve}
                  onChange={(e) => setEstReserve(e.target.checked)}
                  color="primary"
                />
              }
              label="Est Reserve"
              sx={{ mb: 2,
                bgcolor: colors.greenAccent[500] 
               }}
            />
            <TextField
              label="Nombre de places"
              type="number"
              value={nbPlace}
              onChange={(e) => setNbPlace(Number(e.target.value))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Créer l'événement
            </Button>
          </Box>

          {evenementId && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ mb: 2 }}>
                <h2>Accorder des ressources pour l'événement</h2>
                <FormControl fullWidth>
                  <InputLabel>Ressource à accorder</InputLabel>
                  <Select
                    value={selectedRessource}
                    onChange={(e) => setSelectedRessource(e.target.value as string)}
                    fullWidth
                  >
                    {ressources.map((resource) => (
                      <MenuItem key={resource.id} value={resource.id}>
                        {resource.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button onClick={handleAccorderRessource} variant="contained" color="primary" sx={{ mt: 2 }}>
                  Accorder la ressource
                </Button>
              </Box>

              <Box>
                <h2>Sélectionner les utilisateurs pour l'événement</h2>
                <FormControl fullWidth>
                  <InputLabel>Utilisateur à ajouter</InputLabel>
                  <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value as string)}
                    fullWidth
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button onClick={handleAccorderUtilisateur} variant="contained" color="primary" sx={{ mt: 2 }}>
                  Ajouter l'utilisateur
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EvenementsPage;
