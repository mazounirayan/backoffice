import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControlLabel, Checkbox, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../components/theme/theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  numTel?: string;
  estBenevole?: boolean;
  profession?: string;
  dateInscription?: string;
}

interface EditedUser {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  numTel: string;
  estBenevole: boolean;
  profession: string;
}

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState<User[]>([]);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  const [editedUser, setEditedUser] = useState<EditedUser>({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    numTel: "",
    estBenevole: false,
    profession: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ Users: User[] }>('https://pa-api-0tcm.onrender.com/users');
      const data = response.data.Users.map((user: User) => ({
        ...user,
        name: `${user.prenom} ${user.nom}`,
        phone: user.numTel || "N/A",
        access: user.role
      }));
      setRows(data);
      toast.success('Utilisateurs chargés avec succès');
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Échec du chargement des utilisateurs');
    }
  };

  const handleAddMember = () => {
    navigate("/form");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      numTel: user.numTel || "",
      estBenevole: user.estBenevole || false,
      profession: user.profession || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setEditedUser({
      nom: "",
      prenom: "",
      email: "",
      role: "",
      numTel: "",
      estBenevole: false,
      profession: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as { name: string; value: string };
    
    if (e.target instanceof HTMLInputElement) {
        const type = e.target.type;
        const checked = e.target.checked;
        setEditedUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    } else {
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    }
};

const handleSaveUser = async () => {
  if (selectedUser && token) {
      try {
          await axios.patch(
              `https://pa-api-0tcm.onrender.com/users/${selectedUser.id}`,
              {
                ...editedUser,
                token: token,
                idAdmin: user.id,
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              });
          handleCloseDialog();
          fetchUsers();
          toast.success('Utilisateur mis à jour avec succès');
      } catch (error) {
          console.error('Failed to update user', error);
          toast.error('Échec de la mise à jour de l\'utilisateur');
      }
  }
};

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?") && token) {
      try {
        await axios.delete(`https://pa-api-0tcm.onrender.com/users/${userId}`, {
          data: { token, idAdmin:user.id },
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Failed to delete user', error);
        toast.error('Échec de la suppression de l\'utilisateur');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Téléphone",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Rôle",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            p="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor={
              access === "Administrateur"
                ? colors.greenAccent[600]
                : access === "Adherent"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "Administrateur" && <AdminPanelSettingsOutlinedIcon />}
            {access === "Visiteur" && <SecurityOutlinedIcon />}
       
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Button variant="contained" color="secondary" onClick={() => handleEditUser(params.row)}>Modifier</Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteUser(params.row.id)}>Supprimer</Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="TEAM" subtitle="Gérer les membres de l'équipe" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Typography variant="h6">Membres de l'équipe</Typography>
        <Button variant="contained" color="primary" onClick={handleAddMember}>
          Ajouter un membre
        </Button>
      </Box>
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
        <DataGrid rows={rows} columns={columns} slots={{ toolbar: GridToolbar }} />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="nom"
            value={editedUser.nom}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={editedUser.prenom}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Numéro de téléphone"
            name="numTel"
            value={editedUser.numTel}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Profession"
            name="profession"
            value={editedUser.profession}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="estBenevole"
                checked={editedUser.estBenevole}
                onChange={handleInputChange}
              />
            }
            label="Est bénévole"
          />
          <Select
            label="Rôle"
            name="role"
            value={editedUser.role}
            onChange={handleInputChange}
            fullWidth
            
          >
            <MenuItem value="Utilisateur">Utilisateur</MenuItem>
            <MenuItem value="Administrateur">Administrateur</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Annuler</Button>
          <Button onClick={handleSaveUser} color="secondary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
