// Dans AgResults.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

interface Vote {
  id: number;
  proposition: {
    id: number;
    question: string;
    type: string;
    choix: string[];
  };
  choix: string;
  numTour: number;
}

interface AgResult {
  id: number;
  nom: string;
  propositions: {
    id: number;
    question: string;
    type: string;
    choix: string[];
    results: {
      [key: string]: number;
    };
    totalVotes: number;
  }[];
}

const AgResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agResult, setAgResult] = useState<AgResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [agResponse, votesResponse] = await Promise.all([
          axios.get(`https://pa-api-0tcm.onrender.com/ags/${id}`),
          axios.get('https://pa-api-0tcm.onrender.com/votes')
        ]);

        const ag = agResponse.data;
        const votes: Vote[] = votesResponse.data.Votes;

        const agResult: AgResult = {
          id: ag.id,
          nom: ag.nom,
          propositions: ag.propositions.map((prop: any) => {
            const propVotes = votes.filter(v => v.proposition.id === prop.id);
            const results: { [key: string]: number } = {};
            prop.choix.forEach((choice: string) => {
              results[choice] = propVotes.filter(v => v.choix === choice).length;
            });
            return {
              ...prop,
              results,
              totalVotes: propVotes.length
            };
          })
        };

        setAgResult(agResult);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!agResult) {
    return <Typography>Aucun résultat trouvé.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Résultats de l'AG : {agResult.nom}</Typography>
      {agResult.propositions.map((prop) => (
        <Paper key={prop.id} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">{prop.question}</Typography>
          {prop.choix.map((choice) => (
            <Box key={choice} sx={{ mt: 1 }}>
              <Typography>
                {choice}: {prop.results[choice]} votes 
                ({((prop.results[choice] / prop.totalVotes) * 100).toFixed(2)}%)
              </Typography>
            </Box>
          ))}
          <Typography sx={{ mt: 1 }}>Total des votes: {prop.totalVotes}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default AgResults;