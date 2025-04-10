import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import questionsData from './associe.json'; // Adjust path if needed
import Confetti from 'react-confetti'; // Import confetti

// --- Material-UI Imports ---
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    Collapse,
    Alert,
    AlertTitle,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Paper,
    Stack,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme, // To access theme colors if needed
    useMediaQuery // For responsive checks
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    ErrorOutline as ErrorOutlineIcon,
    Replay as ReplayIcon,
    Timer as TimerIcon,
    ExpandMore as ExpandMoreIcon,
    HelpOutline as HelpOutlineIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import AssociImage from '../associe/associ';

// --- Custom Hook for Window Size (needed for Confetti) ---
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

// --- Dynamic Image Loading ---
const loadImage = (imagePath) => {
    try {
        // Ensure path is relative to this file or adjust as needed
        return require(`${imagePath}`);
    } catch (error) {
        console.error(`Failed to load image: ${imagePath}`, error);
        // Provide a fallback image?
        // Example: return 'https://via.placeholder.com/200x150?text=Image+Not+Found';
        return ''; // Or handle error appropriately
    }
};

// --- Shuffle Function ---
const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

// --- Component ---
const Gamelecture1e = () => {
    // --- Hooks ---
    const theme = useTheme(); // Access MUI theme
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is small
    const { width: windowWidth, height: windowHeight } = useWindowSize(); // Get window dimensions

    // --- State ---
    const [selectedSetTitle, setSelectedSetTitle] = useState(questionsData.sets[0].title);
    const [currentSet, setCurrentSet] = useState(questionsData.sets[0]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [shuffledImages, setShuffledImages] = useState([]);
    const [showInstructions, setShowInstructions] = useState(true);
    const [runConfetti, setRunConfetti] = useState(false); // State to control confetti run

    // Ref for the main container (optional, useful if confetti needs specific bounds)
    const gameContainerRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
        const newSet = questionsData.sets.find(set => set.title === selectedSetTitle) || questionsData.sets[0];
        setCurrentSet(newSet);
        resetGame(newSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSetTitle]);

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        if (currentSet && currentSet.questions[currentQuestionIndex]) {
            setShuffledImages(shuffleArray(currentSet.questions[currentQuestionIndex].images));
        }
    }, [currentQuestionIndex, currentSet]);

    // Effect to run confetti briefly when game finishes
    useEffect(() => {
        if (gameFinished) {
            setRunConfetti(true);
            // Optional: Stop confetti after some time
            const timer = setTimeout(() => setRunConfetti(false), 6000); // Run for 6 seconds
            return () => clearTimeout(timer);
        } else {
            setRunConfetti(false); // Ensure it's off if game restarts
        }
    }, [gameFinished]);


    // --- Memoized Values ---
    const currentQuestion = useMemo(() => {
        return currentSet?.questions?.[currentQuestionIndex];
    }, [currentSet, currentQuestionIndex]);

    const totalQuestions = useMemo(() => currentSet?.questions?.length || 0, [currentSet]);
    const progress = useMemo(() => totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0, [currentQuestionIndex, totalQuestions]);

    // --- Callbacks ---
    const resetGame = useCallback((set = currentSet) => {
        setCurrentQuestionIndex(0);
        setFeedback('');
        setIsCorrect(null);
        setScore(0);
        setErrors(0);
        setStartTime(Date.now());
        setEndTime(null);
        setGameFinished(false);
        setClicked(false);
        setRunConfetti(false); // Make sure confetti is reset
        if (set !== currentSet) {
            setCurrentSet(set);
        }
        if (set?.questions?.[0]) {
            setShuffledImages(shuffleArray(set.questions[0].images));
        }
    }, [currentSet]); // Dependency array includes currentSet

    const handleSetChange = useCallback((event) => {
        setSelectedSetTitle(event.target.value);
    }, []);

    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setFeedback('');
            setIsCorrect(null);
            setClicked(false);
        } else {
            setEndTime(Date.now());
            setGameFinished(true); // Trigger game finished state
        }
    }, [currentQuestionIndex, totalQuestions]);

    const checkAnswer = useCallback((selectedImage) => {
        if (clicked || !currentQuestion) return;

        setClicked(true);
        const correct = selectedImage === currentQuestion.correctImage;

        setIsCorrect(correct);
        if (correct) {
            setFeedback("Bravo ! C'est la bonne réponse !");
            setScore(prevScore => prevScore + 1);
        } else {
            // More helpful feedback could include showing the correct image's name/description if available
             const correctImageName = currentQuestion.correctImage.split('/').pop().split('.')[0]; // Basic name extraction
             setFeedback(`Oups ! Ce n'était pas ça. La bonne réponse était associée à : ${correctImageName}`);
            setErrors(prevErrors => prevErrors + 1);
        }

        const timer = setTimeout(goToNextQuestion, 2500); // Wait before next question

        return () => clearTimeout(timer);

    }, [clicked, currentQuestion, goToNextQuestion]);


    const getTotalTime = useCallback(() => {
        if (!startTime || !endTime) return 'N/A';
        const timeTaken = endTime - startTime;
        const seconds = Math.floor((timeTaken / 1000) % 60);
        const minutes = Math.floor((timeTaken / 1000 / 60) % 60);
        return `${minutes} min ${seconds} sec`;
    }, [startTime, endTime]);

    // --- Render Logic ---

    // Loading State
    if (!currentSet || !currentQuestion) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h5">Chargement du jeu...</Typography>
                <LinearProgress sx={{ mt: 2 }} />
            </Container>
        );
    }

    // Game Finished Summary
    if (gameFinished) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4, position: 'relative' }}>
                 {/* --- Confetti Effect --- */}
                 {runConfetti && (
                     <Confetti
                         width={windowWidth}
                         height={windowHeight}
                         recycle={false} // Important: Set to false to stop after animation
                         numberOfPieces={isMobile ? 150 : 300} // Fewer pieces on mobile
                         gravity={0.15} // Adjust fall speed
                         initialVelocityY={15}
                         tweenDuration={5000} // How long pieces animate
                     />
                 )}

                <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)' }}> {/* Slightly transparent paper */}
                    <Typography variant="h4" gutterBottom component="h2" sx={{ color: theme.palette.primary.main }}>
                        🎉 Fin du jeu ! 🎉
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Résumé pour : {currentSet.title}
                    </Typography>
                    <Stack spacing={2} alignItems="center" my={3}>
                         <Chip icon={<CheckCircleOutlineIcon />} label={`Score: ${score} / ${totalQuestions}`} color="success" variant="outlined" sx={{ fontSize: '1.1rem', padding: '10px 15px' }}/>
                         <Chip icon={<ErrorOutlineIcon />} label={`Erreurs: ${errors}`} color="error" variant="outlined" sx={{ fontSize: '1.1rem', padding: '10px 15px' }}/>
                         <Chip icon={<TimerIcon />} label={`Temps: ${getTotalTime()}`} color="info" variant="outlined" sx={{ fontSize: '1.1rem', padding: '10px 15px' }}/>
                    </Stack>
                    <Button variant="contained" startIcon={<ReplayIcon />} onClick={() => resetGame()} size="large">
                        Recommencer ce set
                    </Button>
                </Paper>
            </Container>
        );
    }

    // --- Main Game View ---
    return (
        // --- Attractive Background ---
        <Box
            ref={gameContainerRef} // Add ref here
            sx={{
                minHeight: '100vh', // Ensure background covers viewport height
                // Example Gradient Background (customize colors!)
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                // Or a subtle pattern:
                // backgroundImage: 'url("/path/to/your/subtle-pattern.svg")', // Make sure path is correct
                // backgroundSize: 'cover',
                py: 3, // Add vertical padding
            }}
        >
            <Container maxWidth="lg">

                {/* Instructions Accordion */}
                <Accordion defaultExpanded={!isMobile} /* Keep open on desktop */ expanded={showInstructions} onChange={() => setShowInstructions(!showInstructions)} sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="instructions-content" id="instructions-header">
                        <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">Instructions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Instructions text... */}
                         <Typography paragraph>
                             Bienvenue ! Choisissez l'image qui correspond à la phrase.
                         </Typography>
                         <Typography>
                             Cliquez sur votre choix. La réponse et la prochaine question apparaîtront. Bonne chance !
                         </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Set Selector */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                     <Paper elevation={1} sx={{ background: 'rgba(255, 255, 255, 0.9)', p:1, borderRadius: theme.shape.borderRadius }}>
                        <FormControl sx={{ minWidth: { xs: '90%', sm: 280 } }} size="small">
                            <InputLabel id="set-select-label">Choisir un set</InputLabel>
                            <Select labelId="set-select-label" id="set-select" value={selectedSetTitle} label="Choisir un set" onChange={handleSetChange}>
                                {questionsData.sets.map((set, index) => (
                                    <MenuItem key={index} value={set.title}>
                                        {set.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                     </Paper>
                </Box>

                {/* Game Progress and Info */}
                <Paper elevation={2} sx={{ p: 2, mb: 3, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(3px)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Question {currentQuestionIndex + 1} / {totalQuestions}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip icon={<CheckCircleOutlineIcon />} label={score} color="success" size="small" />
                            <Chip icon={<ErrorOutlineIcon />} label={errors} color="error" size="small" />
                        </Stack>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }}/>
                    <Typography variant={isMobile ? "h6" : "h5"} /* Adjust font size */ component="h2" align="center" sx={{ fontWeight: 'medium', minHeight: '3em' /* Prevent layout shift */ }}>
                        {currentQuestion.phrase}
                    </Typography>
                </Paper>

                {/* Image Options */}
                {/* --- Responsive Image Grid --- */}
                <Grid container spacing={isMobile ? 2 : 3} /* Adjust spacing */ justifyContent="center" alignItems="stretch">
                    {shuffledImages.map((imagePath, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                            <Card
                                sx={{
                                    width: '100%',
                                    display: 'flex', // Needed for CardActionArea to fill height
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: clicked ? 'none' : 'scale(1.03)',
                                        boxShadow: clicked ? 3 : 6,
                                    },
                                    border: clicked && imagePath === currentQuestion.correctImage ? `3px solid ${theme.palette.success.main}` :
                                              clicked && isCorrect === false && imagePath !== currentQuestion.correctImage && feedback.includes(imagePath.split('/').pop().split('.')[0]) /* Optional: highlight wrong choice */ ? `3px solid ${theme.palette.error.main}` :
                                              'none',
                                    opacity: clicked && isCorrect !== null && imagePath !== currentQuestion.correctImage ? 0.65 : 1, // Dim incorrect options after choice
                                     background: 'rgba(255, 255, 255, 0.95)' // Slightly transparent cards
                                }}
                            >
                                <CardActionArea
                                    onClick={() => checkAnswer(imagePath)}
                                    disabled={clicked}
                                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} // Make area fill card
                                >
                                    <CardMedia
                                        component="img"
                                        image={loadImage(imagePath)}
                                        alt={`Option ${index + 1}`}
                                        sx={{
                                            // --- Responsive Height ---
                                            height: { xs: 140, sm: 170, md: 200 }, // Adjust heights per breakpoint
                                            width: '100%', // Ensure media takes width
                                            objectFit: 'contain', // Keep aspect ratio, fit within bounds
                                            p: 1 // Padding around image
                                        }}
                                    />
                                    {/* Optional: Add title/text below image if needed
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography>...</Typography>
                                    </CardContent>
                                    */}
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Feedback Area */}
                <Collapse in={feedback !== ''} timeout={300} sx={{ mt: 3 }}>
                    <Alert
                        severity={isCorrect === true ? 'success' : isCorrect === false ? 'error' : 'info'}
                        iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" />, error: <ErrorOutlineIcon fontSize="inherit" /> }}
                         sx={{ '& .MuiAlert-message': { flexGrow: 1 }, background: 'rgba(255, 255, 255, 0.95)' }}
                    >
                        <AlertTitle>{isCorrect ? 'Correct !' : 'Incorrect'}</AlertTitle>
                        {feedback}
                    </Alert>
                </Collapse>

                {/* Educational Tip */}
                <Collapse in={clicked && isCorrect === true && !!currentQuestion.tip} timeout={300} sx={{ mt: 2 }}>
                    <Alert severity="info" icon={<SchoolIcon fontSize="inherit" />} sx={{ background: 'rgba(229, 246, 253, 0.95)' /* Lighter blue info */ }}>
                        <AlertTitle>Le savais-tu ?</AlertTitle>
                        {currentQuestion.tip}
                    </Alert>
                </Collapse>

            </Container>
            <AssociImage></AssociImage>
        </Box> // End of background Box
    );
};

export default Gamelecture1e;