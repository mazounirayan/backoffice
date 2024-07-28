import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Proposition {
  id: number;
  question: string;
  choix: string[];
  type: 'radio' | 'checkbox';
  results?: { [choice: string]: number };
}

interface Sondages {
  id: number;
  nom: string;
  date: string;
  description: string;
  propositions?: Proposition[];
}

interface ResultsPageProps {
  survey: Sondages;
  onBack: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ survey, onBack }) => {
  const [results, setResults] = useState<Proposition[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/results/${survey.id}`);
      const data = await response.json();
      setResults(data.propositions || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats', error);
    }
  };

  return (
    <Box>
      <Button onClick={onBack}>Retour</Button>
      <Typography variant="h4" gutterBottom>
        Résultats pour le sondage : {survey.nom}
      </Typography>
      {results.map((proposition) => (
        <Box key={proposition.id} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            {proposition.question}
          </Typography>
          {Object.entries(proposition.results || {}).map(([choice, count], index) => (
            <Typography key={index} variant="body1">
              {choice} : {count} votes
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ResultsPage;
