import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, FormControl, FormControlLabel, RadioGroup, Radio, Checkbox, Snackbar
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

const API_BASE_URL = 'https://pa-api-0tcm.onrender.com';

interface Proposition {
  id: number;
  question: string;
  type: 'radio' | 'checkbox';
  choix: string[];
  votes: any[];
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

const PropositionsPage: React.FC = () => {
  const { sondageId } = useParams<{ sondageId: string }>();
  const [sondage, setSondage] = useState<Sondage | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchSondage();
  }, []);

  const fetchSondage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sondages/${sondageId}`);
      const data = await response.json();
      setSondage(data);
    } catch (error) {
      console.error('Error fetching sondage:', error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const responses = await Promise.all(
        Object.entries(data).map(async ([propositionId, choix]) => {
          const response = await fetch(`${API_BASE_URL}/votes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              choix,
              numTour: 1,
              proposition: parseInt(propositionId, 10),
              user: 1  // Replace with the actual user ID
            })
          });
          if (!response.ok) {
            throw new Error('Failed to submit vote');
          }
          return response;
        })
      );
      setSnackbar({ open: true, message: 'Vote soumis avec succès!' });
      reset();
    } catch (error) {
      console.error('Error submitting vote:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la soumission du vote' });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {sondage?.nom}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {sondage?.description}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Du {new Date(sondage?.dateDebut || '').toLocaleDateString()} au {new Date(sondage?.dateFin || '').toLocaleDateString()}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {sondage?.propositions.map((prop) => (
          <Box key={prop.id} sx={{ marginLeft: 2, marginTop: 1 }}>
            <Typography variant="body2">
              {prop.question} ({prop.type})
            </Typography>
            {prop.type === 'radio' ? (
              <FormControl component="fieldset">
                <Controller
                  name={`${prop.id}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {prop.choix.map((choice, index) => (
                        <FormControlLabel key={index} value={choice} control={<Radio />} label={choice} />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            ) : (
              <FormControl component="fieldset">
                <Controller
                  name={`${prop.id}`}
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      {prop.choix.map((choice, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={field.value.includes(choice)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, choice]);
                                } else {
                                  field.onChange(field.value.filter((v: string) => v !== choice));
                                }
                              }}
                            />
                          }
                          label={choice}
                        />
                      ))}
                    </>
                  )}
                />
              </FormControl>
            )}
          </Box>
        ))}
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Soumettre les votes
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default PropositionsPage;
