import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Container, Tabs, Tab, Box, Card, CardContent, Typography, Grid, Chip, Paper,
    CircularProgress, Alert,
    IconButton, Tooltip, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button,
    Fade // For transitions
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // Import alpha utility
import {
    QuestionAnswer, VolumeUp, StopCircle, Audiotrack, SpeakerNotes, Spellcheck,
    Face, VisibilityOff, PanTool, RecordVoiceOver, Hearing, DirectionsWalk, Widgets, Person, HelpOutline,
    CheckCircleOutline, CancelOutlined, Replay, Mic // Added icons
} from '@mui/icons-material';

// --- MODIFIED gameData with QCM structure ---
const gameData = {
    "debutant": {
      "id": "debutant", "label": "Débutant", "title": "Débutants: Le corps et les sens",
      "text": "Notre corps a la tête, les bras, les jambes et le tronc.\nAvec les yeux, on voit.\nAvec le nez, on sent.\nAvec les oreilles, on entend.\nAvec la bouche, on goûte.\nAvec les mains, on touche.",
      "questions": [
        { "id": "q1_debutant", "questionText": "Quelles sont les 4 parties principales du corps citées au début ?", "options": ["Tête, Mains, Pieds, Ventre", "Tête, Bras, Jambes, Tronc", "Yeux, Nez, Oreilles, Bouche", "Cheveux, Doigts, Orteils, Cou"], "correctAnswer": "Tête, Bras, Jambes, Tronc" },
        { "id": "q2_debutant", "questionText": "Avec quelle partie du corps voit-on ?", "options": ["Les oreilles", "Le nez", "Les yeux", "La bouche"], "correctAnswer": "Les yeux" },
        { "id": "q3_debutant", "questionText": "Que fait-on avec le nez ?", "options": ["On voit", "On entend", "On goûte", "On sent"], "correctAnswer": "On sent" },
        { "id": "q4_debutant", "questionText": "Que fait-on avec les mains ?", "options": ["On touche", "On sent", "On voit", "On entend"], "correctAnswer": "On touche" }
      ],
      "syllableWords": [
        { "id": "syl-tete", "word": "tête", "syllables": ["Tê", "te"], "syllableCount": 2 },
        { "id": "syl-nez", "word": "nez", "syllables": ["Nez"], "syllableCount": 1 },
        { "id": "syl-mains", "word": "mains", "syllables": ["Mains"], "syllableCount": 1 },
        { "id": "syl-bouche", "word": "bouche", "syllables": ["Bou", "che"], "syllableCount": 2 }
      ]
    },
    "intermediaire": {
      "id": "intermediaire", "label": "Intermédiaire", "title": "Intermédiaires: Les parties du corps et nos sens",
      "text": "Le corps est composé de la tête, du tronc, des bras et des jambes.\nSur la tête, il y a : les yeux pour voir, le nez pour sentir, les oreilles pour entendre, la bouche pour goûter.\nAvec nos mains, nous pouvons toucher les objets.",
      "questions": [
        { "id": "q1_inter", "questionText": "De quelles parties le corps est-il composé selon le texte ?", "options": ["Tête, Tronc, Bras, Mains", "Tête, Tronc, Bras, Jambes", "Tête, Cou, Épaules, Pieds", "Yeux, Nez, Oreilles, Bouche"], "correctAnswer": "Tête, Tronc, Bras, Jambes" },
        { "id": "q2_inter", "questionText": "Cite trois organes sur la tête et leur fonction (selon le texte).", "options": ["Yeux (voir), Nez (sentir), Mains (toucher)", "Yeux (voir), Oreilles (entendre), Bouche (goûter)", "Nez (sentir), Bouche (goûter), Pieds (marcher)", "Cheveux (protéger), Yeux (voir), Langue (parler)"], "correctAnswer": "Yeux (voir), Oreilles (entendre), Bouche (goûter)" },
        { "id": "q3_inter", "questionText": "Que peut-on faire avec les mains selon le texte ?", "options": ["Goûter les aliments", "Entendre les sons", "Toucher les objets", "Sentir les odeurs"], "correctAnswer": "Toucher les objets" }
      ],
       "syllableWords": [
         { "id": "syl-oreilles", "word": "oreilles", "syllables": ["O", "reil", "les"], "syllableCount": 3 },
         { "id": "syl-jambes", "word": "jambes", "syllables": ["Jam", "bes"], "syllableCount": 2 },
         { "id": "syl-objets", "word": "objets", "syllables": ["Ob", "jets"], "syllableCount": 2 },
         { "id": "syl-corps", "word": "corps", "syllables": ["Corps"], "syllableCount": 1 }
      ]
    },
     "avance": {
      "id": "avance", "label": "Avancé", "title": "Avancés: Le corps humain et ses cinq sens",
      "text": "Notre corps est divisé en plusieurs parties : la tête, le tronc, les bras et les jambes.\nLa tête porte les yeux, qui nous permettent de voir.\nLe nez sert à sentir les odeurs.\nLes oreilles nous aident à entendre les sons.\nLa bouche est utilisée pour goûter les aliments avec la langue.\nGrâce aux mains, nous pouvons toucher et sentir les formes et les textures.",
       "questions": [
            { "id": "q1_avance", "questionText": "Quelle partie spécifique de la bouche est mentionnée pour le goût ?", "options": ["Les lèvres", "Les dents", "La langue", "Le palais"], "correctAnswer": "La langue" },
            { "id": "q2_avance", "questionText": "En plus de toucher, quelle autre capacité des mains est mentionnée ?", "options": ["Sentir les formes et textures", "Goûter", "Entendre", "Voir"], "correctAnswer": "Sentir les formes et textures" }
        ],
      "syllableWords": null // Example where syllables might be null or empty
    }
};
// --- End of gameData ---

