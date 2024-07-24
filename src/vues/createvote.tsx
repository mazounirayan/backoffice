import React, { useState } from 'react';
//import { createVote, Vote } from '../services/VoteService'; // Importez l'interface Votes
import { Button, Checkbox, TextField, Typography, FormControlLabel, Box, useTheme } from '@mui/material';
import { tokens } from "../components/theme/theme";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const CreateVote: React.FC = () => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [multipleChoice, setMultipleChoice] = useState(false);
  // //const [votes, setVotes] = useState<Vote[]>([]); // Utilisez l'interface Votes ici
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  // const handleAddOption = () => {
  //   setOptions([...options, '']);
  // };

  // const handleRemoveOption = (index: number) => {
  //   setOptions(options.filter((_, i) => i !== index));
  // };

  // const handleSubmit = () => {
  //   if (!title.trim()) {
  //     Toastify({
  //       text: "Le titre est requis.",
  //       duration: 3000,
  //       backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
  //     }).showToast();
  //     return;
  //   }

  //   if (options.some(option => !option.trim())) {
  //     Toastify({
  //       text: "Toutes les options doivent être remplies.",
  //       duration: 3000,
  //       backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
  //     }).showToast();
  //     return;
  //   }

  //   const newVote: Vote = {
  //     id: votes.length + 1,
  //     title,
  //     options,
  //     multipleChoice,
  //   };
  //   const createdVote = createVote(newVote); 
  //   const updatedVotes = [...votes, createdVote]; 
  //   setVotes(updatedVotes); 
  //   setTitle(''); 
  //   setOptions(['', '']); 
  //   setMultipleChoice(false); 

  //   Toastify({
  //     text: "Vote créé avec succès.",
  //     duration: 3000,
  //     backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  //   }).showToast();
  // };

  // const handleOptionChange = (index: number, value: string) => {
  //   const newOptions = [...options];
  //   newOptions[index] = value;
  //   setOptions(newOptions);
  // };

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
        Create a Vote
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Enter vote title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ marginBottom: '20px' }}
        required
      />
      {options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <TextField
            fullWidth
            variant="outlined"
            label={`Option ${index + 1}`}
            value={option}
          //  onChange={(e) => handleOptionChange(index, e.target.value)}
            sx={{ marginRight: '10px' }}
            required
          />
          {/* <Button variant="contained" color="secondary" onClick={() => handleRemoveOption(index)}>
            Remove
          </Button> */}
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
        <Button  variant="contained" color="primary" >
          Create Vote
        </Button>
        <Button variant="contained" >
          Add Option
        </Button>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
           
            checked={multipleChoice}
            onChange={() => setMultipleChoice(!multipleChoice)}
          />
        }
        label="Multiple Choice"
        sx={{ marginTop: '20px' }}
      />
    
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Created Votes:
        </Typography>
        <ul>
     
        </ul>
      </Box>
    </Box>
  );
};

export default CreateVote;
