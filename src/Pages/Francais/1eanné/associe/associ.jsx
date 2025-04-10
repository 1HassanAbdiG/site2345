import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Confetti from 'react-confetti';

// --- MUI Imports ---
import {
    Container, Typography, Box, Grid, Card, CardActionArea, CardMedia,
    Collapse, Alert, AlertTitle, Button, LinearProgress, Paper, Stack, Chip,
    useTheme, useMediaQuery, CircularProgress // Added CircularProgress for loading
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutline as ErrorOutlineIcon,
    Replay as ReplayIcon, Timer as TimerIcon, School as SchoolIcon,
    ImageSearch as ImageSearchIcon // Example icon
} from '@mui/icons-material';

// --- Data Import ---
// Import statement might cause issues if JSON is very large or with certain bundlers.
// Consider fetching if needed, but import is usually fine for moderate data.
import gameData from './assoiimage.json'; // Adjust path if needed
import RetrouvePhrase from '../phrseMelanger/phrsemelange';

// --- Custom Hook for Window Size ---
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]); // Initial size 0 to avoid SSR issues maybe
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return { width: size[0], height: size[1] };
};

// --- Dynamic Image Loading Function ---
const loadImage = (imagePath) => {
    try {
        // Assumes imagePath starts with './' and is relative to *this* component file
        return require(`${imagePath}`);
    } catch (error) {
        console.error(`Erreur chargement image: ${imagePath}`, error);
        // Return a placeholder or handle the error visually
        // Example: Using a simple placeholder text or a default broken image icon
        return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20fill%3D%22%23999%22%3EImage%20introuvable%3C%2Ftext%3E%3C%2Fsvg%3E';
    }
};

// --- Shuffle Function ---
const shuffleArray = (array) => {
    if (!Array.isArray(array)) return [];
    return [...array].sort(() => Math.random() - 0.5);
};

