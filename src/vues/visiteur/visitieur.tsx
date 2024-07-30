import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../components/theme/theme"; 
import Header from "../../components/Header"; 

interface Visiteur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  numTel: string;

  profession: string;

  estBanie?: boolean; 
}

const VisiteursManagement: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [visiteurs, setVisiteurs] = useState<Visiteur[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVisiteur, setSelectedVisiteur] = useState<Visiteur | null>(null);
  const [editedVisiteur, setEditedVisiteur] = useState<Partial<Visiteur>>({});
  const token = localStorage.getItem('token');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVisiteurs();
  }, []);

  const fetchVisiteurs = async () => {
    try {
      const response = await axios.get('https://pa-api-0tcm.onrender.com/visiteurs?estBanie=false');
      setVisiteurs(response.data.Visiteurs);
    } catch (error) {
      console.error('Erreur lors de la récupération des visiteurs:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setEditedVisiteur(prev => ({
      ...prev,
      [name]: name === 'estBenevole' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEditVisiteur = (visiteur: Visiteur) => {
    setSelectedVisiteur(visiteur);
    setEditedVisiteur({ ...visiteur });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVisiteur(null);
    setEditedVisiteur({});
  };

  const handleSaveVisiteur = async () => {
    if (editedVisiteur.age && editedVisiteur.age < 16) {
      setError("L'âge doit être supérieur ou égal à 16 ans.");
      return;
    }

    try {
      if (selectedVisiteur) {
        const updatedFields = Object.keys(editedVisiteur).reduce((acc, key) => {
          const visiteurKey = key as keyof Visiteur;
          if (editedVisiteur[visiteurKey] !== selectedVisiteur[visiteurKey]) {
            (acc as any)[visiteurKey] = editedVisiteur[visiteurKey];
          }
          return acc;
        }, {} as Partial<Visiteur>);
  
        if (Object.keys(updatedFields).length > 0) {
          await axios.patch(`https://pa-api-0tcm.onrender.com/visiteursUser/${selectedVisiteur.id}`, updatedFields, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } else {
        const newVisiteur = { ...editedVisiteur, estBanie: false };
        await axios.post('https://pa-api-0tcm.onrender.com/visiteurs', newVisiteur);
      }
      fetchVisiteurs();
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du visiteur:', error);
    }
  };

  const handleDeleteVisiteur = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce visiteur ?')) {
      try {
        await axios.delete(`https://pa-api-0tcm.onrender.com/visiteurs/${id}`);
        fetchVisiteurs();
      } catch (error) {
        console.error('Erreur lors de la suppression du visiteur:', error);
      }
    }
  };

  const handleBanVisiteur = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir bannir ce visiteur ?')) {
      try {
        await axios.patch(`https://pa-api-0tcm.onrender.com/visiteurs/${id}`, {
          estBanie: true,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchVisiteurs();
      } catch (error) {
        console.error('Erreur lors du bannissement du visiteur:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nom", headerName: "Nom", flex: 0.75 },
    { field: "prenom", headerName: "Prénom", flex: 0.75 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "numTel", headerName: "Téléphone", flex: 1 },
    { field: "profession", headerName: "Profession", flex: 0.75  },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleEditVisiteur(params.row)}>Modifier</Button>
          <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={() => handleDeleteVisiteur(params.row.id)}>Supprimer</Button>
          <Button variant="contained" color="warning" onClick={() => handleBanVisiteur(params.row.id)}>Bannir</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="VISITEURS" subtitle="Gestion des visiteurs" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Typography variant="h6">Liste des visiteurs</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Ajouter un visiteur
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
        <DataGrid rows={visiteurs} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedVisiteur ? 'Modifier le visiteur' : 'Ajouter un visiteur'}</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <TextField name="nom" label="Nom" value={editedVisiteur.nom || selectedVisiteur?.nom || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="prenom" label="Prénom" value={editedVisiteur.prenom || selectedVisiteur?.prenom || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="email" label="Email" value={editedVisiteur.email || selectedVisiteur?.email || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="age" label="Âge" type="number" value={editedVisiteur.age || selectedVisiteur?.age || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="numTel" label="Téléphone" value={editedVisiteur.numTel || selectedVisiteur?.numTel || ''} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="profession" label="Profession" value={editedVisiteur.profession || selectedVisiteur?.profession || ''} onChange={handleInputChange} fullWidth margin="normal" />
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveVisiteur} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VisiteursManagement;
