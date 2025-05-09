// src/ReadingLevelsComponent.js
import React, { useState, useRef } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'; // Placeholder icon for exercise section

import { readingData } from './data'; // Import the data
import SyllableExercise from './syllab'; // Import the syllable component

const ReadingLevelsComponent = () => {
  const [selectedLevel, setSelectedLevel] = useState('debutant');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Ref to control the audio element

  const currentLevelData = readingData[selectedLevel];

  const handleTabChange = (event, newValue) => {
    setSelectedLevel(newValue);
    // Stop audio when changing tabs
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset time
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
      if (!audioRef.current) return;

      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play().catch(error => console.error("Error playing audio:", error)); // Added catch for browser policy errors
      }
      setIsPlaying(!isPlaying);
  }

  // Listen to audio ending to reset the play button
  const handleAudioEnd = () => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset time
      }
  }

  // Use effect to add/remove event listener for audio ending
  React.useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
        audioElement.addEventListener('ended', handleAudioEnd);
        // Clean up listener
        return () => {
            audioElement.removeEventListener('ended', handleAudioEnd);
        };
    }
  }, [audioRef.current]); // Rerun if audioRef changes (relevant if conditionally rendered)


  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedLevel}
            onChange={handleTabChange}
            aria-label="Niveaux de lecture"
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={readingData.debutant.label} value="debutant" />
            <Tab label={readingData.intermediaire.label} value="intermediaire" />
            <Tab label={readingData.avance.label} value="avance" />
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box p={3}>
          <Typography variant="h5" component="h2" gutterBottom>
            {currentLevelData.title}
          </Typography>

           {/* Audio Player (Conditional) */}
          {currentLevelData.audioSrc && (
            <Box display="flex" alignItems="center" mb={2} p={1} sx={{ border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f5f5f5'}}>
               <IconButton onClick={togglePlayPause} color="primary" aria-label={isPlaying ? "Pause" : "Lire l'audio"}>
                    {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
                </IconButton>
                <VolumeUpIcon sx={{ mr: 1, color: 'action.active' }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary'}}>
                Écouter le texte
              </Typography>
              {/* Hidden HTML Audio element */}
              <audio ref={audioRef} src={currentLevelData.audioSrc} preload="metadata"></audio>
            </Box>
          )}

          {/* Text */}
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3, lineHeight: 1.7 }}>
            {currentLevelData.text}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Comprehension Questions */}
          <Box mb={3}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <QuestionAnswerIcon sx={{ mr: 1 }} color="action" /> Questions de Compréhension
            </Typography>
            <List dense>
              {currentLevelData.questions.map((q, index) => (
                <ListItem key={index} disablePadding>
                   <ListItemIcon sx={{minWidth: '30px'}}>
                        <Typography sx={{color: 'primary.main', fontWeight:'bold'}}>{index + 1}.</Typography>
                   </ListItemIcon>
                  <ListItemText primary={q} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Syllable Exercise (Conditional) */}
          {currentLevelData.syllableWords && currentLevelData.syllableWords.length > 0 && (
             <>
               <Divider sx={{ my: 3 }} />
                <Box>
                     <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                       <DragIndicatorIcon sx={{ mr: 1 }} color="action" /> Exercice de Syllabes
                     </Typography>
                     <SyllableExercise wordsData={currentLevelData.syllableWords} />
                 </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ReadingLevelsComponent;