import React, { useState } from "react";
import { Box, Typography, Grid, Button, Card, Select, MenuItem } from "@mui/material";
import data from "./questions.json";

const PronounExercise = () => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleChange = (verbId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [verbId]: value,
    }));
  };

  const handleCheck = () => {
    let correctAnswers = 0;
    data.questions.forEach((question) => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(`Votre score : ${correctAnswers} / ${data.questions.length}`);
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        {data.instructions}
      </Typography>

      <Grid container spacing={2}>
        {data.questions.map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
            <Select
                value={answers[question.id] || ""}
                onChange={(e) => handleChange(question.id, e.target.value)}
                displayEmpty
                
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
              >
                <MenuItem value="" disabled>
                  ---
                </MenuItem>
                {question.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
           
                {question.verb}
              
             
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={handleCheck}
        >
          Vérifier mes réponses
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Réinitialiser
        </Button>
      </Box>

      {score && (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          {score}
        </Typography>
      )}
    </Box>
  );
};

export default PronounExercise;
