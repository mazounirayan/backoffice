import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../components/theme/theme"; // Assurez-vous que ce chemin est correct
import Header from "../../components/Header"; // Assurez-vous que ce chemin est correct

interface User {
  id: number;
  nom: string;
  prenom: string;
}

interface Adherent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  age: number;
  numTel: string;
  adresse: string;
  profession: string;
  parrain:  {id:number;prenom:string;nom:string};
  estBenevole: boolean;
  estBanie?: boolean; // Ajouté pour gérer l'état de bannissement
}

const AdherentsManagement: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [adherents, setAdherents] = useState<Adherent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdherent, setSelectedAdherent] = useState<Adherent | null>(null);
  const [editedAdherent, setEditedAdherent] = useState<Partial<Adherent>>({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const [error, setError] = useState<string | null>(null);
console.log(editedAdherent)
  useEffect(() => {
    fetchAdherents();
    fetchUsers();
  }, []);

  const fetchAdherents = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/adherents?estBanie=false');
      setAdherents(response.data.Adherents);
    } catch (error) {
      console.error('Erreur lors de la récupération des adhérents:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/users');
      setUsers(response.data.Users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedAdherent(prev => ({
      ...prev,
      [name]: name === 'estBenevole' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setEditedAdherent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditAdherent = (adherent: Adherent) => {
    setSelectedAdherent(adherent);
    setEditedAdherent({ ...adherent });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdherent(null);
    setEditedAdherent({});
  };

  const handleSaveAdherent = async () => {
    if (editedAdherent.age && editedAdherent.age < 16) {
      setError("L'âge doit être supérieur ou égal à 16 ans.");
      return;
    }

    try {
      if (selectedAdherent) {
        const updatedFields = Object.keys(editedAdherent).reduce((acc, key) => {
          const adherentKey = key as keyof Adherent;
          if (editedAdherent[adherentKey] !== selectedAdherent[adherentKey]) {
            (acc as any)[adherentKey] = editedAdherent[adherentKey];
          }
          return acc;
        }, {} as Partial<Adherent>);
  
        if (Object.keys(updatedFields).length > 0) {
          await axios.patch(`https://pa-api-0tcm.onrender.com/adherentsUser/${selectedAdherent.id}`, updatedFields, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } else {
        const newAdherent = { ...editedAdherent, estBanie: false, parrain: editedAdherent.parrain?.id , estBenevole: editedAdherent.estBenevole !== undefined ? editedAdherent.estBenevole : false};
        await axios.post('https://pa-api-0tcm.onrender.com/auth/signupAdherent', newAdherent);
      }
      fetchAdherents();
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'adhérent:', error);
    }
  };

  const handleDeleteAdherent = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
      try {
        await axios.delete(`https://pa-api-0tcm.onrender.com/adherents/${id}`);
        fetchAdherents();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'adhérent:', error);
      }
    }
  };

  const handleBanAdherent = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir bannir cet adhérent ?')) {
      try {
        await axios.patch(`https://pa-api-0tcm.onrender.com/adherentsUser/${id}`, {
          estBanie: true,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchAdherents();
      } catch (error) {
        console.error('Erreur lors du bannissement de l\'adhérent:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nom", headerName: "Nom", flex: 0.75  },
    { field: "prenom", headerName: "Prénom", flex: 0.75  },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "numTel", headerName: "Téléphone", flex: 1 },
    { field: "profession", headerName: "Profession", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleEditAdherent(params.row)}>Modifier</Button>
          <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={() => handleDeleteAdherent(params.row.id)}>Supprimer</Button>
          <Button variant="contained" color="warning" onClick={() => handleBanAdherent(params.row.id)}>Bannir</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="ADHÉRENTS" subtitle="Gestion des adhérents" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Typography variant="h6">Liste des adhérents</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Ajouter un adhérent
        </Button>
      </Box>
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
        <DataGrid rows={adherents} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedAdherent ? 'Modifier l\'adhérent' : 'Ajouter un adhérent'}</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <TextField name="nom" label="Nom" value={editedAdherent.nom || selectedAdherent?.nom || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="prenom" label="Prénom" value={editedAdherent.prenom || selectedAdherent?.prenom || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="email" label="Email" value={editedAdherent.email || selectedAdherent?.email || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="motDePasse" label="Mot de Passe" type="password" value={editedAdherent.motDePasse || selectedAdherent?.motDePasse || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="age" label="Âge" type="number" value={editedAdherent.age || selectedAdherent?.age || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="numTel" label="Téléphone" value={editedAdherent.numTel || selectedAdherent?.numTel || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="adresse" label="Adresse" value={editedAdherent.adresse || selectedAdherent?.adresse || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="profession" label="Profession" value={editedAdherent.profession || selectedAdherent?.profession || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <FormControlLabel
            control={<Checkbox name="estBenevole" checked={editedAdherent.estBenevole !== undefined ? editedAdherent.estBenevole : selectedAdherent?.estBenevole || false} onChange={handleInputChange} />}
            label="Est bénévole"
          />
          <Select name="parrain" value={editedAdherent.parrain?.id || ''} onChange={handleSelectChange} fullWidth >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.nom} {user.prenom}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveAdherent} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdherentsManagement;
