import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Adherent {
  id: number;
  motDePasse: string;
  estBanie: boolean;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  numTel: string;
  adresse: string;
  profession: string;
  dateInscription: string;
  estBenevole: boolean;
}

interface Visiteur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  numTel: string;
  profession: string;
  dateInscription: string;
  estBanie: boolean;
}

interface AideProjet {
  id: number;
  titre: string;
  descriptionProjet: string;
  budget: number;
  deadline: string;

}

interface ApiResponse {
  AideProjets: AideProjet[];
  totalCount: number;
}

const ProjectPage: React.FC = () => {
  const [projets, setProjets] = useState<AideProjet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<AideProjet | null>(null);
  const [updatedProject, setUpdatedProject] = useState<Partial<AideProjet>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await axios.get<ApiResponse>('https://pa-api-0tcm.onrender.com/aide-projets');
        setProjets(response.data.AideProjets);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Erreur lors de la récupération des projets.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://pa-api-0tcm.onrender.com/aide-projets/${id}`);
      setProjets(projets.filter(projet => projet.id !== id));
      toast.success('Projet supprimé avec succès.');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erreur lors de la suppression du projet.');
    }
  };

  const handleEditClick = (projet: AideProjet) => {
    setSelectedProject(projet);
    setUpdatedProject({ ...projet });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDates = (deadline: string): boolean => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate >= today;
  };

  const handleEditSave = async () => {
    if (selectedProject) {
      const deadline = updatedProject.deadline as string;

      if (!validateDates(deadline)) {
        setFormErrors({ deadline: 'La date limite ne peut pas être dans le passé.' });
        return;
      }

      setFormErrors({});
      
      try {
        await axios.patch(`https://pa-api-0tcm.onrender.com/aide-projets/${selectedProject.id}`, updatedProject);
        setProjets(projets.map(projet => projet.id === selectedProject.id ? { ...projet, ...updatedProject } : projet));
        setEditDialogOpen(false);
        setSelectedProject(null);
        setUpdatedProject({});
        toast.success('Projet mis à jour avec succès.');
      } catch (error) {
        console.error('Error updating project:', error);
        toast.error('Erreur lors de la mise à jour du projet.');
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      <Box>
        {projets.map(projet => (
          <Box key={projet.id} mb={4} p={2} border={1} borderRadius={2} boxShadow={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              {projet.titre}
            </Typography>
            <Typography variant="body1" paragraph>
              {projet.descriptionProjet}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Budget: ${projet.budget}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Deadline: {new Date(projet.deadline).toLocaleDateString()}
            </Typography>
       
            <Box mt={2}>
              <Button variant="contained" color="error" onClick={() => handleDelete(projet.id)}>
                Delete
              </Button>
              <Button variant="outlined" color="primary" onClick={() => handleEditClick(projet)} sx={{ ml: 2 }}>
                Edit
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <>
              <TextField
                name="titre"
                label="Title"
                value={updatedProject.titre || ''}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="descriptionProjet"
                label="Description"
                value={updatedProject.descriptionProjet || ''}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="budget"
                label="Budget"
                type="number"
                value={updatedProject.budget || ''}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="deadline"
                label="Deadline"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={updatedProject.deadline || ''}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                error={!!formErrors.deadline}
                helperText={formErrors.deadline}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </Box>
  );
};

export default ProjectPage;
