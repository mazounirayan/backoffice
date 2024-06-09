import React from 'react';
import { Box, useTheme, Button } from "@mui/material";
import Header from "../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../components/theme/theme";
import { useAuth } from '../services/AuthService';

const documents = [
  { id: 1, title: "Document 1", content: "Content of Document 1" },
  { id: 2, title: "Document 2", content: "Content of Document 2" },
  { id: 3, title: "Document 3", content: "Content of Document 3" },
  // Ajoutez d'autres documents ici
];

const Documents = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user , token } = useAuth();

  const handleViewDocument = (content: string) => {
    alert(content); // Affiche le contenu du document dans une alerte. Vous pouvez changer cette logique pour ouvrir une modal ou naviguer vers une autre page.
  };

  const handleDownloadDocument = (title: string) => {
    // Mettez ici la logique pour télécharger le document
    alert(`Downloading ${title}`);
  };

  return (
    <Box m="20px">
      <Header title="Documents" subtitle="Manage Your Documents" />

      {documents.map((document) => (
        <Accordion key={document.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              {document.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewDocument(document.content)}
              style={{ marginRight: '10px' }}
            >
              View Document
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleDownloadDocument(document.title)}
            >
              upload Document
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Documents;
