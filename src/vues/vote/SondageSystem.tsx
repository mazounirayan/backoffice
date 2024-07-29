import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem,
  Card, CardContent, CardActions, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Snackbar, SelectChangeEvent,
  FormControl, InputLabel, IconButton,
  useTheme
} from '@mui/material';
import { Assignment, Add, Edit, Delete } from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { tokens } from '../../components/theme/theme';
const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

// Types
type TypeSondage = 'UN_TOUR' | 'DEUX_TOURS';
type TypeProposition = 'radio' | 'checkbox';

interface Sondage {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  typeSondage: TypeSondage;
  propositions: Proposition[];
}

interface Proposition {
  id: number;
  question: string;
  type: TypeProposition;
  choix: string[];
  ag: null;
  sondage: Omit<Sondage, 'propositions'>;
  votes: any[];
}

interface SnackbarState {
  open: boolean;
  message: string;
}

// Component
const SondageSystem: React.FC = () => {
  const [sondages, setSondages] = useState<Sondage[]>([]);
  const [openSondageDialog, setOpenSondageDialog] = useState(false);
  const [openPropositionDialog, setOpenPropositionDialog] = useState(false);
  const [currentSondage, setCurrentSondage] = useState<Sondage | null>(null);
  const [currentProposition, setCurrentProposition] = useState<Proposition | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  const [newSondage, setNewSondage] = useState<Omit<Sondage, 'id' | 'propositions'>>({
    nom: '',
    dateDebut: new Date().toISOString(),
    dateFin: new Date().toISOString(),
    description: '',
    typeSondage: 'UN_TOUR'
  });

  const [newProposition, setNewProposition] = useState<Omit<Proposition, 'id' | 'ag' | 'sondage' | 'votes'>>({
    question: '',
    type: 'radio',
    choix: ['', '']
  });

  useEffect(() => {
    fetchSondages();
  }, []);

  const fetchSondages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sondages`);
      const data = await response.json();
      setSondages(data.Sondages);
    } catch (error) {
      console.error('Error fetching sondages:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la récupération des sondages' });
    }
  };

  const handleSondageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const today = new Date().toISOString();
  console.log(newSondage.dateDebut)
  console.log(today)
    if (newSondage.dateDebut < today) {
      setSnackbar({ open: true, message: 'La date de début ne peut pas être antérieure à aujourd\'hui.' });
      return;
    }
  
    try {
      const url = isEditing ? `${API_BASE_URL}/sondages/${currentSondage?.id}` : `${API_BASE_URL}/sondages`;
      const method = isEditing ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSondage)
      });
      if (response.ok) {
        setOpenSondageDialog(false);
        setSnackbar({ open: true, message: `Sondage ${isEditing ? 'modifié' : 'créé'} avec succès!` });
        fetchSondages();
      } else {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} sondage`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} sondage:`, error);
      setSnackbar({ open: true, message: `Erreur lors de la ${isEditing ? 'modification' : 'création'} du sondage` });
    }
  };
  
  const handlePropositionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentSondage) return;

    try {
      const url = isEditing ? `${API_BASE_URL}/propositions/${currentProposition?.id}` : `${API_BASE_URL}/propositions`;
      const method = isEditing ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProposition,
          sondage: currentSondage.id 
        })
      });
      if (response.ok) {
        setOpenPropositionDialog(false);
        setSnackbar({ open: true, message: `Proposition ${isEditing ? 'modifiée' : 'ajoutée'} avec succès!` });
        fetchSondages();
      } else {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} proposition`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} proposition:`, error);
      setSnackbar({ open: true, message: `Erreur lors de la ${isEditing ? 'modification' : 'création'} de la proposition` });
    }
  };

  const handleDeleteProposition = async (propositionId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/propositions/${propositionId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Proposition supprimée avec succès!' });
        fetchSondages();
      } else {
        throw new Error('Failed to delete proposition');
      }
    } catch (error) {
      console.error('Error deleting proposition:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la suppression de la proposition' });
    }
  };
  const handleDeleteSondage = async (sondageId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sondages/${sondageId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Sondage supprimé avec succès!' });
        fetchSondages();
      } else {
        throw new Error('Failed to delete sondage');
      }
    } catch (error) {
      console.error('Error deleting sondage:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la suppression du sondage' });
    }
  };
  
  const handleAddChoice = () => {
    setNewProposition(prev => ({
      ...prev,
      choix: [...prev.choix, '']
    }));
  };

  const handleRemoveChoice = (index: number) => {
    setNewProposition(prev => ({
      ...prev,
      choix: prev.choix.filter((_, i) => i !== index)
    }));
  };

  const handleChoiceChange = (index: number, value: string) => {
    setNewProposition(prev => ({
      ...prev,
      choix: prev.choix.map((choice, i) => i === index ? value : choice)
    }));
  };

  const handleEditSondage = (sondage: Sondage) => {
    setCurrentSondage(sondage);
    setNewSondage({
      nom: sondage.nom,
      dateDebut: sondage.dateDebut,
      dateFin: sondage.dateFin,
      description: sondage.description,
      typeSondage: sondage.typeSondage
    });
    setIsEditing(true);
    setOpenSondageDialog(true);
  };

  const handleEditProposition = (proposition: Proposition) => {
    setCurrentProposition(proposition);
    setNewProposition({
      question: proposition.question,
      type: proposition.type,
      choix: proposition.choix
    });
    setIsEditing(true);
    setOpenPropositionDialog(true);
  };

  const openAddSondageDialog = () => {
    setCurrentSondage(null);
    setNewSondage({
      nom: '',
      dateDebut: new Date().toISOString(),
      dateFin: new Date().toISOString(),
      description: '',
      typeSondage: 'UN_TOUR'
    });
    setIsEditing(false);
    setOpenSondageDialog(true);
  };

  const openAddPropositionDialog = (sondage: Sondage) => {
    setCurrentSondage(sondage);
    setCurrentProposition(null);
    setNewProposition({
      question: '',
      type: 'radio',
      choix: ['', '']
    });
    setIsEditing(false);
    setOpenPropositionDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: colors.primary[500] }}>
      <Typography variant="h4" gutterBottom>
        Système de gestion des sondages
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={openAddSondageDialog}
        sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
      >
        Ajouter un sondage
      </Button>
      <Box sx={{ mt: 2 }}>
        {sondages.map((sondage) => (
          <Card key={sondage.id} sx={{ mb: 2, backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h5">{sondage.nom}</Typography>
              <Typography variant="body1">{sondage.description}</Typography>
              <Typography variant="body2">
                Début: {new Date(sondage.dateDebut).toLocaleString()} - Fin: {new Date(sondage.dateFin).toLocaleString()}
              </Typography>
              <Typography variant="body2">Type: {sondage.typeSondage}</Typography>
              <Box sx={{ mt: 2 }}>
                {sondage.propositions.map((proposition) => (
                  <Card key={proposition.id} sx={{ mb: 1, backgroundColor: colors.primary[300] }}>
                    <CardContent>
                      <Typography variant="h6">{proposition.question}</Typography>
                      <Typography variant="body2">Type: {proposition.type}</Typography>
                      <Box sx={{ mt: 1 }}>
                        {proposition.choix.map((choice, index) => (
                          <Chip key={index} label={choice} sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => handleEditProposition(proposition)}
                        sx={{ backgroundColor: 'orange', color: 'white', '&:hover': { backgroundColor: 'darkorange' } }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteProposition(proposition.id)}
                        sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
                      >
                        Supprimer
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openAddPropositionDialog(sondage)}
                sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
              >
                Ajouter une proposition
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => handleEditSondage(sondage)}
                sx={{ backgroundColor: 'orange', color: 'white', '&:hover': { backgroundColor: 'darkorange' } }}
              >
                Modifier le sondage
              </Button>
              <Button
                variant="contained"
                startIcon={<Delete />}
                onClick={() => handleDeleteSondage(sondage.id)}
                sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
              >
                Supprimer le sondage
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Dialog open={openSondageDialog} onClose={() => setOpenSondageDialog(false)}>
        <DialogTitle>{isEditing ? 'Modifier' : 'Ajouter'} un sondage</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSondageSubmit}>
            <TextField
              label="Nom"
              fullWidth
              margin="normal"
              value={newSondage.nom}
              onChange={(e) => setNewSondage({ ...newSondage, nom: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                label="Date de début"
                value={new Date(newSondage.dateDebut)}
                onChange={(date) => setNewSondage({ ...newSondage, dateDebut: date?.toISOString() || new Date().toISOString() })}    
            />
            <DateTimePicker
            label="Date de fin"
            value={new Date(newSondage.dateFin)}
            onChange={(date) => setNewSondage({ ...newSondage, dateFin: date?.toISOString() || new Date().toISOString() })}
            />

            </LocalizationProvider>
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={newSondage.description}
              onChange={(e) => setNewSondage({ ...newSondage, description: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type de sondage</InputLabel>
              <Select
                value={newSondage.typeSondage}
                onChange={(e: SelectChangeEvent<TypeSondage>) =>
                  setNewSondage({ ...newSondage, typeSondage: e.target.value as TypeSondage })
                }
              >
                <MenuItem value="UN_TOUR">Un tour</MenuItem>
                <MenuItem value="DEUX_TOURS">Deux tours</MenuItem>
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={() => setOpenSondageDialog(false)} color="primary">
                Annuler
              </Button>
              <Button type="submit" color="primary">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openPropositionDialog} onClose={() => setOpenPropositionDialog(false)}>
        <DialogTitle>{isEditing ? 'Modifier' : 'Ajouter'} une proposition</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePropositionSubmit}>
            <TextField
              label="Question"
              fullWidth
              margin="normal"
              value={newProposition.question}
              onChange={(e) => setNewProposition({ ...newProposition, question: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type de proposition</InputLabel>
              <Select
                value={newProposition.type}
                onChange={(e: SelectChangeEvent<TypeProposition>) =>
                  setNewProposition({ ...newProposition, type: e.target.value as TypeProposition })
                }
              >
                <MenuItem value="radio">Radio</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
              </Select>
            </FormControl>
            {newProposition.choix.map((choice, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  label={`Choix ${index + 1}`}
                  fullWidth
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={() => handleRemoveChoice(index)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddChoice} startIcon={<Add />} sx={{ mt: 2 }}>
              Ajouter un choix
            </Button>
            <DialogActions>
              <Button onClick={() => setOpenPropositionDialog(false)} color="primary">
                Annuler
              </Button>
              <Button type="submit" color="primary">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default SondageSystem;

