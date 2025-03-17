import React, { useState } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import { Grid, Paper, Typography, Button, Box } from "@mui/material";

import exerciseData from "./exercice.json"; // Importer les données du JSON
import ExerciseImage from "./lienImagMot";


const Exercise = () => {
    // Données de l'exercice depuis le fichier JSON
    const { titre, instructions, questions } = exerciseData;

    const leftItems = questions.map((q) => ({
        id: `left-${q.id}`,
        text: q.groupe1,
    }));
    const rightItems = questions.map((q) => ({
        id: `right-${q.id}`,
        text: q.groupe2,
    }));

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    const [shuffledRightItems] = useState(shuffle([...rightItems]));

    const [selectedLeft, setSelectedLeft] = useState(null);
    const [pairings, setPairings] = useState([]); // Stocke les associations
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleLeftClick = (item) => {
        setSelectedLeft(item);
    };

    const handleRightClick = (item) => {
        if (selectedLeft) {
            if (pairings.find((pair) => pair.leftId === selectedLeft.id)) {
                alert("Cet élément est déjà relié.");
            } else {
                setPairings([
                    ...pairings,
                    {
                        leftId: selectedLeft.id,
                        rightId: item.id,
                        leftText: selectedLeft.text,
                        rightText: item.text,
                    },
                ]);
            }
            setSelectedLeft(null);
        } else {
            alert("Veuillez d'abord sélectionner un élément de la colonne de gauche.");
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        pairings.forEach((pair) => {
            const question = questions.find(
                (q) => `left-${q.id}` === pair.leftId
            );
            if (question && question.groupe2 === pair.rightText) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setSubmitted(true);
    };

    return (
        <Grid container spacing={4} padding={3}>
            {/* Titre et instructions */}
            <Box sx={{ backgroundColor: "lightblue", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" , p:2}}>
                <Grid item xs={12}>
                    <Paper
                        style={{
                            padding: "20px",
                            backgroundColor: "#e9f5fc",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Typography variant="h3" color="#1976d2" gutterBottom>
                            {titre}
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '1.2em' }}>
                            {instructions}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Zone d'association avec react-archer */}
                <Grid   >
                    <ArcherContainer strokeColor="red" >
                    <Grid container sx={{ display:"flex",justifyContent: "space-around", alignItems: "center", padding: "2rem" }}>
                            {/* Colonne de gauche */}
                            <Grid item xs={5}>
                                <Paper
                                    style={{
                                        width:"60%",
                                        padding: "20px",
                                        backgroundColor: "#f1f8e9",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Typography variant="h5">Groupe 1</Typography>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        {leftItems.map((item) => {
                                            const pairing = pairings.find(
                                                (pair) => pair.leftId === item.id
                                            );
                                            return (

                                                <ArcherElement
                                                    key={item.id}
                                                    id={item.id}
                                                    relations={
                                                        pairing
                                                            ? [
                                                                {
                                                                    targetId: pairing.rightId,
                                                                    targetAnchor: "left",
                                                                    sourceAnchor: "right",
                                                                    style: { strokeColor: "green", strokeWidth: 2 },
                                                                },
                                                            ]
                                                            : []
                                                    }
                                                >
                                                    <Paper
                                                        style={{
                                                            padding: "15px",
                                                            backgroundColor:
                                                                selectedLeft && selectedLeft.id === item.id
                                                                    ? "#bbdefb"
                                                                    : "#bbdefb",
                                                            cursor: "pointer",
                                                            borderRadius: "8px",
                                                            transition: "background-color 0.3s ease",
                                                            boxShadow: selectedLeft && selectedLeft.id === item.id ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "none",
                                                        }}
                                                        onClick={() => handleLeftClick(item)}
                                                    >

                                                        {item.text}
                                                    </Paper>
                                                </ArcherElement>
                                            );
                                        })}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Colonne de droite */}
                            <Grid item xs={5}>
                                <Paper
                                    style={{
                                        width:"60%",
                                        padding: "20px",
                                        backgroundColor: "#f1f8e9",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Typography variant="h5">Groupe 2</Typography>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        {shuffledRightItems.map((item) => (
                                            <ArcherElement key={item.id} id={item.id}>
                                                <Paper
                                                    style={{
                                                        padding: "15px",
                                                        backgroundColor: "#c8e6c9",
                                                        cursor: "pointer",
                                                        borderRadius: "8px",
                                                        transition: "background-color 0.3s ease",
                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                                    }}
                                                    onClick={() => handleRightClick(item)}
                                                >
                                                    {item.text}
                                                </Paper>
                                            </ArcherElement>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </ArcherContainer>
                </Grid>

                {/* Bouton de soumission */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        Soumettre
                    </Button>
                </Grid>

                {/* Affichage du résultat */}
                {submitted && (
                    <Grid item xs={12}>
                        <Paper
                            style={{
                                padding: "20px",
                                backgroundColor: "#c8e6c9",
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Typography variant="h5" color="#1976d2" gutterBottom>
                                Résultat
                            </Typography>
                            <Typography>
                                Vous avez {score} bonne(s) réponse(s) sur {leftItems.length}.
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Box>

            <Box sx={{ bgcolor: "rgba(106, 41, 246, 0.1)", padding: "1rem", borderRadius: "8px", color: "white" }}>
                <ExerciseImage></ExerciseImage>
            </Box>






        </Grid>

    );
};

export default Exercise;