import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import sentencesData from '../jsonverbe/S1.json'; // Assurez-vous du bon chemin d'accès

// Définir les styles en utilisant styled
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '30px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '90%',
  marginTop: '20px', // Ajouter un peu d'espace en haut
}));

const SentenceDisplay = styled(Typography)({
  fontSize: '28px',
  marginBottom: '25px',
  color: '#333',
  fontWeight: 600,
});

const Score = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: '20px',
  color: '#FF758C',
});

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Sujet = () => {
  const [currentSentence, setCurrentSentence] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    selectRandomSentence();
  }, []);

  const selectRandomSentence = () => {
    const sentence = sentencesData[Math.floor(Math.random() * sentencesData.length)];
    setCurrentSentence(sentence);

    const correctSubject = sentence.subject;
    const words = sentence.text.split(/\s+/).filter(word => word.length > 1 && word.toLowerCase() !== correctSubject.toLowerCase());

    let optionsList = [correctSubject]; // Toujours inclure le sujet correct

    // Ajout de mots aléatoires parmi les options incorrectes
    while (optionsList.length < 9 && words.length > 0) {
      const randomWord = words.splice(Math.floor(Math.random() * words.length), 1)[0].replace(/[.,!?]/g, '');
      if (!optionsList.includes(randomWord)) {
        optionsList.push(randomWord);
      }
    }

    // Mélanger les options pour que le sujet correct ne soit pas toujours en première position
    for (let i = optionsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsList[i], optionsList[j]] = [optionsList[j], optionsList[i]];
    }

    setOptions(optionsList);
    setSelectedSubject('');
  };

  const checkAnswer = () => {
    const messageElement = document.getElementById('message');

    if (selectedSubject.toLowerCase() === currentSentence.subject.toLowerCase()) {
      messageElement.textContent = `Bravo ! Le sujet est bien "${currentSentence.subject}".`;
      messageElement.style.color = "#4CAF50";
      setScore(prevScore => prevScore + 1);
    } else {
      messageElement.textContent = `Dommage ! Le sujet correct était : "${currentSentence.subject}".`;
      messageElement.style.color = "#FF5722";
    }

    setTimeout(selectRandomSentence, 3000);
  };

  const resetGame = () => {
    setScore(0);
    document.getElementById('message').textContent = '';
    selectRandomSentence();
  };

  return (
    <StyledContainer>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Jeu du Sujet de la Phrase
        </Typography>
        <SentenceDisplay>
          {currentSentence && currentSentence.text}
        </SentenceDisplay>
        <StyledBox sx={{ my: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="user-input-label">Choisis le sujet</InputLabel>
            <Select
              labelId="user-input-label"
              id="user-input"
              value={selectedSubject}
              label="Choisis le sujet"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledBox>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={checkAnswer}
            sx={{ marginRight: 2 }}
          >
            Vérifier
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={resetGame}
          >
            Réinitialiser
          </Button>
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }} id="message"></Typography>
        <Score>Score: {score}</Score>
      </Paper>
    </StyledContainer>
  );
};

export default Sujet;
