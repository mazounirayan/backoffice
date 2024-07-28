import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button, Box, Typography, List, ListItem } from '@mui/material';
import VotePage from './votePage';
import ResultsPage from './resultPage';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Sondages {
  id: number;
  nom: string;
  date: string;
  description: string;
  propositions?: Proposition[];
}

interface Proposition {
  id: number;
  question: string;
  choix: string[];
  type: 'radio' | 'checkbox';
  sondage: number;
}

interface AlertState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const VotingSystem: React.FC = () => {
  const [surveys, setSurveys] = useState<Sondages[]>([]);
  const [currentSurvey, setCurrentSurvey] = useState<Sondages | null>(null);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: '', type: 'success' });
  const [page, setPage] = useState<'home' | 'vote' | 'results'>('home');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sondages`);
      const data = await response.json();

      if (Array.isArray(data.Sondages)) {
        setSurveys(data.Sondages);
      } else {
        console.error('Data received is not an array:', data.Sondages);
        setSurveys([]);
      }
    } catch (error) {
      showAlert('Erreur lors de la récupération des sondages', 'error');
      setSurveys([]);
    }
  };

  const showAlert = (message: string, type: 'success' | 'error'): void => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSelectSurvey = (survey: Sondages): void => {
    setCurrentSurvey(survey);
    setPage('vote');
  };

  const handleViewResults = (survey: Sondages): void => {
    setCurrentSurvey(survey);
    setPage('results');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Système de Vote
      </Typography>
      
      {alert.show && (
        <Alert severity={alert.type} sx={{ marginBottom: 2 }}>
          <AlertTitle>{alert.type === 'error' ? 'Erreur' : 'Succès'}</AlertTitle>
          {alert.message}
        </Alert>
      )}
      
      {page === 'home' && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h4" gutterBottom>
            Liste des Sondages
          </Typography>
          <List>
            {surveys.map(survey => (
              <ListItem button key={survey.id}>
                <Button onClick={() => handleSelectSurvey(survey)}>
                  Voter - {survey.nom}
                </Button>
                <Button onClick={() => handleViewResults(survey)}>
                  Voir Résultats - {survey.nom}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {page === 'vote' && currentSurvey && (
        <VotePage survey={currentSurvey} onBack={() => setPage('home')} />
      )}

      {page === 'results' && currentSurvey && (
        <ResultsPage survey={currentSurvey} onBack={() => setPage('home')} />
      )}
    </Box>
  );
};

export default VotingSystem;
