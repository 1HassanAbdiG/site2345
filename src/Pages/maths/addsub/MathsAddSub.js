import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Math3e = () => {
  const [data, setData] = useState(null); // Données des exercices
  const [answers, setAnswers] = useState({}); // Réponses utilisateur
  const [scores, setScores] = useState([]); // Scores pour chaque exercice
  const [totalScore, setTotalScore] = useState(0); // Score total

  // Charger les données du fichier JSON
  useEffect(() => {
    fetch('/math3.json') // Remplacez par le chemin réel de votre JSON
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setScores(Array(data.exercises.length).fill(null)); // Initialiser les scores pour chaque exercice
      })
      .catch((error) => console.error('Erreur de chargement du JSON:', error));
  }, []);
 
  // Gérer la modification des réponses
  const handleAnswerChange = (exerciseIndex, questionIndex, value) => {
    setAnswers({
      ...answers,
      [`${exerciseIndex}-${questionIndex}`]: value,
    });
  };
  

     // Vérification des réponses pour un exercice
     const validateExercise = (exerciseIndex) => {
        const exercise = data.exercises[exerciseIndex];
        let correctCount = 0;
    
        exercise.questions.forEach((question, questionIndex) => {
          const userAnswer = answers[`${exerciseIndex}-${questionIndex}`];
          if (userAnswer === question.correctAnswer) {
            correctCount++;
          }
        });


    // Mettre à jour les scores et le score total
    const newScores = [...scores];
    newScores[exerciseIndex] = correctCount;
    setScores(newScores);
    setTotalScore(newScores.reduce((sum, score) => (score !== null ? sum + score : sum), 0));
  };
 

  // Réinitialisation des réponses pour un exercice
  const resetExercise = (exerciseIndex) => {
    const updatedAnswers = { ...answers };
    data.exercises[exerciseIndex].questions.forEach((_, questionIndex) => {
      delete updatedAnswers[`${exerciseIndex}-${questionIndex}`];
    });
    setAnswers(updatedAnswers);

    const newScores = [...scores];
    newScores[exerciseIndex] = null;
    setScores(newScores);
    setTotalScore(newScores.reduce((sum, score) => (score !== null ? sum + score : sum), 0));
  };

  if (!data) {
    return <Typography>Chargement des exercices...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {data.title}
      </Typography>

      {/* Affichage des exercices */}
      {data.exercises.map((exercise, exerciseIndex) => (
        <Accordion key={exerciseIndex}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{exercise.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {exercise.questions.map((question, questionIndex) => (
                <Box key={questionIndex} mb={2}>
                  <Typography>{question.question}</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={answers[`${exerciseIndex}-${questionIndex}`] || ''}
                    onChange={(e) => handleAnswerChange(exerciseIndex, questionIndex, e.target.value)}
                    type="number"
                  />
                </Box>
              ))}
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => validateExercise(exerciseIndex)}
                  sx={{ mr: 2 }}
                >
                  Valider
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => resetExercise(exerciseIndex)}
                >
                  Réinitialiser
                </Button>
              </Box>
              {scores[exerciseIndex] !== null && (
                <Typography mt={2}>
                  Résultat : {scores[exerciseIndex]} / {exercise.questions.length}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Tableau récapitulatif */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Tableau récapitulatif
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exercice</TableCell>
                <TableCell>Questions totales</TableCell>
                <TableCell>Réponses correctes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.exercises.map((exercise, index) => (
                <TableRow key={index}>
                  <TableCell>{exercise.title}</TableCell>
                  <TableCell>{exercise.questions.length}</TableCell>
                  <TableCell>{scores[index] !== null ? scores[index] : '-'}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography fontWeight="bold">Score total</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">{totalScore}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Math3e;
