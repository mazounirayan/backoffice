import React, { useEffect, useState } from 'react';
import { fetchAgs } from './agApi';
import { Ag } from './types';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../services/UserContext';

const AgList: React.FC = () => {
  const [ags, setAgs] = useState<Ag[]>([]);
  const { user } = useUser(); // Utiliser le contexte utilisateur
  const navigate = useNavigate(); // Utiliser le hook useNavigate

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
    navigate(`/ags/${id}`); // Redirection vers la page de détails de l'AG avec l'ID correspondant
  };

  const handleVote = (id: number) => {
    navigate(`/ags/${id}/vote`); // Redirection vers la page de vote avec l'ID correspondant
  };

  const handleDeleteAg = async (id: number) => {
    try {
      const response = await fetch(`https://pa-api-0tcm.onrender.com/ags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Si la suppression est réussie, mettre à jour la liste des AGs
        setAgs(ags.filter(ag => ag.id !== id));
      } else {
        console.error('Failed to delete AG');
      }
    } catch (error) {
      console.error('Error deleting AG:', error);
    }
  };

  const getStatus = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Aujourd\'hui';
    if (isPast(date)) return 'Passé';
    return 'À venir';
  };

  return (
    <div>
      {ags.map((ag) => (
        <div key={ag.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{ag.nom}</h3>
          <p>{ag.description}</p>
          <p><strong>Date:</strong> {format(parseISO(ag.date), 'yyyy-MM-dd')} ({getStatus(ag.date)})</p>
          {isToday(parseISO(ag.date)) && (
            <>
              
              {!hasUserVoted(ag.id) ? (
                <button onClick={() => handleOpenAg(ag.id)}>Ouvrir</button>
              ) : (
                <p>Vous avez déjà voté</p>
              )}
            </>
          )}
          {user?.role === 'Administrateur' && <button onClick={() => handleDeleteAg(ag.id)}>Supprimer</button>} {/* Bouton de suppression visible seulement pour les administrateurs */}
        </div>
      ))}
    </div>
  );
};

export default AgList;