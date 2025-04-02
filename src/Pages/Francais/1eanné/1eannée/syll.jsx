import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';

const syllables = [
  { fr: 'pra' },
  { fr: 'pro' },
  { fr: 'pré' },
  { fr: 'pri', phoneme: '/priii/' }, // Phonème corrigé pour "pri"
  { fr: 'pru' ,phoneme: '/pru/' } ,
  { fr: 'pla' },
  { fr: 'pli', phoneme: '/pli/' },
  { fr: 'ple' },
  { fr: 'plo' },
  { fr: 'plé' },
];

function Syllab() {
  const speakSentence = (syllable) => {
    let textToSpeak = syllable.fr;

    // Use phoneme if available
    if (syllable.phoneme) {
      textToSpeak = syllable.phoneme;
    }

    // Create a SpeechSynthesisUtterance object with the correct text
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR'; // Set language to French

    // Adjusting for the voice selection (if available)
    utterance.voice = window.speechSynthesis.getVoices().find((voice) => voice.name === 'Thomas') || null;

    // Debugging: Log which voice is being used
    if (utterance.voice) {
      console.log("Utilisation de la voix:", utterance.voice.name);
    } else {
      console.log("La voix 'Thomas' n'est pas disponible. Utilisation de la voix par défaut.");
    }

    // Start speaking the text
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h3" gutterBottom color="secondary">
        Apprenez les Syllabes
      </Typography>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        {syllables.map((syllable, index) => (
          <Grid item key={index}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => speakSentence(syllable)}
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
              {syllable.fr}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Syllab;
