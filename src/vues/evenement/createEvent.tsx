import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface Demande {
  id: number;
  type: string;
  dateDemande: string;
  statut: string;
  emailVisiteur: string;
  autreDemandes: any[];
  evenementDemandes: any[];
  aideProjetDemandes: any[];
  parrainageDemandes: any[];
  parrain?: number; // Added for parrainage
}

const Demandes: React.FC = () => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('Evénement');
  const [openNbPlaceDialog, setOpenNbPlaceDialog] = useState<boolean>(false);
  const [openParrainageDialog, setOpenParrainageDialog] = useState<boolean>(false);
  const [openFinancementDialog, setOpenFinancementDialog] = useState<boolean>(false);
  const [currentDemande, setCurrentDemande] = useState<Demande | null>(null);
  const [nbPlace, setNbPlace] = useState<number | string>('');
  const [estReserve, setEstReserve] = useState<boolean>(false);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [financementData, setFinancementData] = useState<{ titre: string; description: string; budget: number; deadline: string } | null>(null);

  useEffect(() => {
    axios.get('https://pa-api-0tcm.onrender.com/demandes')
      .then(response => {
        setDemandes(response.data.Demandes);
        setLoading(false);
      })
      .catch(error => {
        setError('Erreur lors de la récupération des demandes');
        setLoading(false);
      });
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/users');
      setUsers(response.data.users);
    } catch (error) {
      setError('Erreur lors de la récupération des utilisateurs');
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
  };

  const handleAccept = (demande: Demande) => {
    if (demande.type === 'Parrainage') {
      setCurrentDemande(demande);
      fetchUsers();
      setOpenParrainageDialog(true);
    } else if (demande.type === 'Projet') {
      setCurrentDemande(demande);
      setFinancementData({
        titre: demande.aideProjetDemandes[0].titre,
        description: demande.aideProjetDemandes[0].descriptionProjet,
        budget: demande.aideProjetDemandes[0].budget,
        deadline: new Date(demande.aideProjetDemandes[0].deadline).toISOString().split('T')[0]
      });
      setOpenFinancementDialog(true);
    } else {
      setCurrentDemande(demande);
      setOpenNbPlaceDialog(true);
    }
  };

  const handleNbPlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNbPlace(event.target.value);
  };

  const handleEstReserveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEstReserve(event.target.checked);
  };

  const handleDialogClose = () => {
    setOpenNbPlaceDialog(false);
    setOpenParrainageDialog(false);
    setOpenFinancementDialog(false);
    setNbPlace('');
    setEstReserve(false);
    setSelectedUser(null);
  };

  const handleDialogSubmit = async () => {
    if (!currentDemande) return;

    try {
      if (currentDemande.type === 'Evénement') {
        await axios.patch(`https://pa-api-0tcm.onrender.com/demandes/${currentDemande.id}`, { statut: 'Acceptée' });

        await axios.post('https://pa-api-0tcm.onrender.com/evenements', {
          nom: currentDemande.evenementDemandes[0].titre,
          date: currentDemande.evenementDemandes[0].date,
          description: currentDemande.evenementDemandes[0].description,
          lieu: currentDemande.evenementDemandes[0].lieu,
          estReserve,
          nbPlace
        });

        setDemandes(demandes.map(demande =>
          demande.id === currentDemande.id ? { ...demande, statut: 'Acceptée' } : demande
        ));
      } else if (currentDemande.type === 'Parrainage') {
        if (selectedUser === null) {
          setError('Veuillez sélectionner un parrain.');
          return;
        }

        await axios.patch(`https://pa-api-0tcm.onrender.com/parrainage-demandes/${currentDemande.id}`, {
          parrain: selectedUser
        });

        setDemandes(demandes.map(demande =>
          demande.id === currentDemande.id ? { ...demande, statut: 'Acceptée', parrain: selectedUser } : demande
        ));
      } else if (currentDemande.type === 'Projet') {
        if (financementData) {
          await axios.post('https://pa-api-0tcm.onrender.com/aide-projet-demandes', {
            titre: financementData.titre,
            descriptionProjet: financementData.description,
            budget: financementData.budget,
            deadline: financementData.deadline
          });

          setDemandes(demandes.map(demande =>
            demande.id === currentDemande.id ? { ...demande, statut: 'Acceptée' } : demande
          ));
        }
      }
      handleDialogClose();
    } catch (error) {
      setError('Erreur lors de la mise à jour de la demande');
    }
  };

  const handleParrainageSubmit = async () => {
    if (!currentDemande || selectedUser === null) return;

    try {
      await axios.patch(`https://pa-api-0tcm.onrender.com/parrainage-demandes/${currentDemande.id}`, {
        parrain: selectedUser
      });

      setDemandes(demandes.map(demande =>
        demande.id === currentDemande.id ? { ...demande, statut: 'Acceptée', parrain: selectedUser } : demande
      ));
      handleDialogClose();
    } catch (error) {
      setError('Erreur lors de la mise à jour de la demande de parrainage');
    }
  };

  const handleFinancementSubmit = async () => {
    if (!currentDemande || !financementData) return;

    try {
      await axios.post('https://pa-api-0tcm.onrender.com/aide-projet-demandes', {
        titre: financementData.titre,
        descriptionProjet: financementData.description,
        budget: financementData.budget,
        deadline: financementData.deadline
      });

      setDemandes(demandes.map(demande =>
        demande.id === currentDemande.id ? { ...demande, statut: 'Acceptée' } : demande
      ));
      handleDialogClose();
    } catch (error) {
      setError('Erreur lors de la mise à jour de la demande de financement');
    }
  };

  const handleAction = (id: number, action: 'Acceptée' | 'Refusée') => {
    axios.patch(`https://pa-api-0tcm.onrender.com/demandes/${id}`, { statut: action })
      .then(response => {
        setDemandes(demandes.map(demande =>
          demande.id === id ? { ...demande, statut: action } : demande
        ));
      })
      .catch(error => {
        setError('Erreur lors de la mise à jour de la demande');
      });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  const renderDemandesByType = (type: string) => {
    return demandes.filter(demande => demande.type === type).map(demande => (
      <Box key={demande.id} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2, borderRadius: 2 }}>
        <Typography variant="h6">ID: {demande.id}</Typography>
        <Typography>Type: {demande.type}</Typography>
        <Typography>Date de demande: {new Date(demande.dateDemande).toLocaleString()}</Typography>
        <Typography>Statut: {demande.statut}</Typography>
        <Typography>Email Visiteur: {demande.emailVisiteur}</Typography>
        <Box>
          {demande.type === 'Evénement' && demande.evenementDemandes.map(event => (
            <Box key={event.id} sx={{ marginTop: 1 }}>
              <Typography variant="subtitle1">Titre: {event.titre}</Typography>
              <Typography>Date: {new Date(event.date).toLocaleString()}</Typography>
              <Typography>Description: {event.description}</Typography>
              <Typography>Lieu: {event.lieu}</Typography>
            </Box>
          ))}
          {demande.type === 'Projet' && demande.aideProjetDemandes.map(projet => (
            <Box key={projet.id} sx={{ marginTop: 1 }}>
              <Typography variant="subtitle1">Titre: {projet.titre}</Typography>
              <Typography>Description: {projet.descriptionProjet}</Typography>
              <Typography>Budget: {projet.budget}</Typography>
              <Typography>Deadline: {new Date(projet.deadline).toLocaleString()}</Typography>
            </Box>
          ))}
          {demande.type === 'Parrainage' && demande.parrainageDemandes.map(parrainage => (
            <Box key={parrainage.id} sx={{ marginTop: 1 }}>
              <Typography variant="subtitle1">Détails: {parrainage.detailsParrainage}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleAccept(demande)} sx={{ marginRight: 1 }}>Accepter</Button>
          <Button variant="contained" color="secondary" onClick={() => handleAction(demande.id, 'Refusée')}>Refuser</Button>
        </Box>
      </Box>
    ));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Demandes</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Sélectionnez le type de demande:</Typography>
        <Select value={selectedType} onChange={handleTypeChange}>
          <MenuItem value="Evénement">Evénement</MenuItem>
          <MenuItem value="Projet">Projet</MenuItem>
          <MenuItem value="Parrainage">Parrainage</MenuItem>
        </Select>
      </Box>
      {renderDemandesByType(selectedType)}

      {/* Dialog for Event Details */}
      <Dialog open={openNbPlaceDialog} onClose={handleDialogClose}>
        <DialogTitle>Ajouter un Événement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nbPlace"
            label="Nombre de Places"
            type="number"
            fullWidth
            variant="standard"
            value={nbPlace}
            onChange={handleNbPlaceChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={estReserve}
                onChange={handleEstReserveChange}
                name="estReserve"
              />
            }
            label="Réservé"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Annuler</Button>
          <Button onClick={handleDialogSubmit} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Parrainage */}
      <Dialog open={openParrainageDialog} onClose={handleDialogClose}>
        <DialogTitle>Attribuer un Parrain</DialogTitle>
        <DialogContent>
          <Select
            value={selectedUser ?? ''}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
            fullWidth
          >
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Annuler</Button>
          <Button onClick={handleParrainageSubmit} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Financement */}
      <Dialog open={openFinancementDialog} onClose={handleDialogClose}>
        <DialogTitle>Ajouter une Aide au Projet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="titre"
            label="Titre"
            fullWidth
            variant="standard"
            value={financementData?.titre ?? ''}
            onChange={(e) => setFinancementData(prev => ({ ...prev!, titre: e.target.value }))}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            variant="standard"
            value={financementData?.description ?? ''}
            onChange={(e) => setFinancementData(prev => ({ ...prev!, description: e.target.value }))}
          />
          <TextField
            margin="dense"
            id="budget"
            label="Budget"
            type="number"
            fullWidth
            variant="standard"
            value={financementData?.budget ?? ''}
            onChange={(e) => setFinancementData(prev => ({ ...prev!, budget: Number(e.target.value) }))}
          />
          <TextField
            margin="dense"
            id="deadline"
            label="Deadline"
            type="date"
            fullWidth
            variant="standard"
            value={financementData?.deadline ?? ''}
            onChange={(e) => setFinancementData(prev => ({ ...prev!, deadline: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Annuler</Button>
          <Button onClick={handleFinancementSubmit} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Demandes;
