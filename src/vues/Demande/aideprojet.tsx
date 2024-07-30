import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

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
  visiteur: Visiteur | null;
  adherent: Adherent | null;
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

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await axios.get<ApiResponse>('https://pa-api-0tcm.onrender.com/aide-projets');
        setProjets(response.data.AideProjets);
      } catch (error) {
        console.error('Error fetching projects:', error);
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
    } catch (error) {
      console.error('Error deleting project:', error);
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

  const handleEditSave = async () => {
    if (selectedProject) {
      try {
        await axios.patch(`https://pa-api-0tcm.onrender.com/aide-projets/${selectedProject.id}`, updatedProject);
        setProjets(projets.map(projet => projet.id === selectedProject.id ? { ...projet, ...updatedProject } : projet));
        setEditDialogOpen(false);
        setSelectedProject(null);
        setUpdatedProject({});
      } catch (error) {
        console.error('Error updating project:', error);
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
            {projet.visiteur && (
              <Box mt={2} mb={2}>
                <Typography variant="subtitle1">Visitor Info</Typography>
                <Typography variant="body2">
                  {projet.visiteur.nom} {projet.visiteur.prenom}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {projet.visiteur.email}
                </Typography>
              </Box>
            )}
            {projet.adherent && (
              <Box mt={2} mb={2}>
                <Typography variant="subtitle1">Adherent Info</Typography>
                <Typography variant="body2">
                  {projet.adherent.nom} {projet.adherent.prenom}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {projet.adherent.email}
                </Typography>
              </Box>
            )}
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
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectPage;
