import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  TextField,
  Card,
  CardContent,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

// Assuming dictinationsData is structured as per your new JSON
import dictinationsData from "./dictee.json";

const WordPlayer = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [showWords, setShowWords] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const[nombre,Setnombre]=useState(0)
  

  // Snackbar handler
  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleMonthChange = (event) => {
    Setnombre(event.target);
    console.log(nombre)
    setSelectedMonth(event.target.value);
    setSelectedWeek("");
    setSelectedDay(null);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setSelectedDay(null);
  };

  const handleDayChange = (event) => {
    const selected = dictinationsData.months
      .find((month) => month.name === selectedMonth)
      .weeks.find((week) => week.name === selectedWeek)
      .days.find((day) => day.day === event.target.value);
    setSelectedDay(selected);
    resetDictation(selected.words.length);
  };

  const resetDictation = (wordCount = 0) => {
    setShowWords(true);
    setAnswers(Array(wordCount).fill(""));
    setResult(null);
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const startDictation = () => {
    setShowWords(false);
    setResult(null); // Clear the result when a new dictation starts
  };

  // Play word audio
  const playWord = (mp3) => {
    const audio = new Audio(`/audio/${mp3}`);
    audio.play();
  };

  const verifyDictation = () => {
    if (answers.includes("")) {
      handleSnackbar("Veuillez compléter tous les mots avant de vérifier.");
      return;
    }

    let correctCount = 0;
    const errors = [];

    selectedDay.words.forEach((wordObj, index) => {
      const userInput = answers[index];
      const isCorrect = wordObj.word.toLowerCase() === userInput.toLowerCase();

      if (isCorrect) {
        correctCount++;
      } else {
        errors.push({ word: wordObj.word, userInput, isCorrect });
      }
    });

    const score = (correctCount / selectedDay.words.length) * 100;

    setResult({ score, errors });
    handleSnackbar("Dictée vérifiée, consultez vos résultats !");
  };

  return (
    <>
      {/* Top bar */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4">Dictée</Typography>
      </Box>

      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        {/* Config: Month/Week/Day */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configuration de la dictée
            </Typography>
            <Select
              fullWidth
              value={selectedMonth}
              
              onChange={handleMonthChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Sélectionnez un Echellon
              </MenuItem>
              {dictinationsData.months.map((month) => (
                <MenuItem key={month.name} value={month.name}>
                  {month.name}
              
                </MenuItem>
              ))}
            </Select>
            
           
           

            {selectedMonth && (
              <Select
                fullWidth
                value={selectedWeek}
                onChange={handleWeekChange}
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="" disabled>
                  Sélectionnez l'Echellon
                </MenuItem>
                {dictinationsData.months
                  .find((month) => month.name === selectedMonth)
                  .weeks.map((week) => (
                    <MenuItem key={week.name} value={week.name}>
                      {week.name}
                    </MenuItem>
                  ))}
              </Select>
            )}

            {selectedWeek && (
              <Select
                fullWidth
                value={selectedDay?.day || ""}
                onChange={handleDayChange}
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="" disabled>
                  Sélectionnez un jour
                </MenuItem>
                {dictinationsData.months
                  .find((month) => month.name === selectedMonth)
                  .weeks.find((week) => week.name === selectedWeek)
                  .days.map((day) => (
                    <MenuItem key={day.day} value={day.day}>
                      {day.day}
                    </MenuItem>
                  ))}
              </Select>
            )}
          </CardContent>
        </Card>

        {selectedDay && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {selectedDay.title}
            </Typography>
            {showWords ? (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: "#1976d2",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Appuyez sur le bouton pour écouter les mots avant de démarrer.
                </Typography>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {selectedDay.words.map((wordObj, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        padding: "10px",
                        backgroundColor: "#f1f8ff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontSize: "1.1rem",
                          color: "#0d47a1",
                          fontWeight: "500",
                        }}
                      >
                        {wordObj.word}
                      </Typography>
                      <Button
                        onClick={() => playWord(wordObj.mp3)}
                        variant="contained"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0d47a1",
                          },
                          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        🔊
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={startDictation}
                  sx={{
                    mt: 3,
                    backgroundColor: "#388e3c",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    "&:hover": {
                      backgroundColor: "#2e7d32",
                    },
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Commencer la dictée
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Écrivez les mots de la dictée ci-dessous :
                </Typography>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {selectedDay.words.map((wordObj, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        padding: "10px",
                        backgroundColor: "#f1f8ff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontSize: "1.1rem",
                          color: "#0d47a1",
                          fontWeight: "500",
                        }}
                      >
                        <Button
                        onClick={() => playWord(wordObj.mp3)}
                        variant="contained"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0d47a1",
                          },
                          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        🔊
                      </Button>
                      </Typography>
                      <TextField
                        variant="outlined"
                        value={answers[index]}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        sx={{ flex: 2 }}
                      />
                    </li>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={verifyDictation}
                  sx={{
                    mt: 3,
                    backgroundColor: "#d32f2f",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#b71c1c",
                    },
                    fontWeight: "bold",
                    fontSize: "1.2em",
                  }}
                >
                  Vérifier
                </Button>
              </>
            )}
          </Paper>
        )}

        {/* Results */}
        {result && (
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6">Résultats :</Typography>
            <Typography>Score : {result.score.toFixed(2)}%</Typography>
            {result.errors.length > 0 && (
              <Typography variant="body2" sx={{ color: "error.main" }}>
                Erreurs :
              </Typography>
            )}
            <ul>
              {result.errors.map((error, index) => (
                <li key={index}>
                  <Typography variant="body2" sx={{ color: "error.main" }}>
                    {error.word} ➔ {error.userInput}
                  </Typography>
                </li>
              ))}
            </ul>
          </Paper>
        )}
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WordPlayer;
