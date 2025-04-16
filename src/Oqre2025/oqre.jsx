import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Paper,
  Grid,
  Chip, // Changed from Button
  CssBaseline,
  Stack, // Added for layout
  Divider, // Added for visual separation
  CircularProgress, // Added for loading indication (optional but nice)
  Tooltip // Added for clarity on resize buttons
} from '@mui/material';
import {
  MenuBook, // Example icon for PDF
  Assignment, // Example icon for Form
  InfoOutlined, // Example icon for placeholder
  FormatAlignLeft, // Icon for resize
  FormatAlignCenter, // Icon for resize
  FormatAlignRight, // Icon for resize
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles'; // For custom styling

// Importer la configuration depuis le fichier JSON
// Assurez-vous que data.json est dans le bon chemin (par exemple, src/data.json)
// et que votre bundler (comme celui de Create React App) le gère.
import data from './data.json';
import TextEditorMui from './texediteur';
const { config, docConfig } = data;

// Styled components (Optional, but can keep sx props cleaner)
const PanelPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '75vh', // Slightly reduced height for better spacing overall
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // Hide iframe overflow until loaded
}));

const IFrame = styled('iframe')({
  width: '100%',
  height: '100%',
  border: 'none',
  flexGrow: 1, // Allow iframe to take remaining space
});

const PlaceholderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const ControlSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.primary.light, 0.1), // Subtle background
}));

