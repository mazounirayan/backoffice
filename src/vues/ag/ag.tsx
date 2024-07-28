import React, { useEffect, useState } from 'react';
import { fetchAgs } from './agApi';
import { Ag } from './types';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../services/UserContext';
import { Button, Box, Typography } from '@mui/material';

const AgList: React.FC = () => {
  const [ags, setAgs] = useState<Ag[]>([]);
  const { user } = useUser(); 
  const navigate = useNavigate();

  useEffect(() => {
    const getAgs = async () => {
      try {
        const data = await fetchAgs();
        const sortedAgs = data.Ags.sort((a: Ag, b: Ag) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setAgs(sortedAgs);
      } catch (error) {
        console.error('Error fetching AGs:', error);
      }
    };
    getAgs();
  }, []);

  const hasUserVoted = (agId: number) => {
    return localStorage.getItem(`votedAg-${agId}`) === 'true';
  };

  const handleOpenAg = (id: number) => {
    navigate(`/ags/${id}`);
  };

  const handleVote = (id: number) => {
    navigate(`/ags/${id}/vote`); 
  };

  const handleDeleteAg = async (id: number) => {
    try {
      const response = await fetch(`https://pa-api-0tcm.onrender.com/ags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAgs(ags.filter(ag => ag.id !== id));
      } else {
        console.error('Failed to delete AG');
      }
    } catch (error) {
      console.error('Error deleting AG:', error);
    }
  };

  const handleModifyAg = (id: number) => {
    navigate(`/ags/${id}/modify`);
  };

  const getStatus = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Aujourd\'hui';
    if (isPast(date)) return 'Passé';
    return 'À venir';
  };

  return (
    <Box>
      {ags.map((ag) => (
        <Box key={ag.id} sx={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <Typography variant="h5">{ag.nom}</Typography>
          <Typography>{ag.description}</Typography>
          <Typography><strong>Date:</strong> {format(parseISO(ag.date), 'yyyy-MM-dd')} ({getStatus(ag.date)})</Typography>
          {isToday(parseISO(ag.date)) && (
            <>
              {!hasUserVoted(ag.id) ? (
                <Button onClick={() => handleOpenAg(ag.id)} variant="contained" color="primary" sx={{ mr: 1 }}>Ouvrir</Button>
              ) : (
                <Typography>Vous avez déjà voté</Typography>
              )}
            </>
          )}
          {user?.role === 'Administrateur' && (
            <>
              <Button onClick={() => handleDeleteAg(ag.id)} variant="contained" color="error" sx={{ mr: 1 }}>Supprimer</Button>
              <Button onClick={() => handleModifyAg(ag.id)} variant="contained" color="secondary">Modifier</Button>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default AgList;