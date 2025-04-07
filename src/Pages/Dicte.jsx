import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Paper, Typography, List, ListItem, ListItemText,
  IconButton, TextField, CircularProgress, Alert, Divider, Chip,
  Grid, Tooltip, Stack, useTheme, ListItemIcon,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import RepeatIcon from '@mui/icons-material/Repeat';
import HistoryIcon from '@mui/icons-material/History';
import MicIcon from '@mui/icons-material/Mic';
import { alpha } from '@mui/material/styles';

// ASSUREZ-VOUS QUE CE CHEMIN EST CORRECT
import dictationsData from './dicteee.json';

const TARGET_VOICE_NAME = "Microsoft Denise Online (Natural) - French (France)";
const LOCAL_STORAGE_KEY = 'dictationScoresData';

const DictationComponent = () => {
  const theme = useTheme();
  // ... (tous vos états useState restent les mêmes) ...
  const [allDictations] = useState(dictationsData.dictees || []);
  const [selectedDictationIndex, setSelectedDictationIndex] = useState(-1);
  const [wordList, setWordList] = useState([]);
  const [phase, setPhase] = useState('selection');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [dictatedWords, setDictatedWords] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(true);
  const [scoresData, setScoresData] = useState({});
  const [lastAttemptScore, setLastAttemptScore] = useState(null);


  // ... (useEffect et fonctions useCallback restent les mêmes) ...
  // --- Load/Save Scores ---
   useEffect(() => { /* ... (code inchangé) ... */ try { const stored = localStorage.getItem(LOCAL_STORAGE_KEY); if (stored) { const parsed = JSON.parse(stored); const validated = {}; for (const key in parsed) { if (Object.hasOwnProperty.call(parsed, key)) { const value = parsed[key]; if (typeof value === 'object' && value !== null && 'bestScore' in value && 'attempts' in value) { validated[key] = value; } else if (typeof value === 'number') { validated[key] = { bestScore: value, attempts: 1 }; } } } setScoresData(validated); } } catch (e) { console.error(e); } }, []);
   useEffect(() => { /* ... (code inchangé) ... */ try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scoresData)); } catch (e) { console.error(e); } }, [scoresData]);

   // --- Load/Select Voice ---
   const loadAndSelectVoice = useCallback(() => { /* ... (code inchangé) ... */ if (!('speechSynthesis' in window)) { setSpeechError("TTS non supportée."); setVoiceLoading(false); return; } const voices = window.speechSynthesis.getVoices(); if (voices.length > 0) { let found = voices.find(v => v.name === TARGET_VOICE_NAME && v.lang.startsWith('fr')) || voices.find(v => v.lang === 'fr-FR' && v.default) || voices.find(v => v.lang === 'fr-FR') || voices.find(v => v.lang.startsWith('fr')); if (found) { setSelectedVoice(found); console.log("Voix:", found.name); } else { setSpeechError("Voix FR non trouvée."); console.warn("Voix FR non trouvée."); } setVoiceLoading(false); } }, []);
   useEffect(() => { window.speechSynthesis.onvoiceschanged = loadAndSelectVoice; loadAndSelectVoice(); return () => { window.speechSynthesis.onvoiceschanged = null; }; }, [loadAndSelectVoice]);

   // --- Update wordList ---
   useEffect(() => { /* ... */ if (selectedDictationIndex >= 0 && allDictations[selectedDictationIndex]) setWordList(allDictations[selectedDictationIndex].words || []); else setWordList([]); }, [selectedDictationIndex, allDictations]);

   // --- Speak Function ---
   const speakWord = useCallback((text) => { /* ... */ if (!('speechSynthesis' in window) || isSpeaking || !selectedVoice) { if (!selectedVoice && !voiceLoading) setSpeechError("Voix indisponible."); return; } setSpeechError(''); setIsSpeaking(true); const utterance = new SpeechSynthesisUtterance(text); utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang; utterance.rate = 0.9; utterance.pitch = 1; utterance.onend = () => setIsSpeaking(false); utterance.onerror = (event) => { console.error('TTS Error:', event); setSpeechError(`Erreur TTS: ${event.error}`); setIsSpeaking(false); }; window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); }, [isSpeaking, selectedVoice, voiceLoading]);

   // --- Fonction de calcul de score ---
   const calculateScore = useCallback((currentWordList, currentDictatedWords) => { /* ... (code inchangé) ... */ if (!currentWordList || !currentDictatedWords || currentWordList.length !== currentDictatedWords.length) return 0; return currentDictatedWords.reduce((score, typedWord, index) => (typedWord && currentWordList[index] && typedWord.trim().toLowerCase() === currentWordList[index].toLowerCase() ? score + 1 : score), 0); }, []);

   // --- Event Handlers ---
   const handleDictationButtonClick = (index) => { /* ... */ setSelectedDictationIndex(index); setPhase('preparation'); setCurrentWordIndex(0); setUserInput(''); setDictatedWords([]); setSpeechError(''); setLastAttemptScore(null); };
   const handleStartDictation = () => { /* ... */ setPhase('dictation'); setCurrentWordIndex(0); setUserInput(''); setDictatedWords(new Array(wordList.length).fill('')); setLastAttemptScore(null); };
   const handleListenCurrentWord = () => { /* ... */ if (phase === 'dictation' && currentWordIndex < wordList.length) speakWord(wordList[currentWordIndex]); };
   const handleInputChange = (event) => { setUserInput(event.target.value); };

   const handleNextWord = () => { /* ... (code inchangé - la logique était déjà correcte ici) ... */ const currentInput = userInput; const newDictatedWords = [...dictatedWords]; if (currentWordIndex >= 0 && currentWordIndex < newDictatedWords.length) newDictatedWords[currentWordIndex] = currentInput; setDictatedWords(newDictatedWords); setUserInput(''); if (currentWordIndex < wordList.length - 1) { setCurrentWordIndex(prev => prev + 1); } else { const finalScore = calculateScore(wordList, newDictatedWords); setLastAttemptScore(finalScore); setScoresData(prevScoresData => { const currentData = prevScoresData[selectedDictationIndex] || { bestScore: 0, attempts: 0 }; const newAttempts = currentData.attempts + 1; const newBestScore = Math.max(currentData.bestScore, finalScore); return { ...prevScoresData, [selectedDictationIndex]: { bestScore: newBestScore, attempts: newAttempts } }; }); setPhase('finished'); } };

   const handleRestartDictation = () => { /* ... */ setPhase('preparation'); setCurrentWordIndex(0); setUserInput(''); setDictatedWords([]); setSpeechError(''); setIsSpeaking(false); window.speechSynthesis.cancel(); setLastAttemptScore(null); };
   const handleBackToSelection = () => { /* ... */ setSelectedDictationIndex(-1); setPhase('selection'); setCurrentWordIndex(0); setUserInput(''); setDictatedWords([]); setWordList([]); setSpeechError(''); setIsSpeaking(false); window.speechSynthesis.cancel(); setLastAttemptScore(null); };

  // --- Render Functions ---

  const renderSelectionPhase = () => (
       <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'medium', mb: 2 }}> Choisir une Dictée </Typography>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 3, minHeight: 40 }}>
                {/* ... (Affichage état voix inchangé) ... */}
                {voiceLoading && <CircularProgress size={24} />}
                {!voiceLoading && selectedVoice && ( <Tooltip title={`${selectedVoice.name} (${selectedVoice.lang})`}> <Chip icon={<MicIcon />} label="Voix Active" color="success" variant="outlined" size="small" /> </Tooltip> )}
                {!voiceLoading && !selectedVoice && ( <Chip icon={<CancelIcon />} label="Voix Indisponible" color="error" variant="outlined" size="small" /> )}
            </Stack>
            <Divider sx={{ mb: 2 }}><Typography variant="overline">Liste des Dictées</Typography></Divider>
            <Grid container spacing={{ xs: 1, sm: 1.5 }} justifyContent="center" sx={{ mb: 3 }}>
                {/* ... (Mapping boutons dictées inchangé) ... */}
                 {allDictations.map((dictation, index) => ( <Grid item key={index}> <Button variant="contained" color={index % 2 === 0 ? "primary" : "secondary"} /* ... styles ... */ onClick={() => handleDictationButtonClick(index)} disabled={voiceLoading || !selectedVoice} > {dictation.title.replace(/[^0-9]/g, '') || '?'} </Button> </Grid> ))}
            </Grid>
            {Object.keys(scoresData).length > 0 && (
                <>
                    <Divider sx={{ mb: 1 }}><HistoryIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /><Typography variant="overline">Historique</Typography></Divider>
                    <Paper variant="outlined" sx={{ maxHeight: 180, overflow: 'auto', p: 1, bgcolor: alpha(theme.palette.background.default, 0.7) }}>
                        <List dense disablePadding>
                            {/* ... (Affichage historique inchangé) ... */}
                             {Object.keys(scoresData).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(dictIndexStr => { const dictIndex = parseInt(dictIndexStr, 10); const dictation = allDictations[dictIndex]; const scoreData = scoresData[dictIndex]; const totalWords = dictation?.words?.length || 0; if (!dictation || !scoreData) return null; return ( <ListItem key={dictIndex} sx={{ py: 0.5 }}> <ListItemText primary={`${dictation.title}:`} secondary={ <Stack direction="row" spacing={1.5} alignItems="center"> <Chip icon={<StarIcon fontSize='inherit'/>} label={`${scoreData.bestScore} / ${totalWords}`} size="small" color="primary" variant='outlined' sx={{ fontWeight:'bold' }}/> <Chip icon={<RepeatIcon fontSize='inherit' />} label={`x ${scoreData.attempts}`} size="small" variant='outlined' color="info" /> </Stack> } primaryTypographyProps={{ variant: 'body2', mb: 0.5 }} sx={{ m: 0 }} /> </ListItem> ); })}
                        </List>
                    </Paper>
                </>
            )}
            {/* CORRECTION ESLint: Parenthèses ajoutées autour de la condition OR */}
            {(!allDictations || allDictations.length === 0) && (
                 <Alert severity="warning" sx={{ mt: 2 }}>Aucune dictée trouvée.</Alert>
            )}
       </Box>
  );

  // --- renderPreparationPhase (inchangé) ---
   const renderPreparationPhase = () => ( /* ... (code inchangé) ... */ <Box sx={{ px: { xs: 0, sm: 1 } }}> <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}> Préparation: Écoutez les mots </Typography> <List dense sx={{ maxHeight: { xs: 300, sm: 400 }, overflow: 'auto', mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, bgcolor: alpha(theme.palette.background.paper, 0.8) }}> {Array.isArray(wordList) && wordList.map((word, index) => ( <ListItem key={index} divider secondaryAction={ <Tooltip title="Écouter"> <IconButton edge="end" onClick={() => speakWord(word)} disabled={isSpeaking || !selectedVoice}> {isSpeaking ? <CircularProgress size={20} /> : <VolumeUpIcon color="primary" />} </IconButton> </Tooltip> } sx={{ '&:hover': { bgcolor: 'action.selected' } }} > <Chip label={index + 1} size="small" sx={{ mr: 1.5, bgcolor: theme.palette.background.default }}/> <ListItemText primary={word} /> </ListItem> ))} </List> <Divider sx={{ my: 2 }} /> <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center"> <Button variant="outlined" color="secondary" onClick={handleBackToSelection} startIcon={<ArrowBackIcon />} > Choisir une autre </Button> <Button variant="contained" onClick={handleStartDictation} startIcon={<PlayArrowIcon />} size="large" disabled={isSpeaking || wordList.length === 0 || !selectedVoice} sx={{ boxShadow: theme.shadows[3], width: { xs: '100%', sm: 'auto'} }} > Démarrer la Dictée </Button> </Stack> </Box> );

   // --- renderDictationPhase (inchangé) ---
   const renderDictationPhase = () => ( /* ... (code inchangé) ... */ wordList && <Box sx={{ textAlign: 'center', px: { xs: 0, sm: 1 } }}> <Chip label={`Mot ${currentWordIndex + 1} / ${wordList.length}`} color="primary" variant="filled" sx={{ mb: 2, fontWeight: 'medium', letterSpacing: 0.5 }} /> <Box sx={{ my: 3 }}> <Button variant="contained" color="secondary" size="large" onClick={handleListenCurrentWord} disabled={isSpeaking || !selectedVoice} startIcon={isSpeaking ? <CircularProgress size={20} color="inherit"/> : <VolumeUpIcon />} sx={{ borderRadius: '20px', px: 3 }} > Écouter </Button> </Box> <TextField fullWidth label={`Entrez le mot n° ${currentWordIndex + 1}`} variant="filled" value={userInput} onChange={handleInputChange} margin="normal" autoFocus disabled={isSpeaking} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); if(!isSpeaking) handleNextWord(); } }} sx={{ mb: 3, bgcolor: alpha(theme.palette.background.paper, 0.9) }} /> <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center"> <Button variant="outlined" color="secondary" onClick={handleBackToSelection} startIcon={<ArrowBackIcon />} sx={{ width: { xs: '100%', sm: 'auto'} }}> Choisir une autre </Button> <Button variant="contained" onClick={handleNextWord} endIcon={<SkipNextIcon />} disabled={isSpeaking} size="large" sx={{ boxShadow: theme.shadows[3], width: { xs: '100%', sm: 'auto'} }} > {currentWordIndex < wordList.length - 1 ? 'Valider & Suivant' : 'Terminer la Dictée'} </Button> </Stack> </Box> );

   // --- renderFinishedPhase (inchangé) ---
   const renderFinishedPhase = () => { /* ... (code inchangé) ... */ const currentScore = lastAttemptScore ?? 0; const totalWords = wordList.length; const percentage = totalWords > 0 ? Math.round((currentScore / totalWords) * 100) : 0; return ( <Box sx={{ textAlign: 'center', px: { xs: 0, sm: 1 } }}> <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: percentage >= 50 ? 'success.dark' : 'error.dark' }}> Dictée Terminée! </Typography> {lastAttemptScore !== null && ( <Chip label={`Votre Score: ${currentScore} / ${totalWords} (${percentage}%)`} color={percentage >= 50 ? "success" : "error"} /* ... styles ... */ /> )} {scoresData[selectedDictationIndex] && ( <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, mt: 1 }}> <Tooltip title="Meilleur score enregistré pour cette dictée"> <Chip icon={<StarIcon fontSize='small'/>} label={`Meilleur: ${scoresData[selectedDictationIndex].bestScore}/${totalWords}`} size="small" variant="outlined" color="warning"/> </Tooltip> <Tooltip title="Nombre total de fois où cette dictée a été faite"> <Chip icon={<RepeatIcon fontSize='small'/>} label={`Tentatives: ${scoresData[selectedDictationIndex].attempts}`} size="small" variant="outlined" color="info"/> </Tooltip> </Stack> )} <Typography paragraph color="text.secondary" sx={{ mt: 2}}>Détail des réponses :</Typography> <Paper variant="outlined" sx={{ maxHeight: { xs: 250, sm: 350 }, overflow: 'auto', mb: 2, textAlign: 'left', bgcolor: alpha(theme.palette.background.paper, 0.9) }}> <List dense disablePadding> {Array.isArray(dictatedWords) && dictatedWords.map((typedWord, index) => { const correctWord = wordList[index]; const isCorrect = typedWord.trim().toLowerCase() === correctWord.toLowerCase(); return ( <ListItem key={index} divider /* ... styles ... */> <ListItemIcon sx={{minWidth: 40}}> {isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />} </ListItemIcon> <ListItemText primary={typedWord || '(Vide)' } secondary={!isCorrect ? `Attendu: ${correctWord}` : null} /* ... styles ... */ /> </ListItem> ); })} </List> </Paper> <Divider sx={{ my: 2 }} /> <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center"> <Button variant="outlined" color="secondary" onClick={handleBackToSelection} startIcon={<ArrowBackIcon />} /* ... styles ... */ > Choisir une autre Dictée </Button> <Button variant="contained" onClick={handleRestartDictation} startIcon={<RestartAltIcon />} /* ... styles ... */ > Refaire cette Dictée </Button> </Stack> </Box> ); }

  // --- Rendu principal (inchangé) ---
  const selectedTitle = selectedDictationIndex >= 0 && allDictations[selectedDictationIndex]?.title;
  return (
     <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 750, margin: { xs: '1rem', sm: '2rem auto' }, borderRadius: theme.shape.borderRadius * 2, backgroundColor: alpha(theme.palette.background.paper, 0.9), backdropFilter: 'blur(8px)', border: `1px solid ${alpha(theme.palette.divider, 0.15)}` }} >
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}> {selectedTitle ? `Dictée ${selectedTitle.replace(/[^0-9]/g, '') || '?'}` : 'Dictées Interactives'} </Typography>
          {selectedTitle && <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>{selectedTitle}</Typography>}
          <Divider sx={{ my: 3 }} />
          {speechError && <Alert severity="warning" sx={{ mb: 3 }} variant="outlined">{speechError}</Alert>}
          {phase === 'selection' && renderSelectionPhase()}
          {phase === 'preparation' && renderPreparationPhase()}
          {phase === 'dictation' && renderDictationPhase()}
          {phase === 'finished' && renderFinishedPhase()}
          {isSpeaking && phase !== 'preparation' && phase !== 'selection' && ( <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 3, color: 'text.secondary' }}> <CircularProgress size={16} color="inherit" /> <Typography variant="caption">Lecture...</Typography> </Stack> )}
     </Paper>
   );
};

export default DictationComponent;