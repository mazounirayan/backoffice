import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../components/theme/theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";

// Define the interface for Visiteur
export interface Visiteur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  numTel: string;
  adresse: string;
  profession: string;
  dateInscription: string;
  estBenevole: boolean;
  parrain: Parrain | null;
}

// Define the interface for Parrain
export interface Parrain {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  profession: string;
}

const Visiteurs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState<Visiteur[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pa-api-0tcm.onrender.com/visiteurs');
        const data = response.data.Visiteurs.map((visiteur: Visiteur, index: number) => ({
          id: index + 1,
          nom: visiteur.nom,
          prenom: visiteur.prenom,
          email: visiteur.email,
          age: visiteur.age,
          numTel: visiteur.numTel,
          adresse: visiteur.adresse,
          profession: visiteur.profession,
          dateInscription: visiteur.dateInscription,
          estBenevole: visiteur.estBenevole,
          parrain: visiteur.parrain ? `${visiteur.parrain.prenom} ${visiteur.parrain.nom}` : "N/A",
        }));
        setRows(data);
      } catch (error) {
        console.error('Failed to fetch visitors', error);
      }
    };
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left" },
    { field: "numTel", headerName: "Téléphone", flex: 1 },
    { field: "adresse", headerName: "Adresse", flex: 1 },
    { field: "profession", headerName: "Profession", flex: 1 },
    { field: "dateInscription", headerName: "Date d'Inscription", flex: 1 },
    { field: "estBenevole", headerName: "Bénévole", flex: 1, renderCell: (params) => (params.value ? "Oui" : "Non") },
    { field: "parrain", headerName: "Parrain", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Adhérant " subtitle="Liste des Adhérant " />
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
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Visiteurs;
