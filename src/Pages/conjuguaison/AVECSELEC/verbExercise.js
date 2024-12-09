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
import verbsData from "./ex.json";

const VerbExercise = () => {
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
        Écris les pronoms devant les verbes suivants
      </Typography>

      <Grid container spacing={2}>
        {verbsData.verbs.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Pronom"
                      size="small"
                      value={answers[item.id] || ""}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">{item.verb}</Typography>
                  </Grid>
                  {showResults && (
                    <Grid item xs={2}>
                      <Typography
                        variant="body2"
                        color={
                          answers[item.id]?.toLowerCase() === item.pronoun
                            ? "green"
                            : "red"
                        }
                      >
                        {answers[item.id]?.toLowerCase() === item.pronoun
                          ? "✓"
                          : "✗"}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
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

export default VerbExercise;
