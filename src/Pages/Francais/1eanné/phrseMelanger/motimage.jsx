
import React, { useState } from "react";
import { Container, Typography, List, ListItem, IconButton, Card, CardMedia, CardContent, Grid } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const data = {
    chat: "./imag/chat.png",
    banane: "./imag/banana.png",
    chien: "./imag/chien.png",
  };
const speakWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "fr-FR"; // Définit la langue française
  window.speechSynthesis.speak(utterance);
};

const ImageAssociator = () => {
  const [selectedWord, setSelectedWord] = useState("");

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Associez le mot à l’image
      </Typography>

      <Grid container spacing={2} alignItems="center">
        {/* Liste des mots avec audio à gauche */}
        <Grid item xs={4}>
          <List>
            {Object.keys(data).map((word) => (
              <ListItem key={word} button onClick={() => setSelectedWord(word)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => speakWord(word)} aria-label="Lire">
                  <VolumeUpIcon />
                </IconButton>
                <Typography variant="h5">{word}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Flèche au centre */}
        <Grid item xs={4}>
          {selectedWord && (
            <svg width="100" height="50">
              <line x1="10" y1="25" x2="90" y2="25" stroke="black" strokeWidth="2" />
              <polygon points="90,20 100,25 90,30" fill="black" />
            </svg>
          )}
        </Grid>

        {/* Image à droite */}
        <Grid item xs={4}>
          {selectedWord && (
            <Card>
              <CardMedia component="img" height="200" image={data[selectedWord]} alt={selectedWord} />
              <CardContent>
                <Typography variant="h5">{selectedWord}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImageAssociator;

