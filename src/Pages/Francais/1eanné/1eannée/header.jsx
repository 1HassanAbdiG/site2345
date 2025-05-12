import React, { useState } from "react";
import { Button, Box, Container, Grid, Typography } from "@mui/material";

import ExerciseImage from "./syllabe1eanné";
import RelieFleche from "./relieFleche";
import SingPluriel from "./grammaire1_2e/singpr";
//import HistoireGirafe from "./Text1e/Girafe/tex3";
import JeuLecture from "../Lecture1ephrase/lecture";
//import Alimentation from "./Text1e/Alimentation1/aliment";
import FoodGuideActivities from "./Text1e/Alimentation/alimentation";
import SensesGamesContainer from "./corps/jeuorgane";
import Organedesens from "./corps/texteCorps/tex3";
import PlantGamesContainer from "./plante/planteExer";
import PlantLesson from "./plante/PlantLesson";



// Composant pour le bouton personnalisé
function CustomButton({ onClick, label, color = "primary", variant = "contained", disabled }) {
    return (
        <Button
            onClick={onClick}
            color={color}
            variant={variant}
            disabled={disabled}
            sx={{ margin: "0.5rem" }}
        >
            {label}
        </Button>
    );
}

// Composant principal
export default function Exercice1e2e() {
    const [visibleComponent, setVisibleComponent] = useState(null);

    const handleButtonClick = (component) => {
        setVisibleComponent((prevComponent) =>
            prevComponent === component ? null : component
        );
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
            <Typography variant="h3" align="center" gutterBottom>
                Exercices 1re et 2e Année
            </Typography>



            {/* Boutons */}
            <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("syllabes")}
                        label="Syllabes"
                        color="primary"
                        disabled={visibleComponent === "syllabes"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("relieFleche")}
                        label="Associer par flèche"
                        color="secondary"
                        disabled={visibleComponent === "relieFleche"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("singPluriel")}
                        label="Singulier / Pluriel"
                        color="success"
                        disabled={visibleComponent === "singPluriel"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("Organesens")}
                        label="Lecture : Les 5 sens"
                        color="success"
                        disabled={visibleComponent === "Organesens"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("alimentation")}
                        label="Lecture : Alimentation"
                        color="success"
                        disabled={visibleComponent === "alimentation"}
                    />
                </Grid>

                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("jeuLecture")}
                        label="À toi de jouer !"
                        color="primary"
                        disabled={visibleComponent === "jeuLecture"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("organes")}
                        label="Organes des sens"
                        color="warning"
                        disabled={visibleComponent === "organes"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("plantLesson")}
                        label="Leçon : Parties de la plante"
                        color="info"
                        disabled={visibleComponent === "plantLesson"}
                    />
                </Grid>
                <Grid item>
                    <CustomButton
                        onClick={() => handleButtonClick("plantGames")}
                        label="Jeux : Plante"
                        color="secondary"
                        disabled={visibleComponent === "plantGames"}
                    />
                </Grid>

            </Grid>

            {/* Affichage conditionnel des exercices */}
            <Box mt={4} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
                {visibleComponent === "syllabes" && <ExerciseImage />}
                {visibleComponent === "relieFleche" && <RelieFleche />}
                {visibleComponent === "singPluriel" && <SingPluriel />}
                {visibleComponent === "Organesens" && <Organedesens />}
                {visibleComponent === "alimentation" && <FoodGuideActivities />}
                {visibleComponent === "jeuLecture" && <JeuLecture />}
                {visibleComponent === "organes" && <SensesGamesContainer />}
                {visibleComponent === "plantLesson" && <PlantLesson />}
                {visibleComponent === "plantGames" && <PlantGamesContainer />}

                {!visibleComponent && (
                    <Typography variant="body1" align="center">
                        Sélectionnez un exercice pour commencer.
                    </Typography>
                )}
            </Box>

        </Container>
    );
}
