import React from 'react';
import { Box, Typography, Button, Container, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { tokens } from "../components/theme/theme";
import { useTheme } from "@mui/material";
//https://github.com/mazounirayan/jar/releases/download/mazounirayan/ecafclientjava.jar
const DownloadPage: React.FC = () => {
  // URLs des fichiers .jar hébergés sur GitHub Releases
  const applicationUrl = 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/ecafclientjava.jar';
  const plugins = [
    { name: 'calculator-plugin-impl.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/calculator-plugin-impl.jar' },
    { name: 'kanban-plugin-impl.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/kanban-plugin-impl.jar' },
    { name: 'note-plugin-impl.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/note-plugin-impl.jar' }
  ];
  const themes = [
    { name: 'blue-theme-plugin.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/blue-theme-plugin.jar' },
    { name: 'dark-theme-plugin.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/dark-theme-plugin.jar' },
    { name: 'nature-theme-plugin.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/nature-theme-plugin.jar' },
    { name: 'violet-theme-plugin.jar', url: 'https://github.com/mazounirayan/jar/releases/download/mazounirayan/violet-theme-plugin.jar' }
  ];

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
          minHeight: '100vh',
          backgroundColor: 'grey',
          padding: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Téléchargement de l'application Java et des Plugins
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

        <Divider sx={{ my: 4, width: '100%' }} />

        <Box sx={{ width: '100%', mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Application Principale
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={applicationUrl}
            download="ecafclientjava.jar"
            sx={{ mb: 2 }}
          >
            Télécharger l'application Java (.jar)
          </Button>
        </Box>

        <Divider sx={{ my: 4, width: '100%' }} />

        <Box sx={{ width: '100%', mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Plugins
          </Typography>
          {plugins.map(plugin => (
            <Button
              key={plugin.name}
              variant="contained"
              color="secondary"
              href={plugin.url}
              download={plugin.name}
              sx={{ mb: 2 }}
            >
              Télécharger {plugin.name}
            </Button>
          ))}
        </Box>

        <Divider sx={{ my: 4, width: '100%' }} />

        <Box sx={{ width: '100%', mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Thèmes
          </Typography>
          {themes.map(theme => (
            <Button
              key={theme.name}
              variant="contained"
              color="success"
              href={theme.url}
              download={theme.name}
              sx={{ mb: 2 }}
            >
              Télécharger {theme.name}
            </Button>
          ))}
        </Box>

        <Divider sx={{ my: 4, width: '100%' }} />

        <Typography variant="h6" gutterBottom>
          FAQ
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Comment installer Java sur mon ordinateur ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Pour installer Java, visitez le site officiel de [Java SE Downloads](https://www.oracle.com/java/technologies/javase-downloads.html),
              téléchargez l'installateur approprié pour votre système d'exploitation, et suivez les instructions fournies.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Comment exécuter un fichier .jar ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Ouvrez une ligne de commande ou un terminal, naviguez jusqu'au répertoire contenant votre fichier .jar, puis exécutez la commande:
              <pre>java -jar nom-du-fichier.jar</pre>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Où dois-je placer les plugins téléchargés ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Les plugins doivent être placés dans le répertoire approprié de votre application. Consultez la documentation de l'application pour plus de détails sur l'emplacement exact.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Typography variant="body2" sx={{ mt: 4 }}>
          Si vous rencontrez des problèmes lors du téléchargement ou de l'installation, veuillez consulter notre FAQ ou nous contacter à support@example.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default DownloadPage;
