import React, { useEffect, useState } from 'react';

// Définition des interfaces pour typer les données
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

interface SondagesResponse {
    Sondages: Sondage[];
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

interface SondageStatistics {
    sondageId: number;
    sondageNom: string;
    typeSondage: string;
    propositions: ProposalStatistics[];
}

const VoteStatistics: React.FC = () => {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [sondages, setSondages] = useState<Sondage[]>([]);
    const [statistics, setStatistics] = useState<SondageStatistics[]>([]);

    useEffect(() => {
        // Fonction pour récupérer les données des votes
        const fetchVotes = async () => {
            try {
                const response = await fetch('https://pa-api-0tcm.onrender.com/votes');
                const data: VotesResponse = await response.json();
                setVotes(data.Votes);
            } catch (error) {
                console.error('Error fetching votes:', error);
            }
        };

        // Fonction pour récupérer les données des sondages
        const fetchSondages = async () => {
            try {
                const response = await fetch('https://pa-api-0tcm.onrender.com/sondages');
                const data: SondagesResponse = await response.json();
                setSondages(data.Sondages);
            } catch (error) {
                console.error('Error fetching sondages:', error);
            }
        };

        fetchVotes();
        fetchSondages();
    }, []);

    useEffect(() => {
        // Fonction pour calculer les statistiques de pourcentage
        const calculateStatistics = () => {
            const proposalVotes: { [key: number]: { [key: string]: number } } = {};
            const totalVotes: { [key: number]: number } = {};

            votes.forEach(vote => {
                const propId = vote.proposition.id;
                const choice = vote.choix;

                if (!proposalVotes[propId]) {
                    proposalVotes[propId] = {};
                    totalVotes[propId] = 0;
                }

                if (proposalVotes[propId][choice]) {
                    proposalVotes[propId][choice]++;
                } else {
                    proposalVotes[propId][choice] = 1;
                }

                totalVotes[propId]++;
            });

            const sondageStatisticsResults: SondageStatistics[] = sondages.map(sondage => {
                const propositionsStatistics: ProposalStatistics[] = sondage.propositions.map(proposition => {
                    const propId = proposition.id;
                    const choices = proposalVotes[propId] || {};
                    const total = totalVotes[propId] || 0;
                    const choicePercentages: ChoicePercentage[] = Object.keys(choices).map(choice => ({
                        choice,
                        count: choices[choice],
                        percentage: (choices[choice] / total) * 100,
                    }));

                    return {
                        propositionId: propId,
                        question: proposition.question,
                        choices: choicePercentages,
                        totalVotes: total,
                    };
                });

                return {
                    sondageId: sondage.id,
                    sondageNom: sondage.nom,
                    typeSondage: sondage.typeSondage,
                    propositions: propositionsStatistics,
                };
            });

            setStatistics(sondageStatisticsResults);
        };

        if (votes.length > 0 && sondages.length > 0) {
            calculateStatistics();
        }
    }, [votes, sondages]);

    return (
        <div>
            <h1>Statistiques des Votes</h1>
            {statistics.map(sondageStat => (
                <div key={sondageStat.sondageId}>
                    <h2>{sondageStat.sondageNom}</h2>
                    <p><strong>Type de Sondage:</strong> {sondageStat.typeSondage}</p>
                    {sondageStat.propositions.map(stat => (
                        <div key={stat.propositionId}>
                            <h3>{stat.question}</h3>
                            <ul>
                                {stat.choices.map(choice => (
                                    <li key={choice.choice}>
                                        <strong>{choice.choice}:</strong> {choice.count} vote(s) ({choice.percentage.toFixed(2)}%)
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total de Votes:</strong> {stat.totalVotes}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default VoteStatistics;
