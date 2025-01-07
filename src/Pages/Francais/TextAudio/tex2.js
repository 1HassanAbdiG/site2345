import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import bookData from "./Tex2.json";

import audioParagraph1 from "./Chapitre1.mp3";
import audioParagraph2 from "./Chapitre2.mp3";
import audioParagraph3 from "./Chapitre3.mp3";
import audioParagraph4 from "./Chapitre4.mp3";

import image1 from "./lapin1.png";
import image2 from "./rencontrelouplapin2.png";
import image3 from "./lapin3.png";
import image4 from "./foret tranquille.png";

const audioMap = {
  audio_chapter1: audioParagraph1,
  audio_chapter2: audioParagraph2,
  audio_chapter3: audioParagraph3,
  audio_chapter4: audioParagraph4,
};

const imageMap = {
  leo_forest_edge: image1,
  leo_meets_wolf: image2,
  wolf_and_leo_find_chest: image3,
  forest_celebration: image4,
};

const InteractiveBook1 = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);

  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleNextSection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentSection < bookData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
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
    // Stop the audio when returning to history
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // Reset the audio to start from the beginning
  }

  // Navigate to the history page

    navigate("/francais/histoire"); // Redirige vers /francais/histoire
  };



  return (
    <Box sx={{ padding: 4, maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
       <button onClick={handleReturnToHistory}>
        Retour 
      </button>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {bookData.title}
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "block",
          backgroundColor: "#FFF8E1",
          borderRadius: 2,
          boxShadow: 4,
          padding: 2,
        }}
      >
        {/* Section Title */}
        <Typography
          variant="h5"
          color="secondary"
          gutterBottom
          sx={{ textAlign: "center", marginBottom: 2 }}
        >
          {bookData.sections[currentSection].title}
        </Typography>

        {/* Image */}
        <Box
          component="img"
          src={imageMap[bookData.sections[currentSection].image]}
          alt="Illustration"
          sx={{
            float: "left",
            width: "250px", // Uniform width
            height: "250px", // Uniform height
            objectFit: "cover", // Ensures image fits nicely
            marginRight: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        />

        {/* Text */}
        <Typography
          variant="body1"
          color="textPrimary"
          sx={{
            fontSize: "18px",
            lineHeight: 1.8,
            textAlign: "justify",
          }}
        >
          {bookData.sections[currentSection].text}
        </Typography>
      </Box>

      {/* Button Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 4 }}>
        <Button
          variant="contained"
          color="warning"
          onClick={handlePreviousSection}
          disabled={currentSection === 0}
        >
          👈 Précédent
        </Button>
        <Button variant="contained" color="info" onClick={handlePlayAudio}>
          🎵 Écouter l'audio
        </Button>
        <Button variant="contained" color="error" onClick={handleStopAudio}>
          ✋ Arrêter la lecture
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleNextSection}
          disabled={currentSection === bookData.sections.length - 1}
        >
          👉 Suivant
        </Button>
      </Box>
    </Box>
  );
};

export default InteractiveBook1;
