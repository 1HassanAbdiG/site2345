import React, { useState, useCallback, useMemo, useEffect } from 'react';
import motsData from './sens.json'; // Import the new JSON data
import {
    Container, Typography, Card, CardContent, Grid, Button, Box, Alert, Paper, Fade, Divider, 
    ThemeProvider, createTheme, CssBaseline 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // For score display
import LightbulbIcon from '@mui/icons-material/Lightbulb'; // For definition display

// Helper function to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// Basic Theme (Optional, but recommended for consistent styling)
const quizTheme = createTheme({
    palette: {
        primary: { main: '#3f51b5' },
        secondary: { main: '#f50057' },
        success: { main: '#4caf50', light: '#e8f5e9' },
        error: { main: '#f44336', light: '#ffebee' },
        background: { default: '#f4f6f8', paper: '#ffffff' },
    },
    typography: {
        fontFamily: '"Comic Sans MS", cursive, sans-serif', // Fun font for kids
        h4: { fontWeight: 'bold', color: '#3f51b5', marginBottom: '1rem' },
        h5: { fontWeight: 'bold', marginBottom: '1rem' },
        h6: { color: '#555', lineHeight: 1.6 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 'bold', borderRadius: 20, padding: '10px 20px' } } },
        MuiCard: { styleOverrides: { root: { transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } } } },
        MuiAlert: { styleOverrides: { root: { borderRadius: 8, alignItems: 'center' } } },
    }
});

const SensesQuiz = () => {
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
                id: currentItem.mot + currentIndex,
                definition: currentItem.definition,
                correctAnswer: currentItem.mot,
                userAnswer: answer,
                isCorrect,
            },
        ]);
    }, [currentItem, currentIndex, showResult]);

    const nextQuestion = useCallback(() => {
        const next = currentIndex + 1;
        setCurrentIndex(next); 
        setSelectedAnswer(null);
        setShowResult(false);
    }, [currentIndex]);

    const restartQuiz = useCallback(() => {
        setQuizData(shuffleArray(motsData)); 
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setAnswersSummary([]);
    }, []);

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

                        {/* Definition Box */}
                        <Paper elevation={1} sx={{ mb: 1, p: 3, backgroundColor: '#fff', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 , fontSize: 50}}>
                            <LightbulbIcon color="info" sx={{ fontSize: 50 }} />
                            <Typography variant="h4" component="p" sx={{ color: 'info.dark' }}>
                                {currentItem.definition}
                            </Typography>
                        </Paper>

                        {/* Options Grid */}
                        <Grid container spacing={2} justifyContent="center">
                            {options.map((option, index) => {
                                const isCorrect = option === currentItem.mot;
                                const isSelected = option === selectedAnswer;
                                let cardBgColor = 'background.paper'; 
                                let textColor = 'text.primary';
                                let border = '1px solid rgba(0,0,0,0.1)';

                                if (showResult) {
                                    if (isCorrect) {
                                        cardBgColor = 'success.light';
                                        textColor = 'success.dark';
                                        border = '2px solid green';
                                    } else if (isSelected) {
                                        cardBgColor = 'error.light';
                                        textColor = 'error.dark';
                                        border = '2px solid red';
                                    } else {
                                        cardBgColor = 'action.disabledBackground';
                                        textColor = 'text.disabled';
                                        border = '1px solid rgba(0,0,0,0.1)';
                                    }
                                }

                                return (
                                    <Grid item xs={12} sm={6} key={option + index}>
                                        <Card
                                            elevation={showResult ? 1 : 2}
                                            sx={{
                                                cursor: showResult ? 'default' : 'pointer',
                                                backgroundColor: cardBgColor,
                                                border: border,
                                                transition: 'background-color 0.3s, border 0.3s',
                                                pointerEvents: showResult ? 'none' : 'auto', 
                                                minHeight: '60px', 
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
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
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<ArrowForwardIcon />}
                                    size="large"
                                    onClick={nextQuestion}
                                    disabled={currentIndex === quizData.length - 1}
                                >
                                    Question suivante
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </ThemeProvider>
    );
};

export default SensesQuiz;
