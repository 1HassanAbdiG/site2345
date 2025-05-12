import React, { useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Tooltip, Divider as MuiDivider
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, Check as VerifyIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon,
    LooksOne as LooksOneIcon, FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- Data from your plant JSON ---
const plantDefinitionsData = [
    { "definition": "Je suis souvent colorée et j'attire les abeilles. Parfois, je me transforme en fruit.", "mot": "La fleur" },
    { "definition": "Je suis généralement verte. J'aide la plante à fabriquer sa nourriture avec la lumière du soleil et à respirer.", "mot": "La feuille" },
    { "definition": "Je pousse après la fleur et je contiens souvent des graines. Les animaux et les gens aiment me manger.", "mot": "Le fruit" },
    { "definition": "Je soutiens les feuilles, les fleurs et les fruits. Je transporte l'eau des racines vers le reste de la plante.", "mot": "La tige" },
    { "definition": "Je suis la terre dans laquelle la plante grandit. Je lui donne de l'eau et des nutriments, et ses racines s'y ancrent.", "mot": "Le sol" },
    { "definition": "Je suis cachée sous la terre. Je tiens la plante en place et j'absorbe l'eau et les nutriments du sol.", "mot": "Les racines" }
];

// --- Configuration Spécifique au Jeu des Fonctions des Parties de la Plante ---
const plantPartsFunctionsConfig = plantDefinitionsData.map(item => ({
    columnId: item.mot.toLowerCase().replace(/\s+/g, '-').replace("l'", "").replace("la-", "").replace("le-", ""), // e.g., "fleur", "feuille"
    headerImage: `/plantgame/${item.mot.toLowerCase().replace(/\s+/g, '-').replace("l'", "").replace("la-", "").replace("les-", "").replace("le-", "")}.png`, // e.g., /plantgame/fleur.png (REPLACE WITH ACTUAL PATHS)
    headerAltText: item.mot,
    correctAnswers: { definition: item.definition },
    targetIds: { definition: `definition-${item.mot.toLowerCase().replace(/\s+/g, '-').replace("l'", "").replace("la-", "").replace("le-", "")}` }
}));

// Liste de toutes les étiquettes (définitions)
const allLabelsList = plantDefinitionsData.map(item => item.definition);

const PLANT_CATEGORY_ROWS = [{ id: 'definition', label: 'Fonction / Description' }];
const MAX_SCORE = plantPartsFunctionsConfig.length * PLANT_CATEGORY_ROWS.length;

// Thème personnalisé (Identique à FiveSensesGame2)
const gameTheme = createTheme({
    palette: {
        primary: { main: '#6a1b9a' },
        secondary: { main: '#d81b60' },
        success: { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },
        error: { main: '#F44336', light: '#FFCDD2', dark: '#D32F2F' },
        info: { main: '#1976d2', light: '#e3f2fd' },
        background: { default: '#f3e5f5', paper: '#ffffff' },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 'bold', fontSize: '1.6rem', marginBottom: '0.5em' },
        h6: { fontWeight: '600', fontSize: '1.25rem', marginBottom: '0.6em' },
        subtitle1: { fontWeight: '500', fontSize: '1.1rem', color: '#555' },
        body1: { fontSize: '1.0rem' },
        body2: { fontSize: '0.9rem', color: '#666' },
        button: { fontSize: '0.95rem', fontWeight: 'bold', textTransform: 'none' },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    border: '1px solid rgba(200, 200, 200, 0.8)',
                    textAlign: 'center',
                    padding: '10px 8px',
                    fontSize: '0.95rem',
                    height: '80px', // Adjusted height for definitions
                },
                head: {
                    fontWeight: 'bold',
                    backgroundColor: '#ede7f6',
                    fontSize: '1rem',
                    color: '#4a148c',
                },
                body: {
                    '&:first-of-type': {
                        fontWeight: '600',
                        backgroundColor: '#f5f5f5',
                        fontSize: '0.98rem',
                    }
                }
            },
        },
        MuiChip: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    boxShadow: theme.shadows[2],
                    borderRadius: '16px',
                    padding: '8px 12px',
                    fontSize: '0.90rem', // Slightly smaller for potentially longer definitions
                    height: 'auto', // Auto height for multi-line chips
                    whiteSpace: 'normal', // Allow text wrapping in chips
                    textAlign: 'left', // Align text to left for readability
                    transition: 'opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease',
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing', boxShadow: theme.shadows[4], transform: 'scale(1.03)' },
                    '&.source-chip': {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        '&:hover': { backgroundColor: theme.palette.secondary.dark }
                    },
                    '&.placed-chip': {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.grey[400]}`,
                        '&.verified': { cursor: 'default', '&:active': { cursor: 'default', transform: 'scale(1)' } },
                        '&.correct': { borderColor: theme.palette.success.main, borderWidth: '2px' },
                        '&.incorrect': { borderColor: theme.palette.error.main, borderWidth: '2px' }
                    },
                    '&.disabled-chip': {
                        opacity: 0.55,
                        cursor: 'default',
                        backgroundColor: theme.palette.grey[300],
                        boxShadow: 'none',
                        '&:active': { cursor: 'default', transform: 'scale(1)' },
                        '& .MuiChip-icon': { display: 'none' }
                    },
                }),
                icon: {
                    marginLeft: '8px',
                    marginRight: '-4px',
                },
                label: { // Label can now wrap
                    overflow: 'visible',
                    textOverflow: 'clip',
                    whiteSpace: 'normal',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                }
            },
        },
        MuiButton: { styleOverrides: { root: { borderRadius: '20px', padding: '8px 18px' } } },
        MuiPaper: { styleOverrides: { root: { borderRadius: '16px', padding: '1.5rem' } } },
        MuiAlert: { styleOverrides: { root: { borderRadius: '12px', alignItems: 'center' } } }
    },
});

function shuffleArray(array) { let currentIndex = array.length, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; } return array; }

const DropTargetCell = React.memo(({
    targetId, placedLabel, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip
}) => {
    let borderColor = gameTheme.palette.info.main;
    let backgroundColor = gameTheme.palette.info.light + '20';

    if (isVerified) {
        if (verificationResult === true) {
            borderColor = gameTheme.palette.success.dark;
            backgroundColor = gameTheme.palette.success.light;
        } else if (verificationResult === false) {
            borderColor = gameTheme.palette.error.dark;
            backgroundColor = gameTheme.palette.error.light;
        } else {
            borderColor = gameTheme.palette.grey[500];
            backgroundColor = 'rgba(220, 220, 220, 0.4)';
        }
    }

    return (
        <TableCell
            sx={{
                minWidth: 150, // Wider for definitions
                border: `2px dashed ${borderColor}`,
                backgroundColor: backgroundColor,
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
                verticalAlign: 'middle',
                position: 'relative',
                '&:hover': !isVerified ? {
                    borderColor: gameTheme.palette.primary.main,
                    backgroundColor: gameTheme.palette.info.light + '80',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)'
                } : {},
            }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, targetId)}
        >
            {placedLabel && (
                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : (verificationResult ? "Correct !" : "Incorrect")} arrow>
                    <Chip
                        label={placedLabel}
                        size="medium"
                        className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`}
                        icon={isVerified ? (verificationResult ? <CheckCircleIcon /> : <CancelIcon />) : null}
                        draggable={!isVerified}
                        onDragStart={(e) => {
                            if (!isVerified) onDragStartChip(e, placedLabel, targetId);
                            else e.preventDefault();
                        }}
                        onDragEnd={onDragEndChip}
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                            '.MuiChip-icon': {
                                color: verificationResult ? gameTheme.palette.success.dark : gameTheme.palette.error.dark
                            },
                        }}
                    />
                </Tooltip>
            )}
        </TableCell>
    );
});

