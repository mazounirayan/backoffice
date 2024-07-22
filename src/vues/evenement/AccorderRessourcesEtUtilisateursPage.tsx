import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const AccorderRessourcesEtUtilisateursPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [ressources, setRessources] = useState([]);
  const [selectedRessource, setSelectedRessource] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

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
    <div>
      <h2>Accorder des ressources et des utilisateurs pour l'événement</h2>
      
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
      <Button onClick={handleAccorderRessource} variant="contained" color="primary" style={{ marginTop: '10px' }}>
        Accorder la ressource
      </Button>

      <FormControl fullWidth style={{ marginTop: '20px' }}>
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
      <Button onClick={handleAccorderUtilisateur} variant="contained" color="primary" style={{ marginTop: '10px' }}>
        Ajouter l'utilisateur
      </Button>
    </div>
  );
};

export default AccorderRessourcesEtUtilisateursPage;
