import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, LinearProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 10) + 1; // Nombres de 1 à 10
  const num2 = Math.floor(Math.random() * 10) + 1; // Nombres de 1 à 10
  return { num1, num2, answer: num1 * num2 };
};

function Multip() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // Temps imparti en secondes

  useEffect(() => {
    const initialQuestions = Array.from({ length: 20 }, generateQuestion);
    setQuestions(initialQuestions);

    // Démarrage du compte à rebours
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowDialog(true);
          setResults(initialQuestions.map((q) => ({ question: `${q.num1} x ${q.num2}`, correct: false })));
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Nettoyage à l'unmount
  }, []);

  const handleAnswer = () => {
    const isCorrect = parseInt(userAnswer) === questions[currentIndex].answer;
    
    const result = { question: `${questions[currentIndex].num1} x ${questions[currentIndex].num2}`, correct: isCorrect };
    
    if (isCorrect) {
      setScore(score + 1);
      // Afficher une notification ou faire autre chose pour le premier bon résultat, si nécessaire.
      if (currentIndex === 0) {
        alert("Bravo ! Vous avez donné la bonne réponse à la première question !");
      }
    } else {
      result.userAnswer = userAnswer;
    }

    setResults(prevResults => {
      const updatedResults = [...prevResults];
      updatedResults[currentIndex] = result;
      return updatedResults;
    });
    
    setUserAnswer('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowDialog(true);
    }
  };

  const resetGame = () => {
    setQuestions(Array.from({ length: 20 }, generateQuestion));
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setResults([]);
    setTimeLeft(60); // Remettre à 60 secondes
    setShowDialog(false);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Jeu de Multiplication
      </Typography>
      <Typography variant="h6">
        Question {currentIndex + 1} sur 20
      </Typography>
      {questions.length > 0 && (
        <Typography variant="h5">
          {questions[currentIndex].num1} x {questions[currentIndex].num2} = ?
        </Typography>
      )}
      <TextField
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        label="Votre réponse"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAnswer}
        fullWidth
      >
        Vérifier
      </Button>
      <Box sx={{ marginTop: 2 }}>
        <LinearProgress variant="determinate" value={(score / 20) * 100} />
      </Box>
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        Score: {score}
      </Typography>
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        Temps restant: {timeLeft} secondes
      </Typography>

      <Dialog open={showDialog} onClose={resetGame}>
        <DialogTitle>Fin du jeu !</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Votre score final est {score} / 20</Typography>
          <Typography variant="h6">Détails des réponses :</Typography>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                {result.question} - {result.correct ? 'Correct' : `Incorrect (Votre réponse : ${result.userAnswer})`}
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetGame} color="primary">Rejouer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Multip;