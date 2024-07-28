import { Adherant, Cotisation, Transaction } from './api';

export interface Statistics {
  totalCotisations: number;
  totalDons: number;
  nombreAdherants: number;
  nombreCotisations: number;
  totalMontant: number;
  nombreTransactionsParDate: Record<string, number>;
  montantParDate: Record<string, number>;
  adherentsParMois: Record<string, number>;
}

export const calculateStatistics = (adherants: Adherant[], cotisations: Cotisation[], transactions: Transaction[]): Statistics => {
  const stats: Statistics = {
    totalCotisations: 0,
    totalDons: 0,
    nombreAdherants: adherants.length,
    nombreCotisations: cotisations.length,
    totalMontant: 0,
    nombreTransactionsParDate: {},
    montantParDate: {},
    adherentsParMois: {},
  };

  transactions.forEach(transaction => {
    const date = transaction.dateTransaction.split('T')[0];
    stats.totalMontant += transaction.montant;

    if (transaction.type === 'Cotisation') {
      stats.totalCotisations += transaction.montant;
    } else if (transaction.type === 'Don') {
      stats.totalDons += transaction.montant;
    }

    if (!stats.nombreTransactionsParDate[date]) {
      stats.nombreTransactionsParDate[date] = 0;
      stats.montantParDate[date] = 0;
    }
    stats.nombreTransactionsParDate[date] += 1;
    stats.montantParDate[date] += transaction.montant;
  });

  adherants.forEach(adherant => {
    const date = new Date(adherant.dateInscription);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!stats.adherentsParMois[monthYear]) {
      stats.adherentsParMois[monthYear] = 0;
    }
    stats.adherentsParMois[monthYear] += 1;
  });

  return stats;
};