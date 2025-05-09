// src/ReadingLevelsComponent.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Alert
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import HearingIcon from '@mui/icons-material/Hearing'; // Icon for listening section
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Icon for reading section
import BorderColorIcon from '@mui/icons-material/BorderColor'; // Icon for exercise section

// Import the data from the JSON file
import readingData from './data.json';
// Import the syllable exercise component
import SyllableExercise from './SyllableExercise';

const ReadingLevelsComponent = () => {
  const [selectedLevel, setSelectedLevel] = useState('debutant'); // Default level
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false); // To show loading state
  const [audioError, setAudioError] = useState(null); // To show audio errors
  const audioRef = useRef(null); // Ref to control the audio element

  // Get data for the currently selected level
  const currentLevelData = readingData[selectedLevel];

  // Handler for changing tabs
  const handleTabChange = useCallback((event, newValue) => {
    setSelectedLevel(newValue);
    // Stop and reset audio when changing tabs
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoadingAudio(false); // Reset loading state
    setAudioError(null); // Reset error state
  }, []); // No dependencies needed as it uses state setters

  // --- Audio Control ---
  const togglePlayPause = () => {
      if (!audioRef.current || !currentLevelData.audioSrc) return;

      if (isPlaying) {
          audioRef.current.pause();
      } else {
          setIsLoadingAudio(true); // Show loading before play attempt
          setAudioError(null); // Clear previous errors
          audioRef.current.play()
              .then(() => {
                  // Success
                  setIsLoadingAudio(false);
                  setIsPlaying(true); // Set isPlaying only after successful play start
              })
              .catch(error => {
                  console.error("Error playing audio:", error);
                  setAudioError("Impossible de charger ou lire l'audio. Vérifiez le fichier ou les permissions.");
                  setIsLoadingAudio(false);
                  setIsPlaying(false); // Ensure isPlaying is false on error
              });
      }
      // We set isPlaying state *inside* the promise for play(),
      // but we can set it immediately for pause().
      if (isPlaying) {
          setIsPlaying(false);
      }
  };

  // Update state when audio naturally ends
  const handleAudioEnd = useCallback(() => {
      setIsPlaying(false);
      setIsLoadingAudio(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset time for potential replay
      }
  }, []);

   // Handle audio loading states
   const handleCanPlay = useCallback(() => {
      // Can potentially hide a loader here if needed, but play() promise handles it better
   }, []);

   const handleError = useCallback((e) => {
       console.error("Audio Element Error:", e);
       setAudioError("Erreur lors du chargement du fichier audio.");
       setIsLoadingAudio(false);
       setIsPlaying(false);
   }, []);


  // Effect to setup audio element and listeners when level (and thus audioSrc) changes
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      // Add listeners
      audioElement.addEventListener('ended', handleAudioEnd);
      audioElement.addEventListener('canplay', handleCanPlay);
      audioElement.addEventListener('error', handleError);

      // Cleanup listeners on component unmount or when audioSrc changes
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnd);
        audioElement.removeEventListener('canplay', handleCanPlay);
         audioElement.removeEventListener('error', handleError);
      };
    }
  }, [handleAudioEnd, handleCanPlay, handleError]); // Depend on the memoized handlers


  // Effect to load new audio source when selectedLevel changes
  useEffect(() => {
     if (audioRef.current && currentLevelData?.audioSrc) {
          setIsLoadingAudio(true); // Indicate loading when src changes
          setAudioError(null); // Clear old errors
          audioRef.current.src = currentLevelData.audioSrc;
          audioRef.current.load(); // Important: explicitly load the new source
          setIsLoadingAudio(false); // Assume load starts quickly, play() promise handles actual readiness
     } else {
          setIsLoadingAudio(false); // No audio src, not loading
     }
  }, [selectedLevel, currentLevelData?.audioSrc]); // Rerun when level or audioSrc changes


  if (!currentLevelData) {
    return <Container><Typography>Niveau non trouvé.</Typography></Container>; // Should not happen with default state
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}> {/* Overflow hidden for potential border radius issues */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'primary.main' }}>
          <Tabs
            value={selectedLevel}
            onChange={handleTabChange}
            aria-label="Niveaux de lecture"
            variant="fullWidth"
            indicatorColor="secondary" // Use secondary color for indicator
             textColor="inherit" // Inherit (white) from background
             sx={{
                '& .MuiTab-root': { color: 'white', opacity: 0.8 }, // Style inactive tabs
                 '& .Mui-selected': { color: 'white', opacity: 1, fontWeight: 'bold' }, // Style active tab
            }}
          >
            {/* Dynamically create tabs from data keys */}
            {Object.keys(readingData).map(levelKey => (
                <Tab
                    key={readingData[levelKey].id}
                    label={readingData[levelKey].label}
                    value={readingData[levelKey].id}
                />
            ))}
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box p={{ xs: 2, sm: 3 }}> {/* Responsive padding */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
            {currentLevelData.title}
          </Typography>

           {/* --- Audio Player Section (Conditional) --- */}
          {currentLevelData.audioSrc && (
            <Box mb={3} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'grey.100' }}>
               <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                 <HearingIcon sx={{ mr: 1 }} /> Écouter le texte
               </Typography>
               <Box display="flex" alignItems="center">
                    <IconButton onClick={togglePlayPause} color="primary" aria-label={isPlaying ? "Mettre en pause" : "Lire l'audio"} disabled={isLoadingAudio}>
                         {isLoadingAudio ? <CircularProgress size={24} /> : (isPlaying ? <PauseCircleOutlineIcon fontSize="large" /> : <PlayCircleOutlineIcon fontSize="large" />)}
                    </IconButton>
                    <VolumeUpIcon sx={{ ml: 1, mr: 1, color: 'action.active' }} />
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                         {isLoadingAudio ? "Chargement..." : (isPlaying ? "Lecture en cours..." : "Prêt à écouter")}
                    </Typography>
               </Box>
                {audioError && <Alert severity="error" sx={{mt: 1}}>{audioError}</Alert>}
               {/* Hidden HTML Audio element - preload="metadata" is good practice */}
               <audio ref={audioRef} src={currentLevelData.audioSrc} preload="metadata" style={{ display: 'none' }}></audio>
            </Box>
          )}

            {/* --- Text Section --- */}
           <Box mb={3} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <MenuBookIcon sx={{ mr: 1 }} /> Texte à lire
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, p: 1 }}>
                    {currentLevelData.text}
                </Typography>
           </Box>


          {/* --- Comprehension Questions Section --- */}
          {currentLevelData.questions && currentLevelData.questions.length > 0 && (
            <Box mb={3} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <QuestionAnswerIcon sx={{ mr: 1 }} /> Questions de Compréhension
                </Typography>
                <List dense sx={{ pl: 2 }}>
                {currentLevelData.questions.map((q, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{minWidth: '30px'}}>
                            <Typography sx={{color: 'secondary.main', fontWeight:'bold'}}>{index + 1}.</Typography>
                    </ListItemIcon>
                    <ListItemText primary={q} />
                    </ListItem>
                ))}
                </List>
            </Box>
           )}

          {/* --- Syllable Exercise Section (Conditional) --- */}
          {currentLevelData.syllableWords && currentLevelData.syllableWords.length > 0 && (
             <Box mb={3} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'grey.50' }}>
                 <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                     <BorderColorIcon sx={{ mr: 1 }} /> Exercice : Former les mots
                 </Typography>
                 {/* Pass the syllable words array to the dedicated component */}
                 <SyllableExercise wordsData={currentLevelData.syllableWords} />
             </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ReadingLevelsComponent;