// --- Helper function to shuffle array (Fisher-Yates algorithm) ---
function shuffleArray(array) {
  if (!Array.isArray(array)) return []; // Ensure it's an array
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Create a shallow copy to avoid mutating original
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

// --- Helper function to map words to icons ---
const getIconForWord = (word) => {
    if (!word) return <HelpOutline fontSize="large" />; // Handle cases where word might be missing
    const lowerWord = word.toLowerCase();
    switch (lowerWord) {
        case 'tête': return <Face fontSize="large" />;
        case 'nez': return <VisibilityOff fontSize="large" />; // Note: Icon choice might be debatable (smell?)
        case 'mains': return <PanTool fontSize="large" />;
        case 'bouche': return <RecordVoiceOver fontSize="large" />;
        case 'oreilles': return <Hearing fontSize="large" />;
        case 'jambes': return <DirectionsWalk fontSize="large" />;
        case 'objets': return <Widgets fontSize="large" />;
        case 'corps': return <Person fontSize="large" />;
        default: return <HelpOutline fontSize="large" />;
    }
};


// --- The Main Component ---
function InteractiveLearningGame() {
    // --- Basic State ---
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start as true until initial level is set
    const [error, setError] = useState(null);

    // --- TTS State ---
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);

    // --- QCM State ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [showQCMResults, setShowQCMResults] = useState(false);

    // --- Syllable Construction State ---
    const [syllableStates, setSyllableStates] = useState({});

    // --- Initialization and TTS Check ---
    useEffect(() => {
        // Check for Speech Synthesis support
        if ('speechSynthesis' in window) {
            setSpeechSynthesisSupported(true);
            // Pre-load voices (recommended practice)
            const loadVoices = () => window.speechSynthesis.getVoices();
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        } else {
           setError("Désolé, la synthèse vocale n'est pas supportée par votre navigateur.");
        }
        // Set initial level *after* basic setup is done
        const levelKeys = Object.keys(gameData);
        if (levelKeys.length > 0) {
            setSelectedLevelId(levelKeys[0]); // Select the first level initially
        } else {
            setError("Aucune donnée de niveau n'a été trouvée.");
        }
        setIsLoading(false); // Mark loading as complete
    }, []); // Run only once on mount

    // --- Stop Speaking on Unmount ---
    useEffect(() => {
        // Cleanup function to stop any speech when the component unmounts
        return () => {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []); // Run only once on mount for cleanup


    // --- Speech Synthesis Logic ---
    const speakText = useCallback((textToSpeak, lang = 'fr-FR', rate = 0.9) => {
        // Prevent starting if not supported, no text, or browser is actively speaking (using isSpeaking state)
        if (!speechSynthesisSupported || !textToSpeak || isSpeaking) {
            console.warn("Speak request ignored. Supported:", speechSynthesisSupported, "Text:", !!textToSpeak, "Speaking:", isSpeaking);
            return;
        }

        // CRITICAL: Cancel any queued or ongoing speech *before* starting new one.
        // This makes the TTS feel much more responsive ("fluid").
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = 1; // Default pitch

        // --- Event Handlers for Utterance ---
        utterance.onstart = () => {
            // console.log("Speech started");
            setIsSpeaking(true); // Update state when speech actually starts
        };

        utterance.onend = () => {
            // console.log("Speech finished naturally");
            setIsSpeaking(false); // Update state when speech finishes
        };

        utterance.onerror = (event) => {
             // Log 'interrupted' errors as warnings, as they are common if user clicks fast
             if (event.error === 'interrupted') {
                 console.warn('Speech synthesis interrupted.');
             } else {
                 console.error('SpeechSynthesisUtterance.onerror:', event);
                 setError(`Erreur de synthèse vocale: ${event.error}`); // Show other errors to user
             }
             setIsSpeaking(false); // ALWAYS reset speaking state on error/interruption
        };

        utterance.onboundary = () => {
             // Fallback: If speech stops unexpectedly without onend/onerror, check status
             if (!window.speechSynthesis.speaking) {
                 // console.log("Boundary check found speech stopped, resetting state.");
                 setIsSpeaking(false);
             }
         };
        // --- End of Event Handlers ---

        // Find a suitable French voice
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(voice => voice.lang === lang || voice.lang.startsWith(lang.split('-')[0]));
        if (targetVoice) {
            utterance.voice = targetVoice;
        } else {
            console.warn(`Voice for lang "${lang}" not found.`);
        }

        // Use try-catch for the speak call itself, though most errors come via onerror
        try {
             window.speechSynthesis.speak(utterance);
        } catch (e) {
             console.error("Error calling window.speechSynthesis.speak:", e);
             setError("Erreur lors du démarrage de la synthèse vocale.");
             setIsSpeaking(false); // Reset state if the call itself fails
        }

    }, [speechSynthesisSupported, isSpeaking]); // isSpeaking dependency ensures checks use current state

    // --- Stop Speech Function ---
    const stopSpeaking = useCallback(() => {
        if (speechSynthesisSupported && window.speechSynthesis.speaking) {
            // console.log("Manual stop requested");
            window.speechSynthesis.cancel();
            // Let the utterance's onend/onerror handle setting isSpeaking=false for accuracy
        }
    }, [speechSynthesisSupported]);


    // --- Component Data Logic ---
    const levelKeys = useMemo(() => Object.keys(gameData), []); // Memoize keys

    // --- Initialize Syllable States when level changes ---
    const initializeSyllableStates = useCallback((syllableWordsArray) => {
        const initialStates = {};
        if (Array.isArray(syllableWordsArray)) {
            syllableWordsArray.forEach(word => {
                 if (word?.id && Array.isArray(word.syllables)) {
                    initialStates[word.id] = {
                        constructed: [],
                        isCorrect: null, // null = unchecked, true = correct, false = incorrect
                        shuffledSyllables: shuffleArray(word.syllables) // Shuffle syllables for the game
                    };
                 } else { console.warn("Invalid syllable word data found:", word); }
            });
        }
        setSyllableStates(initialStates);
    }, []); // No dependencies needed, it's a pure function based on input

    // --- Effect to Reset State on Level Change ---
    useEffect(() => {
        if (selectedLevelId) {
            // console.log(`Level changed to: ${selectedLevelId}. Resetting state.`);
            stopSpeaking(); // Stop any speech from the previous level
            setCurrentQuestionIndex(0);
            setSelectedAnswer('');
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(false);
            setScore(0);
            setShowQCMResults(false);
            setError(null); // Clear previous level errors
            // Initialize syllables for the *new* level
            initializeSyllableStates(gameData[selectedLevelId]?.syllableWords);
        }
    }, [selectedLevelId, stopSpeaking, initializeSyllableStates]); // Dependencies: run when level changes


    // --- Memoized Current Level Data ---
    const currentLevelData = useMemo(() => {
        if (!selectedLevelId || !gameData[selectedLevelId]) return null;
        return gameData[selectedLevelId];
    }, [selectedLevelId]);

    // --- Tab Change Handler ---
    const handleTabChange = (event, newValue) => {
        if (newValue !== selectedLevelId && !isLoading) { // Prevent change while initially loading
            setSelectedLevelId(newValue);
        }
    };

    // --- QCM Handlers ---
    const handleAnswerSelect = (event) => {
        if (!isAnswerSubmitted) { // Allow change only if not submitted
            setSelectedAnswer(event.target.value);
        }
    };

    const handleCheckAnswer = useCallback(() => {
        // Prevent check if no answer, already submitted, or TTS is active
        if (!selectedAnswer || isAnswerSubmitted || isSpeaking) return;
        const currentQuestion = currentLevelData?.questions?.[currentQuestionIndex];
        if (!currentQuestion) return;

        // stopSpeaking(); // Let speakText handle cancel implicitly
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsAnswerCorrect(correct);
        setIsAnswerSubmitted(true);
        if (correct) setScore(prevScore => prevScore + 1);
        speakText(correct ? "Correct !" : "Incorrect."); // Give audio feedback

    }, [selectedAnswer, isAnswerSubmitted, isSpeaking, currentLevelData, currentQuestionIndex, speakText]);

    const handleNextQuestion = useCallback(() => {
        if (isSpeaking) return; // Prevent advancing while feedback is spoken
        stopSpeaking(); // Explicitly stop any lingering speech before moving on
        const totalQuestions = currentLevelData?.questions?.length || 0;
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            // Reset state for the next question
            setSelectedAnswer('');
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(false);
        } else {
            setShowQCMResults(true); // All questions answered, show results
        }
    }, [isSpeaking, currentLevelData, currentQuestionIndex, stopSpeaking]);

     const handleRestartQCM = useCallback(() => {
         if (isSpeaking) return; // Prevent restart while speaking
         stopSpeaking(); // Stop any speech
         // Reset QCM states to initial values
         setCurrentQuestionIndex(0);
         setSelectedAnswer('');
         setIsAnswerSubmitted(false);
         setIsAnswerCorrect(false);
         setScore(0);
         setShowQCMResults(false);
    }, [isSpeaking, stopSpeaking]);


    // --- Syllable Handlers ---
    const handleSyllableClick = useCallback((wordId, syllable) => {
         const currentState = syllableStates[wordId];
         // Prevent action if word is already marked correct or TTS is active
        if (!currentState || currentState.isCorrect === true || isSpeaking) return;
        // No need to call stopSpeaking() here, speakText handles cancellation
        speakText(syllable); // Speak the clicked syllable
        // Update state: add syllable to constructed array, reset correctness check
        setSyllableStates(prevState => ({
            ...prevState,
            [wordId]: {
                ...prevState[wordId],
                constructed: [...prevState[wordId].constructed, syllable],
                isCorrect: null // Reset correctness status as word has changed
            }
        }));
    }, [syllableStates, isSpeaking, speakText]);

     const handleCheckSyllableWord = useCallback((wordId) => {
        const wordData = currentLevelData?.syllableWords?.find(w => w.id === wordId);
        const currentState = syllableStates[wordId];
        // Prevent check if data missing, already checked, or TTS active
        if (!wordData || !currentState || currentState.isCorrect !== null || isSpeaking) return;

        const constructedWord = currentState.constructed.join('');
        // Compare case-insensitively and ignore potential spaces in target word
        const correctWord = wordData.word ? wordData.word.replace(/\s/g, '') : '';
        const isCorrect = constructedWord.toLowerCase() === correctWord.toLowerCase();

        // --- Speak Constructed Word & Feedback with Delay ---
        let feedbackDelay = 50; // Short delay if nothing constructed
        if (constructedWord) {
            speakText(constructedWord); // Speak the built word first
            feedbackDelay = 700; // Longer delay to allow constructed word speech to potentially finish
        }

        // Update state immediately to show visual result
        setSyllableStates(prevState => ({
            ...prevState,
            [wordId]: { ...prevState[wordId], isCorrect: isCorrect }
        }));

        // Queue feedback speech after a short delay
        const feedbackTimeoutId = setTimeout(() => {
             speakText(isCorrect ? "Correct !" : "Essayez encore.");
        }, feedbackDelay);

        // Cleanup timeout if component unmounts or level changes
        return () => clearTimeout(feedbackTimeoutId);

    }, [currentLevelData, syllableStates, isSpeaking, speakText]);

     const handleResetSyllables = useCallback((wordId) => {
         const wordData = currentLevelData?.syllableWords?.find(w => w.id === wordId);
         // Prevent reset if data missing or TTS active
         if (!wordData || isSpeaking) return;
         stopSpeaking(); // Cancel any ongoing speech before resetting
         speakText("Effacé"); // Give feedback for reset
         // Reset state for this word: clear constructed, reset correctness, reshuffle options
         setSyllableStates(prevState => {
             const currentSyllables = wordData.syllables || [];
             return {
                ...prevState,
                [wordId]: {
                    ...prevState[wordId],
                    constructed: [],
                    isCorrect: null,
                    shuffledSyllables: shuffleArray(currentSyllables) // Re-shuffle
                }
             };
        });
    }, [currentLevelData, isSpeaking, stopSpeaking, speakText]);

    const handleSpeakWord = useCallback((word) => {
        if (isSpeaking || !word) return; // Prevent if speaking or no word
        // stopSpeaking(); // Let speakText handle cancel implicitly
        speakText(word);
    }, [isSpeaking, speakText]);


    // --- Render Logic ---

    // Loading State
    if (isLoading) {
        return ( <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress /></Container> );
     }

    // Render Tabs Function
    const renderTabs = () => (
         <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedLevelId || false} onChange={handleTabChange} aria-label="Niveaux d'apprentissage" centered variant="fullWidth">
                {levelKeys.map((key) => (
                    <Tab icon={<SpeakerNotes />} iconPosition="start"
                         label={gameData[key]?.label || key} // Use label from data, fallback to key
                         value={key} key={key}
                         sx={{ fontWeight: selectedLevelId === key ? 'bold' : 'normal' }}
                         disabled={isLoading} // Disable tabs during initial load (though loading state handles this mostly)
                         />
                ))}
            </Tabs>
        </Box>
    );

     // Handle case where level data might be missing after initial load
     if (!currentLevelData) {
         return (
             <Container maxWidth="md" sx={{ mt: 4 }}>
                 {renderTabs()}
                 <Alert severity={error ? "error" : "warning"} sx={{mt: 2}}>
                     {error || "Veuillez sélectionner un niveau valide ou les données sont manquantes."}
                 </Alert>
             </Container>
         );
     }

    // Destructure data for the current level (only needed variables)
    const { text, questions, syllableWords } = currentLevelData;
    const currentQuestion = questions?.[currentQuestionIndex];
    const totalQuestions = questions?.length || 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {renderTabs()}
            {/* Display general errors (like TTS not supported) */}
            {error && !isLoading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

             {/* --- Main Text Content Section --- */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f9f9f9' }}>
                 <Card raised sx={{ p: { xs: 1, sm: 2 } }}>
                    <CardContent>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Audiotrack sx={{ mr: 1, color: 'secondary.main' }} /> Contenu
                            </Typography>
                            {/* TTS Controls for the main text */}
                            {speechSynthesisSupported && text && (
                                <Box>
                                    {!isSpeaking ? (
                                        <Tooltip title="Lire le texte">
                                            {/* Disable button slightly if no text exists */}
                                            <span>
                                            <IconButton color="primary" onClick={() => speakText(text)} aria-label="Lire le texte" disabled={!text}>
                                                <VolumeUp />
                                            </IconButton>
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Arrêter la lecture">
                                            <IconButton color="secondary" onClick={stopSpeaking} aria-label="Arrêter la lecture">
                                                <StopCircle />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            )}
                        </Box>
                        {/* Display the main text */}
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                            {text || "Pas de texte disponible pour ce niveau."}
                        </Typography>
                        {/* Warning if TTS is not supported */}
                        {!speechSynthesisSupported && (
                            <Alert severity="warning" sx={{mt: 1}}>Synthèse vocale non supportée par ce navigateur.</Alert>
                        )}
                    </CardContent>
                </Card>
            </Paper>

            {/* --- Interactive QCM Section --- */}
            {/* Render only if questions exist for the level */}
            {Array.isArray(questions) && questions.length > 0 && (
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'secondary.dark' }}>
                        <QuestionAnswer sx={{ mr: 1 }} /> Questions ({showQCMResults ? totalQuestions : currentQuestionIndex + 1}/{totalQuestions})
                    </Typography>

                    {/* Display Question or Results */}
                    {!showQCMResults && currentQuestion ? (
                        <Box key={currentQuestion.id}> {/* Key ensures re-render on question change */}
                            <FormControl component="fieldset" variant="standard" fullWidth
                                         disabled={isAnswerSubmitted} /* Disable radio group after submission */
                                         sx={{mb: 2}}>
                                <FormLabel component="legend" sx={{ typography: 'h6', mb: 2, whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                                    {currentQuestion.questionText}
                                </FormLabel>
                                <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
                                    {/* Map through options for the current question */}
                                    {(currentQuestion.options || []).map((option, index) => {
                                        const isCorrectOption = option === currentQuestion.correctAnswer;
                                        const isSelectedOption = option === selectedAnswer;

                                        return (
                                            <FormControlLabel
                                                key={`${currentQuestion.id}-opt-${index}`} value={option} label={option}
                                                control={<Radio sx={{
                                                    // Dynamic coloring based on submission state and correctness
                                                    color: isAnswerSubmitted ? (isCorrectOption ? 'success.main' : (isSelectedOption ? 'error.main' : 'action.disabled')) : 'primary.main',
                                                    '&.Mui-checked': { color: isAnswerSubmitted ? (isCorrectOption ? 'success.main' : 'error.main') : 'primary.main' },
                                                }} />}
                                                sx={theme => ({ // Use theme callback for alpha access
                                                    width: '100%', mb: 1, p: 1.5, borderRadius: 1, border: 2,
                                                    // Dynamic border color
                                                    borderColor: isAnswerSubmitted
                                                        ? (isCorrectOption ? 'success.main' : (isSelectedOption ? 'error.main' : 'grey.300'))
                                                        : 'grey.300',
                                                    // Dynamic background color with transparency using alpha()
                                                    bgcolor: isAnswerSubmitted
                                                        ? (isCorrectOption ? alpha(theme.palette.success.light, 0.3) // Correct: ~30% green
                                                            : (isSelectedOption ? alpha(theme.palette.error.light, 0.3) // Incorrect Selected: ~30% red
                                                                : 'transparent')) // Others transparent
                                                        : 'transparent', // Default transparent
                                                    // Fade out non-selected, non-correct options slightly after submission
                                                    opacity: isAnswerSubmitted && !isSelectedOption && !isCorrectOption ? 0.7 : 1,
                                                    transition: 'background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
                                                    // Hover effect only when not submitted
                                                    '&:hover': !isAnswerSubmitted ? { borderColor: 'primary.main', bgcolor: alpha(theme.palette.action.hover, 0.04) } : {},
                                                })}
                                            />
                                        );
                                    })}
                                </RadioGroup>
                            </FormControl>

                             {/* --- Action Buttons & Feedback Area --- */}
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                {/* Feedback Alert - Fades in */}
                                <Fade in={isAnswerSubmitted} timeout={500} style={{ transitionDelay: isAnswerSubmitted ? '100ms' : '0ms' }}>
                                    {/* Use Box to reserve space and manage visibility smoothly */}
                                    <Box sx={{ width: '100%', minHeight: {xs: '60px', sm:'50px'}, visibility: isAnswerSubmitted ? 'visible' : 'hidden' }}>
                                        <Alert severity={isAnswerCorrect ? "success" : "error"}
                                               icon={isAnswerCorrect ? <CheckCircleOutline /> : <CancelOutlined />}
                                               sx={{ width: '100%' }}>
                                            {isAnswerCorrect ? "Bonne réponse !" : (currentQuestion.correctAnswer ? `Incorrect. La bonne réponse est : ${currentQuestion.correctAnswer}` : "Incorrect.")}
                                        </Alert>
                                    </Box>
                                </Fade>
                                {/* Check / Next / Results Button */}
                                <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center'} }}>
                                    {!isAnswerSubmitted ? (
                                        <Button variant="contained" onClick={handleCheckAnswer}
                                                disabled={!selectedAnswer || isSpeaking /* Disable if no selection or speaking */}
                                                >Vérifier</Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={handleNextQuestion}
                                                disabled={isSpeaking /* Disable while feedback is playing */}
                                                >
                                            {currentQuestionIndex < totalQuestions - 1 ? "Suivant" : "Voir les Résultats"}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ) : showQCMResults ? (
                        // QCM Results View
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                             <Typography variant="h6" gutterBottom>Résultats du QCM</Typography>
                            <Typography variant="body1" gutterBottom>Votre score : {score} / {totalQuestions}</Typography>
                            <Button variant="outlined" startIcon={<Replay />} onClick={handleRestartQCM}
                                    disabled={isSpeaking /* Disable if speaking */}
                                    >Recommencer le QCM</Button>
                        </Box>
                    ) : (
                        // Fallback if currentQuestion is somehow null before results
                         <Typography sx={{p: 2, fontStyle: 'italic'}}>Chargement de la question...</Typography>
                    )}
                </Paper>
            )}


            {/* --- Syllable Construction Section --- */}
            {/* Render only if syllableWords exist and is an array with items */}
            {Array.isArray(syllableWords) && syllableWords.length > 0 && (
                <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'secondary.dark' }}>
                        <Spellcheck sx={{ mr: 1 }} /> Construis les mots
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {/* Map through each word defined in syllableWords */}
                        {syllableWords.map((sylWord) => {
                            // Get the current state for this specific word
                            const wordState = syllableStates[sylWord.id] || { constructed: [], isCorrect: null, shuffledSyllables: [] };
                            const isWordComplete = wordState.isCorrect !== null; // Is the word checked (true or false)?
                            const isWordCorrect = wordState.isCorrect === true; // Is the word specifically correct?

                            return (
                                <Grid item xs={12} sm={6} md={4} key={sylWord.id}>
                                    <Card raised sx={{
                                            height: '100%', display: 'flex', flexDirection: 'column',
                                            // Dynamic border based on correctness
                                            border: 3,
                                            borderColor: isWordComplete ? (isWordCorrect ? 'success.main' : 'error.main') : 'grey.200',
                                            transition: 'border-color 0.4s ease-in-out',
                                            // Optional: subtle shadow effect on completion
                                            boxShadow: isWordComplete ? (isWordCorrect ? '0 0 12px rgba(76, 175, 80, 0.4)' : '0 0 12px rgba(244, 67, 54, 0.4)') : 3 // Default elevation shadow
                                            }}>
                                        {/* Icon and Target Word Area */}
                                        <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-around', bgcolor: 'grey.100', p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                                            <Box sx={{ color: 'primary.main', fontSize: '3rem' }}>{getIconForWord(sylWord.word)}</Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                <Typography variant="h6" sx={{ mr: 0.5 }}>{sylWord.word}</Typography>
                                                {/* Button to speak the target word */}
                                                <Tooltip title={`Écouter le mot "${sylWord.word}"`}>
                                                    <span> {/* Span needed for tooltip on disabled button */}
                                                        <IconButton size="small" onClick={() => handleSpeakWord(sylWord.word)}
                                                                    disabled={isSpeaking || !sylWord.word} /* Disable if speaking or no word */
                                                                    color="secondary">
                                                            <Mic />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                             </Box>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                                            {/* Constructed Syllables Area */}
                                            <Tooltip title={wordState.constructed.length > 0 ? `Cliquer pour écouter "${wordState.constructed.join('')}"` : 'Zone où les syllabes apparaissent'} placement="top">
                                                <Box
                                                    onClick={() => wordState.constructed.length > 0 && !isSpeaking && speakText(wordState.constructed.join(''))}
                                                    sx={theme => ({ // Theme callback for alpha
                                                        minHeight: '50px', border: '2px dashed', borderColor: 'grey.400', borderRadius: 1, p: 1, mb: 2,
                                                        display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'center',
                                                        // Make cursor indicate clickability only when appropriate
                                                        cursor: wordState.constructed.length > 0 && !isSpeaking ? 'pointer' : 'default',
                                                        // Background color based on correctness (with transparency)
                                                        bgcolor: isWordComplete
                                                            ? (isWordCorrect ? alpha(theme.palette.success.light, 0.2) : alpha(theme.palette.error.light, 0.2))
                                                            : alpha(theme.palette.action.hover, 0.04), // Default subtle bg
                                                        transition: 'background-color 0.3s ease',
                                                    })}
                                                >
                                                    {wordState.constructed.length > 0 ? (
                                                        // Display constructed syllables as chips
                                                        wordState.constructed.map((s, i) => <Chip key={`${sylWord.id}-const-${i}`} label={s} size="medium" variant="filled" color="secondary" sx={{ fontWeight: 'bold', boxShadow: 3 }}/>)
                                                    ) : (
                                                        // Placeholder text if empty
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>Cliquez sur les syllabes ci-dessous...</Typography>
                                                    )}
                                                </Box>
                                            </Tooltip>

                                            {/* Available Syllables - Only show if not yet correctly completed */}
                                            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: '40px',
                                                         // Hide available syllables once the word is correct
                                                         visibility: isWordCorrect ? 'hidden' : 'visible' }}>
                                                {/* Only render if not correct */}
                                                {!isWordCorrect && (wordState.shuffledSyllables || []).map((syllable, index) => (
                                                    <Tooltip title={`Ajouter la syllabe "${syllable}"`} key={`${sylWord.id}-avail-${index}`}>
                                                        <span> {/* Span needed for tooltip on disabled chip */}
                                                            <Chip label={syllable}
                                                                  onClick={() => handleSyllableClick(sylWord.id, syllable)}
                                                                  variant="outlined" color="primary"
                                                                  disabled={isSpeaking || isWordComplete} /* Disable if speaking or already checked */
                                                                  clickable={!isSpeaking && !isWordComplete} // Make it explicitly clickable only when enabled
                                                                  sx={{ cursor: (isSpeaking || isWordComplete) ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 'medium', p: 0.5 }}/>
                                                         </span>
                                                    </Tooltip>
                                                ))}
                                            </Box>

                                            {/* Feedback Icon and Action Buttons Area */}
                                             <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                                                 {/* Feedback Icon (Correct/Incorrect) - only shown when complete */}
                                                 <Box sx={{ minWidth: '30px', minHeight: '30px', display: 'flex', alignItems: 'center' }}>
                                                    {isWordComplete && ( isWordCorrect ?
                                                        <CheckCircleOutline sx={{ fontSize: '1.8rem' }} color="success" /> :
                                                        <CancelOutlined sx={{ fontSize: '1.8rem' }} color="error" />
                                                    )}
                                                </Box>
                                                {/* Action Buttons */}
                                                <Box sx={{ display: 'flex', gap: 1}}>
                                                    <Button size="small" variant="outlined" startIcon={<Replay />}
                                                            onClick={() => handleResetSyllables(sylWord.id)}
                                                            disabled={isSpeaking} /* Disable if speaking */
                                                            >Effacer</Button>
                                                    <Button size="small" variant="contained"
                                                            onClick={() => handleCheckSyllableWord(sylWord.id)}
                                                            // Disable check if speaking, already checked, or nothing constructed
                                                            disabled={isSpeaking || isWordComplete || wordState.constructed.length === 0}
                                                            >Vérifier</Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Paper>
            )}

            {/* Show message if no syllable words defined for the level */}
             {(!Array.isArray(syllableWords) || syllableWords.length === 0) && questions && questions.length > 0 && ( // Show only if QCM exists but syllables don't
                <Alert severity="info" sx={{ mb: 4 }}>Pas d'exercice de syllabes pour ce niveau.</Alert>
            )}

        </Container>
    );
}

export default InteractiveLearningGame;