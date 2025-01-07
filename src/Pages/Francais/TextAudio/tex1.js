


import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import bookData from "./text-level-3.json";
import { useNavigate } from "react-router-dom"; // Import de useNavigate

import audioParagraph1 from "./présentation_des_papillons_et_de_leur_amitié.mp3";
import audioParagraph2 from "./le_début_de_la_pluie_et_la_quête_d'abri.mp3";
import audioParagraph3 from "./la_demande_au_lis_blanc.mp3";
import audioParagraph4 from "./la_demande_à_la_rose.mp3";
import audioParagraph5 from "./la_demande_à_la_tulipe.mp3";
import audioParagraph6 from "./l’intervention_du_soleil_et_la_fin_de_la_pluie.mp3";
import audioParagraph7 from "./le_retour_à_la_joie.mp3";
import image1 from "./JOURNÉ ENSOLEILLÉ.finpng.png";
import image2 from "./Pluie.png";
import image3 from "./papillon2.png";
import image4 from "./papillon3.png";
import image5 from "./tulipe.png";
import image6 from "./soleil.png";
import image7 from "./Pipillondebut.png";
//import { Height } from "@mui/icons-material";



const audioMap = {
  audio_paragraph1: audioParagraph1,
  audio_paragraph2: audioParagraph2,
  audio_paragraph3: audioParagraph3,
  audio_paragraph4: audioParagraph4,
  audio_paragraph5: audioParagraph5,
  audio_paragraph6: audioParagraph6,
  audio_paragraph7: audioParagraph7,
};

const imageMap = {
  three_butterflies_playing: image1,
  butterflies_in_rain: image2,
  red_butterfly_and_lily: image3,
  butterflies_asking_rose: image4,
  yellow_butterfly_and_tulip: image5,
  sun_shining_on_butterflies: image6,
  butterflies_dancing_in_sun: image7,
};


const InteractiveBook = () => {
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
          height:"400px",
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
        float:"left",
        width: "100%", // L'image prend la largeur maximale de son conteneur
        maxWidth: "250px", // Limite la taille de l'image à 250px
        height: "250px", // Maintient l'aspect ratio de l'image
        objectFit: "cover", // Assure que l'image couvre bien l'espace disponible
        margin:"20px",
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
            margin:"50px",
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

export default InteractiveBook;

