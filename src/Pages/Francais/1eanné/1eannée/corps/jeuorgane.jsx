import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import BodyPartGameFinalVerify5 from './corpsok';
import SensesQuiz from "./sensesList";
import FiveSensesGame2 from "./5sens2";


const SensesGamesContainer = () => {
  return (
    <Container  sx={{ mt: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Jeux sur les organes des sens
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Trouve le bon mot à partir d'une image
        </Typography>
        <BodyPartGameFinalVerify5 />
      </Box>

      

      <Divider sx={{ my: 4 }} />

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. Associe la bonne définition au bon mot
        </Typography>
        <SensesQuiz />
      </Box>
      <Divider sx={{ my: 4 }} />

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          3.  À Chaque Sens son Organe et son Action !
        </Typography>
        <FiveSensesGame2></FiveSensesGame2>
      </Box>
    </Container>
  );
};

export default SensesGamesContainer;
