import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles'; // Pour styliser les composants

// Liste de mots à apprendre
const words = [
  { word: 'Bisad :Xayawaan guriga lagu haysto oo miyaaqa', definition: 'Xayawaan guriga lagu haysto oo miyaaqa.' },
  { word: 'Eey:Xayawaan guriga lagu haysto oo dhawaaqa', definition: 'Xayawaan guriga lagu haysto oo dhawaaqa.' },
  { word: 'Sarah, miyaad dhammaysay raadinta filimka? Axmed wuxuu yiri ma rabo inuu aado, shaqo ayuu guriga u joogi doonaa, saw sax maaha?.', definition: 'Midho casaan, cagaar ama huruud ah.' },
  { word: 'Sarah, miyaad dhammaysay raadinta filimka? Axmed wuxuu yiri ma rabo inuu aado, inuu guriga joogi doono si uu u shaqeeyo, sax?', definition: 'Dareere muhiim u ah nolosha.' }
];


const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

function App2() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Optionnel : définir une voix par défaut (première de la liste)
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    fetchVoices();

    // Re-fetch voices when they change
    window.speechSynthesis.onvoiceschanged = fetchVoices;

    // Lecture du mot à chaque changement d'index
    const utterance = new SpeechSynthesisUtterance(words[currentIndex].word);
    utterance.voice = selectedVoice; // Utiliser la voix sélectionnée
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  }, [currentIndex, selectedVoice]);

  const handleNext = () => {
    setShowDefinition(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  const handleVoiceChange = (event) => {
    const selected = voices.find(voice => voice.name === event.target.value);
    setSelectedVoice(selected);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Apprenons à lire !
      </Typography>
      <AnimatedCard>
        <CardContent>
          <Typography variant="h5" align="center">
            {words[currentIndex].word}
          </Typography>
          {showDefinition && <Typography variant="body1" align="center">{words[currentIndex].definition}</Typography>}
        </CardContent>
      </AnimatedCard>
      <FormControl variant="outlined" fullWidth style={{ margin: '10px 0' }}>
        <InputLabel id="voice-select-label">Choisissez la voix</InputLabel>
        <Select
          labelId="voice-select-label"
          value={selectedVoice ? selectedVoice.name : ''}
          onChange={handleVoiceChange}
          label="Choisissez la voix"
        >
          {voices.map((voice, index) => (
            <MenuItem key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={toggleDefinition} style={{ margin: '10px', width: '100%' }}>
        {showDefinition ? 'Cacher la définition' : 'Voir la définition'}
      </Button>
      <Button variant="outlined" onClick={handleNext} style={{ margin: '10px', width: '100%' }}>
        Suivant
      </Button>
    </Container>
  );
}

export default App2;