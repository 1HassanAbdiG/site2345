import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import bookData from "../text10.json";
import { useNavigate } from "react-router-dom";

import audioParagraph1 from "./Le petit lapin.mp3";
import audioParagraph2 from "./Le petit lapin partage.mp3";
import audioParagraph3 from "./Le petit cheval.mp3";
import audioParagraph4 from "./Le mouton.mp3";
import audioParagraph5 from "./Le chevreuil.mp3";
import audioParagraph6 from "./Le retour de la carotte.mp3";
import audioParagraph7 from "./Les bons amis.mp3";

import image1 from "./1.png";
import image2 from "./2.png";
import image3 from "./3.png";
import image4 from "./4.png";
import image5 from "./5.png";
import image6 from "./6.png";
import image7 from "./7.png";

const audioMap = {
  audio_lapin: audioParagraph1,
  audio_partage: audioParagraph2,
  audio_cheval: audioParagraph3,
  audio_mouton: audioParagraph4,
  audio_chevreuil: audioParagraph5,
  audio_retour_carotte: audioParagraph6,
  audio_bons_amis: audioParagraph7,
};

const imageMap = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
  6: image6,
  7: image7,
};

const InteractiveBook7 = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigate("/francais/histoire");
  };

  return (
    <Box
      sx={{
        padding: 4,
        height: "100%",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <button onClick={handleReturnToHistory} style={{ marginBottom: "20px" }}>
        Retour
      </button>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {bookData.title}
      </Typography>

      <Box
        sx={{
          width: "80%",
          position: "relative",
          display: "block",
          backgroundColor: "#FFF8E1",
          borderRadius: 2,
          boxShadow: 4,
          padding: 4,
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h5"
          color="secondary"
          gutterBottom
          sx={{ textAlign: "center", marginBottom: 2 }}
        >
          {bookData.sections[currentSection].title}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding:"10px",
              alignItems: "center",
              textAlign: "left",
              backgroundColor: "#CADE34",
            }}
          >
            <Box
              component="img"
              src={imageMap[bookData.sections[currentSection].image1]}
              alt="Illustration 1"
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
                marginBottom: 2,
              }}
            />
            {bookData.sections[currentSection].text.slice(0, Math.ceil(bookData.sections[currentSection].text.length / 2)).map((line, index) => (
              <React.Fragment key={index}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{
                    fontSize: "18px",
                    lineHeight: 1.8,
                    marginBottom: 1,
                  }}
                >
                  {line}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding:"10px",
              alignItems: "center",
              textAlign: "left",
              backgroundColor: "#CADE34",
            }}
          >
            <Box
              component="img"
              src={imageMap[bookData.sections[currentSection].image2]}
              alt="Illustration 2"
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
                marginBottom: 2,
              }}
            />
            {bookData.sections[currentSection].text.slice(Math.ceil(bookData.sections[currentSection].text.length / 2)).map((line, index) => (
              <React.Fragment key={index}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{
                    fontSize: "18px",
                    lineHeight: 1.8,
                    marginBottom: 1,
                  }}
                >
                  {line}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>

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

export default InteractiveBook7;
