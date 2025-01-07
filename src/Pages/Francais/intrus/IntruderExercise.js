import React, { useState } from "react";
import { Box, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import exercises from "./exercises.json";

const IntruderExercise = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentList, setCurrentList] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]); // Stocke les résultats des 5 listes
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Gère les éléments sélectionnés pour chaque liste

  // Gestion de la sélection d'un intrus
  const handleItemClick = (itemIndex) => {
    const { intruderIndex } = exercises.exercises[currentExercise].lists[currentList];
    const isCorrect = itemIndex === intruderIndex;

    // Ajouter le résultat
    setResults((prevResults) => [
      ...prevResults,
      { 
        listNumber: currentList + 1, 
        selectedItem: exercises.exercises[currentExercise].lists[currentList].items[itemIndex],
        isCorrect
      }
    ]);

    // Mettre à jour le score si la réponse est correcte
    if (isCorrect) {
      setScore(score + 1);
    }

    // Passer à la liste suivante ou terminer l'exercice
    if (currentList < 4) {
      setCurrentList(currentList + 1);
    } else {
      setExerciseCompleted(true);
    }

    // Désactiver les boutons de cette liste
    setSelectedItems((prevItems) => [...prevItems, currentList]);
  };

  // Passer à l'exercice suivant
  const handleNextExercise = () => {
    setCurrentExercise(currentExercise + 1);
    setCurrentList(0);
    setScore(0);
    setResults([]);
    setSelectedItems([]);
    setExerciseCompleted(false);
  };

  // Réinitialiser l'exercice
  const handleResetExercise = () => {
    setCurrentList(0);
    setScore(0);
    setResults([]);
    setSelectedItems([]);
    setExerciseCompleted(false);
  };

  const { title, instructions, lists } = exercises.exercises[currentExercise];

  return (
    <Box sx={{ padding: 3 }}>
      {/* Titre de l'exercice */}
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {/* Consignes de l'exercice */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Consignes : {instructions}
      </Typography>

      {/* Score */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Score : {score}
      </Typography>

      {!exerciseCompleted ? (
        <>
          {/* Affichage de la liste actuelle */}
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Liste {currentList + 1} / 5
          </Typography>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
            <Grid container spacing={2}>
              {lists[currentList].items.map((item, itemIndex) => (
                <Grid item xs={6} md={3} key={itemIndex}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleItemClick(itemIndex)}
                    disabled={selectedItems.includes(currentList)} // Désactive les boutons après un clic
                  >
                    {item}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      ) : (
        <>
          {/* Tableau récapitulatif */}
          <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
            Résultats de l'exercice :
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Liste</TableCell>
                  <TableCell>Élément Sélectionné</TableCell>
                  <TableCell>Réponse Correcte</TableCell>
                  <TableCell>Résultat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.listNumber}</TableCell>
                    <TableCell>{result.selectedItem}</TableCell>
                    <TableCell>{lists[result.listNumber - 1].items[lists[result.listNumber - 1].intruderIndex]}</TableCell>
                    <TableCell>{result.isCorrect ? "Correct" : "Incorrect"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bouton pour passer à l'exercice suivant */}
          {currentExercise < exercises.exercises.length - 1 ? (
            <Box sx={{ marginTop: 3, textAlign: "center" }}>
              <Button variant="contained" color="primary" onClick={handleNextExercise}>
                Passer à l'exercice suivant
              </Button>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ marginTop: 3, textAlign: "center" }}>
              Félicitations, vous avez terminé tous les exercices !
            </Typography>
          )}
        </>
      )}

      {/* Bouton de réinitialisation */}
      {exerciseCompleted && (
        <Box sx={{ marginTop: 3, textAlign: "center" }}>
          <Button variant="outlined" color="secondary" onClick={handleResetExercise}>
            Réinitialiser l'exercice
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default IntruderExercise;
