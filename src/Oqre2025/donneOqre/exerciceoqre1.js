// ** IMPORTANT **
// Pour que l'import de PDF fonctionne, ton projet (Next.js, CRA, Vite...)
// doit être configuré pour traiter les fichiers PDF comme des assets.
// Place les fichiers PDF (ex: sample37.pdf) à côté des fichiers JSON correspondants.
// Exemple de structure (si ce composant est dans src/components/InteractiveQuiz):
// /src
// |-- /components
// |   |-- /InteractiveQuiz
// |   |   |-- InteractiveQuiz.js  <-- Ce fichier
// |   |   |-- form37.json
// |   |   |-- sample37.pdf
// |   |   |-- form32.json
// |   |   |-- sample32.pdf
// |   |   |-- form61.json
// |   |   |-- form62.json
// |   |   |-- ConfettiEffect.js  <-- (Ou dans un dossier components/common)

'use client'; // Nécessaire pour les hooks React

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Container, Tabs, Tab, Box, Card, CardContent, Typography,
    Accordion, AccordionSummary, AccordionDetails, Radio, RadioGroup,
    FormControlLabel, FormControl, FormLabel, TextField, Button, Chip,
    Paper, Alert, Fade, List, ListItem, ListItemIcon,
    ListItemText, Avatar, Badge, Divider, Tooltip, Select, MenuItem,
    InputLabel, CircularProgress, ToggleButtonGroup, ToggleButton, Link
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    ExpandMore as ExpandMoreIcon,
    CheckCircleOutline as CheckCircleIcon, // Using outline version
    HighlightOff as CancelIcon, // Using outline version
    HelpOutline as HelpOutlineIcon,
    QuestionAnswer as QuestionAnswerIcon,
    FiberManualRecord as FiberManualRecordIcon,
    EmojiEvents as EmojiEventsIcon, // Kept for score
    School as SchoolIcon,
    Stars as StarsIcon,
    Celebration as CelebrationIcon, // Kept for feedback
    Refresh as RefreshIcon,
    EditNote as EditNoteIcon,
    PictureAsPdf as PictureAsPdfIcon,
    Article as ArticleIcon,
    Book as BookIcon // Alternative to MenuBook
} from '@mui/icons-material';

// --- Configuration ---
// Paths sont relatifs AU FICHIER où ils sont importés (ici, InteractiveQuiz.js)
// Assurez-vous que les fichiers existent aux emplacements indiqués.
const exercisesConfig = {
    '3e': [
        { name: 'Exercice 1 (3e)', jsonPath: './form37.json', pdfImportPath: './F3-2011.pdf' }, // PDF à côté du JSON
        { name: 'Exercice 2 (3e)', jsonPath: './form32.json', pdfImportPath: './sample32.pdf' }, // PDF à côté du JSON (si existe)
    ],
    '6e': [
        { name: 'Exercice 1 (6e)', jsonPath: './form61.json', pdfImportPath: null }, // Pas de PDF pour celui-ci
        { name: 'Exercice 2 (6e)', jsonPath: './form62.json', pdfImportPath: null }, // Pas de PDF pour celui-ci
    ]
};
const gradeLevels = Object.keys(exercisesConfig);

// --- Theme Definition (Professional) ---
const professionalTheme = createTheme({
    palette: {
        mode: 'light', // Standard light mode
        primary: { main: '#1976d2', }, // Standard MUI Blue
        secondary: { main: '#ffa000', }, // Amber/Orange
        success: { main: '#388e3c', }, // Darker Green
        error: { main: '#d32f2f', },   // Standard Red
        warning: { main: '#f57c00', }, // Orange
        info: { main: '#0288d1', },    // Light Blue
        background: { default: '#f4f6f8', paper: '#ffffff' }, // Light grey background
        text: { primary: '#212121', secondary: '#616161' },
        // Minimal gradients or remove them
        // gradient: { ... } // Optional: add subtle gradients if needed
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600, color: '#1A237E' }, // Keep a slightly distinct color for headers if desired
        h6: { fontWeight: 500 },
        // Keep body font sizes standard
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Less rounded
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '8px 20px', // Slightly adjusted padding
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Subtle shadow
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)' // Subtle lift
                    }
                },
                // Remove specific gradient styles unless desired
                // containedPrimary: { ... },
                // containedSecondary: { ... },
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Slightly rounded
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', // Softer shadow
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        // Remove scale transform for professional look
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    },
                     border: '1px solid rgba(0, 0, 0, 0.12)' // Consistent border
                }
            }
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' }, // Prefer outlined for professional forms
            styleOverrides: {
                 root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: '#fff', // Ensure background is white/paper
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2', // Primary color on hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: '1px', // Standard focus width
                        },
                    },
                     '& .MuiFilledInput-root': { // Style filled variant if used
                        borderRadius: 8,
                        backgroundColor: '#f0f0f0', // Lighter filled background
                         '&:hover': { backgroundColor: '#e8e8e8' },
                        '&.Mui-focused': { backgroundColor: '#e0e0e0' }
                    },
                }
            }
        },
        MuiRadio: { styleOverrides: { root: { '&.Mui-checked': { color: '#1976d2' } } } }, // Use primary color for checked
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    textTransform: 'none',
                     padding: '12px 20px', // Adjust padding for tabs
                    '&.Mui-selected': {
                        fontWeight: 600, // Slightly bolder when selected
                        color: '#1976d2' // Primary color when selected
                    }
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                 indicator: {
                    height: 3, // Thinner indicator
                    // backgroundColor: '#1976d2' // Use primary color
                }
            }
        },
        MuiChip: { styleOverrides: { root: { borderRadius: 6 } } }, // Less rounded chips
        MuiAccordion: {
            styleOverrides: {
                root: {
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: 8,
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                     '&.Mui-expanded': { margin: '16px 0' } // Keep expansion margin
                }
            }
        },
        MuiAccordionSummary: {
            styleOverrides: {
                 root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '8px 8px 0 0', // Keep top rounding
                    '&.Mui-expanded': { minHeight: 48 },
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)'}
                 },
                 content: { '&.Mui-expanded': { margin: '12px 0' } }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                     borderRadius: 8,
                     border: '1px solid', // Add subtle border to alerts
                     borderColor: 'currentColor', // Use severity color for border
                     alignItems: 'center', // Vertically center content
                },
                 icon: {
                     fontSize: '1.4rem' // Slightly larger icons in alerts
                 }
            }
        }
    }
});

