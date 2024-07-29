import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { tokens } from "../components/theme/theme";
import {  useTheme } from "@mui/material";
const DownloadPage: React.FC = () => {
  // URLs des fichiers .jar hébergés sur Azure Blob Storage
  const applicationUrl = 'https://drive.google.com/file/d/1ZJFr2nhWr0AaI9U2-F3L5FLXgE0Ywwe2/view?usp=drive_link';
  const plugin1Url = 'https://drive.google.com/file/d/1UzxyhxCbH2cuRr_oV2rPoysm82T83QS9/view?usp=drive_link';
  const plugin2Url = 'https://drive.google.com/file/d/1JDupZOY9XpwwXSrBcKic9vAT4LWed5f6/view?usp=sharing';
  const plugin3Url = 'https://drive.google.com/file/d/1mPqAaStjoCJu0ArYr-nxks4suGG3iy1u/view?usp=sharing';
 
  const themejar =[""]

 
 
 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'grey',
          padding: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Téléchargement de l'application Java
        </Typography>
        <Typography variant="body1" paragraph>
          Vous pouvez télécharger l'application Java ainsi que les plugins nécessaires en utilisant les liens ci-dessous. Suivez les instructions pour installer et exécuter les fichiers téléchargés.
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 4 }}>
          Instructions de Téléchargement et d'Installation
        </Typography>
        <Typography variant="body1" paragraph>
          1. **Télécharger les Fichiers**: Cliquez sur les boutons ci-dessous pour télécharger l'application Java et les plugins en format `.jar`.
        </Typography>
        <Typography variant="body1" paragraph>
          2. **Vérifier l'Installation de Java**: Assurez-vous que Java est installé sur votre machine. Vous pouvez vérifier cela en ouvrant une ligne de commande et en tapant `java -version`. Si Java n'est pas installé, vous pouvez le télécharger depuis le site officiel [Java SE Downloads](https://www.oracle.com/java/technologies/javase-downloads.html).
        </Typography>
        <Typography variant="body1" paragraph>
          3. **Exécuter l'Application**: Une fois le fichier `.jar` téléchargé, vous pouvez exécuter l'application Java en ouvrant une ligne de commande et en utilisant la commande suivante :
          <pre>java -jar chemin/vers/your-application.jar</pre>
        </Typography>
        <Typography variant="body1" paragraph>
          4. **Installer les Plugins**: Pour utiliser les plugins, placez les fichiers `.jar` dans le répertoire approprié de l'application ou suivez les instructions spécifiques fournies avec les plugins.
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            href={applicationUrl}
            download="application.jar"
            sx={{ mb: 2 }}
          >
            Télécharger l'application Java (.jar)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            href={plugin1Url}
            download="plugin1.jar"
            sx={{ mb: 2 }}
          >
            Télécharger Plugin 1 (.jar)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            href={plugin2Url}
            download="plugin2.jar"
            sx={{ mb: 2 }}
          >
            Télécharger Plugin 2 (.jar)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            href={plugin3Url}
            download="plugin3.jar"
            sx={{ mb: 2 }}
          >
            Télécharger Plugin 3 (.jar)
          </Button>
          
        </Box>
        
        <Typography variant="body2" sx={{ mt: 4 }}>
          Si vous rencontrez des problèmes lors du téléchargement ou de l'installation, veuillez consulter notre [FAQ](#) ou nous contacter à support@example.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default DownloadPage;
