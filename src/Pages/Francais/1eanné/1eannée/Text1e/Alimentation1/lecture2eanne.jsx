import React, { useState, useRef } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import bookData from "./aliment.json";
import audioParagraph1 from "./1.mp3";
import audioParagraph2 from "./21.mp3";
import audioParagraph3 from "./3.mp3";
import audioParagraph4 from "./4.mp3";
import image1 from "./1.jpg";
import image2 from "./21.jpg";
import image3 from "./3.jpg";
import image4 from "./5.jpg";
import QuizComponent2 from "./QuizComponent2";


const audioMap = {
  1: audioParagraph1,
  21: audioParagraph2,
  3: audioParagraph3,
  4: audioParagraph4,
};

const imageMap = {
  1: image1,
  21: image2,
  3: image3,
  4: image4,
};

export default function AlimentLecture() {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);

  const handleNextSection = () => {
    pauseAudio();
    if (currentSection < bookData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    pauseAudio();
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handlePlayAudio = () => {
    pauseAudio();
    const audio = new Audio(audioMap[bookData.sections[currentSection].audio]);
    audioRef.current = audio;
    audio.play();
  };

  const handleStopAudio = () => {
    pauseAudio();
  };

  const handleReturnToHistory = () => {
    pauseAudio();
  };

  return (
    <div>
    <Box
      sx={{
        padding: 4,
        height: "100vh",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #FFDEE9, #B5FFFC)", // Background gradient
      }}
    >
      <Button onClick={handleReturnToHistory} variant="outlined" color="primary" sx={{ marginBottom: 2 }}>
        Retourrrr
      </Button>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {bookData.title}
      </Typography>

      <Box
        sx={{
          height: "550px",
          position: "relative",
          backgroundColor: "#FFF8E1",
          borderRadius: 2,
          boxShadow: 4,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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

        {/* Grid to align image and text */}
        <Grid container spacing={1}>
          
            <Box
              component="img"
              src={imageMap[bookData.sections[currentSection].image]}
              alt="Illustration"
              sx={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
          </Grid>
         
      </Box>

      {/* Button Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 4 }}>
        <Button
          variant="contained"
          color="warning"
          onClick={handlePreviousSection}
          disabled={currentSection === 0}
          sx={{ "&:hover": { backgroundColor: "#e5a300" } }} // Hover effect
        >
          👈 Précédent
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handlePlayAudio}
          sx={{ "&:hover": { backgroundColor: "#0091ea" } }} // Hover effect
        >
          🎵 Écouter l'audio
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleStopAudio}
          sx={{ "&:hover": { backgroundColor: "#d50000" } }} // Hover effect
        >
          ✋ Arrêter la lecture
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleNextSection}
          disabled={currentSection === bookData.sections.length - 1}
          sx={{ "&:hover": { backgroundColor: "#00c853" } }} // Hover effect
        >
          👉 Suivant
        </Button>
      </Box>
     
    </Box>
    <Box>
         <QuizComponent2></QuizComponent2>

    </Box>


    </div>
    
  );
};