// --- Confetti Effect Component (Keep as is or import from separate file) ---
const ConfettiEffect = ({ active }) => { /* ... (code from previous version) ... */
    if (!active) return null;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
            {[...Array(60)].map((_, i) => ( // Increased confetti count
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        width: Math.random() * 10 + 5, // Variable size
                        height: Math.random() * 10 + 5,
                        backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
                        borderRadius: '50%',
                        animation: `fall ${2.5 + Math.random() * 2.5}s linear infinite`, // Infinite animation
                        left: `${Math.random() * 100}%`,
                        top: '-30px',
                        transform: `rotate(${Math.random() * 360}deg)`,
                        opacity: Math.random() * 0.6 + 0.4, // Slightly higher opacity
                        '@keyframes fall': {
                            '0%': { transform: `translateY(0px) rotate(${Math.random() * 100 - 50}deg)`, opacity: 1 },
                            '100%': { transform: `translateY(${windowHeight + 40}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 },
                        },
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}
        </Box>
    );
};

// --- Helper Functions (Keep as is) ---
const getQuestionId = (item, sectionIndex, questionIndex) => { /* ... (code from previous version) ... */
    if (questionIndex === -2) return `pdf-view`;
    return item?.id || `s${sectionIndex}-q${questionIndex}`;
};
const formatAsBulletPoints = (text) => { /* ... (code from previous version) ... */
    if (!text || typeof text !== 'string') return null;
    // Improved splitting to handle various punctuation and lists
    const points = text.split(/[\n.•!?:]+/) // Split by newline, bullet points, punctuation
                      .map(p => p.trim())
                      .filter(p => p.length > 0);
    if (points.length === 0 && text.trim().length > 0) { points.push(text.trim()); }
    if (points.length === 0) return null;
    return (
        <List dense sx={{ pl: 0, pt: 0, listStyle: 'none' }}>
            {points.map((point, index) => (
                <ListItem key={index} sx={{ py: 0.2, px: 0, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 24, mt: '4px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.6rem', color: 'text.secondary' }} /> {/* Subtler color */}
                    </ListItemIcon>
                    <ListItemText primary={point} primaryTypographyProps={{ variant: 'body2', sx: { color: 'text.primary' } }} />
                </ListItem>
            ))}
        </List>
    );
};

// --- The Interactive Quiz Component ---
function InteractiveQuiz() {
    // --- State ---
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedExerciseConfig, setSelectedExerciseConfig] = useState(null); // Store the whole config object
    const [currentTestData, setCurrentTestData] = useState(null);
    const [currentPdfUrl, setCurrentPdfUrl] = useState(null); // State for the resolved PDF URL
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [checkedOpenEnded, setCheckedOpenEnded] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);

    // --- Derived State ---
    const availableExercises = useMemo(() => {
        return selectedGrade ? exercisesConfig[selectedGrade] || [] : [];
    }, [selectedGrade]);

    const hasPdf = !!currentPdfUrl; // Check if PDF URL is loaded
    const pdfTabIndex = hasPdf ? 0 : -1;
    const currentSectionIndex = hasPdf ? activeTabIndex - 1 : activeTabIndex;

    // --- *** MODIFIED: Effect for Loading JSON and PDF via Dynamic Import *** ---
    useEffect(() => {
        if (selectedExerciseConfig?.jsonPath) { // Check if a config with jsonPath is selected
            setIsLoading(true);
            setError(null);
            setCurrentTestData(null);
            setCurrentPdfUrl(null); // Reset PDF URL
            setActiveTabIndex(0);

            const jsonImportPromise = import(`${selectedExerciseConfig.jsonPath}`)
                .then(module => {
                    if (!module.default || typeof module.default !== 'object') { throw new Error(`Fichier JSON (${selectedExerciseConfig.jsonPath}) non valide ou export par défaut manquant.`); }
                    if (module.default.sections && !Array.isArray(module.default.sections)) { throw new Error(`La clé 'sections' dans ${selectedExerciseConfig.jsonPath} doit être un tableau.`); }
                    return module.default; // Return the JSON data
                });

            // Only import PDF if path is provided
            const pdfImportPromise = selectedExerciseConfig.pdfImportPath
                ? import(`${selectedExerciseConfig.pdfImportPath}`)
                    .then(pdfModule => pdfModule.default) // Bundler should provide the public path as default export
                    .catch(pdfError => {
                        console.warn(`Avertissement: N'a pas pu charger le PDF depuis ${selectedExerciseConfig.pdfImportPath}:`, pdfError);
                        return null; // Return null if PDF fails, don't block the quiz
                    })
                : Promise.resolve(null); // Resolve immediately with null if no PDF path

            Promise.all([jsonImportPromise, pdfImportPromise])
                .then(([jsonData, pdfUrl]) => {
                    setCurrentTestData(jsonData);
                    setCurrentPdfUrl(pdfUrl); // Store the resolved PDF URL (or null)
                    setError(null); // Clear previous errors
                })
                .catch(importError => {
                    console.error("Erreur lors du chargement des données :", importError);
                    let userMessage = `Erreur lors du chargement de l'exercice. `;
                    if (importError.message.includes('Cannot find module') || importError.message.includes('Failed to fetch')) {
                        userMessage += "Vérifiez que les chemins dans `exercisesConfig` sont corrects et que les fichiers existent.";
                    } else if (importError instanceof SyntaxError) {
                        userMessage += "Vérifiez la syntaxe du fichier JSON.";
                    } else {
                        userMessage += `Détail: ${importError.message}`;
                    }
                    setError(userMessage);
                    setCurrentTestData(null);
                    setCurrentPdfUrl(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });

        } else {
            // Reset if no exercise is selected
            setCurrentTestData(null);
            setCurrentPdfUrl(null);
            setError(null);
            setIsLoading(false);
            setActiveTabIndex(0);
            setStudentAnswers({});
            setCheckedOpenEnded({});
        }
    }, [selectedExerciseConfig]); // Depend on the selected config object

    // --- Effect to Reset Quiz State (Keep as is) ---
    useEffect(() => {
        setStudentAnswers({});
        setCheckedOpenEnded({});
        setShowConfetti(false);
    }, [currentTestData]);

    // --- Memoized Calculations (Keep as is) ---
    const { totalQuestions, totalMcqPoints, allQuestionsMap } = useMemo(() => { /* ... (code from previous version) ... */
        if (!currentTestData?.sections) return { totalQuestions: 0, totalMcqPoints: 0, allQuestionsMap: new Map() };
        let questionCount = 0; let mcqPoints = 0; const qMap = new Map();
        currentTestData.sections.forEach((section, sIdx) => {
            if (section?.questions) {
                section.questions.forEach((q, qIdx) => {
                    questionCount++;
                    const questionId = getQuestionId(q, sIdx, qIdx);
                    qMap.set(questionId, { ...q, sectionIndex: sIdx, questionIndex: qIdx });
                    // Ensure points are only added for valid MCQ questions with answers
                    if (q.type === 'multipleChoice' && q.options && q.correctAnswer) {
                        mcqPoints += (q.points ?? 1);
                    }
                });
            }
        });
        return { totalQuestions: questionCount, totalMcqPoints: mcqPoints, allQuestionsMap: qMap };
    }, [currentTestData]);

    // --- Score Calculation Callback (Keep as is, maybe add validation) ---
    const calculateScores = useCallback(() => { /* ... (code from previous version, ensure qData.correctAnswer exists before comparing) ... */
        let currentTotalScore = 0;
        let currentSectionScore = 0;
        let currentSectionMaxScore = 0;

        allQuestionsMap.forEach((qData, questionId) => {
            const points = qData.points ?? 1;
            if (qData.type === 'multipleChoice' && qData.correctAnswer) { // Check correctAnswer exists
                const studentAnswer = studentAnswers[questionId];
                const correctAnswer = String(qData.correctAnswer).toLowerCase();

                // Add to total score if correct
                if (studentAnswer === correctAnswer) {
                    currentTotalScore += points;
                }

                // Add to section max score if the question is in the current section
                if (qData.sectionIndex === currentSectionIndex) {
                   currentSectionMaxScore += points;
                   // Add to section current score if correct
                   if (studentAnswer === correctAnswer) {
                       currentSectionScore += points;
                   }
                }
            }
        });
        return { totalScore: currentTotalScore, sectionScore: currentSectionScore, sectionMaxScore: currentSectionMaxScore };
    }, [studentAnswers, currentSectionIndex, allQuestionsMap]);

    // --- Progress Calculation (Keep as is) ---
    const currentAnsweredCount = useMemo(() => { /* ... (code from previous version) ... */
        let count = 0;
        allQuestionsMap.forEach((qData, questionId) => {
            if ((qData.type === 'multipleChoice' && studentAnswers[questionId] !== undefined) ||
                (qData.type === 'openEnded' && checkedOpenEnded[questionId])) {
                count++;
            }
        });
        return count;
    }, [studentAnswers, checkedOpenEnded, allQuestionsMap]);

    // --- Quiz Event Handlers (Keep as is) ---
    const handleTabChange = useCallback((event, newValue) => { /* ... (code from previous version) ... */
        const numQuizSections = currentTestData?.sections?.length || 0;
        const totalTabs = hasPdf ? 1 + numQuizSections : numQuizSections;
        if (newValue >= 0 && newValue < totalTabs) {
            setActiveTabIndex(newValue);
        }
    }, [currentTestData, hasPdf]);
    const handleAnswerChange = useCallback((questionId, answerValue) => { /* ... (code from previous version) ... */
        setStudentAnswers(prev => ({ ...prev, [questionId]: answerValue }));
        setCheckedOpenEnded(prev => {
            if (prev[questionId]) {
                const newState = { ...prev };
                delete newState[questionId];
                return newState;
            }
            return prev;
        });
    }, []);
    const handleCheckOpenEnded = useCallback((questionId, checkStatus = true) => { /* ... (code from previous version) ... */
        setCheckedOpenEnded(prev => ({ ...prev, [questionId]: checkStatus }));
    }, []);
    const handleMcqSubmit = useCallback((questionId, answerValue) => { /* ... (code from previous version, checks already included) ... */
        const questionData = allQuestionsMap.get(questionId);
        if (!questionData || questionData.type !== 'multipleChoice' || !questionData.correctAnswer) return;

        const normalizedAnswer = String(answerValue).toLowerCase();
        const correctAnswer = String(questionData.correctAnswer).toLowerCase();
        const isCorrect = normalizedAnswer === correctAnswer;

        const previousAnswer = studentAnswers[questionId];
        const previousAnswerNormalized = previousAnswer !== undefined ? String(previousAnswer).toLowerCase() : undefined;

        if (normalizedAnswer !== previousAnswerNormalized) {
            setStudentAnswers(prev => ({ ...prev, [questionId]: normalizedAnswer }));

            const wasPreviouslyCorrect = previousAnswerNormalized === correctAnswer;
            if (isCorrect && !wasPreviouslyCorrect) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3500);
            }
        }
     }, [allQuestionsMap, studentAnswers]);
    const getCurrentSectionQuestionIds = useCallback(() => { /* ... (code from previous version) ... */
        if (!currentTestData || currentSectionIndex < 0 || currentSectionIndex >= currentTestData.sections.length) {
            return [];
        }
        const section = currentTestData.sections[currentSectionIndex];
        if (!section?.questions) return [];
        return section.questions.map((q, index) => getQuestionId(q, currentSectionIndex, index));
    }, [currentTestData, currentSectionIndex]);
    const handleResetSection = useCallback(() => { /* ... (code from previous version) ... */
        const sectionQuestionIds = getCurrentSectionQuestionIds();
        setStudentAnswers(prev => {
            const newState = { ...prev };
            sectionQuestionIds.forEach(id => delete newState[id]);
            return newState;
        });
        setCheckedOpenEnded(prev => {
            const newState = { ...prev };
            sectionQuestionIds.forEach(id => delete newState[id]);
            return newState;
        });
        setShowConfetti(false); // Stop confetti if section is reset
    }, [getCurrentSectionQuestionIds]);

    // --- Selection Event Handlers ---
    const handleGradeChange = (event, newGrade) => {
        if (newGrade !== null && newGrade !== selectedGrade) {
            setSelectedGrade(newGrade);
            setSelectedExerciseConfig(null); // Reset exercise selection
        } else if (newGrade === null) { // Handle deselection
            setSelectedGrade('');
            setSelectedExerciseConfig(null);
        }
    };

    const handleExerciseChange = (event) => {
        const selectedConf = availableExercises.find(ex => ex.jsonPath === event.target.value);
        setSelectedExerciseConfig(selectedConf || null);
    };

    // --- Calculate score values for display (Keep as is) ---
    const { totalScore, sectionScore, sectionMaxScore } = useMemo(() => {
        if (!currentTestData) return { totalScore: 0, sectionScore: 0, sectionMaxScore: 0 };
        return calculateScores();
    }, [calculateScores, currentTestData, studentAnswers]); // Add studentAnswers dependency

    // --- Progress for display (Keep as is) ---
    const progress = totalQuestions > 0 ? Math.round((currentAnsweredCount / totalQuestions) * 100) : 0;

    // --- Get current section data safely (Keep as is) ---
    const currentSection = useMemo(() => { /* ... (code from previous version) ... */
        if (!currentTestData || !currentTestData.sections || currentSectionIndex < 0 || currentSectionIndex >= currentTestData.sections.length) {
            return null;
        }
        return currentTestData.sections[currentSectionIndex];
    }, [currentTestData, currentSectionIndex]);

    // --- RENDER ---
    return (
        <ThemeProvider theme={professionalTheme}> {/* Apply the new theme */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 3 }, mb: 4 }}>
                <ConfettiEffect active={showConfetti} />

                {/* --- Enhanced Selection Bar (More Professional Look) --- */}
                <Paper
                    elevation={3} // Slightly less elevation
                    sx={{
                        p: { xs: 2, sm: 3 }, mb: { xs: 3, md: 4 }, borderRadius: 3, // Consistent rounding
                        background: (theme) => theme.palette.primary.dark, // Solid professional color
                        // background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, // Subtle gradient option
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(35, 5, 5, 0.1)'
                    }}
                >
                    <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 , color: 'white',}}>
                        <BookIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.3em' }} /> {/* Regular Book Icon */}
                        Sélectionnez votre exercice
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, alignItems: 'center', justifyContent: 'center' }}>
                        {/* Grade Selection */}
                         <FormControl sx={{ minWidth: { xs: '100%', sm: 180 } }}>
                            <Typography id="grade-label" gutterBottom align="center" sx={{ fontWeight: 500, color: 'rgba(255,255,255,0.9)', mb: 1 }}>Année</Typography>
                            <ToggleButtonGroup
                                color="secondary" // Use secondary for selection emphasis
                                value={selectedGrade} exclusive onChange={handleGradeChange} aria-labelledby="grade-label" fullWidth
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2,
                                    '& .MuiToggleButton-root': {
                                        color: 'rgba(255,255,255,0.8)', fontWeight: 500, border: 0, // Remove internal borders
                                        borderRadius: 2, // Match group border radius
                                        '&.Mui-selected': {
                                            color: 'secondary.contrastText', // Use theme contrast text
                                            backgroundColor: 'secondary.main',
                                            fontWeight: 'bold',
                                            '&:hover': { backgroundColor: 'secondary.dark' }
                                        },
                                        '&:not(.Mui-selected):hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                                    }
                                }}
                            >
                                {gradeLevels.map(grade => (
                                    <ToggleButton key={grade} value={grade} aria-label={`${grade} année`}>{grade}e</ToggleButton> // Use 'e' suffix
                                ))}
                            </ToggleButtonGroup>
                        </FormControl>
                        {/* Exercise Selection */}
                         <FormControl
                            variant="outlined"
                            sx={{ minWidth: { xs: '100%', sm: 240 }, // Slightly wider
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.9)', '&.Mui-focused': { color: 'white' } },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                    '& .MuiSelect-select': { color: 'white' },
                                    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
                                }
                            }}
                            disabled={!selectedGrade || availableExercises.length === 0}
                        >
                            <InputLabel id="exercise-select-label">Exercice</InputLabel>
                            <Select
                                labelId="exercise-select-label"
                                id="exercise-select"
                                value={selectedExerciseConfig?.jsonPath || ''} // Select based on jsonPath
                                label="Exercice"
                                onChange={handleExerciseChange}
                            >
                                <MenuItem value="" disabled>
                                     {selectedGrade ? <em>Choisissez un exercice</em> : <em>Sélectionnez une année</em>}
                                </MenuItem>
                                {availableExercises.map((exercise) => (
                                    <MenuItem key={exercise.jsonPath} value={exercise.jsonPath}>{exercise.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* --- Loading / Error / Quiz Display --- */}
                <Box sx={{ mt: 3 }}>
                    {isLoading && ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}><CircularProgress color="secondary" /><Typography sx={{ ml: 2, color: 'text.secondary' }}>Chargement...</Typography></Box> )}
                    {error && !isLoading && ( <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> )}
                    {!isLoading && !error && !currentTestData && selectedGrade && availableExercises.length > 0 && !selectedExerciseConfig && ( <Alert severity="info" icon={<StarsIcon />}>Sélectionnez un exercice pour commencer.</Alert> )}
                    {!isLoading && !error && !currentTestData && selectedGrade && availableExercises.length === 0 && ( <Alert severity="warning" icon={<HelpOutlineIcon />}>Aucun exercice n'est configuré pour la {selectedGrade}e année.</Alert> )}
                    {!isLoading && !error && !currentTestData && !selectedGrade && ( <Alert severity="info" icon={<SchoolIcon />}>Sélectionnez votre année et un exercice.</Alert> )}

                    {/* --- RENDER QUIZ IF DATA IS LOADED --- */}
                    {!isLoading && !error && currentTestData && (
                        <>
                            {/* Header Section */}
                            <Paper
                                elevation={2} // Subtle elevation
                                sx={{
                                    p: { xs: 2, sm: 3 }, mb: 4,
                                    // Use primary gradient or solid color
                                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                                    // background: (theme) => theme.palette.primary.main, // Solid color option
                                    color: 'primary.contrastText', // Ensure text contrast
                                    borderRadius: 3, // Consistent rounding
                                }}
                            >
                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', width: 50, height: 50 }}><ArticleIcon sx={{ fontSize: 28 }} /></Avatar> {/* Generic Article Icon */}
                                        <Box>
                                            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>{currentTestData.testTitle || 'Quiz Interactif'}</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>{availableExercises.find(ex => ex.jsonPath === selectedExerciseConfig?.jsonPath)?.name}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, justifyContent: 'flex-end', flexGrow: { xs: 1, md: 0 } }}>
                                        <Tooltip title={`Score QCM (Max ${totalMcqPoints})`}>
                                            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, textAlign: 'center', minWidth: 80, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'inherit', opacity: 0.8 }}>Score</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}><EmojiEventsIcon sx={{ mr: 0.5, fontSize: '1.2rem', color: '#ffeb3b' }} /><Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{totalScore}</Typography></Box>
                                            </Paper>
                                        </Tooltip>
                                        <Tooltip title={`Progression (${currentAnsweredCount} / ${totalQuestions})`}>
                                            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, textAlign: 'center', minWidth: 80, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'inherit', opacity: 0.8 }}>Progrès</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: 'inherit' }}>{progress}%</Typography>
                                            </Paper>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                {/* Progress Bar */}
                                 <Box sx={{ width: '100%', height: 8, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 4, mt: 2.5, overflow: 'hidden' }}>
                                    <Box sx={(theme) => ({ height: '100%', width: `${progress}%`, background: theme.palette.success.light, transition: 'width 0.5s ease-in-out', borderRadius: 4 })} />
                                </Box>
                            </Paper>

                            {/* Section Tabs */}
                             <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1100 }}> {/* Sticky Tabs */}
                                <Tabs
                                    value={activeTabIndex}
                                    onChange={handleTabChange}
                                    aria-label="Sections du Quiz et Texte"
                                    variant="scrollable" scrollButtons="auto"
                                    indicatorColor="primary" // Use primary indicator
                                    textColor="primary"
                                >
                                    {hasPdf && (
                                        <Tab
                                            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PictureAsPdfIcon />Texte</Box>} // Simplified label
                                            key="pdf-tab" id={`tab-pdf`} aria-controls={`tabpanel-pdf`}
                                        />
                                    )}
                                    {(currentTestData.sections || []).map((section, index) => {
                                        const tabIndex = hasPdf ? index + 1 : index;
                                        const sectionId = getQuestionId(section, index, -1);
                                        return (
                                            <Tab
                                                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                          <Avatar sx={{ width: 24, height: 24, bgcolor: activeTabIndex === tabIndex ? 'primary.main' : 'grey.300', color: activeTabIndex === tabIndex ? 'primary.contrastText' : 'text.secondary', fontSize: '0.75rem', fontWeight: 'bold' }}>{index + 1}</Avatar>
                                                           {section.title || `Section ${index + 1}`}
                                                       </Box>}
                                                key={sectionId}
                                                id={`tab-${sectionId}`}
                                                aria-controls={`tabpanel-${sectionId}`}
                                            />
                                        );
                                    })}
                                </Tabs>
                            </Box>

                            {/* PDF Viewer Panel */}
                             {hasPdf && (
                                <Box role="tabpanel" hidden={activeTabIndex !== pdfTabIndex} id={`tabpanel-pdf`} aria-labelledby={`tab-pdf`} sx={{ mb: 3 }}>
                                    <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'text.primary', fontWeight: 500 }}>Document Associé</Typography>
                                        {currentPdfUrl ? (
                                            <Box sx={{ height: '75vh', position: 'relative', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                                                <iframe
                                                    src={currentPdfUrl} // Use the loaded URL
                                                    title="Document Associé PDF"
                                                    style={{ border: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                                                />
                                            </Box>
                                        ) : (
                                            <Alert severity="warning">Le fichier PDF associé n'a pas pu être chargé ou n'est pas configuré.</Alert>
                                        )}
                                         <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                                            Consultez le document ici. Utilisez les onglets pour naviguer vers les questions.
                                         </Typography>
                                    </Paper>
                                </Box>
                            )}

                            {/* Quiz Section Panels */}
                            {(currentTestData.sections || []).map((section, sIndex) => {
                                const panelIndex = hasPdf ? sIndex + 1 : sIndex;
                                const isActivePanel = activeTabIndex === panelIndex;
                                const sectionId = getQuestionId(section, sIndex, -1);

                                return (
                                    <Box
                                        role="tabpanel"
                                        hidden={!isActivePanel}
                                        key={`panel-${sectionId}`}
                                        id={`tabpanel-${sectionId}`}
                                        aria-labelledby={`tab-${sectionId}`}
                                        sx={{ display: isActivePanel ? 'block' : 'none', outline: 'none' }} // Added outline: none
                                    >
                                        {isActivePanel && (
                                            <>
                                                {/* Section Header */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                                        {section.title || `Section ${sIndex + 1}`}
                                                    </Typography>
                                                    {sectionMaxScore > 0 && (
                                                        <Tooltip title={`Score QCM Section (Max ${sectionMaxScore})`}>
                                                            <Chip
                                                                icon={<EmojiEventsIcon fontSize='small'/>}
                                                                label={`${sectionScore} / ${sectionMaxScore}`}
                                                                variant="outlined" // Outlined chip for section score
                                                                size="small"
                                                                color="info"
                                                                sx={{ fontWeight: 'medium' }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                                <Divider sx={{ mb: 3 }}/> {/* Divider below section header */}

                                                {/* Questions Loop */}
                                                {(section?.questions || []).map((q, qIndex) => {
                                                    const questionId = getQuestionId(q, sIndex, qIndex);
                                                    const studentAnswer = studentAnswers[questionId];
                                                    const isMcqAnswered = q.type === 'multipleChoice' && studentAnswer !== undefined;
                                                    const isOpenEndedChecked = q.type === 'openEnded' && !!checkedOpenEnded[questionId];
                                                    const showFeedback = isMcqAnswered || isOpenEndedChecked;
                                                    let isCorrect = false;
                                                    let correctAnswerLetter = '';
                                                    let correctAnswerText = '';

                                                    if (q.type === 'multipleChoice' && q.correctAnswer && q.options?.length) {
                                                        correctAnswerLetter = String(q.correctAnswer).toLowerCase();
                                                        const correctIndex = correctAnswerLetter.charCodeAt(0) - 97;
                                                        if (correctIndex >= 0 && correctIndex < q.options.length) {
                                                            correctAnswerText = q.options[correctIndex];
                                                        }
                                                        if (isMcqAnswered) { isCorrect = studentAnswer === correctAnswerLetter; }
                                                    }

                                                    let StatusIcon;
                                                    if (isMcqAnswered) { StatusIcon = isCorrect ? <CheckCircleIcon color="success" sx={{ mr: 1 }} /> : <CancelIcon color="error" sx={{ mr: 1 }} />; }
                                                    else if (q.type === 'openEnded') { StatusIcon = isOpenEndedChecked ? <CheckCircleIcon color="info" sx={{ mr: 1 }} /> : <EditNoteIcon color="action" sx={{ mr: 1 }} />; }
                                                    else { StatusIcon = <HelpOutlineIcon color="action" sx={{ mr: 1 }} />; }

                                                    let cardVariant = "elevation"; // Standard card
                                                    let cardBgColor = 'background.paper';
                                                    if (isMcqAnswered) { cardBgColor = isCorrect ? 'success.lightest' : 'error.lightest'; } // Need to define these light shades
                                                    // Define lightest shades in theme or use rgba:
                                                    const successLightest = 'rgba(76, 175, 80, 0.08)';
                                                    const errorLightest = 'rgba(244, 67, 54, 0.08)';
                                                    const infoLightest = 'rgba(25, 118, 210, 0.08)';
                                                    if (isMcqAnswered) { cardBgColor = isCorrect ? successLightest : errorLightest; }
                                                    else if (isOpenEndedChecked) { cardBgColor = infoLightest; }

                                                    return (
                                                         <Card key={questionId} elevation={1} sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: cardBgColor, overflow: 'hidden' /* Clip content better */ }}>
                                                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                                                {/* Question Header */}
                                                                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}> {/* Align start for multiline */}
                                                                    {StatusIcon}
                                                                    <Typography variant="body1" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary', mr: 1 }}>Question {qIndex + 1}</Typography>
                                                                    {typeof q.points === 'number' && q.points > 0 && (
                                                                        <Chip label={`${q.points} pt${q.points > 1 ? 's' : ''}`} variant="outlined" size="small" sx={{ fontWeight: 'medium', ml: 'auto' }} />
                                                                    )}
                                                                </Box>
                                                                {/* Question Text */}
                                                                <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', pl: 4 }}> {/* Indent question text */}
                                                                    {q.questionText || <Box component="span" sx={{ fontStyle: 'italic', color: 'error.main' }}>Texte de la question manquant !</Box>}
                                                                </Typography>

                                                                {/* Answer Area */}
                                                                <Box sx={{ pl: { xs: 0, sm: 4 }, mb: showFeedback ? 2.5 : 0 }}> {/* Indent answer area slightly on larger screens */}
                                                                    {/* MCQ */}
                                                                    {q.type === 'multipleChoice' && q.options?.length && (
                                                                        <FormControl component="fieldset" fullWidth disabled={isMcqAnswered}>
                                                                            {/* Removed redundant legend */}
                                                                            <RadioGroup aria-label={`Réponse pour question ${qIndex + 1}`} name={`quiz-q-${questionId}`} value={studentAnswer || ''} onChange={(e) => handleMcqSubmit(questionId, e.target.value)}>
                                                                                {q.options.map((option, optionIndex) => {
                                                                                    const optionLetter = String.fromCharCode(97 + optionIndex);
                                                                                    const isSelectedAnswer = optionLetter === studentAnswer;
                                                                                    const isTheCorrectAnswer = optionLetter === correctAnswerLetter;
                                                                                    const showFeedbackStyle = isMcqAnswered && (isSelectedAnswer || isTheCorrectAnswer);
                                                                                    let feedbackColor = 'default';
                                                                                    if (showFeedbackStyle) { feedbackColor = isTheCorrectAnswer ? 'success' : 'error'; }

                                                                                    return (
                                                                                        <FormControlLabel
                                                                                            key={optionIndex}
                                                                                            value={optionLetter}
                                                                                            control={<Radio sx={{ py: 0.5 }}/>} // Reduced radio padding
                                                                                            label={<Typography variant="body2" sx={{ fontWeight: showFeedbackStyle && isTheCorrectAnswer ? 'bold' : 'normal', color: showFeedbackStyle ? `${feedbackColor}.dark` : 'text.primary' }}>{`${optionLetter.toUpperCase()}) ${option}`}</Typography>}
                                                                                            sx={{
                                                                                                width: '100%', m: 0, mb: 1, py: 1, px: 1.5, borderRadius: 1.5, border: '1px solid',
                                                                                                borderColor: showFeedbackStyle ? `${feedbackColor}.main` : 'grey.300',
                                                                                                backgroundColor: showFeedbackStyle ? (theme) => theme.palette.mode === 'dark' ? theme.palette[feedbackColor].dark + '20' : theme.palette[feedbackColor].light + '60' : 'transparent', // More subtle background
                                                                                                opacity: isMcqAnswered && !showFeedbackStyle ? 0.7 : 1,
                                                                                                transition: 'border-color 0.2s ease, background-color 0.2s ease',
                                                                                                '&:hover': !isMcqAnswered ? { borderColor: 'primary.main', backgroundColor: 'action.hover' } : {},
                                                                                                cursor: isMcqAnswered ? 'default' : 'pointer'
                                                                                            }}
                                                                                        />
                                                                                    );
                                                                                })}
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    )}
                                                                    {/* Open Ended */}
                                                                    {q.type === 'openEnded' && (
                                                                        <Box sx={{ mt: 1 }}>
                                                                            <TextField fullWidth placeholder="Votre réponse..." variant="outlined" // Use outlined
                                                                                multiline minRows={3} maxRows={8}
                                                                                value={studentAnswer || ''}
                                                                                onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                                                                                disabled={isOpenEndedChecked}
                                                                                sx={{ mb: 1.5 }} />
                                                                            {!isOpenEndedChecked ? (
                                                                                <Button variant="contained" size="small" color="primary" onClick={() => handleCheckOpenEnded(questionId)} disabled={!studentAnswer || studentAnswer.trim() === ''} startIcon={<CheckCircleIcon fontSize='small'/>}>Comparer</Button>
                                                                            ) : (
                                                                                <Button variant="outlined" size="small" color="secondary" onClick={() => handleCheckOpenEnded(questionId, false)} startIcon={<RefreshIcon fontSize='small'/>}>Modifier</Button>
                                                                            )}
                                                                        </Box>
                                                                    )}
                                                                </Box>

                                                                {/* Feedback Section */}
                                                                 <Fade in={showFeedback} timeout={500}>
                                                                    <Box sx={{ visibility: showFeedback ? 'visible' : 'hidden', minHeight: showFeedback ? 'auto' : 0, mt: showFeedback ? 2 : 0, pl: { xs: 0, sm: 4 } }}> {/* Indent feedback */}
                                                                        <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1.5, backgroundColor: 'action.hover' }}>
                                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}><CelebrationIcon fontSize="small" color="secondary" />Feedback</Typography>
                                                                            {/* Feedback content here */}
                                                                            {isMcqAnswered && !isCorrect && correctAnswerLetter && correctAnswerText && (
                                                                                <Alert severity="error" variant="outlined" sx={{ mb: 1 }}> {/* Outlined alerts */}
                                                                                    Réponse correcte : <strong>{correctAnswerLetter.toUpperCase()}) {correctAnswerText}</strong>
                                                                                </Alert>
                                                                            )}
                                                                            {isMcqAnswered && isCorrect && (
                                                                                <Alert severity="success" variant='outlined' sx={{ mb: 1 }}>
                                                                                     Bonne réponse !
                                                                                </Alert>
                                                                            )}
                                                                            {isOpenEndedChecked && (
                                                                                <>
                                                                                    <Alert severity="info" variant="outlined" sx={{ mb: 1, '& .MuiAlert-message': {width: '100%'} }}> {/* Ensure message takes full width */}
                                                                                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>Points clés attendus :</Typography>
                                                                                        {formatAsBulletPoints(q.correctAnswer) || <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Aucun point clé fourni.</Typography>}
                                                                                    </Alert>
                                                                                    <Alert severity="warning" variant="outlined" icon={<EditNoteIcon fontSize="inherit"/>} sx={{ mb: (q.verification || q.pageReference) ? 1 : 0 }}>
                                                                                        <Typography variant="caption">Cette réponse sera revue par l'enseignant.</Typography>
                                                                                    </Alert>
                                                                                </>
                                                                            )}
                                                                            {(q.verification || q.pageReference) && (
                                                                                <Accordion variant="outlined" square elevation={0} sx={{ mt: 1.5, backgroundColor: 'transparent', border: 'none', '&:before': { display: 'none' } }}>
                                                                                     <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${questionId}-content`} id={`panel-${questionId}-header`} sx={{ p: 0, minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                                                                                        <HelpOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small"/>
                                                                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Explication / Référence</Typography>
                                                                                    </AccordionSummary>
                                                                                    <AccordionDetails sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                                                                        {q.verification && (<Typography variant="body2" sx={{ color: 'text.primary', mb: q.pageReference ? 1 : 0 }}>{q.verification}</Typography>)}
                                                                                        {q.pageReference && (<Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>Réf : p. {q.pageReference}</Typography>)}
                                                                                    </AccordionDetails>
                                                                                </Accordion>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Fade>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}

                                                {/* Reset Button */}
                                                 {(section?.questions?.length || 0) > 0 && (
                                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button variant="text" // Text button for less emphasis
                                                            size="small"
                                                            color="warning"
                                                            startIcon={<RefreshIcon fontSize="small" />}
                                                            onClick={handleResetSection}
                                                            sx={{ textTransform: 'none', fontWeight: 400 }}
                                                        >
                                                            Réinitialiser la section
                                                        </Button>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                );
                            })} {/* End of Sections Map */}
                        </>
                    )} {/* End of Conditional Quiz Render */}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default InteractiveQuiz;