import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Select, MenuItem,
  Card, CardContent, CardActions, Stepper, Step, StepLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Snackbar, SelectChangeEvent
} from '@mui/material';
import { HowToVote, EmojiEvents, Assignment, People } from '@mui/icons-material';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

// Types
type ElectionStatus = 'en cours' | 'terminé' | 'à venir';
type ElectionType = 'majoritaire' | 'proportionnel' | 'préférentiel';

interface Election {
  id: number;
  title: string;
  status: ElectionStatus;
  type: ElectionType;
 
}

interface SnackbarState {
  open: boolean;
  message: string;
}

const AdvancedVotingSystem: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [currentElection, setCurrentElection] = useState<Election | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '' });
  const [newElectionTitle, setNewElectionTitle] = useState<string>('');
  const [newElectionType, setNewElectionType] = useState<ElectionType>('majoritaire');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async (): Promise<void> => {
    const mockElections: Election[] = [
      { id: 1, title: "Élection du conseil d'administration", status: 'en cours', type: 'majoritaire' },
      { id: 2, title: "Modification des statuts", status: 'terminé', type: 'proportionnel' },
      { id: 3, title: "Choix du nouveau logo", status: 'à venir', type: 'préférentiel'},
    ];
    setElections(mockElections);
  };

  const handleCreateElection = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handleSubmitElection = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // Logique pour créer une nouvelle élection
    const newElection: Election = {
      id: elections.length + 1,
      title: newElectionTitle,
      status: 'à venir',
      type: newElectionType,

    };
    setElections([...elections, newElection]);
    setOpenDialog(false);
    setSnackbar({ open: true, message: 'Nouvelle élection créée avec succès!' });
  };

  const handleVote = (): void => {
    // Logique pour enregistrer le vote
    setActiveStep((prevStep) => prevStep + 1);
    setSnackbar({ open: true, message: 'Vote enregistré avec succès!' });
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleElectionTypeChange = (event: SelectChangeEvent<ElectionType>): void => {
    setNewElectionType(event.target.value as ElectionType);
  };

  const steps: string[] = ['Identification', 'Choix du candidat', 'Confirmation', 'Vote enregistré'];

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Système de Vote Innovant
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Assignment />}
          onClick={handleCreateElection}
        >
          Créer une nouvelle élection
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<EmojiEvents />}
        >
          Voir les résultats
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Élections en cours
      </Typography>

      {elections.map((election) => (
        <Card key={election.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{election.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
              <Chip 
                label={election.status} 
                color={election.status === 'en cours' ? 'success' : 'default'}
                size="small"
                sx={{ marginRight: 1 }}
              />
              <Chip 
                label={election.type} 
                variant="outlined"
                size="small"
                sx={{ marginRight: 1 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
               
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              startIcon={<HowToVote />}
              onClick={() => setCurrentElection(election)}
            >
              Voter
            </Button>
          </CardActions>
        </Card>
      ))}

      {currentElection && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            {currentElection.title}
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ marginTop: 4 }}>
            {activeStep === 0 && (
              <TextField
                label="Numéro d'identification"
                variant="outlined"
                fullWidth
              />
            )}
            {activeStep === 1 && (
              <Select
                label="Choisissez votre candidat"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="candidat1">Candidat 1</MenuItem>
                <MenuItem value="candidat2">Candidat 2</MenuItem>
                <MenuItem value="candidat3">Candidat 3</MenuItem>
              </Select>
            )}
            {activeStep === 2 && (
              <Typography>
                Veuillez confirmer votre choix.
              </Typography>
            )}
            {activeStep === 3 && (
              <Typography>
                Votre vote a été enregistré. Merci de votre participation!
              </Typography>
            )}
            {activeStep < 3 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleVote}
                sx={{ marginTop: 2 }}
              >
                {activeStep === 2 ? 'Confirmer' : 'Suivant'}
              </Button>
            )}
          </Box>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Créer une nouvelle élection</DialogTitle>
        <form onSubmit={handleSubmitElection}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Titre de l'élection"
              type="text"
              fullWidth
              variant="outlined"
              value={newElectionTitle}
              onChange={(e) => setNewElectionTitle(e.target.value)}
            />
            <Select
              label="Type d'élection"
              variant="outlined"
              fullWidth
              sx={{ marginTop: 2 }}
              value={newElectionType}
              onChange={handleElectionTypeChange}
            >
              <MenuItem value="majoritaire">Majoritaire</MenuItem>
              <MenuItem value="proportionnel">Proportionnel</MenuItem>
              <MenuItem value="préférentiel">Préférentiel</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained">Créer</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default AdvancedVotingSystem;
