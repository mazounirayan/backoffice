import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

interface Proposition {
  id: number;
  question: string;
  type: string;
  choix: string[];
}

interface Vote {
  id: number;
  proposition: Proposition;
  choix: string;
  numTour: number;
}

interface Sondage {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  typeSondage: string;
  propositions: Proposition[];
}

interface VotesResponse {
  Votes: Vote[];
  totalCount: number;
}

interface ChoicePercentage {
  choice: string;
  count: number;
  percentage: number;
}

interface ProposalStatistics {
  propositionId: number;
  question: string;
  choices: ChoicePercentage[];
  totalVotes: number;
}

const VoteStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<ProposalStatistics[]>([]);
  const [sondage, setSondage] = useState<Sondage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { sondageId } = useParams<{ sondageId: string }>();

  useEffect(() => {
    const fetchSondageAndVotes = async () => {
      try {
        const [sondageRes, votesRes] = await Promise.all([
          fetch(`https://pa-api-0tcm.onrender.com/sondages/${sondageId}`),
          fetch(`https://pa-api-0tcm.onrender.com/votes`)
        ]);

        if (!sondageRes.ok || !votesRes.ok) throw new Error('Failed to fetch data');

        const sondageData = await sondageRes.json();
        const votesData: VotesResponse = await votesRes.json();

        // Filtrer les votes pertinents en fonction des propositions du sondage
        const votes = votesData.Votes.filter(vote => 
          sondageData.Sondage.propositions.some((prop: Proposition) => prop.id === vote.proposition.id)
        );

        // Calculer les statistiques pour chaque proposition
        const proposalStats: ProposalStatistics[] = sondageData.Sondage.propositions.map((proposition: Proposition) => {
          const relevantVotes = votes.filter(vote => vote.proposition.id === proposition.id);
          const totalVotes = relevantVotes.length;
          const choiceCounts = proposition.choix.map(choice => {
            const count = relevantVotes.filter(vote => vote.choix === choice).length;
            return { choice, count, percentage: (count / totalVotes) * 100 };
          });

          return {
            propositionId: proposition.id,
            question: proposition.question,
            choices: choiceCounts,
            totalVotes,
          };
        });

        setSondage(sondageData.Sondage);
        setStatistics(proposalStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSondageAndVotes();
  }, [sondageId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Statistiques du Sondage {sondage?.nom}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Type de Sondage : {sondage?.typeSondage}
      </Typography>
      {statistics.map(stat => (
        <Box key={stat.propositionId} sx={{ marginBottom: 4 }}>
          <Typography variant="h6">
            {stat.question}
          </Typography>
          {stat.choices.map(choiceStat => (
            <Typography key={choiceStat.choice}>
              {choiceStat.choice}: {choiceStat.count} votes ({choiceStat.percentage.toFixed(2)}%)
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default VoteStatistics;
