import React from "react";
import { Box, Typography, Container } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const UnderConstruction = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
      >
        <ConstructionIcon
          sx={{
            fontSize: 80,
            color: "#8B4513", // Marron dominant
            animation: "blink 1.5s infinite alternate",
          }}
        />
        <Typography variant="h4" sx={{ color: "#8B4513", fontWeight: "bold", mt: 2 }}>
          Page en construction
        </Typography>
        <Typography variant="body1" sx={{ color: "#555", mt: 1 }}>
          Nous travaillons actuellement sur cette page. Revenez bientôt !
        </Typography>
      </Box>
    </Container>
  );
};

export default UnderConstruction;
