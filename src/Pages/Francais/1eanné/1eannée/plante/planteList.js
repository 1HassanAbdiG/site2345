import React, { useState, useCallback, useMemo, useEffect } from 'react';
import motsData from './plante.json'; // Import the new JSON data
import {
    Container, Typography, Card, CardContent, Grid, Button, Box, Alert, Paper, Fade, Divider,
    ThemeProvider, createTheme, CssBaseline, IconButton // Added IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'; // Icon for the speak button

// Helper function to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// Basic Theme (Optional, but recommended for consistent styling)
const quizTheme = createTheme({
    palette: {
        primary: { main: '#3f51b5' },
        secondary: { main: '#f50057' },
        success: { main: '#4caf50', light: '#e8f5e9', dark: '#388e3c' }, // Added dark
        error: { main: '#f44336', light: '#ffebee', dark: '#d32f2f' },   // Added dark
        info: { main: '#2196f3', light: '#e3f2fd', dark: '#1976d2' },   // Added info
        background: { default: '#f4f6f8', paper: '#ffffff' },
        action: { disabledBackground: '#e0e0e0', disabled: 'rgba(0, 0, 0, 0.38)' }, // For disabled options
    },
    typography: {
        fontFamily: '"Comic Sans MS", cursive, sans-serif', // Fun font for kids
        h4: { fontWeight: 'bold', color: '#3f51b5', marginBottom: '1rem' },
        h5: { fontWeight: 'bold', marginBottom: '1rem' },
        h6: { color: '#555', lineHeight: 1.6 },
        body1: { fontSize: '1rem' },
        body2: { fontSize: '0.9rem' },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 'bold', borderRadius: 20, padding: '10px 20px' } } },
        MuiCard: { styleOverrides: { root: { transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } } } },
        MuiAlert: { styleOverrides: { root: { borderRadius: 8, alignItems: 'center' } } },
    }
});

