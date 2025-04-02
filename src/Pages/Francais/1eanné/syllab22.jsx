import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { VolumeUp, CheckCircle, Close } from '@mui/icons-material';
import './ApprentissageSyllabes.css'; // Créez un fichier CSS pour le style

const syllabes = [
  { mot: 'chat', syllabes: ['cha', 't'] },
  { mot: 'table', syllabes: ['ta', 'ble'] },
  { mot: 'soleil', syllabes: ['so', 'leil'] },
  // Ajoutez d'autres mots et syllabes ici
];

function ApprentissageSyllabes() {
  const [motActuel, setMotActuel] = useState(syllabes[0]);
  const [syllabesEntrees, setSyllabesEntrees] = useState(['', '']);
  const [resultat, setResultat] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const verifierSyllabes = () => {
    const correctes = syllabesEntrees.every(
      (syllabe, index) => syllabe.toLowerCase() === motActuel.syllabes[index]
    );
    setResultat(correctes);
    setOpenDialog(true);
  };

  const motSuivant = () => {
    const indexActuel = syllabes.indexOf(motActuel);
    const indexSuivant = (indexActuel + 1) % syllabes.length;
    setMotActuel(syllabes[indexSuivant]);
    setSyllabesEntrees(['', '']);
    setResultat(null);
  };

  const lireMot = () => {
    const utterance = new SpeechSynthesisUtterance(motActuel.mot);
    speechSynthesis.speak(utterance);
  };

  return (
    <Container maxWidth="md" className="apprentissage-syllabes">
      <Typography variant="h4" component="h1" gutterBottom>
        Apprends les syllabes !
      </Typography>
      <Paper elevation={3} className="mot-actuel">
        <Typography variant="h5" component="h2">
          {motActuel.mot}
        </Typography>
        <IconButton onClick={lireMot}>
          <VolumeUp />
        </IconButton>
      </Paper>
      <Grid container spacing={2}>
        {motActuel.syllabes.map((_, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={`Syllabe ${index + 1}`}
              variant="outlined"
              value={syllabesEntrees[index]}
              onChange={(e) => {
                const nouvellesSyllabes = [...syllabesEntrees];
                nouvellesSyllabes[index] = e.target.value;
                setSyllabesEntrees(nouvellesSyllabes);
              }}
            />
          </Grid>
        ))}
      </Grid>
      <div className="boutons">
        <Button variant="contained" color="primary" onClick={verifierSyllabes}>
          Vérifier
        </Button>
        <Button variant="contained" color="secondary" onClick={motSuivant}>
          Mot suivant
        </Button>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{resultat ? 'Bravo !' : 'Essaie encore !'}</DialogTitle>
        <DialogContent>
          <Typography>
            {resultat
              ? 'Tu as trouvé les bonnes syllabes !'
              : 'Ce n\'est pas tout à fait ça...'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ApprentissageSyllabes;