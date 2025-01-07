import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
//import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Confetti from "react-confetti";
import data from "./data.json";

const Exercice = () => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = (event, input) => {
    setAnswers({ ...answers, [input]: parseInt(event.target.value) });
  };

  const validateAnswers = () => {
    const validatedResults = data.questions.map(({ input, correct }) => {
      const userAnswer = answers[input];
      const isCorrect = userAnswer === correct;
      return { input, userAnswer: userAnswer || "Non répondu", correct, isCorrect };
    });

    setResults(validatedResults);
    setShowConfetti(validatedResults.every((res) => res.isCorrect));
  };

  const resetAnswers = () => {
    setAnswers({});
    setResults(null);
    setShowConfetti(false);
  };

  return (
    <Box p={3} style={{ backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Progression */}
      <Box mb={3} textAlign="center">
        <Typography variant="h6" color="primary">
          Progression : {Object.keys(answers).length} / {data.questions.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(Object.keys(answers).length / data.questions.length) * 100}
          style={{ height: 10, marginTop: 10 }}
        />
      </Box>

      {/* Process Description */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" style={{ color: "#ff5722", fontWeight: "bold" }}>
          🧩 Résous le défi : {data.process.join(" → ")}
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} style={{ borderRadius: 15 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "#ffcc80", fontSize: "1.2rem", fontWeight: "bold" }}>
                Entrée
              </TableCell>
              <TableCell align="center" style={{ backgroundColor: "#ffcc80", fontSize: "1.2rem", fontWeight: "bold" }}>
                Sortie (Choisis la bonne réponse)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.questions.map(({ input, options }) => (
              <TableRow key={input}>
                <TableCell align="center" style={{ fontSize: "1.1rem", color: "#00796b" }}>
                  <strong>{input}</strong>
                </TableCell>
                <TableCell align="center">
                  <Select
                    value={answers[input] || ""}
                    onChange={(e) => handleChange(e, input)}
                    displayEmpty
                    fullWidth
                    style={{ backgroundColor: "#e3f2fd", borderRadius: 10 }}
                  >
                    <MenuItem value="" disabled>
                      Choisis
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option} value={option} style={{ fontSize: "1.1rem" }}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Buttons */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="success"
          onClick={validateAnswers}
          style={{ marginRight: 10, fontSize: "1rem", padding: "10px 20px" }}
          startIcon={<CheckCircleIcon />}
        >
          Valider
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={resetAnswers}
          style={{ fontSize: "1rem", padding: "10px 20px" }}
          startIcon={<HighlightOffIcon />}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Results */}
      {results && (
        <Box mt={4}>
          <Typography variant="h6" align="center" style={{ color: "#3f51b5", fontWeight: "bold" }}>
            Tableau récapitulatif des résultats
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: 20, borderRadius: 15 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ backgroundColor: "#c5e1a5", fontWeight: "bold" }}>
                    Entrée
                  </TableCell>
                  <TableCell align="center" style={{ backgroundColor: "#c5e1a5", fontWeight: "bold" }}>
                    Votre Réponse
                  </TableCell>
                  <TableCell align="center" style={{ backgroundColor: "#c5e1a5", fontWeight: "bold" }}>
                    Correct
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map(({ input, userAnswer, correct, isCorrect }) => (
                  <TableRow key={input}>
                    <TableCell align="center">{input}</TableCell>
                    <TableCell align="center" style={{ color: isCorrect ? "#4caf50" : "#f44336" }}>
                      {userAnswer}
                    </TableCell>
                    <TableCell align="center">
                      {isCorrect ? <CheckCircleIcon style={{ color: "#4caf50" }} /> : <HighlightOffIcon style={{ color: "#f44336" }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Exercice;