const PlanteQuiz = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answersSummary, setAnswersSummary] = useState([]);
    const [quizData, setQuizData] = useState(() => shuffleArray(motsData));

    const currentItem = useMemo(() => quizData[currentIndex], [quizData, currentIndex]);

    const generateOptions = useCallback(() => {
        if (!currentItem) return [];

        const otherOptions = quizData
            .filter((item) => item.mot !== currentItem.mot)
            .map((item) => item.mot);

        const uniqueOtherOptions = Array.from(new Set(otherOptions));
        const sampledOptions = shuffleArray(uniqueOtherOptions).slice(0, 3);
        const allOptions = shuffleArray([...sampledOptions, currentItem.mot]);
        return allOptions;
    }, [currentItem, quizData]);

    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(generateOptions());
    }, [currentItem, generateOptions]);

    // --- NEW: Text-to-Speech Functionality ---
    const speakDefinition = useCallback(() => {
        if (!currentItem || !currentItem.definition) return;

        if ('speechSynthesis' in window) {
            // Cancel any previous speech first
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(currentItem.definition);
            // Set language for better pronunciation (adjust if needed)
            utterance.lang = 'fr-FR';
            utterance.pitch = 1; // Range 0-2
            utterance.rate = 0.9; // Range 0.1-10
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("La synthèse vocale n'est pas supportée par ce navigateur.");
            // Optionally show an alert to the user
            // alert("Désolé, la lecture audio n'est pas disponible sur votre navigateur.");
        }
    }, [currentItem]); // Dependency on currentItem to get the correct definition


    // --- FIXED: Dependency Array for handleAnswer ---
    const handleAnswer = useCallback((answer) => {
        if (showResult) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === currentItem.mot;
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        setAnswersSummary(prevSummary => [
            ...prevSummary,
            {
                id: currentItem.mot + currentIndex, // Unique key for list rendering
                definition: currentItem.definition,
                correctAnswer: currentItem.mot,
                userAnswer: answer,
                isCorrect,
            },
        ]);
    }, [currentItem, showResult, currentIndex]); // Added currentIndex dependency

    const nextQuestion = useCallback(() => {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        setSelectedAnswer(null);
        setShowResult(false);
        // Stop any ongoing speech synthesis when moving to the next question
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, [currentIndex]);

    const restartQuiz = useCallback(() => {
        setQuizData(shuffleArray(motsData));
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setAnswersSummary([]);
         // Stop any ongoing speech synthesis on restart
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    // --- Render Logic ---

    // End Screen
    if (!currentItem) {
        return (
            <ThemeProvider theme={quizTheme}>
                <CssBaseline />
                <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                        <EmojiEventsIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Quiz terminé !
                        </Typography>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Ton score : {score} / {quizData.length}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            Résumé de tes réponses :
                        </Typography>
                        <Box sx={{ maxHeight: '40vh', overflowY: 'auto', textAlign: 'left', mb: 3, pr: 1 }}>
                            {answersSummary.map((entry) => (
                                <Alert
                                    key={entry.id}
                                    severity={entry.isCorrect ? "success" : "error"}
                                    icon={entry.isCorrect ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                                    sx={{ mb: 1.5, textAlign: 'left' }}
                                >
                                    <Typography variant="body2" component="div"><strong>Définition:</strong> {entry.definition}</Typography>
                                    <Typography variant="body2" component="div"><strong>Ta réponse:</strong> <Box component="span" sx={{ color: entry.isCorrect ? 'success.dark' : 'error.dark', fontWeight: 'bold' }}>{entry.userAnswer}</Box></Typography>
                                    {!entry.isCorrect && (
                                        <Typography variant="body2" component="div"><strong>Bonne réponse:</strong> <Box component="span" sx={{ fontWeight: 'bold' }}>{entry.correctAnswer}</Box></Typography>
                                    )}
                                </Alert>
                            ))}
                        </Box>
                        <Button variant="contained" startIcon={<ReplayIcon />} onClick={restartQuiz} size="large">
                            Recommencer le quiz
                        </Button>
                    </Paper>
                </Container>
            </ThemeProvider>
        );
    }

    // Question Screen
    return (
        <ThemeProvider theme={quizTheme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Fade in={true} timeout={500}>
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Question {currentIndex + 1} / {quizData.length}
                        </Typography>
                        <Typography variant="h5" align="center" color="secondary" sx={{ mb: 3 }}>
                            Trouve le bon mot !
                        </Typography>

                        {/* Definition Box - Enhanced */}
                        <Paper
                            elevation={1}
                            sx={{
                                mb: 4,
                                p: { xs: 1.5, sm: 2 }, // Adjusted padding
                                backgroundColor: 'info.light',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5 // Spacing between icon, text, and button
                            }}
                        >
                            <LightbulbIcon color="info" sx={{ fontSize: 30, flexShrink: 0 }} />
                            {/* --- MODIFIED: Definition Typography Styling --- */}
                            <Typography
                                component="p" // Keep as p for semantics
                                sx={{
                                    flexGrow: 1, // Allow text to take available space
                                    color: 'info.dark',
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }, // Larger font size, responsive
                                    fontWeight: 500, // Slightly bolder
                                    lineHeight: 1.5, // Improved readability
                                    textAlign: 'left', // Align text left
                                }}
                            >
                                {currentItem.definition}
                            </Typography>
                            {/* --- NEW: Speak Button --- */}
                            <IconButton
                                onClick={speakDefinition}
                                color="info" // Use info color to match the box
                                aria-label="Lire la définition"
                                title="Lire la définition" // Tooltip on hover
                                sx={{ flexShrink: 0 }} // Prevent button from shrinking
                            >
                                <VolumeUpIcon />
                            </IconButton>
                        </Paper>

                        {/* Options Grid */}
                        <Grid container spacing={2} justifyContent="center">
                            {options.map((option, index) => {
                                const isCorrect = option === currentItem.mot;
                                const isSelected = option === selectedAnswer;
                                let cardBgColor = 'background.paper';
                                let textColor = 'text.primary';
                                let border = '1px solid rgba(0,0,0,0.1)';
                                let elevation = showResult ? 1 : 2; // Lower elevation when showing result

                                if (showResult) {
                                    if (isCorrect) {
                                        cardBgColor = 'success.light';
                                        textColor = 'success.dark';
                                        border = `2px solid ${quizTheme.palette.success.main}`;
                                    } else if (isSelected) {
                                        cardBgColor = 'error.light';
                                        textColor = 'error.dark';
                                        border = `2px solid ${quizTheme.palette.error.main}`;
                                    } else {
                                        // Fade out incorrect, unselected options
                                        cardBgColor = 'action.disabledBackground';
                                        textColor = 'text.disabled';
                                        border = `1px solid ${quizTheme.palette.action.disabledBackground}`;
                                    }
                                }

                                return (
                                    <Grid item xs={12} sm={6} key={option + '-' + index}> {/* More robust key */}
                                        <Card
                                            elevation={elevation}
                                            sx={{
                                                cursor: showResult ? 'default' : 'pointer',
                                                backgroundColor: cardBgColor,
                                                border: border,
                                                transition: 'background-color 0.3s, border 0.3s, transform 0.2s, box-shadow 0.2s',
                                                pointerEvents: showResult ? 'none' : 'auto',
                                                minHeight: '60px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': !showResult ? { // Only apply hover effect if not showing result
                                                    transform: 'scale(1.03)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                 } : {}
                                            }}
                                            onClick={() => handleAnswer(option)}
                                        >
                                            <CardContent sx={{ p: 1.5 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium', color: textColor, textAlign: 'center' }}>
                                                    {option}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Result and Next Button Area */}
                        {showResult && (
                            <Fade in={showResult} timeout={500}>
                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    {selectedAnswer === currentItem.mot ? (
                                        <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>Bravo ! C’est la bonne réponse 🎉</Alert>
                                    ) : (
                                        <Alert severity="error" icon={<CancelIcon fontSize="inherit" />}>
                                            Dommage ! La bonne réponse était : <strong>{currentItem.mot}</strong>
                                        </Alert>
                                    )}
                                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={nextQuestion} endIcon={<ArrowForwardIcon />}>
                                        {currentIndex + 1 < quizData.length ? "Question suivante" : "Voir le bilan"}
                                    </Button>
                                </Box>
                            </Fade>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </ThemeProvider>
    );
};

export default PlanteQuiz;