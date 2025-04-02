import React, { useState, useRef } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import bookData from "./le petit_bûcheron.json";
import { useNavigate } from "react-router-dom";

// Importation des fichiers audio et d'images
import audioPart1 from "./audio_part1.mp3";
import audioPart2 from "./audio_part2.mp3";
import audioPart3 from "./audio_part3.mp3";
import audioPart4 from "./audio_part4.mp3";
import audioPart5 from "./audio_part5.mp3";
import audioPart6 from "./audio_part6.mp3";

import image11 from "./11.jpg";
import image12 from "./12.jpg";
import image21 from "./21.jpg";
import image22 from "./22.jpg";
import image31 from "./31.jpg";
import image32 from "./32.jpg";
import image41 from "./41.jpg";
import image42 from "./42.jpg";
import image51 from "./51.jpg";
import image52 from "./52.jpg";
import image62 from "./62.jpg";
import image61 from "./61.jpg";
import QuizComponentBucheron from "./QuizComponent";

const audioMap = {
  audio_part1: audioPart1,
  audio_part2: audioPart2,
  audio_part3: audioPart3,
  audio_part4: audioPart4,
  audio_part5: audioPart5,
  audio_part6: audioPart6,
};

const imageMap = {
  "11.jpg": image11,
  "12.jpg": image12,
  "21.jpg": image21,
  "22.jpg": image22,
  "31.jpg": image31,
  "32.jpg": image32,
  "41.jpg": image41,
  "42.jpg": image42,
  "51.jpg": image51,
  "61.jpg": image61,
  "62.jpg": image62,
  "52.jpg": image52,
};

const splitText = (text) => {
  if (typeof text !== "string") {
    console.error("Le texte doit être une chaîne de caractères. Vérifie ton JSON.");
    return ["", ""];
  }

  const lines = text.split("\n");
  const midIndex = Math.ceil(lines.length / 2);

  return [
    lines.slice(0, midIndex).join("\n"),
    lines.slice(midIndex).join("\n"),
  ];
};

const InteractiveBookBucheron= () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // État pour gérer le chargement
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const handleNextSection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentSection < bookData.sections.length - 1) {
      setIsLoading(true); // Commencer le chargement
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePreviousSection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentSection > 0) {
      setIsLoading(true); // Commencer le chargement
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioMap[bookData.sections[currentSection].audio]);
    audioRef.current = audio;
    audio.play();
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleReturnToHistory = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigate("/francais/histoire");
  };

  const currentSectionData = bookData.sections[currentSection];
  const [textPart1, textPart2] = splitText(currentSectionData.text);

  // Simuler le temps de chargement
  setTimeout(() => setIsLoading(false), 300); // Temps de chargement en millisecondes

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: "1000px",
        margin: "auto",
        fontFamily: "Georgia, serif",
        border: "3px solid #3f51b5",
        borderRadius: "20px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f0f4ff",
        opacity: isLoading ? 0.5 : 1,  // Ajuster l'opacité pendant le chargement
        transition: "opacity 0.3s ease" // Animation de la transition
        
      }}
    >
      <button onClick={handleReturnToHistory}>Retour</button>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {bookData.title}
      </Typography>
         {/* Section Title */}
         <Typography variant="h5" color="secondary" gutterBottom sx={{ textAlign: "center",color:"red" }}>
          {currentSectionData.title}
        </Typography>

      {/* Grille avec 2 lignes et 2 colonnes */}
      <Grid container spacing={0}>
        {/* Première section : Image 1 à gauche et Texte 1 à droite */}
        <Grid item xs={6} sx={{ padding: 0 }}>
          <Box
            component="img"
            src={imageMap[currentSectionData.images[0]]}
            alt="Illustration 1"
            sx={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 2 }}
          />
          
        </Grid>
        <Grid item xs={6} sx={{ padding: 2, textAlign: "justify" }}>
          <Typography variant="body1" sx={{ fontSize: "20px", lineHeight: 1.8 }}>
            {textPart1.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Typography>
        </Grid>

        {/* Deuxième section : Texte 2 à gauche et Image 2 à droite */}
        <Grid item xs={6} sx={{ padding: 2, textAlign: "justify" }}>
          <Typography variant="body1" sx={{ fontSize: "20px", lineHeight: 1.8 }}>
            {textPart2.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ padding: 0 }}>
          <Box
            component="img"
            src={imageMap[currentSectionData.images[1]]}
            alt="Illustration 2"
            sx={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 2 }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 4 }}>
        <Button variant="contained" color="warning" onClick={handlePreviousSection} disabled={currentSection === 0}>
          👈 Précédent
        </Button>
        <Button variant="contained" color="info" onClick={handlePlayAudio}>
          🎵 Écouter l'audio
        </Button>
        <Button variant="contained" color="error" onClick={handleStopAudio}>
          ✋ Arrêter la lecture
        </Button>
        <Button variant="contained" color="success" onClick={handleNextSection} disabled={currentSection === bookData.sections.length - 1}>
          👉 Suivant
        </Button>
      </Box>
      <QuizComponentBucheron></QuizComponentBucheron>
    </Box>
  );
};

export default InteractiveBookBucheron;