import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box, TextField } from '@mui/material';
import { styled } from '@mui/system';
import verbs from '../jsonverbe/V1.json';

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '30px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '90%',
}));

const VerbDisplay = styled(Typography)({
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

const GameContainer1 = () => {
  const [currentVerb, setCurrentVerb] = useState({});
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    selectRandomVerb();
  }, []);

  const selectRandomVerb = () => {
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    setCurrentVerb(verb);
  };

  const checkAnswer = () => {
    if (userInput === currentVerb.infinitive.toLowerCase().trim()) {
      setMessage("Bravo ! Vous êtes un as de la conjugaison !");
      setScore(score + 1);
      // Confetti logic can be added here if desired
    } else {
      setMessage(`Oups ! La bonne réponse était "${currentVerb.infinitive}". Essayez encore !`);
    }
    setTimeout(selectRandomVerb, 1500);
    setUserInput('');
  };

  const resetGame = () => {
    setScore(0);
    setMessage('');
    selectRandomVerb();
    setUserInput('');
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Conjugo-Défi: Maître des Verbes
      </Typography>
      <VerbDisplay>{currentVerb.conjugated}</VerbDisplay>
      <StyledBox component="form" onSubmit={(e) => {
        e.preventDefault();
        checkAnswer();
      }}>
        <TextField
          label="Infinitif du verbe"
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Entrez le verbe ici"
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginRight: 2 }}
          >
            Vérifier
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            size="large"
            onClick={resetGame}
          >
            Réinitialiser
          </Button>
        </Box>
      </StyledBox>
      <Score>Score: {score}</Score>
      <Typography>{message}</Typography>
    </StyledContainer>
  );
};

export default GameContainer1;
