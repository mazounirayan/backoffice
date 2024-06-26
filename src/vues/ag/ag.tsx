// src/components/AgList.tsx
import React, { useEffect, useState } from 'react';
import { fetchAgs } from './agApi';
import { Ag } from './types';
import { format, isPast, isToday, parseISO } from 'date-fns';

const AgList: React.FC = () => {
    const [ags, setAgs] = useState<Ag[]>([]);
  
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
            {isToday(parseISO(ag.date)) && <button>Ouvrir</button>}
          </div>
        ))}
      </div>
    );
  };
  
  export default AgList;