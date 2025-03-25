import React, { useState } from "react";
import exercices from "./excercie_conj.json"; // Import du JSON
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  LinearProgress,
} from "@mui/material";

const Exercice_conj = () => {
  const [selectedExercice, setSelectedExercice] = useState(1);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);

  const handleExerciceChange = (event) => {
    setSelectedExercice(event.target.value);
    setAnswers({});
    setResults([]);
    setScore(0);
  };

  const handleSelectChange = (phraseId, index, value) => {
    setAnswers({
      ...answers,
      [phraseId]: { ...answers[phraseId], [index]: value },
    });
  };

  const checkAnswers = () => {
    const exercice = exercices.find((ex) => ex.exercice === selectedExercice);
    let totalScore = 0;

    const newResults = exercice.phrases.map((phrase) => {
      const userAnswers = answers[phrase.id] || {};
      const correct = phrase.reponses.every(
        (rep, index) => rep === userAnswers[index]
      );

      if (correct) totalScore += 1;

      return {
        id: phrase.id,
        phrase: phrase.phrase,
        correct,
      };
    });

    setResults(newResults);
    setScore(totalScore);
  };

  const exercice = exercices.find((ex) => ex.exercice === selectedExercice);
  const completedCount = Object.keys(answers).length;
  const totalCount = exercice?.phrases.length || 0;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <Box
      sx={{
       
        width: "95%",
        backgroundColor: "white",
        padding: 3,

        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography
        variant="h1"
        gutterBottom

        sx={{     

          fontSize: "3rem", // Change la taille de la police
          textAlign: "center",
          color: "#000000", // Très noir
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",

        }}
      >
        Exercices
      </Typography>

      {/* Sélecteur d'exercice */}
      <Select
        value={selectedExercice}
        onChange={handleExerciceChange}
        displayEmpty
        sx={{
          width: "100%",
          marginBottom: 4,

          backgroundColor: "#8cd8b0", // Soft neutral color
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",

          fontSize: "2rem", // Change la taille de la police         
          color: "#000000", // Très noir
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {exercices.map((ex) => (
          <MenuItem key={ex.exercice} value={ex.exercice}>
            Exercice {ex.titre}
          </MenuItem>
        ))}
      </Select>

      {/* Barre de progression */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#3f51b5", // Subtle, calm color for progress bar
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          marginTop: 1,
          fontSize: "1rem", // Change la taille de la police         
          color: "#000000", // Très noir
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Progression : {completedCount}/{totalCount} phrases complétées
      </Typography>

      <Box
        sx={{
          width: "95%",
          marginBottom: 4,
          backgroundColor: "#e3f2fd", // Douce couleur bleue
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#1565c0", // Bleu foncé pour le titre
            marginBottom: "10px",
          }}
          dangerouslySetInnerHTML={{
            __html: exercice.rules
              .split("\n\n")[0] // Sépare le texte en paragraphes, prend le premier
              .replace(/{{(.*?)}}/g, (match, content) => {
                // Applique la couleur et le style à chaque contenu entre {{ }}
                return `<span style="color: #d32f2f; font-weight: bold;">${content}</span>`;
              })
          }}
        />
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#424242", // Gris foncé pour le texte
          }}
          dangerouslySetInnerHTML={{
            __html: exercice.rules
              .split("\n\n")[1] // Sépare le texte en paragraphes, prend le deuxième
              .split("\n") // Sépare chaque ligne
              .map(line =>
                line.replace(/{{(.*?)}}/g, (match, content) => {
                  // Applique la couleur et le style à chaque contenu entre {{ }}
                  return `<span style="color: #d32f2f; font-weight: bold;">${content}</span>`;
                })
              )
              .join("<br />") // Utilise un <br /> pour les sauts de ligne
          }}
        />
      </Box>


      {/* Phrases avec les sélecteurs */}
      {exercice?.phrases.map((phrase) => (
        <Card
          key={phrase.id}
          sx={{
            margin: "10px",
            fontSize: "1rem", // Change la taille de la police         
            color: "#000000", // Très noir
            fontWeight: "bold",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <CardContent>
            <Typography variant="body1" sx={{
              width: "100%",
              color: "#000000", // Très noir
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
              margin: "5px",
              fontSize: "1rem",


            }} gutterBottom>
              <span style={{
                color: "green", fontWeight: "bold",
                fontFamily: "'Roboto', sans-serif",
              }}>{phrase.id} ) </span>

              {phrase.phrase.split("___").map((part, index) => (
                <React.Fragment key={index}>
                  {part}

                  {index < phrase.reponses.length && (
                    <Select
                      value={answers[phrase.id]?.[index] || ""}
                      onChange={(e) =>
                        handleSelectChange(phrase.id, index, e.target.value)
                      }
                      displayEmpty
                      sx={{
                        width: 320,
                        color: "#000000", // Très noir
                        fontWeight: "bold",
                        fontFamily: "'Roboto', sans-serif",
                        margin: "5px",
                        fontSize: "1rem",

                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#ddd" },
                      }}
                    >
                      <MenuItem value="">---</MenuItem>
                      {phrase.options.map((option, i) => (
                        <MenuItem key={i} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </React.Fragment>
              ))}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Bouton de vérification */}
      <Button
        variant="contained"
        color="primary"
        onClick={checkAnswers}
        sx={{
          marginTop: 2,
          fontSize: "1.1rem",
          backgroundColor: "#3f51b5", // Calmer color for the button
          "&:hover": { backgroundColor: "#303f9f" },
        }}
      >
        Vérifier les réponses
      </Button>

      {/* Résultats */}
      {results.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              marginTop: 4,
              textAlign: "center",
              color: score === totalCount ? "#4caf50" : "#f44336",
            }}
          >
            Bilan : {score}/{totalCount} points
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Phrase</TableCell>
                  <TableCell align="center">Résultat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.phrase}</TableCell>
                    <TableCell align="center">
                      {result.correct ? "✅ Correct" : "❌ Incorrect"}
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

export default Exercice_conj ;
