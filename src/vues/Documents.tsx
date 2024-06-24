import React, { useEffect, useState } from 'react';
import { Box, useTheme, Button } from "@mui/material";
import Header from "../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../components/theme/theme";
import { useAuth } from '../services/AuthService';

import { getDocumentName, getDocumentlien } from '../services/api';

interface Document {
  fileName: string;
}

const Documents: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user,token } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);

  // Fetch documents only when user data is available
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is null');
        return;
      }

      if (!user) return;

      try {
        const result = await getDocumentName(token, user.id);
        console.log(result)
        setDocuments(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleViewDocument = async (content: string) => {
    if (!token) {
      console.error('Token is null');
      return;
    }

    if (!user) return;

    try {
      console.log(content);
      const result = await getDocumentlien(content,token, user.id);
      console.log(result)
      window.open(result.sasUrl, '_blank');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    // alert(content); // Replace with appropriate logic for document viewing
  };

  const handleDownloadDocument = (title: string) => {
    alert(`Downloading ${title}`); // Replace with actual download logic
  };

  // Display loading message while user data is fetched
  if (!user) {
    return <p>Loading user data...</p>;
  }
  console.log(documents);
  return (
    <Box m="20px">
      <Header title="Documents" subtitle="Manage Your Documents" />

      {documents.map((document,index) => (
        
        <Accordion key={index} defaultExpanded>
           
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
            {document.fileName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewDocument(document.fileName)}
              style={{ marginRight: '10px' }}
            >
              View Document
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleDownloadDocument(document.fileName)}
            >
              Upload Document
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Documents;
