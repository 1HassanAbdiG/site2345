import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import histoiresData from "./histoires.json";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";

const Histoires = () => {
  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f9fbe7" }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#558b2f" }}
      >
        Bibliothèque d'Histoires
      </Typography>

      {histoiresData.histoires.map((niveauData, niveauIndex) => (
        <Box key={niveauIndex} sx={{ marginBottom: "40px" }}>
          {/* Niveau */}
          <Typography
            variant="h4"
            align="left"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#33691e",
              marginBottom: "20px",
              textDecoration: "underline",
            }}
          >
            {niveauData.niveau}
          </Typography>

          {/* Cartes d'histoires */}
          <Grid container spacing={3}>
            {niveauData.histoires.map((histoire, histoireIndex) => (
              <Grid item xs={12} sm={6} md={4} key={histoireIndex}>
                <Link to={histoire.link} style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s",
                      height: "100%", // Assure une hauteur égale
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Image */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={require(`${histoire.image}`)} // Charge les images locales
                      alt={histoire.titre}
                      sx={{ filter: "brightness(0.9)" }}
                    />

                    {/* Contenu */}
                    <CardContent
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#f1f8e9",
                        flexGrow: 1, // Remplissage dynamique pour garder les tailles égales
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: "#2e7d32",
                          marginBottom: "10px",
                          minHeight: "40px", // Hauteur minimale pour gérer 2 lignes
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {histoire.titre}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default Histoires;
