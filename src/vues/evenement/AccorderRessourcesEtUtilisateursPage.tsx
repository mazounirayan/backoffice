import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Container, Paper,useTheme } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../components/theme/theme';
const AccorderRessourcesEtUtilisateursPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [ressources, setRessources] = useState<any[]>([]);
  const [selectedRessource, setSelectedRessource] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    fetchRessources();
    fetchUsers();
  }, []);

  const fetchRessources = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/ressources');
      setRessources(response.data);
    } catch (error) {
      console.error('Error fetching ressources:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/users');
      setUsers(response.data.Users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAccorderRessource = async () => {
    try {
      await axios.post('https://pa-api-0tcm.onrender.com/evenement-ressources', {
        evenement: eventId,
        ressource: selectedRessource
      });
      alert('Ressource accordée avec succès');
    } catch (error) {
      console.error('Error accordering resource:', error);
    }
  };

  const handleAccorderUtilisateur = async () => {
    try {
      await axios.post('https://pa-api-0tcm.onrender.com/evenement-users', {
        evenement: eventId,
        user: selectedUser
      });
      alert('Utilisateur ajouté avec succès');
    } catch (error) {
      console.error('Error accordering user:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ padding: 3, backgroundColor: colors.primary[500], borderRadius: 2 }}>
        <Paper sx={{ padding: 3,    backgroundColor: colors.primary[500], borderRadius: 2 }}>
          <Typography variant="h4" sx={{ marginBottom: 3 }}>
            Accorder des ressources et des utilisateurs pour l'événement
          </Typography>

          <Box sx={{ marginBottom: 4 ,  backgroundColor: colors.primary[500] }}>
            <FormControl fullWidth>
              <InputLabel>Ressource à accorder</InputLabel>
              <Select
                value={selectedRessource}
                onChange={(e) => setSelectedRessource(e.target.value as string)}
                fullWidth
              >
                {ressources.map((resource: any) => (
                  <MenuItem key={resource.id} value={resource.id}>
                    {resource.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleAccorderRessource}
              variant="contained"
     
              sx={{ marginTop: 2 ,  bgcolor: colors.greenAccent[500] }}
            >
              Accorder la ressource
            </Button>
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>Utilisateur à ajouter</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value as string)}
                fullWidth
              >
                {users.map((user: any) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleAccorderUtilisateur}
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Ajouter l'utilisateur
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AccorderRessourcesEtUtilisateursPage;
