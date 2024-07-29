import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent, RadioGroup,
  FormControlLabel, Radio, Snackbar
} from '@mui/material';
import data from '../../services/data';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Choix {
  id: number;
  texte: string;
}

interface Proposition {
  id: number;
  question: string;
  choix: string[];
  type: string;
}

interface Sondage {
  id: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  propositions: Proposition[];
}

interface Vote {
  id: number;
  proposition: {
    id: number;
    question: string;
    type: string;
    choix: string[];
  };
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    estBenevole: boolean;
    numTel: string;
    profession: string;
    estEnLigne: boolean;
  };
  choix: string;
  numTour: number;
}

const VotePage: React.FC = () => {
  const { sondageId } = useParams<{ sondageId: string }>();
  const navigate = useNavigate();
  const [sondage, setSondage] = useState<Sondage | null>(null);
  const [selectedChoix, setSelectedChoix] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    fetchSondage();
  
  }, [sondageId]);

  const fetchSondage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sondages/${sondageId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération du sondage');
      const data = await response.json();
      setSondage(data);
    } catch (error) {
      console.error('Error fetching sondage:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la récupération du sondage' });
    }
  };


  const handleVote = async () => {
    if (!selectedChoix || !sondage) return;

    const voteKey = `vote_${sondageId}`;

    try {
      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choix: selectedChoix,
          numTour: 1,
          proposition: sondage.propositions[0].id,
          user: JSON.parse(localStorage.getItem('loggedInUser') || '{}').id
        })
      });

      if (!response.ok) throw new Error('Failed to submit vote');

      localStorage.setItem(voteKey, 'true');
      setSnackbar({ open: true, message: 'Vote enregistré avec succès!' });
    
    } catch (error) {
      console.error('Error submitting vote:', error);
      setSnackbar({ open: true, message: 'Erreur lors de l\'enregistrement du vote' });
    }
  };

  useEffect(() => {
    if (sondage) {
      const endDate = new Date(sondage.dateFin);
      const interval = setInterval(() => {
        const now = new Date();
        console.log(endDate,"fin")
        console.log(now,"debut")

        if (now > endDate) {
          clearInterval(interval);
         alert("depasser")
         /* navigate(`/results/${sondageId}`);*/
        }
      }, 10000); // Vérifie toutes les 10 secondes
      return () => clearInterval(interval);
    }
  }, [sondage, sondageId, navigate]);

  const now = new Date();
  const startDate = new Date(sondage?.dateDebut || '');
  const endDate = new Date(sondage?.dateFin || '');
  const voteStatus =
    now < startDate ? "Le vote n'a pas encore commencé" :
      now > endDate ? "Le vote est terminé" :
        "Le vote est en cours";

  if (!sondage) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>{sondage.nom}</Typography>
      <Typography variant="body1" gutterBottom>{sondage.description}</Typography>
      <Typography variant="subtitle1" gutterBottom>
        {voteStatus}
      </Typography>

      {sondage.propositions.map((proposition) => (
        <Card key={proposition.id} sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{proposition.question}</Typography>
            <RadioGroup
              value={selectedChoix}
              onChange={(e) => setSelectedChoix(e.target.value)}
            >
              {proposition.choix.map((choix, index) => (
                <FormControlLabel
                  key={index}
                  value={choix}
                  control={<Radio />}
                  label={choix}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleVote}
        sx={{ marginTop: 2 }}
      >
        Voter
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default VotePage;
