import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import plantLessonData from "./lecturePlante.json"; // Import the plant JSON data

// Import audio files for the plant lesson (10 sections)
import audioPlanteFleur from "./audio/plante_fleur_audio.mp3";
import audioPlanteFeuille from "./audio/plante_feuille_audio.mp3";
import audioPlanteFruit from "./audio/plante_fruit_audio.mp3";
import audioPlanteTige from "./audio/plante_tige_audio.mp3";
import audioPlanteRacines from "./audio/plante_racines_audio.mp3";
import audioPlanteSol from "./audio/plante_sol_audio.mp3";
import audioBesoinEau from "./audio/plante_besoin_eau_audio.mp3";
import audioBesoinAir from "./audio/plante_besoin_air_audio.mp3";
import audioBesoinSoleil from "./audio/plante_besoin_soleil_audio.mp3";
import audioBesoinTemperature from "./audio/plante_besoin_temperature_audio.mp3";

// Import image files for the plant lesson (10 sections)
// Ensure these paths and file extensions are correct
import imagePlanteFleur from "./images/plante_fleur.png";
import imagePlanteFeuille from "./images/plante_feuille.png";
import imagePlanteFruit from "./images/plante_fruit.png";
import imagePlanteTige from "./images/plante_tige.png";
import imagePlanteRacines from "./images/plante_racines.png";
import imagePlanteSol from "./images/plante_sol.png";
import imageBesoinEau from "./images/plante_besoin_eau.png";
import imageBesoinAir from "./images/plante_besoin_air.png";
import imageBesoinSoleil from "./images/plante_besoin_soleil.png";
import imageBesoinTemperature from "./images/plante_besoin_temperature.png";

import QuizComponent from "./QuizComponent"; // Assuming this is a generic quiz or will be adapted

const audioMap = {
  "plante_fleur_audio": audioPlanteFleur,
  "plante_feuille_audio": audioPlanteFeuille,
  "plante_fruit_audio": audioPlanteFruit,
  "plante_tige_audio": audioPlanteTige,
  "plante_racines_audio": audioPlanteRacines,
  "plante_sol_audio": audioPlanteSol,
  "plante_besoin_eau_audio": audioBesoinEau,
  "plante_besoin_air_audio": audioBesoinAir,
  "plante_besoin_soleil_audio": audioBesoinSoleil,
  "plante_besoin_temperature_audio": audioBesoinTemperature,
};

const imageMap = {
  "plante_fleur": imagePlanteFleur,
  "plante_feuille": imagePlanteFeuille,
  "plante_fruit": imagePlanteFruit,
  "plante_tige": imagePlanteTige,
  "plante_racines": imagePlanteRacines,
  "plante_sol": imagePlanteSol,
  "plante_besoin_eau": imageBesoinEau,
  "plante_besoin_air": imageBesoinAir,
  "plante_besoin_soleil": imageBesoinSoleil,
  "plante_besoin_temperature": imageBesoinTemperature,
};

const PlantLesson = () => { // Renamed component
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);

  const handleNextSection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentSection < plantLessonData.sections.length - 1) {
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
    // Use the 'audio' key from the current section to find the audio file in audioMap
    const audioKey = plantLessonData.sections[currentSection].audio;
    if (audioMap[audioKey]) {
      const audio = new Audio(audioMap[audioKey]);
      audioRef.current = audio;
      audio.play();
    } else {
      console.error("Audio file not found for key:", audioKey);
    }
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
    // Navigation logic would go here if useNavigate was active
    console.log("Return to history clicked");
  };

  // Get the current section data
  const sectionData = plantLessonData.sections[currentSection];
  const imageKey = sectionData.image;

  return (
    <Box sx={{ // sx prop for the root Box
      padding: 4,
      // height: "1600px", // Consider making height dynamic or removing fixed height
      margin: "auto",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // justifyContent: "center", // Centering might not be ideal if content is long
    }}>
      <button onClick={handleReturnToHistory}>
        Retour
      </button>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {plantLessonData.title} {/* Use plantLessonData */}
      </Typography>

      <Box
        sx={{
        //   height: "400px", // Content might exceed this, consider minHeight or dynamic height
          minHeight: "400px",
          width: "100%", // Make it responsive
          maxWidth: "800px", // Limit max width for better readability
          position: "relative",
          display: "block",
          backgroundColor: "#FFF8E1", // Light cream background
          borderRadius: 2,
          boxShadow: 4,
          padding: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          mt: 2, mb: 2 // Margin top and bottom
        }}
      >
        <Typography
          variant="h4"
          color="secondary"
          gutterBottom
          sx={{ textAlign: "center", marginBottom: 2 }}
        >
          {sectionData.title}
        </Typography>

        <Box
          component="img"
          src={imageMap[imageKey]} // Use imageKey to get image from imageMap
          alt={`Illustration pour ${sectionData.title}`}
          sx={{
            float: { sm: "left" }, // Float left on small screens and up
            width: "100%",
            maxWidth: { xs: "80%", sm: "250px" }, // Responsive max width
            maxHeight: "300px", // Limit image height
            height: "auto",
            objectFit: "contain", // Use contain to see the whole image
            margin: { xs: "0 auto 16px auto", sm: "0 20px 10px 0" }, // Responsive margin
            borderRadius: 2,
            boxShadow: 3,
            display: "block", // Ensure it's a block for auto margins
          }}
        />

        <Typography
          variant="body1"
          color="textPrimary"
          sx={{
            textAlign: "justify",
            // margin: "50px", // Removed fixed margin, padding is on parent
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" }, // Responsive font size
            lineHeight: 1.8,
            // Clearfix for floated image
            overflow: "hidden", // This will contain the floated image's space
          }}
        >
          {sectionData.text
            .split('\n')
            .map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, marginTop: 4, width: "100%", maxWidth: "800px" }}>
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
          ✋ Arrêter
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleNextSection}
          disabled={currentSection === plantLessonData.sections.length - 1}
        >
          👉 Suivant
        </Button>
      </Box>
      <Box sx={{mt: 4, width: "100%", maxWidth: "800px"}}>
        <QuizComponent />
      </Box>
    </Box>
  );
};

export default PlantLesson; // Export renamed component