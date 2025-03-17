import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  ButtonGroup,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import styles from "./Conjugation.module.css";
import ExerciceConj from "./ExerciceConj";

// Object to store paths to the JSON files
const jsonPaths = {
  Présent: "./conjugaison1.json",
  Futur: "./conjugaison2.json",
  Imparfait: "./conjugaison3.json",
  Passe_composé: "./conjugaison4.json",
};

const Conjugation = () => {
  const [selectedGroup, setSelectedGroup] = useState("1er groupe");
  const [selectedVerb, setSelectedVerb] = useState("");
  const [conjugationData, setConjugationData] = useState({});
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState("");

  // Function to dynamically import the conjugation data based on selected tense
  const handleTenseChange = async (selectedTense) => {
    try {
      const data = await import(`${jsonPaths[selectedTense]}`);
      setConjugationData(data.default || data);
    } catch (error) {
      console.error("Error loading conjugation data:", error);
    }
  };

  // Initialize scores for all verbs whenever the conjugation data changes
  useEffect(() => {
    const initialScores = {};
    Object.keys(conjugationData).forEach((group) => {
      Object.keys(conjugationData[group]?.verbs || {}).forEach((verb) => {
        initialScores[verb] = { best: 0, last: 0, first: null, group };
      });
    });
    setScores(initialScores);
  }, [conjugationData]);

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setSelectedVerb("");
    setMessage("");
  };

  const handleVerbChange = (e) => {
    setSelectedVerb(e.target.value);
    setMessage("");
  };

  const checkAnswers = () => {
    if (!selectedVerb) {
      setMessage("Veuillez sélectionner un verbe.");
      return;
    }

    const inputs = document.querySelectorAll(`.${styles.verbInput}`);
    let correct = 0;
    let allFilled = true;

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFilled = false;
        input.style.backgroundColor = "#f9e79f"; // Yellow for empty fields
      } else {
        const userAnswer = input.value.toLowerCase().trim();
        const correctAnswer =
          conjugationData[selectedGroup].verbs[selectedVerb][parseInt(input.dataset.index)];

        if (userAnswer === correctAnswer) {
          input.style.backgroundColor = "#d5f5e3"; // Green for correct answer
          correct++;
        } else {
          input.style.backgroundColor = "#fadbd8"; // Red for incorrect answer
        }
      }
    });

    if (!allFilled) {
      setMessage("Veuillez remplir tous les champs avant de vérifier.");
      return;
    }

    setMessage(`Vous avez ${correct} réponse(s) correcte(s) sur 6.`);
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };

      updatedScores[selectedVerb].last = correct;

      if (updatedScores[selectedVerb].first === null) {
        updatedScores[selectedVerb].first = correct;
      }

      updatedScores[selectedVerb].best = Math.max(updatedScores[selectedVerb].best, correct);
      return updatedScores;
    });
  };

  const resetExercise = () => {
    const inputs = document.querySelectorAll(`.${styles.verbInput}`);
    inputs.forEach((input) => {
      input.value = "";
      input.style.backgroundColor = "";
    });
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Conjugaison
        </Typography>

        <Paper sx={{ p: 3, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom>
            Instructions :
          </Typography>
          <Typography variant="body1" paragraph>
            Suivez les étapes ci-dessous pour pratiquer la conjugaison des verbes aux différents temps :
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="1. Choisissez un temps, puis le groupe et un verbe parmi ceux proposés." />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Conjuguez le verbe choisi :" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Vérifiez vos réponses à chaque étape." />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Répétez l’exercice avec différents verbes pour mieux maîtriser chaque temps." />
            </ListItem>
          </List>
        </Paper>
      </Container>

      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="tense buttons"
        style={{ display: "flex", justifyContent: "space-around", marginTop: "20px", width: "100%" }}
      >
        {["Présent", "Futur", "Imparfait", "Passe_composé"].map((tense) => (
          <Button
            key={tense}
            onClick={() => handleTenseChange(tense)}
            style={{
              borderRadius: "12px",
              fontSize: "1.2rem",
              padding: "10px 20px",
              textTransform: "none",
              transition: "0.3s ease",
              margin: "0 10px",
              backgroundColor: "#2196f3",
              color: "white",
              width: "20%",
              "&:hover": {
                backgroundColor: "#0288d1",
                transform: "scale(1.05)",
              },
            }}
          >
            {tense.charAt(0).toUpperCase() + tense.slice(1).replace("-", " ")}
          </Button>
        ))}
      </ButtonGroup>
      <br />

      {/* Group selection */}
      <select className={styles.groupSelector} value={selectedGroup} onChange={handleGroupChange}>
        {Object.keys(conjugationData).map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      {/* Display the rule of the selected group */}
      <Card sx={{ marginBottom: "30px", boxShadow: 3, borderRadius: "10px", backgroundColor: "#f4f6f9" }}>
        <CardContent>
          {/* Règle du groupe sélectionné */}
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              color: "#fff",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "red",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {conjugationData[selectedGroup]?.rule?.title || "Titre indisponible"}
          </Typography>

          <List>
            {conjugationData[selectedGroup]?.rule?.content?.map((item, index) => (
              <ListItem
                key={index}
                sx={{

                  paddingBottom: "20px",
                  borderRadius: "8px",
                  boxShadow: 2,
                  marginBottom: "10px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  {/* Section Idée avec la mise en forme HTML */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#2c3e50",
                      marginBottom: "10px",
                      backgroundColor: "#ffc107",
                      padding: "10px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle sx={{ marginRight: "10px", color: "#28a745" }} />
                    {item?.idea || "Idée non disponible"}
                  </Typography>

                  <ListItemText
                    sx={{
                      fontSize: "1.2rem", // Augmente la taille de la police du titre
                      fontWeight: "400", // Simplifie le poids de la police
                      lineHeight: 1.8, // Augmente l'espacement des lignes
                      backgroundColor: "#f8f9fa", // Couleur de fond douce
                      padding: "15px", // Ajoute un peu plus de remplissage
                      borderRadius: "8px",
                      boxShadow: 2, // Élève le niveau de l'ombre pour un effet de profondeur
                      marginTop: "10px",
                      transition: "background-color 0.3s ease", // Ajoute une transition douce
                      "&:hover": {
                        backgroundColor: "#e9ecef", // Change la couleur de fond au survol
                      },
                      "& span": {
                        color: "#d32f2f", // Couleur du texte à l'intérieur des span
                        fontWeight: "bold", // Texte en gras
                        fontSize: "1.2rem", // Taille de la police des span
                        textDecoration: "underline", // Surligner pour ajouter un effet
                      },
                    }}
                    secondary={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.text.replace(/{{(.*?)}}/g, (match, p1) => `<span>${p1}</span>`),
                        }}
                        style={{
                          color: "#000000", // Couleur du texte noir
                          fontSize: "1.2rem", // Augmente la taille de la police du texte principal
                          lineHeight: 1.6, // Ajuste l'espacement des lignes pour le texte
                        }}
                      />
                    }
                  />


                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Verb selection */}
      {selectedGroup && (
        <select className={styles.verbSelector} value={selectedVerb} onChange={handleVerbChange}>
          <option value="">-- Choisir un verbe --</option>
          {Object.keys(conjugationData[selectedGroup]?.verbs || {}).map((verb) => (
            <option key={verb} value={verb}>
              {verb}
            </option>
          ))}
        </select>
      )}

      {/* Conjugation exercise */}
      {selectedVerb && (
        <div className={styles.exerciseBox}>
          <h2>
            Conjuguez le verbe "<span>{selectedVerb}</span>"
          </h2>
          {conjugationData[selectedGroup].verbs[selectedVerb]?.map((_, index) => (
            <div key={index}>
              <span className={styles.pronoun}>{["je", "tu", "il/elle", "nous", "vous", "ils/elles"][index]}</span>
              <input type="text" className={styles.verbInput} data-index={index} />
            </div>
          ))}
          <button className={styles.checkBtn} onClick={checkAnswers}>
            Vérifier
          </button>
          <button className={styles.resetBtn} onClick={resetExercise}>
            Réinitialiser
          </button>
          {message && (
            <p className={`${styles.message} ${message.includes("correct") ? styles.success : styles.error}`}>
              {message}
            </p>
          )}
        </div>
      )}

      {/* Scores table */}
      {selectedGroup && (
        <table className={styles.scoresTable}>
          <thead>
            <tr>
              <th>Verbe</th>
              <th>Score de la première validation</th>
              <th>Dernier score</th>
              <th>Meilleur score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scores)
              .filter(([verb]) => Object.keys(conjugationData[selectedGroup]?.verbs || {}).includes(verb))
              .map(([verb, score]) => (
                <tr key={verb}>
                  <td>{verb}</td>
                  <td>{score.first !== null ? `${score.first}/6` : "Pas encore validé"}</td>
                  <td>{score.last}/6</td>
                  <td>{score.best}/6</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
     <Box className={styles.blackBox}>
  
    <ExerciceConj />
</Box>

     
    </div>
  );
};

export default Conjugation;