// src/App.js
import React, { useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';

const syllables = [
  { fr: 'ba', en: 'ba' },
  { fr: 'be', en: 'be' },
  { fr: 'bi', en: 'bi' },
  { fr: 'bo', en: 'bo' },
  { fr: 'bu', en: 'bu' },
];

function  Syllab() {
  const [language, setLanguage] = useState('fr'); // Langue par défaut : français

  // Fonction pour lire une syllabe avec la synthèse vocale
  const speakSentence = (syllable) => {
    const utterance = new SpeechSynthesisUtterance(language === 'fr' ? syllable.fr : syllable.en);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    window.speechSynthesis.speak(utterance); // Démarrer la synthèse vocale
  };

  return (
    <Container style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h3" gutterBottom color="secondary">
        🎵 Apprenez les Syllabes 🎵
      </Typography>

      {/* Choix de langue */}
      <Typography variant="h6" gutterBottom>
        Choisissez la langue :
      </Typography>
      <Button
        onClick={() => setLanguage('fr')}
        variant={language === 'fr' ? 'contained' : 'outlined'}
        style={{ marginRight: '10px' }}
      >
        Français
      </Button>
      <Button
        onClick={() => setLanguage('en')}
        variant={language === 'en' ? 'contained' : 'outlined'}
      >
        Anglais
      </Button>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        {syllables.map((syllable, index) => (
          <Grid item key={index}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => speakSentence(syllable)} // Appeler la fonction de lecture de syllabe
              style={{
                fontSize: '24px',
                padding: '20px',
                backgroundColor: '#FF5722',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
              startIcon={<VolumeUp />}
            >
              {syllable.fr} {/* Affiche la syllabe en français */}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Syllab;