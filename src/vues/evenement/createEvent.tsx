import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

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
      alert('Événement créé avec succès. Vous pouvez maintenant accorder des ressources et des utilisateurs.');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleAccorderRessource = async () => {
    if (!evenementId || !selectedRessource) return;
    try {
      await axios.post('https://pa-api-0tcm.onrender.com/evenement-ressources', {
        evenement: evenementId,
        ressource: selectedRessource
      });
      alert('Ressource accordée avec succès');
    } catch (error) {
      console.error('Error accordering resource:', error);
    }
  };

  const handleAccorderUtilisateur = async () => {
    if (!evenementId || !selectedUser) return;
    try {
      await axios.post('https://pa-api-0tcm.onrender.com/evenement-users', {
        evenement: evenementId,
        user: selectedUser
      });
      alert('Utilisateur ajouté avec succès');
    } catch (error) {
      console.error('Error accordering user:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateEvent}>
        <TextField
          label="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
        <TextField
          label="Lieu"
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          fullWidth
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
        />
        <TextField
          label="Nombre de places"
          type="number"
          value={nbPlace}
          onChange={(e) => setNbPlace(Number(e.target.value))}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Créer l'événement
        </Button>
      </form>

      {evenementId && (
        <div>
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
          <Button onClick={handleAccorderRessource} variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Accorder la ressource
          </Button>

          <h2>Sélectionner les utilisateurs pour l'événement</h2>
          <FormControl fullWidth style={{ marginTop: '20px' }}>
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
          <Button onClick={handleAccorderUtilisateur} variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Ajouter l'utilisateur
          </Button>
        </div>
      )}
    </div>
  );
};

export default EvenementsPage;
