import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { fetchAdherants, fetchCotisations, fetchTransactions, Adherant, Cotisation, Transaction } from './api';
import {  calculateStatistics,Statistics } from './stats';





const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatisticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<Statistics | null>(null);
    const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('year');
  
    useEffect(() => {
      const fetchData = async () => {
        const [adherants, cotisations, transactions] = await Promise.all([
          fetchAdherants(),
          fetchCotisations(),
          fetchTransactions(),
        ]);
        setStats(calculateStatistics(adherants, cotisations, transactions));
      };
  
      fetchData();
    }, []);
  
    const filterDataByTimeRange = <T extends Record<string, number>>(data: T): Partial<T> => {
      const now = new Date();
      const timeRanges = {
        month: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        quarter: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        year: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      };
  
      return Object.entries(data).reduce((acc, [date, value]) => {
        if (new Date(date) >= timeRanges[timeRange]) {
          return { ...acc, [date]: value };
        }
        return acc;
      }, {} as Partial<T>);
    };
  
    if (!stats) {
      return <div>Chargement...</div>;
    }
  
    const filteredTransactions = filterDataByTimeRange(stats.nombreTransactionsParDate);
    const filteredMontants = filterDataByTimeRange(stats.montantParDate);
    const filteredAdherents = filterDataByTimeRange(stats.adherentsParMois);
  
    const barChartData = Object.entries(filteredTransactions).map(([date, count]) => ({
      date,
      'Nombre de transactions': count,
      'Montant total': filteredMontants[date] || 0,
    }));
  
    const lineChartData = Object.entries(filteredAdherents).map(([month, count]) => ({
      month,
      'Nouveaux adhérents': count,
    }));
  
    const pieChartData = [
      { name: 'Cotisations', value: stats.totalCotisations },
      { name: 'Dons', value: stats.totalDons },
    ];
  
    return (
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Tableau de bord des statistiques
            </Typography>
    
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="time-range-select-label">Période</InputLabel>
              <Select
                labelId="time-range-select-label"
                id="time-range-select"
                value={timeRange}
                label="Période"
                onChange={(e) => setTimeRange(e.target.value as 'month' | 'quarter' | 'year')}
              >
                <MenuItem value="month">Dernier mois</MenuItem>
                <MenuItem value="quarter">Dernier trimestre</MenuItem>
                <MenuItem value="year">Dernière année</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Nombre de cotisations" />
              <CardContent>
                <Typography variant="h4">{stats.nombreCotisations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Total des cotisations" />
              <CardContent>
                <Typography variant="h4">{stats.totalCotisations.toFixed(2)} €</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Total des dons" />
              <CardContent>
                <Typography variant="h4">{stats.totalDons.toFixed(2)} €</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Nombre d'adhérents" />
              <CardContent>
                <Typography variant="h4">{stats.nombreAdherants}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Transactions et montants par date" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Nombre de transactions" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="Montant total" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Nouveaux adhérents par mois" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Nouveaux adhérents" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Répartition des revenus" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StatisticsDashboard;