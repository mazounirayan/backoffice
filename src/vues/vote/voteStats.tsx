import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Typography, Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

interface Proposition {
  id: number;
  question: string;
  type: string;
  choix: string[];
}

interface Vote {
  id: number;
  proposition: Proposition;
  choix: string;
  numTour: number;
}

interface Sondage {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  typeSondage: string;
  propositions: Proposition[];
}

interface VotesResponse {
  Votes: Vote[];
  totalCount: number;
}

interface SondagesResponse {
  Sondages: Sondage[];
  totalCount: number;
}

interface ChoicePercentage {
  choice: string;
  count: number;
  percentage: number;
}

interface ProposalStatistics {
  propositionId: number;
  question: string;
  choices: ChoicePercentage[];
  totalVotes: number;
}

interface SondageStatistics {
  sondageId: number;
  sondageNom: string;
  typeSondage: string;
  propositions: ProposalStatistics[];
}

const VoteStatistics: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [sondage, setSondage] = useState<Sondage | null>(null);
  const [statistics, setStatistics] = useState<SondageStatistics | null>(null);
  const [winners, setWinners] = useState<string | null>(null);
  const [secondRoundNeeded, setSecondRoundNeeded] = useState<boolean>(false);
  const [isSondageFinished, setIsSondageFinished] = useState<boolean>(false);
  const navigate = useNavigate();
  const { sondageId } = useParams<{ sondageId?: string }>();

  useEffect(() => {
    if (!sondageId) {
      console.error('Sondage ID is missing');
      return;
    }

    const fetchVotes = async () => {
      try {
        const response = await fetch('https://pa-api-0tcm.onrender.com/votes');
        const data: VotesResponse = await response.json();
        setVotes(data.Votes);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    const fetchSondages = async () => {
      try {
        const response = await fetch('https://pa-api-0tcm.onrender.com/sondages');
        const data: SondagesResponse = await response.json();
        const foundSondage = data.Sondages.find(s => s.id.toString() === sondageId);
        setSondage(foundSondage || null);
      } catch (error) {
        console.error('Error fetching sondages:', error);
      }
    };
    
    const checkSondageStatus = () => {
        if (sondage) {
          const now = new Date();
          const endDate = new Date(sondage.dateFin);
          setIsSondageFinished(now > endDate);
        }
      };
      fetchVotes();
      fetchSondages();
      const intervalId = setInterval(() => {
        checkSondageStatus();
        if (isSondageFinished) {
            fetchVotes();
            fetchSondages();
        }
      }, 10000);

  






      return () => clearInterval(intervalId);
  }, [sondageId,isSondageFinished]);

  useEffect(() => {
    if (votes.length > 0 && sondage) {
      const calculateStatistics = () => {
        const proposalVotes: { [key: number]: { [key: string]: number } } = {};
        const totalVotes: { [key: number]: number } = {};

        votes.forEach(vote => {
          const propId = vote.proposition.id;
          const choice = vote.choix;

          if (sondage.propositions.some(p => p.id === propId)) {
            if (!proposalVotes[propId]) {
              proposalVotes[propId] = {};
              totalVotes[propId] = 0;
            }

            if (proposalVotes[propId][choice]) {
              proposalVotes[propId][choice]++;
            } else {
              proposalVotes[propId][choice] = 1;
            }

            totalVotes[propId]++;
          }
        });

        const propositionsStatistics: ProposalStatistics[] = sondage.propositions.map(proposition => {
          const propId = proposition.id;
          const choices = proposalVotes[propId] || {};
          const total = totalVotes[propId] || 0;
          const choicePercentages: ChoicePercentage[] = Object.keys(choices).map(choice => ({
            choice,
            count: choices[choice],
            percentage: (choices[choice] / total) * 100,
          }));

          let winner: string | null = null;
          let needSecondRound = false;

          if (sondage.typeSondage === 'UN_TOUR') {
            winner = choicePercentages.reduce((a, b) => a.percentage > b.percentage ? a : b).choice;
          } else if (sondage.typeSondage === 'DEUX_TOURS') {
            const topChoice = choicePercentages.reduce((a, b) => a.percentage > b.percentage ? a : b);
            if (topChoice.percentage > 50) {
              winner = topChoice.choice;
            } else {
              needSecondRound = true;
            }
          }

          setWinners(winner);
          setSecondRoundNeeded(needSecondRound);

          return {
            propositionId: propId,
            question: proposition.question,
            choices: choicePercentages,
            totalVotes: total,
          };
        });

        setStatistics({
          sondageId: sondage.id,
          sondageNom: sondage.nom,
          typeSondage: sondage.typeSondage,
          propositions: propositionsStatistics,
        });
      };

      calculateStatistics();
    }
  }, [votes, sondage]);

  const createSecondRound = async () => {
    if (!sondage || !statistics) return;

    const topTwoChoices = statistics.propositions[0].choices
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 2)
      .map(c => c.choice);

    const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000);

    try {
      const sondageResponse = await fetch('https://pa-api-0tcm.onrender.com/sondages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: `${sondage.nom} - 2ème tour`,
          dateDebut: oneHourLater.toISOString(),
          dateFin: new Date(oneHourLater.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          description: `Deuxième tour pour ${sondage.nom}`,
          typeSondage: 'UN_TOUR',
        })
      });

      if (!sondageResponse.ok) {
        throw new Error('Erreur lors de la création du sondage pour le deuxième tour');
      }

      const newSondage = await sondageResponse.json();

      const propositionResponse = await fetch('https://pa-api-0tcm.onrender.com/propositions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: statistics.propositions[0].question,
          choix: topTwoChoices,
          type: "radio",
          sondage: newSondage.id
        })
      });

      if (!propositionResponse.ok) {
        throw new Error('Erreur lors de la création de la proposition pour le deuxième tour');
      }

      alert('Deuxième tour créé avec succès!');
      navigate(`/vote`);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du deuxième tour');
    }
  };

  if (!sondage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5" color="textSecondary">Sondage non trouvé.</Typography>
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Statistiques des Votes
      </Typography>
      <Typography variant="h5" color="primary" gutterBottom>
        {sondage?.nom}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <strong>Type de Sondage:</strong> {sondage?.typeSondage}
      </Typography>
      
      {!isSondageFinished ? (
        <Typography variant="h6" color="textSecondary">
          Le sondage n'est pas encore terminé. Les résultats seront disponibles après {sondage?.dateFin}.
        </Typography>
      ) : (
        <>
          {statistics && statistics.propositions.map(stat => (
            <Paper key={stat.propositionId} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom>
                {stat.question}
              </Typography>
              <List>
                {stat.choices.map(choice => (
                  <ListItem key={choice.choice}>
                    <ListItemText
                      primary={`${choice.choice}: ${choice.count} vote(s)`}
                      secondary={`${choice.percentage.toFixed(2)}%`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="subtitle2">
                <strong>Total de Votes:</strong> {stat.totalVotes}
              </Typography>
            </Paper>
          ))}
          {winners && (
            <Typography variant="h6" color="success.main" gutterBottom>
              <strong>Gagnant:</strong> {winners}
            </Typography>
          )}
          {secondRoundNeeded && (
            <Box mt={3} display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body1" gutterBottom>
                Un second tour est nécessaire.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={createSecondRound}
              >
                Créer le deuxième tour
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default VoteStatistics;
