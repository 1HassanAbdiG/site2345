


import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import bookData from "../tex5.json";
import { useNavigate } from "react-router-dom"; // Import de useNavigate

import audioParagraph1 from "./Chapitre1.mp3";
import audioParagraph2 from "./Chapitre2.mp3";
import audioParagraph3 from "./Chapitre3.mp3";
import audioParagraph4 from "./Chapitre4.mp3";


import image1 from "./1.png";
import image2 from "./2.png";
import image3 from "./3.png";
import image4 from "./4.png";


//import { Height } from "@mui/icons-material";



const audioMap = {
  audio_chapter1: audioParagraph1,
  audio_chapter2: audioParagraph2,
  audio_chapter3: audioParagraph3,
  audio_chapter4: audioParagraph4,
 

};

const imageMap = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,

  

};


const InteractiveBook5 = () => {
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
    <Box x={{
      padding: 4,

      height: "1600px",
      margin: "auto",
      fontFamily: "Arial, sans-serif",
      display: "flex", // Permet de gérer l'espacement et l'alignement du contenu
      flexDirection: "column", // Pour empiler verticalement l'image et le texte
      alignItems: "center", // Centrer le contenu
      justifyContent: "center", // Centrer le contenu verticalement
    }}>
      <button onClick={handleReturnToHistory}>
        Retour
      </button>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {bookData.title}
      </Typography>

      <Box
        sx={{
          height: "400px",
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
            width: "100%", // L'image prend la largeur maximale de son conteneur
            maxWidth: "250px", // Limite la taille de l'image à 250px
            height: "250px", // Maintient l'aspect ratio de l'image
            objectFit: "cover", // Assure que l'image couvre bien l'espace disponible
            margin: "20px",
            borderRadius: 2,
            boxShadow: 3,
            marginBottom: 2,
          }}
        />



        {/* Text */}
        <Typography
          variant="body1"
          color="textPrimary"
          sx={{
            textAlign: "justify",
            margin: "50px",
            fontSize: "18px",
            lineHeight: 1.8,
           
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

export default InteractiveBook5;

