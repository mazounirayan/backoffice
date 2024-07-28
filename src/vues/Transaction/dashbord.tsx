import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import StatisticsDashboard from './dashbordStat';
import { fetchTransactions } from './api';
import sendEmail from './email';

const Dash: React.FC = () => {
  const [totalCotisationsAmount, setTotalCotisationsAmount] = useState(0);

  useEffect(() => {
    const notifyAdminIfNeeded = async () => {
      const transactions = await fetchTransactions();
      const total = transactions
        .filter((tx: { type: string; }) => tx.type === 'Cotisation')
        .reduce((sum:number , tx:any) => sum + tx.montant, 0);
      setTotalCotisationsAmount(total);

      if (total > 1000) {
        sendEmail('admin@example.com', `Le total des cotisations a atteint ${total} €.`);
      }
    };

    notifyAdminIfNeeded();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h5">Statistiques</Typography>
            <StatisticsDashboard  />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h6">Résumé des Cotisations</Typography>
            <Typography variant="body1">Total des Cotisations : {totalCotisationsAmount} €</Typography>
            {/* Ajouter plus de détails ou d'options ici */}
            <Button variant="contained" color="primary">
              Exporter les Données
            </Button>
          </Paper>
        </Grid>
        {/* Ajouter d'autres sections pour les fonctionnalités supplémentaires */}
      </Grid>
    </Container>
  );
};

export default Dash;