const GameSummaryTable = ({ studentName, attemptCount, firstAttemptScore, bestScore, worstScore, maxScore }) => (
    <TableContainer component={Paper} elevation={2} sx={{ mt: 3, borderRadius: '12px' }}>
        <Table size="small" aria-label="Tableau récapitulatif">
            <TableHead sx={{ backgroundColor: gameTheme.palette.primary.light }}>
                <TableRow><TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statistique</TableCell><TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Valeur</TableCell></TableRow>
            </TableHead>
            <TableBody>
                <TableRow><TableCell><PersonIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Élève</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>{studentName || '-'}</TableCell></TableRow>
                <TableRow><TableCell><FormatListNumberedIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Nbr. tentatives</TableCell><TableCell align="right">{attemptCount}</TableCell></TableRow>
                <TableRow><TableCell><LooksOneIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Score 1ère tentative</TableCell><TableCell align="right">{firstAttemptScore === null ? '-' : `${firstAttemptScore} / ${maxScore}`}</TableCell></TableRow>
                <TableRow><TableCell><EmojiEventsIcon sx={{ verticalAlign: 'bottom', mr: 1, color: '#ffc107' }} /> Meilleur score</TableCell><TableCell align="right">{bestScore === null ? '-' : `${bestScore} / ${maxScore}`}</TableCell></TableRow>
                <TableRow><TableCell><TrendingDownIcon sx={{ verticalAlign: 'bottom', mr: 1, color: gameTheme.palette.error.main }} /> Plus mauvais score</TableCell><TableCell align="right">{worstScore === null ? '-' : `${worstScore} / ${maxScore}`}</TableCell></TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);

