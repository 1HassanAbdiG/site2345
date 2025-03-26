import React, { useState } from "react";
import { Button, Box, Container, Grid, Typography } from "@mui/material";
import ExerciseImage from "./syllabe1eanné";
import Exercise from "./relieFleche";
import Singplurie12 from "./grammaire1_2e/singpr";
import Histoire12 from "./Text1e/dromataire/tex3"




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
export default function Exercice1e2e() {
    const [visibleComponent, setVisibleComponent] = useState(null);

    // Gérer l'affichage des composants
    const handleButtonClick = (component) => {
        setVisibleComponent((prevComponent) =>
            prevComponent === component ? null : component
        );
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: "2rem" }}> {/* Conteneur centré */}
            <Typography variant="h3" align="center" gutterBottom>
                Exercices 1e et 2e Année
            </Typography>

            {/* Boutons pour afficher/masquer les composants */}
            <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("ExerciceI")}
                        label={
                            visibleComponent === "ExerciceI"
                                ? "syllabes"
                                : "syllabes"
                        }
                        color="primary"
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("ExerciseF")}
                        label={
                            visibleComponent === "construction"
                                ? "Associez"
                                : "Associez"
                        }
                        color="secondary"
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("ExerciceSP")}
                        label={
                            visibleComponent === "ExerciceSP"
                                ? "singulier pluriel"
                                : "singulier pluriel"
                        }
                        color="success"
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("ExerciceHis")}
                        label={
                            visibleComponent === "ExerciceHis"
                                ? "Lecture"
                                : "Lecture"
                        }
                        color="success"
                    />
                </Grid>
            </Grid>

            {/* Rendu conditionnel des composants */}
            <Box mt={4} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
                {visibleComponent === "ExerciceI" && <ExerciseImage />}
                {visibleComponent === "ExerciseF" && <Exercise />}
                {visibleComponent === "ExerciceSP" && <Singplurie12 />}
                {visibleComponent === "ExerciceHis" && <Histoire12 />}




                {!visibleComponent && (
                    <Typography variant="body1" align="center">
                        Sélectionnez un sujet pour commencer.
                    </Typography>
                )}
            </Box>
        </Container>
    );
}