import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent
} from "@mui/material";
import exerciseData from "./EX2.json";

const VerbConjugationExercise = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetExercise = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "20px auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Conjugue au présent les verbes entre parenthèses
      </Typography>

      <Grid container spacing={2}>
        {exerciseData.exercises.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {item.sentence.split("...").map((part, index) => (
                    <span key={index}>
                      {index === 1 && (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={answers[item.id] || ""}
                          onChange={(e) =>
                            handleInputChange(item.id, e.target.value)
                          }
                          sx={{ width: 100, mr: 1 }}
                        />
                      )}
                      {part}
                    </span>
                  ))}
                </Typography>
                {showResults && (
                  <Typography
                    variant="body2"
                    color={
                      answers[item.id]?.toLowerCase() ===
                      item.answer.toLowerCase()
                        ? "green"
                        : "red"
                    }
                  >
                    {answers[item.id]?.toLowerCase() ===
                    item.answer.toLowerCase()
                      ? "✓ Bonne réponse"
                      : `✗ Mauvaise réponse (Réponse : ${item.answer})`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={checkAnswers}
        >
          Vérifier les réponses
        </Button>
        <Button variant="outlined" color="secondary" onClick={resetExercise}>
          Réinitialiser
        </Button>
      </Box>
    </Box>
  );
};

export default VerbConjugationExercise;
