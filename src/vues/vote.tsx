import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme, Radio, Checkbox, FormControlLabel, Button } from '@mui/material';
import { Vote, getVotes } from '../services/VoteService'; // Assurez-vous que l'interface Vote est correctement importée

const DisplayVotes: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<{ [voteId: number]: string[] }>({});
  const [votes, setVotes] = useState<Vote[]>([]); // Utilisez l'interface Vote ici
  const theme = useTheme();

  useEffect(() => {
    const fetchedVotes = getVotes(); 
    setVotes(fetchedVotes);

    const initialSelectedOptions: { [voteId: number]: string[] } = {};
    fetchedVotes.forEach(vote => {
      initialSelectedOptions[vote.id] = [];
    });
    setSelectedOptions(initialSelectedOptions);
  }, []);

  const handleVoteOptionChange = (voteId: number, option: string) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [voteId]: prevOptions[voteId] ? [...prevOptions[voteId], option] : [option]
    }));
  };

  const handleVoteSubmit = (voteId: number) => {
    // Envoie des options sélectionnées au backend ou à toute autre logique de traitement
    console.log('Options sélectionnées pour le vote', voteId, ':', selectedOptions[voteId]);
    // Réinitialiser les options sélectionnées après avoir soumis le vote
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [voteId]: []
    }));
  };

  return (
    <Box
      sx={{
        width: '50%',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: 'black',
        marginTop: '120px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Votes
      </Typography>
      {votes.map(vote => (
        <Box key={vote.id} sx={{ marginBottom: '20px' }}>
          <Typography variant="h5">{vote.title}</Typography>
          {vote.options.map(option => (
            <FormControlLabel
              key={option}
              control={
                vote.multipleChoice ? (
                  <Checkbox
                    checked={selectedOptions[vote.id]?.includes(option)}
                    onChange={() => handleVoteOptionChange(vote.id, option)}
                    sx={{ color: theme.palette.primary.main }}
                  />
                ) : (
                  <Radio
                    checked={selectedOptions[vote.id]?.[0] === option}
                    onChange={() => handleVoteOptionChange(vote.id, option)}
                    sx={{ color: theme.palette.primary.main }}
                  />
                )
              }
              label={option}
            />
          ))}
          <Button variant="contained" color="primary" onClick={() => handleVoteSubmit(vote.id)}>
            Vote
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default DisplayVotes;
