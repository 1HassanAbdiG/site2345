import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Confetti from 'react-confetti';

// --- MUI Imports ---
import {
    Container, Typography, Box, Paper, Stack, Chip, Button, Alert,
    AlertTitle, Collapse, LinearProgress, Skeleton,
    useTheme, useMediaQuery, CircularProgress, Backdrop,
    FormControl, InputLabel, Select, MenuItem // Removed Grid, IconButton
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Replay as ReplayIcon,
    VolumeUp as VolumeUpIcon, ErrorOutline as ErrorOutlineIcon, Undo as UndoIcon,
    TouchApp as TouchAppIcon, Scoreboard as ScoreboardIcon, EmojiEvents as EmojiEventsIcon,
    PlaylistAddCheck as PlaylistAddCheckIcon, SpeakerNotesOff as SpeakerNotesOffIcon,
    Category as CategoryIcon, HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';

// --- Data Import ---
// Make sure this path is correct relative to your component file
import gameData from './phrse.json';
import SyllableTable from './syllab';

// --- Custom Hook for Window Size ---
const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return { width: size[0], height: size[1] };
};

// --- Helper Functions ---
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const generateWordItems = (sentence) => {
    if (!sentence || typeof sentence !== 'string') return [];
    return sentence.split(' ').map((word, index) => ({
        // Generate a more unique ID in case of duplicate words
        id: `word-${index}-${word.replace(/[^a-zA-Z0-9]/g, '')}-${Math.random().toString(16).slice(2)}`,
        content: word
    }));
};

// --- Constants ---
const PHRASES_PER_RUN = 10;
const FEEDBACK_DURATION_MS = 2200; // Slightly longer for readability
const CONFETTI_DURATION_MS = 6000;

// --- Sub-Components ---

// Game Header
const GameHeader = React.memo(({ currentSentenceNum, totalSentences, score, progress, exerciseName }) => {
    // const theme = useTheme(); // Removed unused theme variable
    return (
        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(3px)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Phrase {Math.min(currentSentenceNum, totalSentences)} / {totalSentences}
                </Typography>
                <Chip icon={<ScoreboardIcon />} label={`Score: ${score}`} color="info" size="small" variant="outlined"/>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1.5, height: 6, borderRadius: 3 }}/>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontStyle: 'italic' }}>
                 Exercice: {exerciseName || 'Non sélectionné'}
            </Typography>
        </Paper>
    );
});

// Construction Zone (Destination for words)
const ConstructionZone = React.memo(({ items, onMoveToSource, isFeedbackActive, isMobile }) => {
    const theme = useTheme();
    return (
        <Paper elevation={2} sx={{
            p: 2, mb: 3, minHeight: isMobile ? '80px' : '100px',
            display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.98)', // Lighter background
            border: `2px dashed ${theme.palette.primary.light}`, // Use theme color
            borderRadius: 2,
            opacity: isFeedbackActive ? 0.7 : 1,
            transition: 'opacity 0.3s ease, border-color 0.3s ease',
            boxShadow: theme.shadows[1],
        }}>
            {items.length === 0 && (
                <Typography sx={{ color: theme.palette.grey[500], width: '100%', textAlign: 'center', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlaylistAddCheckIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    Construis la phrase ici...
                </Typography>
            )}
            {items.map((item) => (
                <Chip
                    key={item.id}
                    label={item.content}
                    variant="filled"
                    color="primary" // Use primary color for constructed words
                    onClick={() => !isFeedbackActive && onMoveToSource(item.id)}
                    disabled={isFeedbackActive}
                    icon={<UndoIcon />}
                    sx={{
                        cursor: isFeedbackActive ? 'default' : 'pointer',
                        fontWeight: 'medium',
                        fontSize: isMobile ? '0.95rem' : '1.1rem',
                        py: isMobile ? 2.5 : 3,
                        px: 1.5,
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                            backgroundColor: !isFeedbackActive ? theme.palette.primary.dark : undefined,
                            boxShadow: !isFeedbackActive ? theme.shadows[4] : theme.shadows[2],
                            transform: !isFeedbackActive ? 'scale(1.03)' : 'none',
                        },
                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                    }}
                />
            ))}
        </Paper>
    );
});