// --- Le Composant Jeu Principal ---
function PlantPartsFunctionsGame() {
    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [draggableLabels, setDraggableLabels] = useState(() => shuffleArray([...allLabelsList]));
    const [placedLabels, setPlacedLabels] = useState({});
    const [verificationResults, setVerificationResults] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    const [attemptCount, setAttemptCount] = useState(0);
    const [firstAttemptScore, setFirstAttemptScore] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [worstScore, setWorstScore] = useState(null);

    const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        if (isVerified) { event.preventDefault(); return; }
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.6';
        if (sourceTargetId) {
            setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            setIsVerified(false);
            setFeedback({ type: '', message: '' });
            setVerificationResults({});
        }
    }, [isVerified]);

    const handleDragEnd = useCallback((event) => { event.currentTarget.style.opacity = '1'; }, []);
    const handleDragOver = useCallback((event) => { if (isVerified) return; event.preventDefault(); event.dataTransfer.dropEffect = "move"; }, [isVerified]);

    const handleDropOnTarget = useCallback((event, targetId) => {
        if (isVerified) return;
        event.preventDefault(); event.stopPropagation();
        const droppedLabelName = event.dataTransfer.getData("text/plain");
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        if (!droppedLabelName) return;
        const labelAlreadyInTarget = placedLabels[targetId];

        setPlacedLabels(prev => {
            const newState = { ...prev };
            newState[targetId] = droppedLabelName;
            if (sourceTargetId && sourceTargetId !== targetId && labelAlreadyInTarget) {
                newState[sourceTargetId] = labelAlreadyInTarget;
            }
            return newState;
        });
        setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({});
    }, [isVerified, placedLabels]);

    const handleDropOnSourceArea = useCallback((event) => {
        if (isVerified) return; event.preventDefault();
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        if (sourceTargetId) {
            setIsVerified(false);
            setFeedback({ type: '', message: '' });
            setVerificationResults({});
        }
    }, [isVerified]);

    const handleVerify = useCallback(() => {
        if (isVerified) return;
        const results = {}; let currentScore = 0;
        plantPartsFunctionsConfig.forEach(col => {
            PLANT_CATEGORY_ROWS.forEach(row => { // Though there's only one row type ('definition')
                const targetId = col.targetIds[row.id];
                const placed = placedLabels[targetId];
                // Direct comparison for definitions
                const isCorrect = placed && col.correctAnswers[row.id].trim().toLowerCase() === placed.trim().toLowerCase();
                results[targetId] = !!isCorrect;
                if (isCorrect) currentScore++;
            });
        });
        const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt);
        if (currentAttempt === 1) { setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore); }
        else { setBestScore(prev => Math.max(prev ?? -1, currentScore)); setWorstScore(prev => Math.min(prev ?? MAX_SCORE + 1, currentScore)); }
        setVerificationResults(results); setScore(currentScore); setIsVerified(true);
        setFeedback({ type: currentScore === MAX_SCORE ? 'success' : 'error', message: currentScore === MAX_SCORE ? `Félicitations ${studentName || ''} ! Score Parfait !` : `Essai ${currentAttempt}: ${MAX_SCORE - currentScore} erreur${(MAX_SCORE - currentScore) > 1 ? 's' : ''}. Vérifie les cases rouges.` });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placedLabels, attemptCount, studentName, isVerified]);

    const handleReset = useCallback(() => {
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setDraggableLabels(shuffleArray([...allLabelsList]));
    }, []);

    const handleStartGame = () => { if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); } else { setFeedback({ type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.' }); } };
    const placedCount = Object.keys(placedLabels).length; const allCellsFilled = placedCount === MAX_SCORE;

    return (
        <ThemeProvider theme={gameTheme}>
            <Box sx={{ backgroundColor: gameTheme.palette.background.default, padding: { xs: 1, sm: 2, md: 3 }, minHeight: '100vh' }}>
                <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '1200px', width: '100%', margin: 'auto' }}>
                    {!isGameStarted ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: 4 }}>
                            <Typography variant="h5" sx={{ color: gameTheme.palette.primary.dark, textAlign: 'center' }}> Jeu Interactif : Les Parties de la Plante et Leurs Fonctions </Typography>
                            <PersonIcon sx={{ fontSize: 80, color: gameTheme.palette.secondary.light, mb: 1 }} />
                            <TextField label="Quel est ton prénom ?" variant="filled" value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '90%', maxWidth: '350px' }} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); } }} autoFocus />
                            {feedback.message && <Alert severity={feedback.type || 'info'} sx={{ width: '90%', maxWidth: '350px' }}>{feedback.message}</Alert>}
                            <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()}> C'est Parti ! </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center" sx={{ color: gameTheme.palette.primary.dark, mb: 1 }}>
                                    À Chaque Partie de la Plante sa Fonction !
                                </Typography>
                                <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                                    Élève : <strong>{studentName}</strong>
                                </Typography>

                                <Paper elevation={1} sx={{ p: 2, mb: 3, background: '#fff', borderRadius: '12px' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.secondary.dark }}>
                                        ❶ Choisis et Glisse les Définitions
                                    </Typography>
                                    <Typography variant="body2" align="center" sx={{ mb: 1.5 }}>
                                        Prends une définition et déplace-la dans la case correspondante du tableau.
                                    </Typography>
                                    <MuiDivider sx={{ mb: 1.5 }} />
                                    
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1.5,
                                            p: 2,
                                            minHeight: '100px',
                                            maxHeight: '50vh',
                                            overflowY: 'auto',
                                            alignContent: 'flex-start',
                                            border: '1px dashed',
                                            borderColor: 'black',
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(255,255,255,0.8)'
                                        }}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDropOnSourceArea}
                                    >
                                        {draggableLabels.map((labelName, index) => {
                                            const isUsed = Object.values(placedLabels).includes(labelName);
                                            const isDisabled = isUsed || isVerified;
                                            return (
                                                <Chip
                                                    key={`${labelName}-${index}`}
                                                    label={labelName}
                                                    icon={<DragIndicatorIcon />}
                                                    className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`}
                                                    draggable={!isDisabled}
                                                    onDragStart={(e) => handleDragStart(e, labelName)}
                                                    onDragEnd={handleDragEnd}
                                                    size="medium"
                                                    color={isDisabled ? 'default' : 'success'} // ✅ couleur verte si actif
                                                    sx={{
                                                        cursor: isDisabled ? 'default' : 'grab',
                                                        fontSize: '1.2rem', // ✅ taille texte plus grande
                                                        height: '50px',    // ✅ hauteur plus grande
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>

                                </Paper>

                                <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.primary.dark }}>
                                    ❷ Complète le Tableau
                                </Typography>
                                <TableContainer component={Paper} elevation={2} sx={{ mt: 1, borderRadius: '12px', overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 700 }} aria-label="Tableau des parties de la plante et leurs fonctions">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ minWidth: '120px' }}>Catégorie</TableCell>
                                                {plantPartsFunctionsConfig.map(col => (
                                                    <TableCell key={col.columnId} align="center" sx={{ padding: '10px' }}>
                                                        <Tooltip title={col.headerAltText} arrow>
                                                            <img src={col.headerImage} alt={col.headerAltText} style={{ width: '100px', height: '100px', objectFit: 'contain', verticalAlign: 'middle', marginBottom: '5px' }} />
                                                        </Tooltip>
                                                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>{col.headerAltText}</Typography>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {PLANT_CATEGORY_ROWS.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell component="th" scope="row"> {row.label} </TableCell>
                                                    {plantPartsFunctionsConfig.map(col => (
                                                        <DropTargetCell
                                                            key={col.targetIds[row.id]}
                                                            targetId={col.targetIds[row.id]}
                                                            placedLabel={placedLabels[col.targetIds[row.id]]}
                                                            verificationResult={verificationResults[col.targetIds[row.id]]}
                                                            isVerified={isVerified}
                                                            onDrop={handleDropOnTarget}
                                                            onDragOver={handleDragOver}
                                                            onDragStartChip={handleDragStart}
                                                            onDragEndChip={handleDragEnd}
                                                        />
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Paper elevation={1} sx={{ p: 2, mt: 3, background: '#fff', borderRadius: '12px' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.success.dark }}>
                                        ❸ Vérifie tes Réponses
                                    </Typography>
                                    <MuiDivider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ flexGrow: 1, minHeight: '50px', width: '100%' }}>
                                            {feedback.message && (<Alert severity={feedback.type || 'info'} variant='filled' sx={{ width: '100%', justifyContent: 'center' }}>{feedback.message}</Alert>)}
                                            {allCellsFilled && !isVerified && !feedback.message && (<Alert severity="info" variant="outlined" icon={<InfoIcon />} sx={{ width: '100%', justifyContent: 'center' }}>Toutes les cases sont remplies. Clique sur Vérifier !</Alert>)}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                                            <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allCellsFilled} size="large" sx={{ flexGrow: { xs: 1, sm: 0 } }}> Vérifier </Button>
                                            <Tooltip title="Recommencer">
                                                <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ minWidth: 'auto', p: '10px' }}> <RefreshIcon /> </Button>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 2, color: gameTheme.palette.primary.dark }}>
                                        Score Actuel : {score} / {MAX_SCORE}
                                    </Typography>
                                </Paper>

                                {attemptCount > 0 && (
                                    <>
                                        <Typography variant="h6" align="center" sx={{ mt: 4, mb: 1, color: gameTheme.palette.primary.dark }}>
                                            📊 Tableau Récapitulatif
                                        </Typography>
                                        <GameSummaryTable
                                            studentName={studentName}
                                            attemptCount={attemptCount}
                                            firstAttemptScore={firstAttemptScore}
                                            bestScore={bestScore}
                                            worstScore={worstScore}
                                            maxScore={MAX_SCORE}
                                        />
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default PlantPartsFunctionsGame;