const PreparationOQRE = () => {
  const [grade, setGrade] = useState("6e");
  const [subject, setSubject] = useState(null);
  const [year, setYear] = useState(null);
  const [panelSize, setPanelSize] = useState("balanced");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const handleGradeChange = (event, newGrade) => {
    if (newGrade !== null) {
      setGrade(newGrade);
      setSubject(null); // Reset subsequent selections
      setYear(null);
    }
  };

  const handleSubjectChange = (event, newSubject) => {
    if (newSubject !== null) {
      setSubject(newSubject);
      setYear(null); // Reset year selection
    }
  };

  const handleYearSelect = (selectedYear) => {
    setYear(selectedYear);
    setLoadingPdf(true); // Indicate loading start
    setLoadingForm(true);
  };

  const handlePanelSizeChange = (event, newSize) => {
    if (newSize !== null) {
      setPanelSize(newSize);
    }
  };

  // Reset loading state when iframe finishes loading
  const handleIframeLoad = (type) => {
    if (type === 'pdf') setLoadingPdf(false);
    if (type === 'form') setLoadingForm(false);
  };

  // Get document paths based on selections
  const docDetails = grade && subject && year ? docConfig[grade]?.[subject]?.[year] : null;
  const pdfSrc = docDetails?.pdf || "";
  const googleFormURL = docDetails?.googleForm || "";

  // Define panel widths based on state
  const leftWidth = panelSize === "left" ? 12 : panelSize === "right" ? 4 : 6;
  const rightWidth = panelSize === "right" ? 8 : panelSize === "left" ? 4 : 6;

  return (
    <>
      <CssBaseline />
      {/* Minimalist AppBar for Title */}
      <AppBar position="static" color="primary" elevation={1} sx={{ mb: 3 }}>
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Préparation OQRE
          </Typography>
        </Toolbar>
      </AppBar>


      <Container
        maxWidth="xl"
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg,rgb(251, 253, 252) 0%,rgb(235, 238, 238) 100%)',
          borderRadius: 2,
          padding: 2
        }}
      >


        {/* --- Selection Controls Section --- */}
        <ControlSection elevation={2}>
          <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
            {/* Grade Selection */}
            <Box>
              <Typography variant="subtitle1" gutterBottom align="center" color="primary">
                1. Choisissez l'année scolaire
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup value={grade} exclusive onChange={handleGradeChange} color="primary">
                  {config.grades.map((gr) => (
                    <ToggleButton key={gr} value={gr} sx={{ px: 3 }}> {/* More padding */}
                      {gr.replace('e', 'ème')} Année
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Box>

            {/* Subject Selection */}
            <Box sx={{ opacity: grade ? 1 : 0.5, transition: 'opacity 0.3s ease' }}> {/* Fade effect */}
              <Typography variant="subtitle1" gutterBottom align="center" color={grade ? "primary" : "text.disabled"}>
                2. Choisissez la matière
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup value={subject} exclusive onChange={handleSubjectChange} disabled={!grade} color="secondary">
                  {config.subjects.map((subj) => (
                    <ToggleButton key={subj} value={subj} sx={{ px: 3 }}>
                      {subj}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Box>

            {/* Year/Document Selection */}
            <Box sx={{ opacity: subject ? 1 : 0.5, transition: 'opacity 0.3s ease' }}>
              <Typography variant="subtitle1" gutterBottom align="center" color={subject ? "primary" : "text.disabled"}>
                3. Choisissez l'année du document
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
                {config.yearOptions.map((yr) => (
                  <Chip
                    key={yr}
                    label={yr}
                    clickable
                    disabled={!subject}
                    onClick={() => handleYearSelect(yr)}
                    color={year === yr ? "primary" : "default"}
                    variant={year === yr ? "filled" : "outlined"}
                    sx={{ fontSize: '0.9rem', padding: '4px 8px' }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </ControlSection>

        {/* --- Panel Resize Controls --- */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={panelSize}
            exclusive
            onChange={handlePanelSizeChange}
            aria-label="text alignment"
            size="small"
          >
            <ToggleButton value="left" aria-label="left aligned">
              <Tooltip title="Agrandir Document">
                <FormatAlignLeft />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="balanced" aria-label="centered">
              <Tooltip title="Vue Équilibrée">
                <FormatAlignCenter />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned">
              <Tooltip title="Agrandir Formulaire">
                <FormatAlignRight />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* --- Content Panels --- */}
        <Grid container spacing={3}> {/* Increased spacing */}
          {/* Left Panel (PDF) */}
          <Grid item xs={12} md={leftWidth} sx={{ transition: 'width 0.3s ease-in-out' }}>
            <PanelPaper elevation={3}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <MenuBook color="action" />
                <Typography variant="h6">Document</Typography>
                {loadingPdf && <CircularProgress size={20} sx={{ ml: 1 }} />}
              </Stack>
              <Divider sx={{ mb: 1 }} />
              {pdfSrc ? (
                <IFrame
                  src={pdfSrc}
                  title="Document PDF"
                  onLoad={() => handleIframeLoad('pdf')}
                  onError={() => handleIframeLoad('pdf')} // Also reset on error
                />
              ) : (
                <PlaceholderBox>
                  <InfoOutlined sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1">
                    Veuillez compléter les sélections ci-dessus pour afficher le document PDF.
                  </Typography>
                </PlaceholderBox>
              )}
            </PanelPaper>
          </Grid>

          {/* Right Panel (Google Form) */}
          <Grid item xs={12} md={rightWidth} sx={{ transition: 'width 0.3s ease-in-out' }}>
            <PanelPaper elevation={3}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Assignment color="action" />
                <Typography variant="h6">Formulaire de réponse</Typography>
                {loadingForm && <CircularProgress size={20} sx={{ ml: 1 }} />}
              </Stack>
              <Divider sx={{ mb: 1 }} />
              {googleFormURL ? (
                <IFrame
                  src={googleFormURL + "?embedded=true"} // Keep embedded=true
                  title="Google Form"
                  onLoad={() => handleIframeLoad('form')}
                  onError={() => handleIframeLoad('form')}
                />
              ) : (
                <PlaceholderBox>
                  <InfoOutlined sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1">
                    Veuillez compléter les sélections ci-dessus pour afficher le formulaire Google.
                  </Typography>
                </PlaceholderBox>
              )}
            </PanelPaper>
          </Grid>
        </Grid>
        <Texediteur/>

      </Container>
    </>
  );
};

export default PreparationOQRE;