// Word Source Zone (Shuffled words)
const WordSourceZone = React.memo(({ items, onMoveToDestination, isFeedbackActive, isMobile }) => {
    const theme = useTheme();
    return (
        <>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.8)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TouchAppIcon sx={{ verticalAlign: 'bottom', mr: 0.5 }}/> Mots mélangés :
            </Typography>
            <Paper elevation={1} sx={{
                p: 2, mb: 3, minHeight: isMobile ? '80px' : '100px',
                display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'center',
                background: 'rgba(230, 230, 245, 0.85)', // Slightly different background
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: 2,
                opacity: isFeedbackActive ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
            }}>
                {items.map((item) => (
                    <Chip
                        key={item.id}
                        label={item.content}
                        variant="outlined" // Outlined for source words
                        onClick={() => !isFeedbackActive && onMoveToDestination(item.id)}
                        disabled={isFeedbackActive}
                        sx={{
                            cursor: isFeedbackActive ? 'default' : 'pointer',
                            fontSize: isMobile ? '0.95rem' : '1.1rem',
                            py: isMobile ? 2.5 : 3,
                            px: 1.5,
                            borderColor: theme.palette.grey[500],
                            color: theme.palette.text.primary,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Ensure readability
                            '&:hover': {
                                backgroundColor: !isFeedbackActive ? theme.palette.action.hover : undefined,
                                borderColor: !isFeedbackActive ? theme.palette.grey[700] : theme.palette.grey[500],
                                boxShadow: !isFeedbackActive ? theme.shadows[2] : 'none',
                                transform: !isFeedbackActive ? 'scale(1.03)' : 'none',
                            },
                           transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                        }}
                    />
                ))}
                 {items.length === 0 && !isFeedbackActive && (
                     <Typography sx={{ color: theme.palette.grey[600], fontStyle: 'italic' }}>Tous les mots utilisés !</Typography>
                 )}
            </Paper>
        </>
    );
});

// Feedback Display
const FeedbackDisplay = React.memo(({ feedback, isCorrect, isActive }) => {
    if (!isActive || !feedback) return null; // Render nothing if inactive

    return (
        <Collapse in={isActive} timeout={400}>
            <Alert
                severity={isCorrect === true ? 'success' : isCorrect === false ? 'error' : 'info'}
                iconMapping={{
                    success: <CheckCircleIcon fontSize="inherit" />,
                    error: <CancelIcon fontSize="inherit" />,
                    info: <ErrorOutlineIcon fontSize="inherit" />
                }}
                sx={{ mb: 2, '.MuiAlert-message': { flexGrow: 1 } }} // Ensure message takes space
            >
                <AlertTitle>{isCorrect ? 'Bravo !' : isCorrect === false ? 'Oups ! Essaie encore.' : 'Info'}</AlertTitle>
                {feedback}
            </Alert>
        </Collapse>
    );
});

// Action Buttons
const ActionButtons = React.memo(({ onSpeak, onValidate, canSpeak, canValidate, isFeedbackActive }) => {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button
                variant="contained"
                color="secondary"
                startIcon={canSpeak ? <VolumeUpIcon /> : <SpeakerNotesOffIcon />}
                onClick={onSpeak}
                disabled={!canSpeak || !canValidate || isFeedbackActive} // Disable if no words or during feedback
                sx={{ flexGrow: { sm: 1 } }}
                aria-label="Lire la phrase construite"
            >
                Lire ma phrase
            </Button>
            <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={onValidate}
                disabled={!canValidate || isFeedbackActive} // Disable if no words or during feedback
                sx={{ flexGrow: { sm: 1 } }}
                aria-label="Valider la phrase"
            >
                Valider
            </Button>
        </Stack>
    );
});

// Game Summary / Bilan
const GameSummary = React.memo(({ score, totalQuestions, exerciseName, onRestart, windowWidth, windowHeight }) => {
    const theme = useTheme();
    const showConfetti = score > totalQuestions / 2;

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {showConfetti && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={400} tweenDuration={CONFETTI_DURATION_MS} />}
            <Paper elevation={6} sx={{
                p: { xs: 3, sm: 5 },
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
                border: `4px solid ${theme.palette.primary.main}`,
                borderRadius: 4,
                boxShadow: theme.shadows[8]
            }}>
                <EmojiEventsIcon sx={{ fontSize: 60, color: theme.palette.warning.main, mb: 2 }} />
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: theme.palette.primary.dark, fontWeight: 'bold' }}>
                    🎉 Bilan de l'exercice 🎉
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.secondary.dark, mb: 3 }}>
                    {exerciseName}
                </Typography>
                <Chip
                    icon={<ScoreboardIcon />}
                    label={`Score : ${score} / ${totalQuestions}`}
                    color={score >= totalQuestions / 2 ? "success" : "warning"}
                    variant="filled" // Filled looks stronger here
                    sx={{ fontSize: '1.4rem', padding: '20px 25px', my: 3, fontWeight: 'bold' }}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center' sx={{ mt: 4 }}>
                    <Button variant="contained" startIcon={<ReplayIcon />} onClick={onRestart} size="large">
                        Recommencer cet exercice
                    </Button>
                    {/* Add a button to go back to selection or next exercise if needed */}
                </Stack>
            </Paper>
        </Container>
    );
});


