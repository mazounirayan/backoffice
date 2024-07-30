import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme, Button, InputLabel, FormControl, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../components/theme/theme"; // Assurez-vous que ce chemin est correct
import Header from "../../components/Header"; // Assurez-vous que ce chemin est correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  profession: string;
  estBenevole: boolean;
  estBanie?: boolean;
}

const UnbanManagement: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem('token');
  const [userType, setUserType] = useState<'adherent' | 'visiteur'>('adherent');

  useEffect(() => {
    fetchBannedUsers();
  }, [userType]);

  const fetchBannedUsers = async () => {
    try {
      if(userType ==="adherent") {
        const adherentsResponse = await axios.get('https://pa-api-0tcm.onrender.com/adherents?estBanie=true');
        setUsers([...adherentsResponse.data.Adherents]);
      } else {
        const visiteursResponse = await axios.get('https://pa-api-0tcm.onrender.com/visiteurs?estBanie=true');
        setUsers([...visiteursResponse.data.Visiteurs]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs bannis:', error);
      toast.error('Erreur lors de la récupération des utilisateurs bannis');
    }
  };

  const handleUnbanUser = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir débannir cet utilisateur ?')) {
      try {
        console.log(userType)
        if (userType === 'adherent'){
          await axios.patch(`https://pa-api-0tcm.onrender.com/adherentsUser/${id}`, {
            estBanie: false,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.patch(`https://pa-api-0tcm.onrender.com/visiteurs/${id}`, {
            estBanie: false,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        fetchBannedUsers();
        toast.success('Utilisateur débanni avec succès');
      } catch (error) {
        console.error('Erreur lors du débannissement de l\'utilisateur:', error);
        toast.error('Erreur lors du débannissement de l\'utilisateur');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nom", headerName: "Nom", flex: 0.75 },
    { field: "prenom", headerName: "Prénom", flex: 0.75 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "numTel", headerName: "Téléphone", flex: 1 },
    { field: "profession", headerName: "Profession", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="primary" onClick={() => handleUnbanUser(params.row.id)}>
            Débannir
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="UTILISATEURS BANNIS" subtitle="Gestion des utilisateurs bannis" />
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel id="user-type-select-label">Type d'utilisateur</InputLabel>
        <Select
          labelId="user-type-select-label"
          id="user-type-select"
          value={userType}
          onChange={(e) => setUserType(e.target.value as 'adherent' | 'visiteur')}
          label="Type d'utilisateur"
        >
          <MenuItem value="adherent">Adhérents</MenuItem>
          <MenuItem value="visiteur">Visiteurs</MenuItem>
        </Select>
      </FormControl>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid rows={users} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default UnbanManagement;
