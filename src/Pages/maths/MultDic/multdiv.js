import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Composant pour le bouton personnalisé
function CustomButton({ onClick, label, color = "primary", variant = "contained" }) {
  return (
    <Button onClick={onClick} color={color} variant={variant} style={{ margin: "0 10px" }}>
      {label}
    </Button>
  );
}

// Composant Principal
const MultipDiv = () => {
  const [visibleComponent, setVisibleComponent] = useState(null);
  //const [jsonData, setJsonData] = useState(null);
  const [data, setData] = useState(null); // Données des exercices
  const [answers, setAnswers] = useState({}); // Réponses utilisateur
  const [scores, setScores] = useState([]); // Scores par exercice
  const [totalScore, setTotalScore] = useState(0); // Score total

  // Fonction pour charger le JSON dynamiquement
  const loadJson = async (jsonFileName) => {
    try {
      const json = await import(`./${jsonFileName}`);
      //setJsonData(json);
      setData(json.default || json); // Certains fichiers JSON exportent par défaut
    } catch (error) {
      console.error("Erreur lors du chargement du JSON :", error);
    }
  };

  // Gérer les réponses utilisateur
  const handleAnswerChange = (exerciseIndex, questionIndex, value) => {
    setAnswers({
      ...answers,
      [`${exerciseIndex}-${questionIndex}`]: value,
    });
  };

  // Valider les réponses d'un exercice
  const validateExercise = (exerciseIndex) => {
    if (!data || !data.exercises) return; // Vérification de la structure
    const exercise = data.exercises[exerciseIndex];
    let correctCount = 0;

    exercise.questions.forEach((question, questionIndex) => {
      const userAnswer = answers[`${exerciseIndex}-${questionIndex}`];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    // Mise à jour des scores
    const newScores = [...scores];
    newScores[exerciseIndex] = correctCount;
    setScores(newScores);
    setTotalScore(newScores.reduce((sum, score) => (score !== null ? sum + score : sum), 0));
  };

  // Réinitialiser les réponses pour un exercice
  const resetExercise = (exerciseIndex) => {
    if (!data || !data.exercises) return; // Vérification de la structure

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

  // Réinitialiser tout lorsque le niveau change
  const resetAllData = () => {
    setAnswers({});
    setScores([]);
    setTotalScore(0);
  };

  // Gérer l'affichage des composants
  const handleButtonClick = (component, jsonFile) => {
    if (visibleComponent === component) {
      setVisibleComponent(null);
     // setJsonData(null);
      setData(null);
    } else {
      resetAllData(); // Réinitialiser les données avant de charger un nouveau niveau
      setVisibleComponent(component);
      loadJson(jsonFile);
    }
  };

  return (
    <div>
      <CustomButton
        onClick={() => handleButtonClick("Niveau3e", "math3.json")}
        label={visibleComponent === "Niveau3e" ? "Masquer Niveau 3e" : "Afficher Niveau 3e"}
        color="primary"
      />
      <CustomButton
        onClick={() => handleButtonClick("Niveau4e", "math4.json")}
        label={visibleComponent === "Niveau4e" ? "Masquer Niveau 4e" : "Afficher Niveau 4e"}
        color="secondary"
      />
      <CustomButton
        onClick={() => handleButtonClick("Niveau5e", "math5.json")}
        label={visibleComponent === "Niveau5e" ? "Masquer Niveau 5e" : "Afficher Niveau 5e"}
        color="success"
      />
      <CustomButton
        onClick={() => handleButtonClick("Niveau6e", "math6.json")}
        label={visibleComponent === "Niveau6e" ? "Masquer Niveau 6e" : "Afficher Niveau 6e"}
        color="warning"
      />

      {data && (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            {data.title}
          </Typography>

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
                        value={answers[`${exerciseIndex}-${questionIndex}`] || ""}
                        onChange={(e) => handleAnswerChange(exerciseIndex, questionIndex, e.target.value)}
                        type="text"
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
                      <TableCell>{scores[index] !== null ? scores[index] : "-"}</TableCell>
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
      )}
    </div>
  );
};

export default MultipDiv;
