import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ag, Proposition } from './types';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ModifyAg: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ag, setAg] = useState<Ag | null>(null);
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [quorum, setQuorum] = useState(0);
  const [description, setDescription] = useState('');
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProposition, setCurrentProposition] = useState<Proposition | null>(null);
  const [dateError, setDateError] = useState('');
  useEffect(() => {
    const fetchAg = async () => {
      try {
        const response = await axios.get(`https://pa-api-0tcm.onrender.com/ags/${id}`);
        const agData = response.data;
        setAg(agData);
        setNom(agData.nom);
        setDate(agData.date.split('T')[0]);
        setType(agData.type);
        setQuorum(agData.quorum);
        setDescription(agData.description);
        setPropositions(agData.propositions);
      } catch (error) {
        console.error('Error fetching AG:', error);
      }
    };
    fetchAg();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    if (date < today) {
      setDateError("La date ne peut pas être antérieure à aujourd'hui.");
      return;
    }
    try {
      // Update AG without propositions
      await axios.patch(`https://pa-api-0tcm.onrender.com/ags/${id}`, {
        nom,
        date,
        type,
        quorum,
        description
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating AG:', error);
    }
  };

  const handleAddProposition = () => {
    setCurrentProposition(null);
    setOpenDialog(true);
  };

  const handleEditProposition = (proposition: Proposition) => {
    setCurrentProposition(proposition);
    setOpenDialog(true);
  };

  const handleDeleteProposition = async (propositionId: number) => {
    try {
      await axios.delete(`https://pa-api-0tcm.onrender.com/propositions/${propositionId}`);
      setPropositions(propositions.filter(p => p.id !== propositionId));
    } catch (error) {
      console.error('Error deleting proposition:', error);
    }
  };

  const handleSaveProposition = async (proposition: Omit<Proposition, 'id'>) => {
    if (currentProposition) {
      // Update existing proposition
      try {
        const updatedProposition = await axios.patch(`https://pa-api-0tcm.onrender.com/propositions/${currentProposition.id}`, proposition);
        setPropositions(propositions.map(p => p.id === currentProposition.id ? updatedProposition.data : p));
      } catch (error) {
        console.error('Error updating proposition:', error);
      }
    } else {
      // Add new proposition
      try {
        const response = await axios.post('https://pa-api-0tcm.onrender.com/propositions', { ...proposition, ag: Number(id) });
        setPropositions([...propositions, response.data]);
      } catch (error) {
        console.error('Error adding proposition:', error);
      }
    }
    setOpenDialog(false);
  };

  if (!ag) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Modifier l'AG</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            if (dateError) setDateError('');
          }}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          
        error={Boolean(dateError)}
        helperText={dateError}
        />
       
   
    
       
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="extraordinaire">Extraordinaire</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Quorum"
          type="number"
          value={quorum}
          onChange={(e) => setQuorum(Number(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Propositions</Typography>
        <List>
          {propositions.map((proposition) => (
            <ListItem key={proposition.id}>
              <ListItemText primary={proposition.question} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditProposition(proposition)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProposition(proposition.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button startIcon={<AddIcon />} onClick={handleAddProposition} sx={{ mt: 2 }}>
          Ajouter une proposition
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Enregistrer les modifications
        </Button>
      </form>

      <PropositionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveProposition}
        proposition={currentProposition}
      />
    </Box>
  );
};

interface PropositionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (proposition: Omit<Proposition, 'id'>) => void;
  proposition: Proposition | null;
}

const PropositionDialog: React.FC<PropositionDialogProps> = ({ open, onClose, onSave, proposition }) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('checkbox');
  const [choix, setChoix] = useState<string[]>(['', '']);

  useEffect(() => {
    if (proposition) {
      setQuestion(proposition.question);
      setType(proposition.type);
      setChoix(proposition.choix);
    } else {
      setQuestion('');
      setType('checkbox');
      setChoix(['', '']);
    }
  }, [proposition]);

  const handleSave = () => {
    onSave({
      question,
      type,
      choix: choix.filter(c => c !== '')
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{proposition ? 'Modifier la proposition' : 'Ajouter une proposition'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Question"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="checkbox">Checkbox</MenuItem>
            <MenuItem value="radio">Radio</MenuItem>
          </Select>
        </FormControl>
        {choix.map((choice, index) => (
          <TextField
            key={index}
            margin="dense"
            label={`Choix ${index + 1}`}
            fullWidth
            value={choice}
            onChange={(e) => {
              const newChoix = [...choix];
              newChoix[index] = e.target.value;
              setChoix(newChoix);
            }}
          />
        ))}
        <Button onClick={() => setChoix([...choix, ''])} sx={{ mt: 1 }}>
          Ajouter un choix
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyAg;