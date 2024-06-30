// src/components/CreatePropositionForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

interface PropositionFormProps {
  agId: number;
}

const CreatePropositionForm: React.FC<PropositionFormProps> = ({ agId }) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('checkbox');
  const [choix, setChoix] = useState<string[]>(['', '']);

  const handleAddChoice = () => {
    setChoix([...choix, '']);
  };

  const handleRemoveChoice = (index: number) => {
    setChoix(choix.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choix];
    newChoices[index] = value;
    setChoix(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const proposition = { question, type, choix, ag: agId };
      await axios.post('http://localhost:3000/propositions', proposition);
      // Reset form
      setQuestion('');
      setType('checkbox');
      setChoix(['', '']);
    } catch (error) {
      console.error('Erreur lors de la création de la proposition', error);
    }
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
        marginTop: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Create a Proposition for AG {agId}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as string)}
        >
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="radio">Radio</MenuItem>
          <MenuItem value="text">Text</MenuItem>
        </Select>
      </FormControl>
      {choix.map((choice, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <TextField
            fullWidth
            variant="outlined"
            label={`Choice ${index + 1}`}
            value={choice}
            onChange={(e) => handleChoiceChange(index, e.target.value)}
            sx={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="secondary" onClick={() => handleRemoveChoice(index)}>
            Remove
          </Button>
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Proposition
        </Button>
        <Button variant="contained" onClick={handleAddChoice}>
          Add Choice
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePropositionForm;
