


import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import bookData from "./sens.json";
//import { useNavigate } from "react-router-dom"; // Import de useNavigate

import audioParagraph1 from "./1.mp3";
import audioParagraph2 from "./2.mp3";
import audioParagraph3 from "./3.mp3";
import audioParagraph4 from "./4.mp3";
import audioParagraph5 from "./5.mp3";


import image1 from "./1.png";
import image2 from "./1.png";
import image3 from "./1.png";
import image4 from "./1.png";
import image5 from "./1.png";

import QuizComponent from "./QuizComponent";


//import { Height } from "@mui/icons-material";



const audioMap = {
  1: audioParagraph1,
  2: audioParagraph2,
  3: audioParagraph3,
  4: audioParagraph4,
  5: audioParagraph5,

};

const imageMap = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,


};


const Organedesens = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);


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
          variant="h4"

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
            height: "300px", // Maintient l'aspect ratio de l'image
            objectFit: "cover", // Assure que l'image couvre bien l'espace disponible
            margin: "20px",
            borderRadius: 2,
            boxShadow: 3,
            marginBottom: 2,
          }}
        />



        <Typography
          variant="body1"
          color="textPrimary"
          sx={{
            textAlign: "justify",
            margin: "50px",
            fontSize: "30px",
            lineHeight: 1.8,
          }}
        >
          {bookData.sections[currentSection].text
            .split('\n') // Sépare le texte à chaque '\n'
            .map((line, index) => (
              <span key={index}>
                {line}
                <br /> {/* Affiche un saut de ligne HTML */}
              </span>
            ))}
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
      <QuizComponent></QuizComponent>
    </Box>
  );
};

export default Organedesens ;

