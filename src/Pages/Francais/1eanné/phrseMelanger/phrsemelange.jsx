import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Confetti from 'react-confetti';

// --- MUI Imports ---
import {
    Container, Typography, Box, Paper, Stack, Chip, Button, Alert,
    AlertTitle, Collapse, LinearProgress,
    useTheme, useMediaQuery, CircularProgress,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Replay as ReplayIcon,
    VolumeUp as VolumeUpIcon,
    ErrorOutline as ErrorOutlineIcon, Undo as UndoIcon,
    TouchApp as TouchAppIcon, Scoreboard as ScoreboardIcon
} from '@mui/icons-material';

// --- Data Import ---
import gameData from './phrse.json'; // Adjust path if needed
import RetrouvePhrase2 from './phraseconstrction2';
import ImageAssociator from './motimage';

// --- Custom Hook for Window Size ---
const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        handleResize(); window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return { width: size[0], height: size[1] };
};

// --- Helper Functions ---
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const generateWordItems = (sentence) => {
    if (!sentence) return [];
    return sentence.split(' ').map((word, index) => ({
        id: `word-${index}-${word.replace(/[^a-zA-Z0-9]/g, '')}`, content: word
    }));
};

// --- Constants ---
const PHRASES_PER_RUN = 10;
const FEEDBACK_DURATION_MS = 2000;

