import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
// Import plant-related components
import PlantPartGame from './PlantPartGame';
import PlantPartsFunctionsGame from "./PlantPartsFunctionsGame";
import PlanteQuiz from "./planteList";



const PlantGamesContainer = () => {
    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Découverte et Jeux sur les Plantes
            </Typography>



            <Divider sx={{ my: 4 }} />

            <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom>
                    2. Identifie les Parties de la Plante
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                    Fais glisser le nom de chaque partie de la plante sur l'image correspondante.
                </Typography>
                <PlantPartGame />
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom>
                    3. À Chaque Partie de la Plante sa Fonction !
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                    Associe la bonne définition (fonction) à chaque partie de la plante illustrée.
                </Typography>
                <PlantPartsFunctionsGame />
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom>
                    4. Associe la Bonne Définition au Bon Mot
                </Typography>
                <PlanteQuiz />
            </Box>
        </Container>
    );
};

export default PlantGamesContainer;
