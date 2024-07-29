import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent, RadioGroup,
  FormControlLabel, Radio, Snackbar
} from '@mui/material';

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
  const [showResultsButton, setShowResultsButton] = useState(false);

  useEffect(() => {
    fetchSondage();
    fetchVotes();
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

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/votes`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des votes');
      const data = await response.json();
      setVotes(data.Votes);
    } catch (error) {
      console.error('Error fetching votes:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la récupération des votes' });
    }
  };

  const handleVote = async () => {
    if (!selectedChoix || !sondage) return;

    const voteKey = `vote_${sondageId}`;
    if (localStorage.getItem(voteKey)) {
      setSnackbar({ open: true, message: 'Vous avez déjà voté.' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choix: selectedChoix,
          numTour: 1,
          proposition: sondage.propositions[0].id,
          user: 1
        })
      });

      if (!response.ok) throw new Error('Failed to submit vote');

      localStorage.setItem(voteKey, 'true');
      setSnackbar({ open: true, message: 'Vote enregistré avec succès!' });
      fetchVotes();
      const votesResponse = await fetch(`${API_BASE_URL}/votes`);
      if (!votesResponse.ok) throw new Error('Failed to fetch votes');
      
      const votesData = await votesResponse.json();
      const filteredVotes = votesData.Votes.filter((vote: Vote) => vote.proposition.id === sondage?.propositions[0].id);
      const voteCounts :number = filteredVotes.reduce((acc: any, vote: Vote) => {
        acc[vote.choix] = (acc[vote.choix] || 0) + 1;
        return acc;
      }, {});
      const sortedChoices = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
      const topTwoChoices = sortedChoices.slice(0, 2).map(choice => choice[0]);
  
      const hasMajority = sortedChoices.length > 0 && sortedChoices[0][1] > filteredVotes.length / 2;
      console.log(hasMajority)
      if (hasMajority) {
    
        navigate(`/results/${sondageId}`);
      } else {
        await createNewSondage(voteCounts);
        navigate(`/vote/${sondageId}`); 
      }



    } catch (error) {
      console.error('Error submitting vote:', error);
      setSnackbar({ open: true, message: 'Erreur lors de l\'enregistrement du vote' });
    }
  };

  useEffect(() => {
    if (sondage) {
      const now = new Date();
      const endDate = new Date(sondage.dateFin);

      if (now > endDate) {
        
        calculateResults()
      } else {
    
        const interval = setInterval(() => {
          const now = new Date();
          if (now > endDate) {
            clearInterval(interval);
            navigate(`/results/${sondageId}`);
          }
        }, 10000); 
        return () => clearInterval(interval);
      }
    }
  }, [sondage, sondageId, navigate]);

  const calculateResults = () => {
    if (!sondage) return;

    const propositionId = sondage.propositions[0].id;
    const filteredVotes = votes.filter(vote => vote.proposition.id === propositionId);

    const voteCounts:number = filteredVotes.reduce((acc: any, vote: Vote) => {
      acc[vote.choix] = (acc[vote.choix] || 0) + 1;
      return acc;
    }, {});

    const totalVotes = filteredVotes.length;
    const maxVotes = Math.max(...Object.values(voteCounts));
    const majority = maxVotes > totalVotes / 2;

    if (majority) {
      setShowResultsButton(true);
    } else {
      createNewSondage(voteCounts);
    }
  };

  const createNewSondage = async (voteCounts: number) => {
    const sortedChoices = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
    const topTwoChoices = sortedChoices.slice(0, 2).map(choice => choice[0]);
      console.log(topTwoChoices)
    try {
   
      const surveyResponse = await fetch(`${API_BASE_URL}/sondages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: `${sondage?.nom} - Second Tour`,
          description: `Deuxième tour pour ${sondage?.nom}`,
          dateDebut: new Date().toISOString(),
          dateFin: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          typeSondage: "DEUX_TOURS",
          
        })
      });
  
      if (!surveyResponse.ok) throw new Error('Failed to create new sondage');
      
      const newSurvey = await surveyResponse.json();
  
      // Create the new proposition for the new survey
      const propositionResponse = await fetch(`${API_BASE_URL}/propositions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: sondage?.propositions[0].question,
          choix: topTwoChoices,
          type: 'radio',
          sondage: newSurvey.id
        })
      });
  
      if (!propositionResponse.ok) throw new Error('Failed to create new proposition');
  
      setSnackbar({ open: true, message: 'Nouveau sondage et proposition créés pour le second tour' });
    } catch (error) {
      console.error('Error creating new sondage:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la création du nouveau sondage' });
    }
  };
  
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

      {showResultsButton && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/results/${sondage.id}`)}
          sx={{ marginTop: 2 }}
        >
          Voir les résultats
        </Button>
      )}

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