const RetrouvePhrase = () => {
    // --- Hooks ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const feedbackTimeoutRef = useRef(null);

    // --- State ---
    const [allExercises, setAllExercises] = useState([]);
    const [selectedExerciseName, setSelectedExerciseName] = useState('');
    const [currentExerciseSentences, setCurrentExerciseSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [originalSentence, setOriginalSentence] = useState('');
    const [sourceItems, setSourceItems] = useState([]);
    const [destinationItems, setDestinationItems] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [isFeedbackActive, setIsFeedbackActive] = useState(false);
    const [score, setScore] = useState(0);
    const [sentencesAttempted, setSentencesAttempted] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(null);
    const [runConfetti, setRunConfetti] = useState(false);
    const [canSpeak, setCanSpeak] = useState(false);
    // const [completedExercises, setCompletedExercises] = useState({}); // Removed as unused

    // --- Effects ---
    useEffect(() => { // Initial load
        try {
            if (!gameData?.exercises?.length) throw new Error("Format JSON invalide.");
            setAllExercises(gameData.exercises);
            setSelectedExerciseName(gameData.exercises[0]?.name || '');
            setIsLoading(false);
            setCanSpeak('speechSynthesis' in window);
        } catch (err) {
            setErrorLoading("Impossible de charger les exercices."); setIsLoading(false);
        }
    }, []);

    useEffect(() => { // Load sentences on exercise change
        if (!selectedExerciseName || allExercises.length === 0) return;
        const selectedExercise = allExercises.find(ex => ex.name === selectedExerciseName);
        if (selectedExercise?.sentences) {
            setCurrentExerciseSentences(shuffleArray(selectedExercise.sentences));
            resetCurrentRun(false); // Reset state for the new exercise, don't reshuffle again
        } else {
            setCurrentExerciseSentences([]);
            resetCurrentRun(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExerciseName, allExercises]); // Dependencies are correct

    useEffect(() => { // Setup current sentence data
        if (feedbackTimeoutRef.current) { clearTimeout(feedbackTimeoutRef.current); feedbackTimeoutRef.current = null; }
        if (currentExerciseSentences.length > 0 && currentSentenceIndex < currentExerciseSentences.length && currentSentenceIndex < PHRASES_PER_RUN) {
            const sentenceToShow = currentExerciseSentences[currentSentenceIndex];
            setOriginalSentence(sentenceToShow);
            const wordItems = generateWordItems(sentenceToShow);
            setSourceItems(shuffleArray(wordItems));
            setDestinationItems([]);
            setIsCorrect(null); setFeedback(''); setIsFeedbackActive(false);
        }
        return () => { if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current); };
    }, [currentSentenceIndex, currentExerciseSentences]); // Dependencies are correct

    useEffect(() => { // Confetti effect
        if (gameFinished && score > PHRASES_PER_RUN / 2) {
            setRunConfetti(true);
            const timer = setTimeout(() => setRunConfetti(false), 6000); return () => clearTimeout(timer);
        } else { setRunConfetti(false); }
    }, [gameFinished, score]); // Dependencies are correct

    // --- Memoized Values ---
    const progress = useMemo(() => (sentencesAttempted / PHRASES_PER_RUN) * 100, [sentencesAttempted]);
    const constructedSentenceString = useMemo(() => destinationItems.map(item => item.content).join(' '), [destinationItems]);

    // --- CLICK Handlers ---
     const handleMoveToDestination = useCallback((wordId) => {
         if (isFeedbackActive) return;
         const itemToMove = sourceItems.find(item => item.id === wordId);
         if (itemToMove) {
             setDestinationItems(prev => [...prev, itemToMove]);
             setSourceItems(prev => prev.filter(item => item.id !== wordId));
             setIsCorrect(null); setFeedback('');
         }
     }, [sourceItems, isFeedbackActive]); // Dependencies are correct

     const handleMoveToSource = useCallback((wordId) => {
         if (isFeedbackActive) return;
         const itemToMove = destinationItems.find(item => item.id === wordId);
         if (itemToMove) {
             setSourceItems(prev => [...prev, itemToMove]);
             setDestinationItems(prev => prev.filter(item => item.id !== wordId));
             setIsCorrect(null); setFeedback('');
         }
     }, [destinationItems, isFeedbackActive]); // Dependencies are correct

    // --- Action Handlers ---
    const handleValidateAndProceed = useCallback(() => {
        if (isFeedbackActive) return;
        const attempt = constructedSentenceString.trim();
        const correct = originalSentence.trim();
        const isAnswerCorrect = attempt.toLowerCase() === correct.toLowerCase();

        setIsFeedbackActive(true);
        setFeedback(isAnswerCorrect ? 'Bravo !' : 'Oups ! Vérifie.');
        setIsCorrect(isAnswerCorrect);
        if (isAnswerCorrect) { setScore(prev => prev + 1); }
        const nextAttemptNumber = sentencesAttempted + 1;
        setSentencesAttempted(nextAttemptNumber);

        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = setTimeout(() => {
            if (nextAttemptNumber >= PHRASES_PER_RUN) {
                setGameFinished(true);
            } else {
                if (currentSentenceIndex + 1 < currentExerciseSentences.length) {
                    setCurrentSentenceIndex(prevIndex => prevIndex + 1);
                } else { setGameFinished(true); } // Ran out of sentences
            }
             setFeedback('');
             feedbackTimeoutRef.current = null;
        }, FEEDBACK_DURATION_MS);

    }, [ // Dependencies are correct
        constructedSentenceString, originalSentence, isFeedbackActive,
        sentencesAttempted, currentSentenceIndex, currentExerciseSentences.length
        // Removed selectedExerciseName as it wasn't directly used for validation/transition logic itself
        // Removed score as it's only read via functional update `setScore(prev => prev + 1)`
    ]);

    const handleSpeak = useCallback(() => {
        if (!canSpeak || !constructedSentenceString || isFeedbackActive) return;
        if (speechSynthesis.speaking) speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(constructedSentenceString);
        utterance.lang = 'fr-FR'; utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }, [constructedSentenceString, canSpeak, isFeedbackActive]); // Dependencies are correct

    // ** resetCurrentRun - KEEP selectedExerciseName and allExercises as dependencies **
    // This is logically correct because the function needs them when shouldResetSentences is true.
    // If the warning persists, it's likely a case where the rule is too strict for conditional usage.
    const resetCurrentRun = useCallback((shouldResetSentences = true) => {
        if (feedbackTimeoutRef.current) { clearTimeout(feedbackTimeoutRef.current); feedbackTimeoutRef.current = null; }
        setCurrentSentenceIndex(0);
        setScore(0); setSentencesAttempted(0); setGameFinished(false);
        setRunConfetti(false); setIsFeedbackActive(false);
        setFeedback(''); setIsCorrect(null);
        // This block NEEDS the dependencies listed below
        if (shouldResetSentences && selectedExerciseName) {
             const selectedExercise = allExercises.find(ex => ex.name === selectedExerciseName);
             if (selectedExercise?.sentences) {
                 // Reshuffle sentences when explicitly restarting
                 setCurrentExerciseSentences(shuffleArray(selectedExercise.sentences));
             }
        }
        // Sentence data loading/resetting is triggered by the change in currentSentenceIndex via its useEffect
    }, [selectedExerciseName, allExercises]); // Dependencies are correct and needed

    const handleExerciseChange = (event) => {
         setSelectedExerciseName(event.target.value);
         // The useEffect watching selectedExerciseName calls resetCurrentRun(false)
     };

    // --- Render Logic --- (No changes needed in JSX for this warning)
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (errorLoading) return <Container sx={{ mt: 3 }}><Alert severity="error">{errorLoading}</Alert></Container>;
    if (gameFinished) {
         // Bilan View
         return ( <Container maxWidth="sm" sx={{ mt: 4, mb: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}> {runConfetti && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={300} />} <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, background: 'rgba(255, 255, 255, 0.95)', border: `3px solid ${theme.palette.warning.light}`, borderRadius: 2 }}> <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>📝 Bilan de l'exercice 📝</Typography> <Typography variant="h6" gutterBottom> {selectedExerciseName}</Typography> <Chip icon={<ScoreboardIcon />} label={`Score : ${score} / ${PHRASES_PER_RUN}`} color={score >= PHRASES_PER_RUN / 2 ? "success" : "warning"} variant="outlined" sx={{ fontSize: '1.2rem', padding: '15px 20px', my: 3 }} /> <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center'> <Button variant="contained" startIcon={<ReplayIcon />} onClick={() => resetCurrentRun(true)} size="large"> Recommencer cet exercice </Button> </Stack> </Paper> </Container> );
    }

    // Main Game View
    return (
        <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.info.light} 100%)`, py: { xs: 2, sm: 3 }, border: `5px solid ${theme.palette.warning.main}`, borderRadius: '15px', margin: { xs: 1, sm: 2 }, boxSizing: 'border-box' }}>
             <Container maxWidth="md">
                 {/* Exercise Selector */}
                  <Paper elevation={1} sx={{ p: 1, mb: 2, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center' }}>
                      <FormControl sx={{ minWidth: { xs: '90%', sm: 300 } }} size="small" disabled={isFeedbackActive}>
                         <InputLabel id="exercise-select-label">Choisir un Exercice</InputLabel>
                         <Select labelId="exercise-select-label" id="exercise-select" value={selectedExerciseName} label="Choisir un Exercice" onChange={handleExerciseChange} >
                             {allExercises.map((ex, index) => (<MenuItem key={index} value={ex.name}>{ex.name}</MenuItem>))}
                         </Select>
                     </FormControl>
                 </Paper>

                 {/* Progress Header */}
                 <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 3 }, mb: 3, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(3px)' }}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                         <Typography variant="body2" color="text.secondary">Phrase {Math.min(sentencesAttempted + 1, PHRASES_PER_RUN)} / {PHRASES_PER_RUN}</Typography>
                         <Chip icon={<ScoreboardIcon />} label={`Score: ${score}`} color="info" size="small" variant="outlined"/>
                     </Box>
                     <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }}/>
                     <Typography variant="body2" color="text.secondary" align="center">Exercice: {selectedExerciseName}</Typography>
                 </Paper>

                 {/* Construction Zone */}
                 <Paper elevation={2} sx={{ p: 2, mb: 3, minHeight: isMobile ? '60px' : '80px', display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', background: 'rgba(255, 255, 255, 0.95)', border: `2px dashed ${theme.palette.grey[400]}`, opacity: isFeedbackActive ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
                     {destinationItems.length === 0 && <Typography sx={{ color: theme.palette.grey[500], width: '100%', textAlign: 'center', fontStyle: 'italic' }}> Construis la phrase ici... </Typography>}
                     {destinationItems.map((item) => (
                         <Chip key={item.id} label={item.content} variant="filled" color="primary" onClick={() => handleMoveToSource(item.id)}
                             disabled={isFeedbackActive} icon={<UndoIcon />} sx={{ cursor: isFeedbackActive ? 'default' : 'pointer', fontWeight: 'medium', fontSize: isMobile ? '0.9rem' : '1rem', py: isMobile ? 2 : 2.5, px: 1.5, boxShadow: theme.shadows[1], '&:hover': { backgroundColor: !isFeedbackActive ? theme.palette.primary.light : undefined, boxShadow: !isFeedbackActive ? theme.shadows[3] : theme.shadows[1], }, }} />
                     ))}
                 </Paper>

                 {/* Word Source */}
                 <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.7)', textAlign: 'center' }}> <TouchAppIcon sx={{ verticalAlign: 'bottom', mr: 0.5 }}/> Mots mélangés : </Typography>
                 <Paper elevation={1} sx={{ p: 2, mb: 3, minHeight: isMobile ? '60px' : '80px', display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'center', background: 'rgba(230, 230, 230, 0.8)', border: `1px solid ${theme.palette.grey[300]}`, opacity: isFeedbackActive ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
                     {sourceItems.map((item) => (
                         <Chip key={item.id} label={item.content} variant="outlined" onClick={() => handleMoveToDestination(item.id)}
                             disabled={isFeedbackActive} sx={{ cursor: isFeedbackActive ? 'default' : 'pointer', fontSize: isMobile ? '0.9rem' : '1rem', py: isMobile ? 2 : 2.5, px: 1.5, borderColor: theme.palette.grey[500], color: theme.palette.text.primary, '&:hover': { backgroundColor: !isFeedbackActive ? theme.palette.action.hover : undefined, borderColor: !isFeedbackActive ? theme.palette.grey[700] : theme.palette.grey[500], boxShadow: !isFeedbackActive ? theme.shadows[2] : 'none', }, }} />
                     ))}
                 </Paper>

                 {/* Feedback Area */}
                 <Collapse in={feedback !== ''} timeout={400}>
                     <Alert severity={isCorrect === true ? 'success' : isCorrect === false ? 'error' : 'info'} iconMapping={{ success: <CheckCircleIcon fontSize="inherit" />, error: <CancelIcon fontSize="inherit" />, info: <ErrorOutlineIcon fontSize="inherit" /> }} sx={{ mb: 2 }} > <AlertTitle>{isCorrect ? 'Bravo !' : isCorrect === false ? 'Attention !' : 'Info'}</AlertTitle> {feedback} </Alert>
                 </Collapse>

                 {/* Action Buttons */}
                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                     <Button variant="contained" color="secondary" startIcon={<VolumeUpIcon />} onClick={handleSpeak}
                         disabled={!canSpeak || destinationItems.length === 0 || isFeedbackActive}
                         sx={{ flexGrow: { sm: 1 } }}>
                         Lire ma phrase
                     </Button>
                     <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={handleValidateAndProceed}
                         disabled={destinationItems.length === 0 || isFeedbackActive}
                         sx={{ flexGrow: { sm: 1 } }}>
                         Valider
                     </Button>
                 </Stack>
             </Container>
             <RetrouvePhrase2></RetrouvePhrase2>
             <ImageAssociator></ImageAssociator>
        </Box>
    );
};

export default RetrouvePhrase;