import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box, Select, MenuItem, FormControl, InputLabel, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter } from '@mui/material';
import { styled } from '@mui/system';

import sentencesData from '../jsonverbe/S1.json'; // Assurez-vous que le chemin est correct
import verbs from '../jsonverbe/V1.json'; // Assurez-vous que le chemin est correct

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '30px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '90%',
  marginTop: '20px',
}));

const SentenceDisplay = styled(Typography)({
  fontSize: '28px',
  marginBottom: '25px',
  color: '#333',
  fontWeight: 600,
});

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

const CombinedGame = () => {
  const [currentSentence, setCurrentSentence] = useState(null);
  const [currentVerb, setCurrentVerb] = useState({});
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [responseCount, setResponseCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameMode, setGameMode] = useState('sujet'); // 'sujet' ou 'verbe'
  const [message, setMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState({ color: '#000' });
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (gameMode === 'sujet') {
      selectRandomSentence();
    } else {
      selectRandomVerb();
    }
  }, [gameMode]);

  const selectRandomSentence = () => {
    if (gameEnded) return;

    const sentence = sentencesData[Math.floor(Math.random() * sentencesData.length)];
    setCurrentSentence(sentence);

    const correctSubject = sentence.reponse;
    let words = sentence.text.split(/\s+/).filter(word =>
      word.length > 1 && word.toLowerCase() !== correctSubject.toLowerCase()
    );

    if (words.length === 0) {
      words = ["Pas d'options disponibles"];
    }

    let optionsList = [correctSubject];

    while (optionsList.length < 9 && words.length > 0) {
      const randomWord = words.splice(Math.floor(Math.random() * words.length), 1)[0].replace(/[.,!?]/g, '');
      if (!optionsList.includes(randomWord)) {
        optionsList.push(randomWord);
      }
    }

    optionsList.sort(() => Math.random() - 0.5);

    setOptions(optionsList);
    setSelectedSubject('');
  };

  const selectRandomVerb = () => {
    if (gameEnded) return;

    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    setCurrentVerb(verb);
  };

  const checkAnswer = (isVerb) => {
    const correctAnswer = isVerb ? currentVerb.reponse.toLowerCase() : currentSentence.reponse.toLowerCase();
    const userAnswer = isVerb ? userInput.toLowerCase().trim() : selectedSubject.toLowerCase();

    if (userAnswer === correctAnswer) {
      setMessage(isVerb ? "Bravo ! Vous êtes un as de la conjugaison !" : `Bravo ! Le sujet est bien "${currentSentence.reponse}".`);
      setMessageStyle({ color: "#4CAF50" });
      setScore(prevScore => prevScore + 1);
    } else {
      setMessage(isVerb ? `Oups ! La bonne réponse était "${currentVerb.reponse}". Essayez encore !` : `Dommage ! Le sujet correct était : "${currentSentence.reponse}".`);
      setMessageStyle({ color: "#FF5722" });
    }

    const newResponseCount = responseCount + 1;
    setResponseCount(newResponseCount);

    if (newResponseCount >= 10) {
      setGameEnded(true);
    } else {
      setTimeout(() => {
        isVerb ? selectRandomVerb() : selectRandomSentence();
        setUserInput('');
      }, isVerb ? 100 : 200);
    }
  };

  const resetGame = () => {
    setScore(0);
    setResponseCount(0);
    setMessage('');
    setMessageStyle({ color: '#000' });
    setGameEnded(false);
    gameMode === 'sujet' ? selectRandomSentence() : selectRandomVerb();
    setUserInput('');
    setSelectedSubject('');
  };

  return (
    <StyledContainer>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {gameMode === 'sujet'
            ? 'Défis du Français : Trouve le Sujet!'
            : 'Mission : Trouve le Verbe!'}
        </Typography>

        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setGameMode('sujet')}
            sx={{ marginRight: 2 }}
          >
            Jeu du Sujet
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => setGameMode('verbe')}
          >
            Jeu des Verbes
          </Button>
        </Box>

        {gameMode === 'sujet' ? (
          <>
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
                  <MenuItem value=""><em>Aucun</em></MenuItem>
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
                onClick={() => checkAnswer(false)}
                sx={{ marginRight: 2 }}
                disabled={!selectedSubject || gameEnded}
              >
                Vérifier
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={resetGame}
                disabled={gameEnded}
              >
                Réinitialiser
              </Button>
            </Box>
          </>
        ) : (
          <>
            <VerbDisplay>
              {currentVerb.text}
            </VerbDisplay>
            <TextField
              fullWidth
              label="Entrez la réponse"
              variant="outlined"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => checkAnswer(true)}
                disabled={!userInput || gameEnded}
              >
                Vérifier
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={resetGame}
                disabled={gameEnded}
              >
                Réinitialiser
              </Button>
            </Box>
          </>
        )}

        {message && (
          <Typography variant="h6" sx={{ color: messageStyle.color, mt: 2 }}>
            {message}
          </Typography>
        )}

        {gameEnded && (
          <Box mt={3}>
            <Score>
              Votre score final est : {score} / {responseCount}
            </Score>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={resetGame}
              sx={{ marginTop: 2 }}
            >
              Rejouer
            </Button>
          </Box>
        )}
        {gameEnded && (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Résumé des Scores
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Jeu</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Jeu du Sujet</TableCell>
                    <TableCell>{gameMode === 'sujet' ? score : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jeu des Verbes</TableCell>
                    <TableCell>{gameMode === 'verbe' ? score : '-'}</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell><strong>{score}/10</strong></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </StyledContainer>
  );
};

export default CombinedGame;
