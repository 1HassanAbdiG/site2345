import React, { useState } from "react";
import { Button, Box, Container, Grid, Typography } from "@mui/material";
import AdjectiveLesson from "./AdjectiveLesson";
import Orthographeaa from "../Francais/Orthographe/Orthographeaa";
import DragDropExercise from "../Francais/completerunephrase";

import Orthographeaa1 from "../Francais/possessif/Phpossessif";
//import PhraseTable from "../Francais/Orthographe/phraseTable";


// Composant pour le bouton personnalisé
function CustomButton({ onClick, label, color = "primary", variant = "contained" }) {
    return (
        <Button
            onClick={onClick}
            color={color}
            variant={variant}
            sx={{ margin: "0.5rem" }} // Spacing entre les boutons
        >
            {label}
        </Button>
    );
}

// Composant principal
export default function Grammaire() {
    const [visibleComponent, setVisibleComponent] = useState(null);

    // Gérer l'affichage des composants
    const handleButtonClick = (component) => {
        setVisibleComponent((prevComponent) =>
            prevComponent === component ? null : component
        );
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: "2rem" }}> {/* Conteneur centré */}
            <Typography variant="h3" align="center" gutterBottom>
                Grammaire
            </Typography>

            {/* Boutons pour afficher/masquer les composants */}
            <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("Adjectif")}
                        label={
                            visibleComponent === "Adjectif"
                                ? "Adjectif et Types de Phrases"
                                : "Adjectif et Types de Phrases"
                        }
                        color="primary"
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("construction")}
                        label={
                            visibleComponent === "construction"
                                ? "Construction de Phrases"
                                : "Construction de Phrases"
                        }
                        color="secondary"
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("Homophone")}
                        label={
                            visibleComponent === "Homophone"
                                ? "Homophones"
                                : "Homophones"
                        }
                        color="success"
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("Possessif")}
                        label={
                            visibleComponent === "Possessif" 
                                ? "Possessif" 
                                : "Possessif" 
                        }
                        color="success"
                    />
                </Grid>
            </Grid>

            {/* Rendu conditionnel des composants */}
            <Box mt={4} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
                {visibleComponent === "Adjectif" && <AdjectiveLesson />}
                {visibleComponent === "Homophone" && <Orthographeaa />}
                {visibleComponent === "construction" && <DragDropExercise />}
                {visibleComponent === "Possessif" && <Orthographeaa1 />}
              
                {!visibleComponent && (
                    <Typography variant="body1" align="center">
                        Sélectionnez un sujet pour commencer.
                    </Typography>
                )}
            </Box>
        </Container>
    );
}
