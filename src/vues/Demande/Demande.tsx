import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Select, MenuItem, Button ,SelectChangeEvent } from '@mui/material';

interface Demande {
  id: number;
  type: string;
  dateDemande: string;
  statut: string;
  emailVisiteur: string;
  autreDemandes: any[];
  evenementDemandes: any[];
  aideProjetDemandes: any[];
  parrainageDemandes: any[];
}

const Demandes: React.FC = () => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('Evénement');

  useEffect(() => {
    axios.get('https://pa-api-0tcm.onrender.com/demandes')
      .then(response => {
        setDemandes(response.data.Demandes);
        setLoading(false);
      })
      .catch(error => {
        setError('Erreur lors de la récupération des demandes');
        setLoading(false);
      });
  }, []);

  const handleAction = (id: number, action: 'acceptée' | 'refusée') => {
    axios.patch(`https://pa-api-0tcm.onrender.com/demandes/${id}`, { statut: action })
      .then(response => {
        setDemandes(demandes.map(demande => 
          demande.id === id ? { ...demande, statut: action } : demande
        ));
      })
      .catch(error => {
        setError('Erreur lors de la mise à jour de la demande');
      });
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  const renderDemandesByType = (type: string) => {
    return demandes.filter(demande => demande.type === type).map(demande => (
      <Box key={demande.id} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2, borderRadius: 2 }}>
        <Typography variant="h6">ID: {demande.id}</Typography>
        <Typography>Type: {demande.type}</Typography>
        <Typography>Date de demande: {new Date(demande.dateDemande).toLocaleString()}</Typography>
        <Typography>Statut: {demande.statut}</Typography>
        <Typography>Email Visiteur: {demande.emailVisiteur}</Typography>
        <Box>
          {demande.type === 'Evénement' && demande.evenementDemandes.map(event => (
            <Box key={event.id} sx={{ marginTop: 1 }}>
              <Typography variant="subtitle1">Titre: {event.titre}</Typography>
              <Typography>Date: {new Date(event.date).toLocaleString()}</Typography>
              <Typography>Description: {event.description}</Typography>
              <Typography>Lieu: {event.lieu}</Typography>
            </Box>
          ))}
          {demande.type === 'Projet' && demande.aideProjetDemandes.map(projet => (
            <Box key={projet.id} sx={{ marginTop: 1 }}>
              <Typography variant="subtitle1">Titre: {projet.titre}</Typography>
              <Typography>Description: {projet.descriptionProjet}</Typography>
              <Typography>Budget: {projet.budget}</Typography>
              <Typography>Deadline: {new Date(projet.deadline).toLocaleString()}</Typography>
            </Box>
          ))}
          {demande.type === 'Parrainage' && demande.parrainageDemandes.map(parrainage => (
            <Box key={parrainage.id} sx={{ marginTop: 1 }}>
              <Typography variant="subtitle1">Détails: {parrainage.detailsParrainage}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleAction(demande.id, 'acceptée')} sx={{ marginRight: 1 }}>Accepter</Button>
          <Button variant="contained" color="secondary" onClick={() => handleAction(demande.id, 'refusée')}>Refuser</Button>
        </Box>
      </Box>
    ));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Demandes</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Sélectionnez le type de demande:</Typography>
        <Select value={selectedType} onChange={handleTypeChange}>
          <MenuItem value="Evénement">Evénement</MenuItem>
          <MenuItem value="Projet">Projet</MenuItem>
          <MenuItem value="Parrainage">Parrainage</MenuItem>
        </Select>
      </Box>
      {renderDemandesByType(selectedType)}
    </Box>
  );
};

export default Demandes;
