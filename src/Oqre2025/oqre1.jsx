import React, { useState } from 'react';
//import SplitPane from 'react-split-pane-v2';

// --- MUI Imports ---
import {
  AppBar, Toolbar, Typography, Container, Box, Button, ButtonGroup,
  Paper, Stack, CssBaseline, ThemeProvider, createTheme,
  IconButton, Tooltip
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

import { config, docConfig } from './configData';
import TextEditorSelectionModify from './tex';
import JsonViewer from './OQREEXERCICE/JsonViewer';
import Oqrerevision1 from './OQRERESIVION/Oqrerevision2';
//import DetectiveTextComponent from './OQREEXERCICE/DetectiveTextComponent';

// --- Theme ---
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ffa000' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
  },
  typography: {
    h1: { fontSize: '1.6rem', fontWeight: 'bold' },
    h2: { fontSize: '1.4rem', fontWeight: 'bold' },
    h3: { fontSize: '1.2rem', fontWeight: 'bold' },
  },
});



function SubjectSection({ subject, pdfUrl, formUrl, icon }) {
  const [viewMode, setViewMode] = useState("split"); // split, pdf, form

  const getFlexValues = () => {
    switch (viewMode) {
      case "pdf":
        return ["90%", "10%"];
      case "form":
        return ["10%", "90%"];
      default:
        return ["50%", "50%"];
    }
  };

  const [leftWidth, rightWidth] = getFlexValues();

  return (
    <Paper elevation={3} sx={{ p: 2, overflow: "hidden" }}>
      {/* Titre et icônes */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h4" component="h2">
          {icon} <Box component="span" sx={{ ml: 1 }}>{subject}</Box>
        </Typography>

        <Box>
          <Tooltip title="Agrandir PDF">
            <span>
              <IconButton onClick={() => setViewMode("pdf")} disabled={viewMode === "pdf"}>
                <LastPageIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Vue partagée">
            <span>
              <IconButton onClick={() => setViewMode("split")} disabled={viewMode === "split"}>
                <VerticalSplitIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Agrandir formulaire">
            <span>
              <IconButton onClick={() => setViewMode("form")} disabled={viewMode === "form"}>
                <FirstPageIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Contenu divisé en 2 parties avec flexbox */}
      <Box sx={{ display: "flex", height: "65vh", border: "1px solid #ccc", borderRadius: 1 }}>
        <Box sx={{ width: leftWidth, transition: "width 0.3s", overflow: "auto", bgcolor: "#f5f5f5" }}>
          <iframe
            src={pdfUrl}
            title="PDF"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </Box>
        <Box sx={{ width: rightWidth, transition: "width 0.3s", overflow: "auto" }}>
          <iframe
            src={formUrl}
            title="Form"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </Box>
      </Box>
    </Paper>
  );
}



// --- Composant principal ---
function OqreMuiViewer() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const handleGradeSelect = (grade) => setSelectedGrade(grade);
  const gradeData = selectedGrade ? docConfig[selectedGrade] : null;

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'Français': return <MenuBookIcon sx={{ mr: 0.8 }} fontSize="inherit" />;
      case 'Maths': return <CalculateIcon sx={{ mr: 0.8 }} fontSize="inherit" />;
      default: return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      < Oqrerevision1></Oqrerevision1>

      <JsonViewer></JsonViewer>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
              Portail OQRE
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>Choisis ton année :</Typography>
              <ButtonGroup variant="contained" size="medium">
                {config.grades.map((grade) => (
                  <Button key={grade} onClick={() => handleGradeSelect(grade)}>
                    {grade.toUpperCase()}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 2, md: 3 } }}>
          {!selectedGrade && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h2">Bienvenue sur le portail OQRE !</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Sélectionne une année pour voir les exercices disponibles.
              </Typography>
            </Box>
          )}

          {selectedGrade && gradeData && (
            <Stack spacing={4} sx={{ mt: 2 }}>
              <Typography variant="h2" align="center">
                Exercices {selectedGrade.toUpperCase()}
              </Typography>

              {gradeData['Français'] && (
                <SubjectSection
                  subject="Français"
                  pdfUrl={gradeData['Français'].pdf}
                  formUrl={gradeData['Français'].googleForm}
                  icon={getSubjectIcon('Français')}
                />
              )}
              <TextEditorSelectionModify></TextEditorSelectionModify>

              {gradeData['Maths'] && (
                <SubjectSection
                  subject="Maths"
                  pdfUrl={gradeData['Maths'].pdf}
                  formUrl={gradeData['Maths'].googleForm}
                  icon={getSubjectIcon('Maths')}
                />
              )}
            </Stack>
          )}

          {selectedGrade && !gradeData && (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
              Données manquantes pour cette année. Veuillez vérifier la configuration.
            </Typography>
          )}
        </Container>

        
      </Box>
    </ThemeProvider>
  );
}

export default OqreMuiViewer;