// --- Main Component ---
const RetrouvePhrase2 = () => {
    // --- Hooks ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const feedbackTimeoutRef = useRef(null);
    const confettiTimeoutRef = useRef(null);

    // --- State ---
    const [allExercises, setAllExercises] = useState([]);
    const [selectedExerciseName, setSelectedExerciseName] = useState('');
    const [currentExerciseSentences, setCurrentExerciseSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [originalSentence, setOriginalSentence] = useState('');
    const [sourceItems, setSourceItems] = useState([]);       // Shuffled words available
    const [destinationItems, setDestinationItems] = useState([]); // Words placed by user
    const [feedback, setFeedback] = useState('');             // Feedback message
    const [isCorrect, setIsCorrect] = useState(null);         // Boolean: true=correct, false=incorrect, null=pending
    const [isFeedbackActive, setIsFeedbackActive] = useState(false); // Controls feedback display/disabling UI
    const [score, setScore] = useState(0);
    const [sentencesAttempted, setSentencesAttempted] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);         // Initial data load
    const [isLoadingExercise, setIsLoadingExercise] = useState(false); // Loading specific exercise sentences
    const [errorLoading, setErrorLoading] = useState(null);
    const [runConfetti, setRunConfetti] = useState(false);
    const [canSpeak, setCanSpeak] = useState(false);

    // --- Effects ---

    // Initial Load & Speech Synthesis Check
    useEffect(() => {
        try {
            // Basic validation of the imported data structure
            if (!gameData || !Array.isArray(gameData.exercises) || gameData.exercises.length === 0) {
                throw new Error("Format JSON invalide ou aucun exercice trouvé.");
            }
            setAllExercises(gameData.exercises);
            // Set the first exercise as default, or empty if none exists
            setSelectedExerciseName(gameData.exercises[0]?.name || '');
            setIsLoading(false);
            setCanSpeak('speechSynthesis' in window && typeof window.speechSynthesis.speak === 'function');
        } catch (err) {
            console.error("Erreur de chargement initial:", err);
            setErrorLoading(`Impossible de charger les exercices: ${err.message}`);
            setIsLoading(false);
        }
    }, []); // Runs only once on mount

    // Load Sentences when Exercise Selection Changes
    useEffect(() => {
        if (!selectedExerciseName || allExercises.length === 0) {
            // Handle case where selection is cleared or no exercises exist
            setCurrentExerciseSentences([]);
            resetCurrentRun(false); // Reset game state but don't reshuffle empty array
            return;
        };

        setIsLoadingExercise(true); // Start loading indicator
        const selectedExercise = allExercises.find(ex => ex.name === selectedExerciseName);

        if (selectedExercise?.sentences && Array.isArray(selectedExercise.sentences)) {
             // Add a small delay for perceived smoothness when switching
             const timer = setTimeout(() => {
                setCurrentExerciseSentences(shuffleArray(selectedExercise.sentences.filter(s => typeof s === 'string' && s.trim() !== ''))); // Ensure sentences are valid strings and shuffle
                resetCurrentRun(false); // Reset game state for the new exercise
                setIsLoadingExercise(false); // Stop loading indicator
             }, 250); // 250ms delay
             return () => clearTimeout(timer); // Cleanup timeout if component unmounts or selection changes again quickly
        } else {
            console.warn(`Exercice sélectionné "${selectedExerciseName}" n'a pas de phrases valides.`);
            setCurrentExerciseSentences([]);
            resetCurrentRun(false);
            setIsLoadingExercise(false); // Stop loading indicator even if data is invalid
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExerciseName, allExercises]); // Triggered only by selection change or initial load of exercises

    // Setup Current Sentence Data
    useEffect(() => {
        // Clear any lingering feedback timeout from the previous sentence
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = null;
        }

        // Check if we have sentences, are within bounds, and haven't finished the run
        if (currentExerciseSentences.length > 0 && currentSentenceIndex < currentExerciseSentences.length && currentSentenceIndex < PHRASES_PER_RUN) {
            const sentenceToShow = currentExerciseSentences[currentSentenceIndex];
            setOriginalSentence(sentenceToShow);
            const wordItems = generateWordItems(sentenceToShow);
            setSourceItems(shuffleArray(wordItems)); // Shuffle words for the source zone
            setDestinationItems([]); // Clear the construction zone
            setIsCorrect(null);      // Reset correctness state
            setFeedback('');         // Clear feedback message
            setIsFeedbackActive(false); // Ensure UI is interactive
        } else if (sentencesAttempted >= PHRASES_PER_RUN && !gameFinished) {
             // This condition handles finishing the run if we reach PHRASES_PER_RUN attempts
             setGameFinished(true);
        }

        // Cleanup function for the effect
        return () => {
            if (feedbackTimeoutRef.current) {
                clearTimeout(feedbackTimeoutRef.current);
            }
        };
    }, [currentSentenceIndex, currentExerciseSentences, gameFinished, sentencesAttempted]); // Dependencies are correct

    // Confetti Effect Timer
    useEffect(() => {
        if (runConfetti) {
            // Set a timer to stop confetti after a duration
            confettiTimeoutRef.current = setTimeout(() => {
                setRunConfetti(false);
            }, CONFETTI_DURATION_MS);
        }
        // Cleanup function
        return () => {
            if (confettiTimeoutRef.current) {
                clearTimeout(confettiTimeoutRef.current);
            }
        };
    }, [runConfetti]); // Trigger only when runConfetti changes

    // --- Memoized Values ---
    const progress = useMemo(() => (sentencesAttempted / PHRASES_PER_RUN) * 100, [sentencesAttempted]);
    const constructedSentenceString = useMemo(() => destinationItems.map(item => item.content).join(' '), [destinationItems]);
    const canValidate = useMemo(() => destinationItems.length > 0, [destinationItems]);

    // --- Event Handlers (Callbacks) ---

    const handleMoveToDestination = useCallback((wordId) => {
        if (isFeedbackActive) return; // Prevent moving during feedback
        const itemToMove = sourceItems.find(item => item.id === wordId);
        if (itemToMove) {
            setDestinationItems(prev => [...prev, itemToMove]);
            setSourceItems(prev => prev.filter(item => item.id !== wordId));
            setIsCorrect(null); // Reset correctness if user changes the sentence
            setFeedback('');
        }
    }, [sourceItems, isFeedbackActive]);

    const handleMoveToSource = useCallback((wordId) => {
        if (isFeedbackActive) return; // Prevent moving during feedback
        const itemToMove = destinationItems.find(item => item.id === wordId);
        if (itemToMove) {
            // Move back to source - consider preserving original shuffled order if needed,
            // but appending to the end is simpler and usually acceptable UX.
            setSourceItems(prev => [...prev, itemToMove]);
            setDestinationItems(prev => prev.filter(item => item.id !== wordId));
            setIsCorrect(null); // Reset correctness if user changes the sentence
            setFeedback('');
        }
    }, [destinationItems, isFeedbackActive]);

    const handleValidateAndProceed = useCallback(() => {
        if (isFeedbackActive || !canValidate) return; // Prevent double clicks or validating empty

        const attempt = constructedSentenceString.trim();
        const correct = originalSentence.trim();
        // Case-insensitive comparison, remove extra whitespace and punctuation for robustness
        const normalize = (str) => str.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
        const isAnswerCorrect = normalize(attempt) === normalize(correct);

        setIsFeedbackActive(true); // Show feedback, disable interaction
        setFeedback(isAnswerCorrect ? 'Phrase correcte !' : 'Vérifie les mots ou leur ordre.');
        setIsCorrect(isAnswerCorrect);
        if (isAnswerCorrect) {
            setScore(prev => prev + 1);
        }
        const nextAttemptNumber = sentencesAttempted + 1;
        setSentencesAttempted(nextAttemptNumber); // Increment attempt counter *before* the timeout

        // Clear previous timeout just in case
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);

        feedbackTimeoutRef.current = setTimeout(() => {
            // Check if the game should end (reached max phrases or ran out of unique sentences)
            if (nextAttemptNumber >= PHRASES_PER_RUN || currentSentenceIndex + 1 >= currentExerciseSentences.length) {
                setGameFinished(true);
                if (score + (isAnswerCorrect ? 1 : 0) > PHRASES_PER_RUN / 2) { // Check score *after* update potential
                     setRunConfetti(true); // Trigger confetti on game end if score is good
                }
            } else {
                // Proceed to the next sentence
                setCurrentSentenceIndex(prevIndex => prevIndex + 1);
                // Resetting feedback happens naturally in the sentence setup useEffect
            }
            // No need to explicitly reset feedback state here, the sentence change effect handles it
            feedbackTimeoutRef.current = null; // Clear the ref after timeout executes
        }, FEEDBACK_DURATION_MS);

    }, [
        constructedSentenceString, originalSentence, isFeedbackActive, canValidate,
        sentencesAttempted, currentSentenceIndex, currentExerciseSentences.length, score // Include score for confetti logic
    ]);

    const handleSpeak = useCallback(() => {
        if (!canSpeak || !constructedSentenceString || isFeedbackActive || speechSynthesis.speaking) return;
        // Cancel any previous utterance
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(constructedSentenceString);
        utterance.lang = 'fr-FR'; // Set language for better pronunciation
        utterance.rate = 0.9;     // Slightly slower rate
        speechSynthesis.speak(utterance);
    }, [constructedSentenceString, canSpeak, isFeedbackActive]);

    // Reset the current game run (e.g., when clicking "Recommencer")
    const resetCurrentRun = useCallback((shouldResetSentences = true) => {
        if (feedbackTimeoutRef.current) { clearTimeout(feedbackTimeoutRef.current); feedbackTimeoutRef.current = null; }
        if (confettiTimeoutRef.current) { clearTimeout(confettiTimeoutRef.current); confettiTimeoutRef.current = null; }
        if (speechSynthesis.speaking) { speechSynthesis.cancel(); } // Stop speech

        setCurrentSentenceIndex(0);
        setScore(0);
        setSentencesAttempted(0);
        setGameFinished(false);
        setRunConfetti(false);
        setIsFeedbackActive(false);
        setFeedback('');
        setIsCorrect(null);
        setSourceItems([]); // Clear items immediately
        setDestinationItems([]);

        // Reshuffle sentences only if explicitly requested (e.g., restart button)
        // This avoids reshuffling when simply changing exercises (handled by useEffect)
        if (shouldResetSentences && selectedExerciseName && allExercises.length > 0) {
            setIsLoadingExercise(true); // Show loading briefly for reshuffle
            const selectedExercise = allExercises.find(ex => ex.name === selectedExerciseName);
            if (selectedExercise?.sentences && Array.isArray(selectedExercise.sentences)) {
                // Use a small timeout to allow UI to update before potential blocking shuffle
                setTimeout(() => {
                    setCurrentExerciseSentences(shuffleArray(selectedExercise.sentences.filter(s => typeof s === 'string' && s.trim() !== '')));
                    // The sentence setup useEffect will trigger based on setCurrentExerciseSentences change
                     setIsLoadingExercise(false);
                }, 50); // Short delay
            } else {
                 setCurrentExerciseSentences([]);
                 setIsLoadingExercise(false);
            }
        }
        // Sentence data loading/resetting is primarily triggered by the change in
        // currentSentenceIndex and currentExerciseSentences via their useEffects.
    }, [selectedExerciseName, allExercises]); // Dependencies are correct

    // Handle selection change in the dropdown
    const handleExerciseChange = (event) => {
        setSelectedExerciseName(event.target.value);
        // The useEffect watching selectedExerciseName handles the logic
        // of loading sentences and resetting the run state (via resetCurrentRun(false)).
    };

    // --- Render Logic ---

    // 1. Initial Loading State
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement des exercices...</Typography>
            </Box>
        );
    }

    // 2. Error State
    if (errorLoading) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error" icon={<ErrorOutlineIcon fontSize="large"/>}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>Erreur de Chargement</AlertTitle>
                    {errorLoading}
                    <br />
                    Veuillez vérifier le fichier `phrse.json` et rafraîchir la page.
                </Alert>
            </Container>
        );
    }

    // 3. Game Finished State (Summary View)
    if (gameFinished) {
        return (
            <GameSummary
                score={score}
                totalQuestions={PHRASES_PER_RUN}
                exerciseName={selectedExerciseName}
                onRestart={() => resetCurrentRun(true)} // Pass true to reshuffle
                windowWidth={windowWidth}
                windowHeight={windowHeight}
            />
        );
    }

    // 4. Main Game View
    return (
        // Use a subtle gradient or solid color for less distraction
        <Box sx={{
             minHeight: '100vh',
             // background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
             background: theme.palette.grey[100], // Simpler background
             py: { xs: 2, sm: 4 },
             px: { xs: 1, sm: 2 } }}>
            <Container maxWidth="lg"> {/* Allow slightly wider container */}

                {/* Exercise Selector */}
                <Paper elevation={1} sx={{ p: 1.5, mb: 3, background: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                    <FormControl sx={{ minWidth: { xs: '95%', sm: 350 }, maxWidth: '100%' }} size="small" disabled={isFeedbackActive || isLoadingExercise}>
                        <InputLabel id="exercise-select-label"> <CategoryIcon sx={{fontSize: '1rem', verticalAlign: 'middle', mr: 0.5}}/> Choisir un Exercice</InputLabel>
                        <Select
                            labelId="exercise-select-label"
                            id="exercise-select"
                            value={selectedExerciseName}
                            label="Choisir un Exercice"
                            onChange={handleExerciseChange}
                        >
                            {allExercises.length === 0 && <MenuItem disabled>Aucun exercice chargé</MenuItem>}
                            {allExercises.map((ex) => (
                                <MenuItem key={ex.name} value={ex.name}>{ex.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                 {/* Loading Overlay for Exercise Change */}
                 <Backdrop
                     sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                     open={isLoadingExercise}
                 >
                     <CircularProgress color="inherit" sx={{ mr: 2 }} />
                     <Typography>Chargement de l'exercice...</Typography>
                 </Backdrop>

                {/* Conditional Rendering during exercise load */}
                {isLoadingExercise ? (
                     <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 3 }, mb: 3, borderRadius: 2 }}>
                         <Skeleton variant="text" width="40%" sx={{mb: 1.5}} />
                         <Skeleton variant="rectangular" width="100%" height={8} sx={{mb: 1.5}} />
                         <Skeleton variant="text" width="60%" sx={{margin: 'auto'}}/>
                         <Skeleton variant="rounded" height={isMobile ? 80 : 100} sx={{ mt: 3, mb: 3 }} />
                         <Skeleton variant="rounded" height={isMobile ? 80 : 100} sx={{ mb: 3 }} />
                         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                             <Skeleton variant="rounded" height={40} sx={{flexGrow: { sm: 1 }}} />
                             <Skeleton variant="rounded" height={40} sx={{flexGrow: { sm: 1 }}} />
                         </Stack>
                     </Paper>
                ) : currentExerciseSentences.length === 0 && !isLoading ? (
                     <Paper elevation={2} sx={{ p: 3, textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
                        <HourglassEmptyIcon sx={{fontSize: 40, color: theme.palette.grey[500], mb: 2}}/>
                         <Typography variant="h6" color="text.secondary">
                             {selectedExerciseName ? `Aucune phrase valide trouvée pour "${selectedExerciseName}".` : "Veuillez sélectionner un exercice."}
                         </Typography>
                     </Paper>
                 ) : (
                     <>
                         {/* Progress Header */}
                         <GameHeader
                             currentSentenceNum={sentencesAttempted + 1}
                             totalSentences={PHRASES_PER_RUN}
                             score={score}
                             progress={progress}
                             exerciseName={selectedExerciseName}
                         />

                         {/* Construction Zone */}
                         <ConstructionZone
                             items={destinationItems}
                             onMoveToSource={handleMoveToSource}
                             isFeedbackActive={isFeedbackActive}
                             isMobile={isMobile}
                         />

                         {/* Word Source */}
                         <WordSourceZone
                             items={sourceItems}
                             onMoveToDestination={handleMoveToDestination}
                             isFeedbackActive={isFeedbackActive}
                             isMobile={isMobile}
                         />

                         {/* Feedback Area */}
                         <FeedbackDisplay
                             feedback={feedback}
                             isCorrect={isCorrect}
                             isActive={isFeedbackActive}
                         />

                         {/* Action Buttons */}
                         <ActionButtons
                             onSpeak={handleSpeak}
                             onValidate={handleValidateAndProceed}
                             canSpeak={canSpeak}
                             canValidate={canValidate}
                             isFeedbackActive={isFeedbackActive}
                         />
                     </>
                 )}
            </Container>
            <SyllableTable></SyllableTable>
        </Box>
    );
};

export default RetrouvePhrase2;