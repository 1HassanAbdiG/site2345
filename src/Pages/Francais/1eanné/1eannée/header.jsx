import React, { useState } from "react";
import { Button, Box, Container, Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'; // Import styled

// Import your exercise components
import ExerciseImage from "./syllabe1eanné";
import RelieFleche from "./relieFleche";
import SingPluriel from "./grammaire1_2e/singpr";
//import HistoireGirafe from "./Text1e/Girafe/tex3"; // Commented out as in original
import JeuLecture from "../Lecture1ephrase/lecture";
//import Alimentation from "./Text1e/Alimentation1/aliment"; // Commented out as in original
import FoodGuideActivities from "./Text1e/Alimentation/alimentation";
import SensesGamesContainer from "./corps/jeuorgane";
import Organedesens from "./corps/texteCorps/tex3";
import PlantGamesContainer from "./plante/planteExer";
import PlantLesson from "./plante/PlantLesson";

import FrenchExercises22 from "../excercice/exercises";
// Import the new FrenchExercises component



// Custom styled components for sections if desired (optional, but can improve visual separation)
const SectionBox = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
}));


// Composant pour le bouton personnalisé (kept as is)
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
        // Toggle visibility: if the same button is clicked, hide the component
        setVisibleComponent((prevComponent) =>
            prevComponent === component ? null : component
        );
         // Optional: Scroll to the exercise area when a button is clicked
         setTimeout(() => {
             const exerciseArea = document.getElementById('exercise-area');
             if (exerciseArea) {
                 exerciseArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }
         }, 100); // Small delay to allow state update and rendering
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
            <Typography variant="h3" align="center" gutterBottom>
                Exercices 1re et 2e Année
            </Typography>

            {/* Organized Buttons by Category */}

            {/* Section: Lecture */}
            <SectionBox>
                 <Typography variant="h5" gutterBottom>Lecture</Typography>
                 <Grid container justifyContent="center" spacing={1}> {/* Reduced spacing */}
                     <Grid item><CustomButton onClick={() => handleButtonClick("Organesens")} label="Les 5 sens" color="success" disabled={visibleComponent === "Organesens"} /></Grid>
                     <Grid item><CustomButton onClick={() => handleButtonClick("alimentation")} label="Alimentation" color="success" disabled={visibleComponent === "alimentation"} /></Grid>
                     <Grid item><CustomButton onClick={() => handleButtonClick("jeuLecture")} label="À toi de jouer (Phrases)" color="primary" disabled={visibleComponent === "jeuLecture"} /></Grid>
                 </Grid>
            </SectionBox>


            {/* Section: Grammaire */}
            <SectionBox>
                <Typography variant="h5" gutterBottom>Grammaire</Typography>
                <Grid container justifyContent="center" spacing={1}>
                    <Grid item><CustomButton onClick={() => handleButtonClick("singPluriel")} label="Singulier / Pluriel" color="success" disabled={visibleComponent === "singPluriel"} /></Grid>
                    {/* Add the new varied exercises component here */}
                    <Grid item>
                        <CustomButton
                            onClick={() => handleButtonClick("frenchExercises")}
                            label="Exercices Variés"
                            color="primary" // Choose a suitable color
                            disabled={visibleComponent === "frenchExercises"}
                        />
                    </Grid>
                </Grid>
            </SectionBox>


            {/* Section: Vocabulaire & Jeux */}
             <SectionBox>
                 <Typography variant="h5" gutterBottom>Vocabulaire & Jeux</Typography>
                 <Grid container justifyContent="center" spacing={1}>
                    <Grid item><CustomButton onClick={() => handleButtonClick("syllabes")} label="Syllabes" color="primary" disabled={visibleComponent === "syllabes"} /></Grid>
                    <Grid item><CustomButton onClick={() => handleButtonClick("relieFleche")} label="Associer par flèche" color="secondary" disabled={visibleComponent === "relieFleche"} /></Grid>
                    <Grid item><CustomButton onClick={() => handleButtonClick("organes")} label="Jeu Organes des sens" color="warning" disabled={visibleComponent === "organes"} /></Grid>
                    <Grid item><CustomButton onClick={() => handleButtonClick("plantGames")} label="Jeu : Parties de la Plante" color="secondary" disabled={visibleComponent === "plantGames"} /></Grid>
                 </Grid>
             </SectionBox>

            {/* Section: Leçons */}
            <SectionBox>
                <Typography variant="h5" gutterBottom>Leçons</Typography>
                <Grid container justifyContent="center" spacing={1}>
                    <Grid item><CustomButton onClick={() => handleButtonClick("plantLesson")} label="Leçon : Parties de la Plante" color="info" disabled={visibleComponent === "plantLesson"} /></Grid>
                </Grid>
            </SectionBox>


            {/* Conditional Display Area for Exercises */}
            <Box id="exercise-area" mt={4} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px", minHeight: '300px' }}> {/* Added minHeight for better layout */}
                {/* Render the selected component */}
                {visibleComponent === "syllabes" && <ExerciseImage />}
                {visibleComponent === "relieFleche" && <RelieFleche />}
                {visibleComponent === "singPluriel" && <SingPluriel />}
                {visibleComponent === "Organesens" && <Organedesens />}
                {visibleComponent === "alimentation" && <FoodGuideActivities />}
                {visibleComponent === "jeuLecture" && <JeuLecture />}
                {visibleComponent === "organes" && <SensesGamesContainer />}
                {visibleComponent === "plantLesson" && <PlantLesson />}
                {visibleComponent === "plantGames" && <PlantGamesContainer />}
                {visibleComponent === "frenchExercises" && <FrenchExercises22 />} 


                {/* Default text when no component is visible */}
                {!visibleComponent && (
                    <Typography variant="body1" align="center" sx={{ mt: '100px', color: 'text.secondary' }}> {/* Centered text */}
                        Sélectionnez un exercice ci-dessus pour commencer.
                    </Typography>
                )}
            </Box>

        </Container>
    );
}