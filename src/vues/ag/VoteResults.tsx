import React, { useEffect, useState } from 'react';

type Proposition = {
  id: number;
  question: string;
  type: string;
  choix: string[];
};

type User = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
  dateInscription: string;
  estBenevole: boolean;
  numTel: string;
  profession: string;
  estEnLigne: boolean;
};

type Vote = {
  id: number;
  proposition: Proposition;
  user: User;
  choix: string;
};

const VoteResults: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [groupedVotes, setGroupedVotes] = useState<{ [key: number]: { [key: string]: number } }>({});

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch('https://pa-api-0tcm.onrender.com/votes');
        const data = await response.json();
        setVotes(data.Votes);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, []);

  useEffect(() => {
    const groupVotes = () => {
      const grouped: { [key: number]: { [key: string]: number } } = {};

      votes.forEach((vote) => {
        const propositionId = vote.proposition.id;
        const choix = vote.choix;

        if (!grouped[propositionId]) {
          grouped[propositionId] = {};
        }

        if (!grouped[propositionId][choix]) {
          grouped[propositionId][choix] = 0;
        }

        grouped[propositionId][choix] += 1;
      });

      setGroupedVotes(grouped);
    };

    if (votes.length > 0) {
      groupVotes();
    }
  }, [votes]);

  return (
    <div>
      <h1>Résultats des votes</h1>
      {Object.keys(groupedVotes).map((propositionId) => {
        const propositionVotes = groupedVotes[parseInt(propositionId)];
        const proposition = votes.find(vote => vote.proposition.id === parseInt(propositionId))?.proposition;

        return (
          <div key={propositionId} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{proposition?.question}</h3>
            <ul>
              {Object.keys(propositionVotes).map((choix) => (
                <li key={choix}>
                  {choix}: {propositionVotes[choix]} votes
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default VoteResults;
