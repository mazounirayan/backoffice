import React, { useState, ChangeEvent, FormEvent } from "react";
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Paper,useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./css/new.scss";
import { SelectChangeEvent } from '@mui/material';
import { tokens } from '../components/theme/theme';


interface NewProps {
 
  title: string;
}

interface FormValues {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
  estBenevole: boolean;
  numTel: string;
  profession: string;
  dateInscription: string;
}

const New: React.FC<NewProps> = ({ title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formValues, setFormValues] = useState<FormValues>({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'Visiteur',
    estBenevole: false,
    numTel: '',
    profession: '',
    dateInscription: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let updatedValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      updatedValue = e.target.checked
    }
    setFormValues({
      ...formValues,
      [name]: updatedValue === null ? '' : updatedValue,
    });
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormValues({
      ...formValues,
      role: e.target.value as string,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!formValues.nom || !formValues.prenom || !formValues.email || !formValues.motDePasse) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const response = await fetch('https://pa-api-0tcm.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Utilisateur créé avec succès');
       
      }  else if (data && data.email) {
        toast.error(data.email);
      } else {
        toast.error(data.error || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <div className="new">
      <ToastContainer />
      <div className="newContainer">
        <div className="top">
          <Typography variant="h1">{title}</Typography>
        </div>
        <Box 
           sx={{      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            backgroundColor: colors.primary[500],
            padding: 3, borderRadius: 2 }}>
        <Paper sx={{ padding: 3, backgroundColor: colors.primary[500], borderRadius: 2 }}>
      
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom"
              type="text"
              name="nom"
              value={formValues.nom}
              onChange={handleInputChange}
              placeholder="Martin"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              label="Prenom"
              type="text"
              name="prenom"
              value={formValues.prenom}
              onChange={handleInputChange}
              placeholder="Alice"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="alice.martin@email.com"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              name="motDePasse"
              value={formValues.motDePasse}
              onChange={handleInputChange}
              placeholder="motdepasse2"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Rôle</InputLabel>
              <Select
                name="role"
                value={formValues.role}
                onChange={handleRoleChange}
                label="Rôle"
              >
                <MenuItem value="Visiteur">Visiteur</MenuItem>
                <MenuItem value="Administrateur">Administrateur</MenuItem>
                <MenuItem value="Adherent">Adherent</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Numéro de téléphone"
              type="text"
              name="numTel"
              value={formValues.numTel}
              onChange={handleInputChange}
              placeholder="0123456789"
              
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Profession"
              type="text"
              name="profession"
              value={formValues.profession}
              onChange={handleInputChange}
              placeholder="Ingénieur"
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Date d'inscription"
              type="date"
              name="dateInscription"
              value={formValues.dateInscription}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box display="flex" alignItems="center" mt={2}>
              <label>
                Est Bénévole
                <input
                  type="checkbox"
                  name="estBenevole"
                  checked={formValues.estBenevole}
                  onChange={handleInputChange}
                />
              </label>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button type="submit" color="secondary" variant="contained">
                Créer un nouvel utilisateur
              </Button>
            </Box>
          </form>
  
        </Paper>
        </Box>
      </div>
    
    </div>
  );
};

export default New;
