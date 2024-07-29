import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, CircularProgress, Button
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Sondage {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  typeSondage: string;
  nombreVotants?: number; // Ajout du point d'interrogation pour le rendre optionnel
}

const SondagesListPage: React.FC = () => {
  const [sondages, setSondages] = useState<Sondage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSondages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sondages`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSondages(data.Sondages);
      } catch (error) {
        console.error('Error fetching sondages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSondages();
  }, []);

  const handleViewStats = (id: number) => {
    navigate(`/stats/${id}`);
    console.log(`Voir les statistiques pour le sondage ID: ${id}`);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Sondages
      </Typography>
      <List>
        {sondages.map((sondage) => (
          <ListItem button component={Link} to={`/vote/${sondage.id}`} key={sondage.id}>
            <ListItemText
              primary={sondage.nom}
              secondary={`Nombre de votants : ${sondage.nombreVotants ?? 'Non disponible'}`}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewStats(sondage.id)}
              sx={{ ml: 2 }} // Ajout d'un margin-left pour espacer le bouton du texte
            >
              Voir les statistiques
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SondagesListPage;
