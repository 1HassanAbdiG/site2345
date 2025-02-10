import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {  Button, Typography, Paper, Grid, Box,} from '@mui/material';

// Custom Theme
const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
    secondary: { main: '#e74c3c' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

// Instructions Component
const Instructions = ({ instructions }) => (
  <Paper sx={{ backgroundColor: '#f0f8ff', p: 2, mb: 2 }}>
    <Typography variant="h6">Consignes :</Typography>
    {instructions.map((instruction, index) => (
      <Typography key={index}>{instruction}</Typography>
    ))}
  </Paper>
);

// Place Value Box Component
const PlaceValueBox = ({ index, digit, placeValue, correction, onClick }) => (
  <Paper
    onClick={onClick}
    sx={{
      width: 100, height: 100, border: '3px solid #4a90e2', borderRadius: 1, backgroundColor: '#f0f8ff', position: 'relative', cursor: 'pointer', textAlign: 'center',
    }}
  >
    <Box sx={{ backgroundColor: '#4a90e2', color: 'white', p: 0.5, borderTopLeftRadius: 1, borderTopRightRadius: 1 }}>
      {placeValue}
    </Box>
    <Box sx={{ flexGrow: 1, fontSize: '1.5em', fontWeight: 'bold', color: '#4a90e2', lineHeight: '60px' }}>
      {digit}
    </Box>
    {correction && (
      <Box sx={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', fontSize: '0.8em', color: '#e74c3c' }}>
        Correction : {correction}
      </Box>
    )}
  </Paper>
);

// Digit Component
const Digit = ({ digit, onClick }) => (
  <Paper
    onClick={onClick}
    sx={{
      width: 60, height: 60, border: '3px solid #e74c3c', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontSize: '1.5em', fontWeight: 'bold', color: '#e74c3c', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff',
    }}
  >
    {digit}
  </Paper>
);

const languageData = {
  fr: {
    gameTitle: "Jeu de Valeur de Position",
    instructions: [
      "1. Observe le nombre affiché en haut.",
      "2. Clique sur un chiffre en bas, puis sur la case correspondante pour le placer.",
      "3. Place chaque chiffre dans la bonne case selon sa valeur de position.",
      "4. Si tu te trompes, tu peux cliquer sur une case pour récupérer le chiffre.",
      "5. Quand tu as fini, clique sur \"Vérifier la Réponse\".",
      "6. Pour un nouveau défi, clique sur \"Nouveau Nombre\"."
    ],
    checkAnswer: "Vérifier la Réponse",
    newNumber: "Nouveau Nombre",
    correctFeedback: "Bravo ! Tu as placé tous les chiffres correctement !",
    incorrectFeedback: "Pas tout à fait. Vérifie les cases en rouge.",
    correction: "Correction : ",
    placeValues: ['Unités', 'Dizaines', 'Centaines', 'Milliers', 'Dizaines de Milliers', 'Centaines de Milliers']
  },
  en: {
    gameTitle: "Place Value Game",
    instructions: [
      "1. Observe the number displayed above.",
      "2. Click on a digit below, then click on the corresponding box to place it.",
      "3. Place each digit in the correct box according to its place value.",
      "4. If you make a mistake, you can click on a box to retrieve the digit.",
      "5. When you are done, click \"Check Answer\".",
      "6. For a new challenge, click \"New Number\"."
    ],
    checkAnswer: "Check Answer",
    newNumber: "New Number",
    correctFeedback: "Well done! You placed all the digits correctly!",
    incorrectFeedback: "Not quite. Check the boxes in red.",
    correction: "Correction: ",
    placeValues: ['Units', 'Tens', 'Hundreds', 'Thousands', 'Ten Thousands', 'Hundred Thousands']
  }
};

export default function Placer_Val() {
  const [currentNumber, setCurrentNumber] = React.useState(0);
  const [selectedDigit, setSelectedDigit] = React.useState(null);
  const [placedDigits, setPlacedDigits] = React.useState({});
  const [feedback, setFeedback] = React.useState('');
  const [corrections, setCorrections] = React.useState({});
  const [availableDigits, setAvailableDigits] = React.useState([]);
  const [language, setLanguage] = React.useState('fr');

  React.useEffect(() => { generateNewNumber(); }, []);

  const generateNewNumber = () => {
    const number = Math.floor(Math.random() * 1000000);
    const shuffledDigits = number.toString().padStart(6, '0').split('').sort(() => Math.random() - 0.5).map((digit, index) => ({ digit: Number(digit), id: index }));
    
    setCurrentNumber(number);
    setAvailableDigits(shuffledDigits);
    setPlacedDigits({});
    setFeedback('');
    setCorrections({});
  };

  const checkAnswer = () => {
    const numberString = currentNumber.toString().padStart(6, '0');
    const newCorrections = {};
    let allCorrect = true;

    for (let i = 0; i < 6; i++) {
      if (placedDigits[i]?.digit !== parseInt(numberString[5 - i])) {
        allCorrect = false;
        newCorrections[i] = numberString[5 - i];
      }
    }

    setCorrections(newCorrections);
    setFeedback(allCorrect ? languageData[language].correctFeedback : languageData[language].incorrectFeedback);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: '#e6f3ff', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <Typography variant="h4">{languageData[language].gameTitle}</Typography>
          <Instructions instructions={languageData[language].instructions} />
          <Typography sx={{ fontSize: '2.5em', fontWeight: 'bold', color: '#2c3e50', mb: 2 }}>
            {currentNumber.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {languageData[language].placeValues.map((placeValue, index) => (
              <Grid item key={index}>
                <PlaceValueBox
                  index={index}
                  digit={placedDigits[index]?.digit}
                  placeValue={placeValue}
                  correction={corrections[index]}
                  onClick={() => {
                    if (selectedDigit !== null) {
                      setPlacedDigits(prev => ({ ...prev, [index]: selectedDigit }));
                      setAvailableDigits(prev => prev.filter(digitObj => digitObj.id !== selectedDigit.id));
                      setSelectedDigit(null);
                    } else if (placedDigits[index] !== undefined) {
                      setSelectedDigit(placedDigits[index]);
                      setPlacedDigits(prev => {
                        const newPlacedDigits = { ...prev };
                        delete newPlacedDigits[index];
                        return newPlacedDigits;
                      });
                      setAvailableDigits(prev => [...prev, placedDigits[index]]);
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            {availableDigits.map(({ digit, id }) => (
              <Grid item key={id}>
                <Digit digit={digit} onClick={() => setSelectedDigit({ digit, id })} />
              </Grid>
            ))}
          </Grid>

          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary" onClick={checkAnswer}>
              {languageData[language].checkAnswer}
            </Button>
            <Button variant="contained" color="secondary" onClick={generateNewNumber}>
              {languageData[language].newNumber}
            </Button>
          </Box>

          {feedback && (
            <Typography sx={{ textAlign: 'center', fontSize: '1.2em', mt: 2, fontWeight: 'bold' }} color={feedback === languageData[language].correctFeedback ? 'primary' : 'secondary'}>
              {feedback}
            </Typography>
          )}

          <Box mt={3} display="flex" justifyContent="center">
            <Button variant="outlined" color="primary" onClick={() => setLanguage('fr')}>Français</Button>
            <Button variant="outlined" color="primary" onClick={() => setLanguage('en')}>English</Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
