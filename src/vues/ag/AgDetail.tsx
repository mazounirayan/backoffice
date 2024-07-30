import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAgById } from './agApi';
import { Ag, Proposition } from './types';
import { Typography, Box, Radio, Checkbox, FormControlLabel, Button, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { tokens } from '../../components/theme/theme';

interface PropositionFormProps {
  agId: string;
  [key: string]: string | undefined;
}


const AgDetail: React.FC = () => {
  const [ag, setAg] = useState<Ag | null>(null);
  const { id } = useParams<PropositionFormProps>();
  const [votes, setVotes] = useState<{ [key: number]: string[] }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  useEffect(() => {
    const getAgDetails = async () => {
      if (!id || !user) {
        return;
      }

      try {
        const agId = parseInt(id, 10);
        const data = await fetchAgById(agId);
        setAg(data);

        const initialVotes: { [key: number]: string[] } = {};
        data.propositions.forEach((prop: Proposition) => {
          initialVotes[prop.id] = [];
        });
        setVotes(initialVotes);
      } catch (error) {
        console.error('Error fetching AG details:', error);
      }
    };

    getAgDetails();
  }, [id]);

  const handleVoteChange = (propositionId: number, choice: string) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [propositionId]: [choice],
    }));
  };

  const handleCheckboxVoteChange = (propositionId: number, choice: string) => {
    setVotes((prevVotes) => {
      const previousChoices = prevVotes[propositionId] || [];
      if (previousChoices.includes(choice)) {
        return {
          ...prevVotes,
          [propositionId]: previousChoices.filter((ch) => ch !== choice),
        };
      } else {
        return {
          ...prevVotes,
          [propositionId]: [...previousChoices, choice],
        };
      }
    });
  };

  const handleSubmitVotes = async () => {
    const userId = user.id;
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    try {
      const promises = Object.entries(votes).flatMap(([propositionId, choices]) =>
        choices.map(choice =>
          axios.post('https://pa-api-0tcm.onrender.com/votes', {
            choix: choice,
            proposition: parseInt(propositionId, 10),
            user: user.id,
            numTour:1
          })
        )
      );

      await Promise.all(promises);

      console.log('Votes submitted successfully');
      localStorage.setItem(`votedAg-${id}`, 'true');
      navigate('/');
    } catch (error) {
      console.error('Error submitting votes:', error);
    }
  };

  const handleVoteConfirmation = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (confirmed: boolean) => {
    setOpenDialog(false);
    if (confirmed) {
      handleSubmitVotes();
    }
  };

  if (!ag) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        width: '50%',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  
        marginTop: '120px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {ag.nom}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {ag.description}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Date:</strong> {ag.date}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Nombre de participants:</strong> {ag.participations.length}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Propositions:
      </Typography>
      {ag.propositions.map((proposition) => (
        <Box key={proposition.id} sx={{ marginBottom: '20px' }}>
          <Typography variant="h6">{proposition.question}</Typography>
          {proposition.choix.map((choice) => (
            <FormControlLabel
              key={choice}
              control={
                proposition.type === 'checkbox' ? (
                  <Checkbox
                    checked={votes[proposition.id]?.includes(choice) || false}
                    onChange={() => handleCheckboxVoteChange(proposition.id, choice)}
                    sx={{ color: theme.palette.primary.main }}
                  />
                ) : (
                  <Radio
                    checked={votes[proposition.id]?.[0] === choice || false}
                    onChange={() => handleVoteChange(proposition.id, choice)}
                    sx={{ color: theme.palette.primary.main }}
                  />
                )
              }
              label={choice}
            />
          ))}
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleVoteConfirmation}
        sx={{ mt: 2 }}
      >
        Vote
      </Button>

      <Dialog
        open={openDialog}
        onClose={() => handleCloseDialog(false)}
      >
        <DialogTitle>Confirmer le vote</DialogTitle>
        <DialogContent>
          <DialogContentText>Voulez-vous confirmer votre vote ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={() => handleCloseDialog(true)} color="primary" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgDetail;
