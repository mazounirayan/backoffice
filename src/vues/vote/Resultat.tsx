import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemText, CircularProgress
} from '@mui/material';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Vote {
  id: number;
  choix: string;
  proposition: {
    id: number;
    question: string;
    choix: string[];
  };
}

const ResultsPage: React.FC = () => {
  const { sondageId } = useParams<{ sondageId: string }>();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVotes();
  }, [sondageId]);

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/votes`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des votes');
      const data = await response.json();
      const filteredVotes = data.Votes.filter((vote: Vote) => vote.proposition.id === Number(sondageId));
      setVotes(filteredVotes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching votes:', error);
      setError('Erreur lors de la récupération des votes');
      setLoading(false);
    }
  };

  const calculateResults = () => {
    const voteCounts = votes.reduce((acc: any, vote: Vote) => {
      acc[vote.choix] = (acc[vote.choix] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(voteCounts).map(([choix, count]) => ({
      choix,
      count
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>{error}</Typography>;

  const results = calculateResults();

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Résultats du Sondage</Typography>

      {results.length === 0 ? (
        <Typography>Aucun vote n'a été enregistré pour ce sondage.</Typography>
      ) : (
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Votes</Typography>
            <List>
              {results.map((result, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${result.choix}: ${result.count} vote(s)`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ResultsPage;
