import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, useTheme, CircularProgress, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Header from "../components/Header"; // Assurez-vous que ce composant existe ou ajustez-le en conséquence
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { format } from 'date-fns';


interface Transaction {
    id: number;
    montant: number;
    type: string;
    methodePaiement: string | null;
    emailVisiteur: string;
    evenement: string | null;
    dateTransaction: string;
}

const Transactions: React.FC = () => {
    const theme = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pa-api-0tcm.onrender.com/transactions');
                const data = response.data.Transactions.map((transaction: Transaction) => ({
                    id: transaction.id,
                    montant: transaction.montant ,
                    type: transaction.type,
                    methodePaiement: transaction.methodePaiement || "N/A",
                    emailVisiteur: transaction.emailVisiteur || "N/A",
                    evenement: transaction.evenement,
                    dateTransaction: transaction.dateTransaction
                   
                

                  }));
                setTransactions(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch transactions');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "montant", headerName: "Montant", width: 150 },
        { field: "type", headerName: "Type", width: 150 },
        { field: "methodePaiement", headerName: "Méthode de Paiement", width: 200},
        { field: "emailVisiteur", headerName: "Email Visiteur", width: 200 },
        { field: "dateTransaction", headerName: "Date de Transaction", width: 200 }
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Header title="Transactions" subtitle="Gestion des Transactions" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: theme.palette.secondary.main,
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.primary.dark,
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.primary.light,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: theme.palette.primary.dark,
                    },
                    "& .MuiCheckbox-root": {
                        color: `${theme.palette.secondary.main} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${theme.palette.text.primary} !important`,
                    },
                }}
            >
                <DataGrid
                    checkboxSelection
                    rows={transactions}
                    columns={columns}
               
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Transactions;
