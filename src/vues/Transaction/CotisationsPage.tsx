import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Snackbar } from '@mui/material';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { Cotisation, CotisationsResponse } from './types';

const CotisationsPage: React.FC = () => {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    axios.get<CotisationsResponse>('https://pa-api-0tcm.onrender.com/cotisations')
      .then(response => setCotisations(response.data.Cotisations))
      .catch(error => console.error('Erreur de récupération des cotisations:', error));
  }, []);

  const handleAlertClose = () => setAlertOpen(false);

  const sendEmail = (email: string,  name: string | undefined, daysLeft:number ,type:string) => {
    emailjs.send('ecafAsso', 'template_bwbn1fj', {
      from_name: "Ecaf Asso",
      to_name: name,
      to_email: email,

      cotisation_type:type,
      days_remaining:daysLeft,
    }, '0zZ8oJcY_ckB4yqi5')
      .then((response) => {
        console.log('Success:', response);
        setAlertMessage(`Email envoyé à ${email}`);
        setAlertOpen(true);
      })
      .catch((error) => {
        console.log('Error:', error);
        setAlertMessage(`Erreur d'envoi de l'email à ${email}`);
        setAlertOpen(true);
      });
  };

  const calculateDaysLeft = (date: string) => {
    const cotisationDate = new Date(date);
    const expirationDate = new Date(cotisationDate);
    expirationDate.setFullYear(cotisationDate.getFullYear() + 1);

    const today = new Date();
    const daysDiff = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestion des Cotisations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Adhérent</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Jours Restants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cotisations.map(cotisation => (
              <TableRow key={cotisation.id}>
                <TableCell>{cotisation.id}</TableCell>
                <TableCell>{cotisation.type}</TableCell>
                <TableCell>{new Date(cotisation.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {cotisation.adherent ? `${cotisation.adherent.nom} ${cotisation.adherent.prenom}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {cotisation.user ? `${cotisation.user.nom} ${cotisation.user.prenom}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {calculateDaysLeft(cotisation.date) < 0 ? 'Dépassé' : calculateDaysLeft(cotisation.date) === 0 ? 'Aujourd\'hui' : `${calculateDaysLeft(cotisation.date)} jours`}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const email = cotisation.adherent ? cotisation.adherent.email : cotisation.user?.email;
                      const name = cotisation.adherent ? cotisation.adherent.nom : cotisation.user?.nom;
                      const daysLeft = calculateDaysLeft(cotisation.date);
                      if (email) {
                       

                        sendEmail(email,  name ,daysLeft,cotisation.type);
                      }
                    }}
                  >
                    Envoyer Email
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message={alertMessage}
      />
    </Container>
  );
};

export default CotisationsPage;
