import React, { useState, useEffect, FormEvent } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton,
  TextField, FormControlLabel, Checkbox
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon } from '@mui/icons-material';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Types for event and participant
interface Event {
  id: number;
  nom: string;
  date: string;
  description: string;
  lieu: string;
  estReserve: boolean;
  nbPlace: number;
  inscriptions: { id: number }[];
}

interface Participant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  numTel: string;
  profession: string;
  estBanie: boolean;
  inscriptionId: number;
}

const GestionEvenements: React.FC = () => {
  const [evenements, setEvenements] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [date, setDate] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [estReserve, setEstReserve] = useState<boolean>(false);
  const [nbPlace, setNbPlace] = useState<number>(0);

  useEffect(() => {
    fetchEvenements();
  }, []);

  const fetchEvenements = async () => {
    try {
      const response = await fetch('https://pa-api-0tcm.onrender.com/evenements');
      const data = await response.json();
      setEvenements(data.Evenements || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      toast.error('Erreur lors de la récupération des événements');
    }
  };

  const fetchParticipantDetails = async (inscriptionId: number) => {
    try {
      const response = await fetch(`https://pa-api-0tcm.onrender.com/inscriptions/${inscriptionId}`);
      if (!response.ok) {
        console.error(`Erreur lors de la récupération du participant avec l'id ${inscriptionId}: ${response.statusText}`);
        toast.error(`Erreur lors de la récupération du participant avec l'id ${inscriptionId}`);
        return null;
      }
      const data = await response.json();
      const participant = data.visiteur || data.adherent;
      return participant ? { ...participant, inscriptionId } : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du participant:', error);
      toast.error('Erreur lors de la récupération des détails du participant');
      return null;
    }
  };

  const showParticipants = async (event: Event) => {
    const participantDetailsPromises = event.inscriptions.map(p => fetchParticipantDetails(p.id));
    const detailedParticipants = await Promise.all(participantDetailsPromises);

    const validParticipants = detailedParticipants.filter(participant => participant !== null);
    
    setParticipants(validParticipants);
    setIsParticipantsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setDate(new Date(event.date).toISOString().split('T')[0]);
    setEstReserve(event.estReserve);
    setNbPlace(event.nbPlace);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://pa-api-0tcm.onrender.com/evenements/${id}`, { method: 'DELETE' });
      fetchEvenements();
      toast.success('Événement supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const sendEmail = (email: string, subject: string, message: string) => {
    emailjs.send('your_service_id', 'your_template_id', {
      subject,
      message,
      to_email: email,
    }, 'your_user_id')
      .then((response) => {
        console.log('Email envoyé:', response);
        toast.success('Email envoyé avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        toast.error('Erreur lors de l\'envoi de l\'email');
      });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      setDateError('La date ne peut pas être inférieure à aujourd\'hui.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const values: { [key: string]: FormDataEntryValue } = Object.fromEntries(formData.entries());
    const formattedValues = {
      ...values,
      date: date,
      estReserve: estReserve,
      nbPlace: Number(nbPlace),
    };

    try {
      const method = editingEvent ? 'PATCH' : 'POST';
      const url = editingEvent
        ? `https://pa-api-0tcm.onrender.com/evenements/${editingEvent.id}`
        : 'https://pa-api-0tcm.onrender.com/evenements';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedValues),
      });

      const subject = editingEvent ? 'Événement modifié' : 'Nouvel événement créé';
      participants.forEach(participant => {
        sendEmail(participant.email, subject, `L'événement "${formattedValues}" a été ${editingEvent ? 'modifié' : 'créé'}.`);
      });

      setIsModalOpen(false);
      fetchEvenements();
      toast.success(`Événement ${editingEvent ? 'modifié' : 'créé'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'événement:', error);
      toast.error('Erreur lors de la sauvegarde de l\'événement');
    }
  };

  const removeParticipant = async (inscriptionId: number) => {
    try {
      await fetch(`https://pa-api-0tcm.onrender.com/inscriptions/${inscriptionId}`, { method: 'DELETE' });
      setParticipants(participants.filter(p => p.inscriptionId !== inscriptionId));
      toast.success('Participant supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error);
      toast.error('Erreur lors de la suppression du participant');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Gestion des Événements</h1>
      <Button variant="contained" onClick={() => { setEditingEvent(null); setDate(''); setEstReserve(false); setNbPlace(0); setIsModalOpen(true); }} style={{ marginBottom: '20px' }}>
        Ajouter un événement
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Nombre de places</TableCell>
              <TableCell>Est réservé</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evenements && evenements.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.nom}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{event.lieu}</TableCell>
                <TableCell>{event.nbPlace}</TableCell>
                <TableCell>{event.estReserve ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(event)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(event.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => showParticipants(event)}>
                    <PeopleIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="nom"
              label="Nom"
              type="text"
              fullWidth
              defaultValue={editingEvent?.nom || ''}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={!!dateError}
              helperText={dateError}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              defaultValue={editingEvent?.description || ''}
            />
            <TextField
              margin="dense"
              name="lieu"
              label="Lieu"
              type="text"
              fullWidth
              defaultValue={editingEvent?.lieu || ''}
            />
            <TextField
              margin="dense"
              name="nbPlace"
              label="Nombre de places"
              type="number"
              fullWidth
              value={nbPlace}
              onChange={(e) => setNbPlace(Number(e.target.value))}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={estReserve}
                  onChange={(e) => setEstReserve(e.target.checked)}
                />
              }
              label="Est réservé"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" color="primary">
              {editingEvent ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isParticipantsModalOpen} onClose={() => setIsParticipantsModalOpen(false)}>
        <DialogTitle>Participants</DialogTitle>
        <DialogContent>
          <List>
            {participants && participants.map((participant) => (
              <ListItem key={participant.inscriptionId}>
                <ListItemText primary={`${participant.nom} ${participant.prenom} (${participant.email})`} secondary={`Age: ${participant.age}, Profession: ${participant.profession}, Téléphone: ${participant.numTel}`} />
                <IconButton onClick={() => removeParticipant(participant.inscriptionId)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsParticipantsModalOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default GestionEvenements;