// --- Component ---
const AssociImage = () => {
    // --- Hooks ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    // --- State ---
    const [currentSet, setCurrentSet] = useState(null); // Start as null until loaded
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shuffledImages, setShuffledImages] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(null); // null | true | false
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const [clicked, setClicked] = useState(false); // Disable options after click
    const [runConfetti, setRunConfetti] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [errorLoading, setErrorLoading] = useState(null); // Error state

    // --- Effects ---
    // Load data on mount
    useEffect(() => {
        try {
            // Simulate loading delay if needed:
            // setTimeout(() => {
                if (!gameData || !gameData.questions || gameData.questions.length === 0) {
                   throw new Error("Format JSON invalide ou questions manquantes.");
                }
                setCurrentSet(gameData); // Load the imported data
                setIsLoading(false);
                setStartTime(Date.now());
            // }, 500); // Simulate 0.5 second load
        } catch (err) {
            console.error("Erreur lors du chargement des données du jeu:", err);
            setErrorLoading("Impossible de charger les données du jeu. Vérifiez le fichier JSON et rechargez.");
            setIsLoading(false);
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Shuffle images when question or set changes
    useEffect(() => {
        if (currentSet && currentSet.questions && currentSet.questions[currentQuestionIndex]) {
            const imagesToShuffle = currentSet.questions[currentQuestionIndex].images;
             // Basic validation
            if (Array.isArray(imagesToShuffle) && imagesToShuffle.length > 0) {
                 setShuffledImages(shuffleArray(imagesToShuffle));
            } else {
                console.error("Images manquantes ou invalides pour la question:", currentQuestionIndex);
                 // Handle this error state, maybe skip question or show error
                 setShuffledImages([]); // Set empty to avoid crash
            }
        }
    }, [currentQuestionIndex, currentSet]);

    // Trigger confetti on game finish
    useEffect(() => {
        if (gameFinished) {
            // Only run confetti if the score is reasonably good (optional)
            // const successThreshold = totalQuestions ? Math.ceil(totalQuestions * 0.6) : 1; // e.g., 60%
            // if (score >= successThreshold) {
                setRunConfetti(true);
                const timer = setTimeout(() => setRunConfetti(false), 7000); // Run for 7 seconds
                return () => clearTimeout(timer);
            // }
        } else {
            setRunConfetti(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameFinished, score]); // Rerun if score changes when finished (though unlikely needed)

    // --- Memoized Values ---
    const currentQuestion = useMemo(() => {
        return currentSet?.questions?.[currentQuestionIndex];
    }, [currentSet, currentQuestionIndex]);

    const totalQuestions = useMemo(() => currentSet?.questions?.length || 0, [currentSet]);
    const progress = useMemo(() => totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0, [currentQuestionIndex, totalQuestions]);

    // --- Callbacks ---
    const resetGame = useCallback(() => {
        if (!currentSet) return; // Don't reset if data isn't loaded
        setCurrentQuestionIndex(0);
        setFeedback('');
        setIsCorrect(null);
        setScore(0);
        setErrors(0);
        setStartTime(Date.now());
        setEndTime(null);
        setGameFinished(false);
        setClicked(false);
        setRunConfetti(false);
        // Reshuffle images for the first question
        if (currentSet.questions?.[0]?.images) {
            setShuffledImages(shuffleArray(currentSet.questions[0].images));
        }
    }, [currentSet]);

    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setFeedback('');
            setIsCorrect(null);
            setClicked(false); // Re-enable clicks for the new question
        } else {
            setEndTime(Date.now());
            setGameFinished(true);
        }
    }, [currentQuestionIndex, totalQuestions]);

    const checkAnswer = useCallback((selectedImage) => {
        if (clicked || !currentQuestion) return;

        setClicked(true); // Disable options immediately
        const correct = selectedImage === currentQuestion.correctImage;

        setIsCorrect(correct);
        if (correct) {
            setFeedback("Bravo ! C'est la bonne réponse !");
            setScore(prevScore => prevScore + 1);
        } else {
             const correctImageFilename = currentQuestion.correctImage.split('/').pop();
             setFeedback(`Oups ! La bonne image pour "${currentQuestion.phrase}" était celle-ci : ${correctImageFilename.split('.')[0]}.`);
            setErrors(prevErrors => prevErrors + 1);
        }

        const timer = setTimeout(goToNextQuestion, 2800); // Slightly longer delay

        return () => clearTimeout(timer); // Cleanup timer on component unmount or quick change

    }, [clicked, currentQuestion, goToNextQuestion]);

    const getTotalTime = useCallback(() => {
        if (!startTime || !endTime) return 'N/A';
        const timeTaken = endTime - startTime;
        const seconds = Math.floor((timeTaken / 1000) % 60);
        const minutes = Math.floor((timeTaken / 1000 / 60) % 60);
        if (minutes === 0) return `${seconds} secondes`;
        return `${minutes} min ${seconds} sec`;
    }, [startTime, endTime]);

    // --- Render Logic ---

    // 1. Loading State
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
                <Typography sx={{ ml: 2 }}>Chargement du jeu...</Typography>
            </Box>
        );
    }

    // 2. Error State
    if (errorLoading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Alert severity="error">
                    <AlertTitle>Erreur</AlertTitle>
                    {errorLoading}
                </Alert>
            </Container>
        );
    }

    // 3. Game Finished Summary
    if (gameFinished) {
        const isSuccess = score > errors && score >= Math.ceil(totalQuestions * 0.5); // Example success condition
        return (
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4, position: 'relative', zIndex: 1 /* Ensure summary is above potential background */ }}>
                {/* Confetti - only on success? */}
                {runConfetti && isSuccess && (
                    <Confetti
                        width={windowWidth || 300} // Fallback width
                        height={windowHeight || 500} // Fallback height
                        recycle={false}
                        numberOfPieces={isMobile ? 180 : 400}
                        gravity={0.12}
                        initialVelocityY={15}
                        tweenDuration={6000} // Longer duration
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} // Fixed position behind summary
                    />
                )}

                <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                    <Typography variant="h4" gutterBottom component="h2" sx={{ color: isSuccess ? theme.palette.success.main : theme.palette.warning.main }}>
                        {isSuccess ? '🎉 Bravo, terminé ! 🎉' : '✨ Jeu Terminé ✨'}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {currentSet.title} - Résumé
                    </Typography>
                    <Stack spacing={2} alignItems="center" my={3}>
                         <Chip icon={<CheckCircleOutlineIcon />} label={`Score: ${score} / ${totalQuestions}`} color="success" variant="outlined" sx={{ fontSize: '1.1rem', padding: '10px 15px' }}/>
                         <Chip icon={<ErrorOutlineIcon />} label={`Erreurs: ${errors}`} color="error" variant="outlined" sx={{ fontSize: '1.1rem', padding: '10px 15px' }}/>
                         <Chip icon={<TimerIcon />} label={`Temps: ${getTotalTime()}`} color="info" variant="outlined" sx={{ fontSize: '1.1rem', padding: '10px 15px' }}/>
                    </Stack>
                    <Button variant="contained" startIcon={<ReplayIcon />} onClick={resetGame} size="large">
                        Recommencer
                    </Button>
                </Paper>
            </Container>
        );
    }

    // 4. Main Game View (if not loading, no error, not finished)
    if (!currentQuestion) {
         // Safety check if currentQuestion is somehow null after loading
         return (
             <Container maxWidth="sm" sx={{ mt: 5 }}>
                 <Alert severity="warning">Question non trouvée. Essayez de rafraîchir.</Alert>
             </Container>
         );
     }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.success.light} 100%)`, // Example: Light blue to light green gradient
                // Or a subtle pattern:
                // backgroundImage: 'url("/images/patterns/soft_lines.svg")', // Ensure path is correct in public folder
                // backgroundSize: 'cover',
                py: { xs: 2, sm: 3 }, // Responsive vertical padding
                overflow: 'hidden' // Prevent confetti overflow issues if absolutely positioned
            }}
        >
            <Container maxWidth="lg">
                {/* Progress and Info */}
                <Paper elevation={2} sx={{ p: 2, mb: 3, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(3px)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Question {currentQuestionIndex + 1} / {totalQuestions}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip icon={<CheckCircleOutlineIcon />} label={score} color="success" size="small" variant="outlined" />
                            <Chip icon={<ErrorOutlineIcon />} label={errors} color="error" size="small" variant="outlined"/>
                        </Stack>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }}/>
                    {/* The Word/Phrase to match */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '3em', mt: 1 }}>
                        <ImageSearchIcon sx={{ mr: 1, color: 'primary.main', fontSize: isMobile ? '1.8rem' : '2.2rem' }} />
                         <Typography
                             variant={isMobile ? "h5" : "h4"}
                             component="h2"
                             align="center"
                             sx={{ fontWeight: 'medium' }}
                         >
                             {currentQuestion.phrase}
                         </Typography>
                    </Box>
                </Paper>

                {/* Image Options Grid */}
                <Grid container spacing={isMobile ? 2 : 3} justifyContent="center" alignItems="stretch">
                    {shuffledImages.map((imagePath, index) => (
                        <Grid item xs={12} sm={6} md={4} key={imagePath + index} /* Use path in key for stability */ sx={{ display: 'flex' }}>
                            <Card
                                elevation={clicked ? 2 : 4} // Change elevation on click
                                sx={{
                                    width: '100%', display: 'flex', flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.3s ease',
                                    '&:hover': {
                                        transform: clicked ? 'none' : 'scale(1.04)',
                                        boxShadow: clicked ? theme.shadows[2] : theme.shadows[8], // More shadow on hover
                                    },
                                    border: '3px solid transparent', // Placeholder for colored border
                                    borderColor: clicked && imagePath === currentQuestion.correctImage ? theme.palette.success.main :
                                                clicked && isCorrect === false && feedback.includes(imagePath.split('/').pop().split('.')[0]) /* Highlight wrong user choice? Less direct way */ ? theme.palette.error.light :
                                                'transparent',
                                    opacity: clicked && isCorrect !== null && imagePath !== currentQuestion.correctImage ? 0.6 : 1,
                                    background: 'rgba(255, 255, 255, 0.97)' // Almost opaque cards
                                }}
                            >
                                <CardActionArea
                                    onClick={() => checkAnswer(imagePath)}
                                    disabled={clicked}
                                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1 }} // Add padding inside action area
                                >
                                    <CardMedia
                                        component="img"
                                        image={loadImage(imagePath)} // Use loader
                                        alt={`Option ${index + 1} pour ${currentQuestion.phrase}`} // Better alt text
                                        sx={{
                                            height: { xs: 150, sm: 180, md: 210 }, // Responsive height
                                            width: 'auto', // Let width adjust
                                            maxWidth: '100%', // Ensure it doesn't overflow card
                                            objectFit: 'contain',
                                            // p: 1 // Padding removed as it's on CardActionArea now
                                        }}
                                    />
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Feedback Area */}
                <Collapse in={feedback !== ''} timeout={400} sx={{ mt: 3 }}>
                    <Alert
                        severity={isCorrect === true ? 'success' : isCorrect === false ? 'error' : 'info'}
                        icon={isCorrect === true ? <CheckCircleOutlineIcon fontSize="inherit" /> : <ErrorOutlineIcon fontSize="inherit" />}
                        sx={{ '& .MuiAlert-message': { flexGrow: 1 }, background: 'rgba(255, 255, 255, 0.97)', boxShadow: theme.shadows[3] }}
                        variant="filled" // Filled style might stand out more
                    >
                        <AlertTitle>{isCorrect ? 'Correct !' : 'Incorrect'}</AlertTitle>
                        {feedback}
                    </Alert>
                </Collapse>

                {/* Educational Tip */}
                <Collapse in={clicked && isCorrect === true && !!currentQuestion.tip} timeout={400} sx={{ mt: 2 }}>
                    <Alert severity="info" icon={<SchoolIcon fontSize="inherit" />} sx={{ background: 'rgba(229, 246, 253, 0.97)', boxShadow: theme.shadows[2] }} variant="outlined">
                        <AlertTitle>Le savais-tu ?</AlertTitle>
                        {currentQuestion.tip}
                    </Alert>
                </Collapse>

            </Container>

            <RetrouvePhrase></RetrouvePhrase>
        </Box>
    );
};

export default AssociImage;