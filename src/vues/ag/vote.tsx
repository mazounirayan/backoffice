import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tokens } from '../../components/theme/theme';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

interface Proposition {
  id: string;
  question: string;
  type: 'checkbox' | 'radio' | 'text';
  choix: string[];
}

interface VoteData {
  propositionId: string;
  userId: string;
  choices: { [key: string]: any };
  numTour : number ; 
}

const VoteForm: React.FC = () => {
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [selectedProposition, setSelectedProposition] = useState<Proposition | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<{ [key: string]: any }>({});
  const { agId } = useParams<{ agId: string }>();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  useEffect(() => {
    const fetchPropositions = async () => {
      try {
        const response = await axios.get(`https://pa-api-0tcm.onrender.com/propositions?agId=${agId}`);
        setPropositions(response.data);
      } catch (error) {
        console.error('Error fetching propositions', error);
      }
    };

    fetchPropositions();
  }, [agId]);

  const handlePropositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prop = propositions.find((p) => p.id === event.target.value);
    setSelectedProposition(prop || null);
    setSelectedChoices({});
  };

  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (selectedProposition?.type === 'checkbox') {
      setSelectedChoices({
        ...selectedChoices,
        [name]: checked,
      });
    } else {
      setSelectedChoices({
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProposition) {
      Toastify({
        text: "Veuillez sélectionner une proposition.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return;
    }

    if (selectedProposition.type === 'text' && !selectedChoices.textAnswer) {
      Toastify({
        text: "Veuillez entrer une réponse.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return;
    }

    if ((selectedProposition.type === 'radio' || selectedProposition.type === 'checkbox') && Object.keys(selectedChoices).length === 0) {
      Toastify({
        text: "Veuillez sélectionner une option.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return;
    }

    try {
      const voteData: VoteData = {
        propositionId: selectedProposition.id,
        userId: loggedInUser.id,
        choices: selectedChoices,
        numTour:1
      };
      await axios.post('https://pa-api-0tcm.onrender.com/votes', voteData);
      Toastify({
        text: "Vote soumis avec succès.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
    } catch (error) {
      console.error('Error submitting vote', error);
      Toastify({
        text: "Erreur lors de la soumission du vote.",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
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
        backgroundColor: colors.primary[500],
        marginTop: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Vote for a Proposition
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <TextField
          select
          label="Select Proposition"
          value={selectedProposition ? selectedProposition.id : ''}
          onChange={handlePropositionChange}
          SelectProps={{
            native: true,
          }}
          required
        >
          <option value="" />
          {propositions.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.question}
            </option>
          ))}
        </TextField>
      </FormControl>
      {selectedProposition && (
        <>
          {selectedProposition.type === 'checkbox' && (
            <FormGroup>
              {selectedProposition.choix.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={!!selectedChoices[choice]}
                      onChange={handleChoiceChange}
                      name={choice}
                    />
                  }
                  label={choice}
                />
              ))}
            </FormGroup>
          )}
          {selectedProposition.type === 'radio' && (
            <RadioGroup name="radioGroup" onChange={handleChoiceChange}>
              {selectedProposition.choix.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  value={choice}
                  control={<Radio />}
                  label={choice}
                />
              ))}
            </RadioGroup>
          )}
          {selectedProposition.type === 'text' && (
            <TextField
              fullWidth
              variant="outlined"
              label="Your Answer"
              name="textAnswer"
              value={selectedChoices.textAnswer || ''}
              onChange={handleChoiceChange}
              sx={{ marginBottom: '20px' }}
              required
            />
          )}
          <Button variant="contained" sx={{ bgcolor: colors.greenAccent[500] }} onClick={handleSubmit}>
            Submit Vote
          </Button>
        </>
      )}
    </Box>
  );
};

export default VoteForm;
