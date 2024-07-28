import React, { useState } from 'react';
import { Box, Button, Typography, FormControlLabel, RadioGroup, Radio, Checkbox } from '@mui/material';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Proposition {
  id: number;
  question: string;
  choix: string[];
  type: 'radio' | 'checkbox';
}

interface Sondages {
  id: number;
  nom: string;
  date: string;
  description: string;
  propositions?: Proposition[];
}

interface VotePageProps {
  survey: Sondages;
  onBack: () => void;
}

const VotePage: React.FC<VotePageProps> = ({ survey, onBack }) => {
  const [selectedChoices, setSelectedChoices] = useState<{ [key: number]: string[] }>({});

  const handleChange = (propositionId: number, choice: string) => {
    setSelectedChoices((prevState) => ({
      ...prevState,
      [propositionId]: prevState[propositionId]
        ? [...prevState[propositionId], choice]
        : [choice],
    }));
  };

  const handleSubmitVote = async () => {
    try {
      await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedChoices),
      });
      alert('Vote enregistré avec succès');
      onBack();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du vote', error);
    }
  };

  return (
    <Box>
      <Button onClick={onBack}>Retour</Button>
      <Typography variant="h4" gutterBottom>
        Vote pour le sondage : {survey.nom}
      </Typography>
      {survey.propositions?.map((proposition) => (
        <Box key={proposition.id} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            {proposition.question}
          </Typography>
          {proposition.type === 'radio' && (
            <RadioGroup
              name={`proposition-${proposition.id}`}
              onChange={(e) => handleChange(proposition.id, (e.target as HTMLInputElement).value)}
            >
              {proposition.choix.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  value={choice}
                  control={<Radio />}
                  label={choice}
                />
              ))}
            </RadioGroup>
          )}
          {proposition.type === 'checkbox' && (
            <>
              {proposition.choix.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      onChange={(e) => handleChange(proposition.id, choice)}
                    />
                  }
                  label={choice}
                />
              ))}
            </>
          )}
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmitVote}>
        Soumettre le vote
      </Button>
    </Box>
  );
};

export default VotePage;
