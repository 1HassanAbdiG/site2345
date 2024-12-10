
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import exercisesData from "./exercices.json";



const DecimauxExercice = () => {
   
      const [userAnswers, setUserAnswers] = useState({});
      const [scores, setScores] = useState({});
      const [totalScore, setTotalScore] = useState(null);
    
      const handleChange = (id, value) => {
        setUserAnswers({ ...userAnswers, [id]: value });
      };
    
      const handleValidation = (exerciseId) => {
        const exercise = exercisesData.exercices.find((ex) => ex.id === exerciseId);
        let correctAnswers = 0;
    
        exercise.questions.forEach((question) => {
          if (parseFloat(userAnswers[question.id]) === question.answer) {
            correctAnswers += 1;
          }
        });
    
        setScores({ ...scores, [exerciseId]: correctAnswers });
      };
    
      const handleTotalScore = () => {
        let total = Object.values(scores).reduce((sum, value) => sum + value, 0);
        setTotalScore(total);
      };
    
      const handleReset = () => {
        setUserAnswers({});
        setScores({});
        setTotalScore(null);
      };
    
      return (
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Exercices Mathématiques
          </Typography>
          {exercisesData.exercices.map((exercise) => (
            <Accordion key={exercise.id} sx={{ marginBottom: 2 }}  style={{color:"black"}}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{exercise.titre}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{exercise.instructions}</Typography>
                {exercise.questions.map((question) => (
                  <Box key={question.id} sx={{ marginTop: 2 }} style={{color:"red"}}>
                    <Typography>
                      {question.id}. {question.question}
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Votre réponse"
                      value={userAnswers[question.id] || ""}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginTop: 2 }}
                  onClick={() => handleValidation(exercise.id)}
                >
                  Valider cette partie
                </Button>
                {scores[exercise.id] !== undefined && (
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    Score pour cette partie : {scores[exercise.id]} /{" "}
                    {exercise.questions.length}
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
          <Divider sx={{ marginY: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleTotalScore}
            >
              Calculer le score total
            </Button>
            <Button variant="contained" color="error" onClick={handleReset}>
              Réinitialiser
            </Button>
          </Box>
          {totalScore !== null && (
            <Typography variant="h5" sx={{ marginTop: 3 }}>
              Score total : {totalScore} /{" "}
              {exercisesData.exercices.reduce(
                (sum, ex) => sum + ex.questions.length,
                0
              )}
            </Typography>
          )}
        </Container>
      );
    };
    
   

export default DecimauxExercice;


