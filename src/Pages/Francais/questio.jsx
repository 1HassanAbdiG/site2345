import React, { useState } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import data from "./questionss.json"; // Importation du JSON

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = data.questions;

  // Gestion des réponses
  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  // Calculer le score
  const calculateScore = () => {
    let newScore = 0;

    // Vérifier les réponses des questions à choix multiples
    questions.multipleChoice.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        newScore++;
      }
    });

    setScore(newScore);
    setShowResults(true);
  };

  // Rendu des questions à choix multiples
  const renderMultipleChoice = (question, index) => (
    <Box key={index} mb={3} component={Paper} p={2} elevation={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          <Typography variant="h6">{question.question}</Typography>
        </FormLabel>
        <RadioGroup
          value={answers[index] ?? ""}
          onChange={(e) => handleAnswer(index, parseInt(e.target.value, 10))}
        >
          {question.options.map((option, optionIndex) => (
            <FormControlLabel
              key={optionIndex}
              value={optionIndex}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );

  // Rendu des questions ouvertes
  const renderOpenEnded = (question, index) => (
    <Box key={index} mb={3} component={Paper} p={2} elevation={3}>
      <Typography variant="h6">{question.question}</Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        value={answers[index] || ""}
        onChange={(e) => handleAnswer(index, e.target.value)}
        placeholder="Votre réponse"
      />
    </Box>
  );

  // Rendu des résultats
  const renderResults = () => (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Résultats
      </Typography>
      <Typography variant="h5" color="primary">
        Votre score : {score} / {questions.multipleChoice.length}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Récapitulatif des réponses
      </Typography>
      {questions.multipleChoice.map((question, index) => (
        <Box key={index} mb={2}>
          <Typography variant="subtitle1">
            <strong>Question :</strong> {question.question}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Votre réponse :</strong>{" "}
            {question.options[answers[index]] || "Non répondu"}
          </Typography>
          <Typography variant="subtitle2" color="success.main">
            <strong>Bonne réponse :</strong> {question.options[question.correctAnswer]}
          </Typography>
          <Divider />
        </Box>
      ))}
      {questions.openEnded.map((question, index) => (
        <Box key={index + questions.multipleChoice.length} mb={2}>
          <Typography variant="subtitle1">
            <strong>Question :</strong> {question.question}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Votre réponse :</strong> {answers[index + questions.multipleChoice.length] || "Non répondu"}
          </Typography>
          <Divider />
        </Box>
      ))}
      <Button variant="contained" color="secondary" onClick={() => window.location.reload()}>
        Recommencer
      </Button>
    </Box>
  );

  return (
    <Box p={4}>
      {!showResults ? (
        <>
          {/* Titre et texte principal */}
          <Typography variant="h4" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {data.text}
          </Typography>

          {/* Questions à choix multiples */}
          <Typography variant="h5" gutterBottom>
            Questions à choix multiples
          </Typography>
          {questions.multipleChoice.map((q, i) => renderMultipleChoice(q, i))}

          {/* Questions ouvertes */}
          <Typography variant="h5" gutterBottom>
            Questions ouvertes
          </Typography>
          {questions.openEnded.map((q, i) =>
            renderOpenEnded(q, i + questions.multipleChoice.length)
          )}

          {/* Bouton de soumission */}
          <Button
            variant="contained"
            color="primary"
            onClick={calculateScore}
            sx={{ mt: 4 }}
          >
            Soumettre
          </Button>
        </>
      ) : (
        renderResults()
      )}
    </Box>
  );
};

export default Questionnaire;
