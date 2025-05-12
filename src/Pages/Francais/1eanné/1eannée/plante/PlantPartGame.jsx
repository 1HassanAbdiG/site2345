import React, { useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Chip, Alert,
    Button, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Tooltip, Divider as MuiDivider
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, Check as VerifyIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon, LooksOne as LooksOneIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- Configuration Spécifique au Jeu des Parties de la Plante ---
const plantPartsConfig = [
    { id: 'target-flower', name: 'Fleur',
      targetPosition: { top: '17.3%', left: '7.7%' }, // Approx. top-left of white box in image.png
      targetDimensions: { width: '23.2%', height: '10%' } }, // Approx. width/height of white box
    { id: 'target-leaf', name: 'Feuille',
      targetPosition: { top: '5.9%', left: '64.2%' },
      targetDimensions: { width: '31.9%', height: '10%' } },
    { id: 'target-fruit', name: 'Fruit',
      targetPosition: { top: '35.3%', left: '7.7%' },
      targetDimensions: { width: '23.2%', height: '10%' } },
    { id: 'target-stem', name: 'Tige',
      targetPosition: { top: '37.3%', left: '64.2%' },
      targetDimensions: { width: '31.9%', height: '10%' } },
    { id: 'target-soil', name: 'Sol', // Label for the soil area as indicated by a box in the image
      targetPosition: { top: '58.1%', left: '7.7%' },
      targetDimensions: { width: '23.2%', height: '10%' } },
    { id: 'target-roots', name: 'Racines',
      targetPosition: { top: '79.3%', left: '64.1%' },
      targetDimensions: { width: '31.9%', height: '10%' } },
];

const allPlantLabelsList = ['Fleur', 'Feuille', 'Fruit', 'Tige', 'Sol', 'Racines'];
const MAX_SCORE = plantPartsConfig.length;

// ========================================================================
// --- THÈME (Identique à l'original fourni) ---
// ========================================================================
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
                root: { border: '1px solid rgba(200, 200, 200, 0.8)', textAlign: 'center', padding: '10px 8px', fontSize: '0.95rem', height: 'auto', },
                head: { fontWeight: 'bold', backgroundColor: '#ede7f6', fontSize: '1rem', color: '#4a148c', },
                body: { '&:first-of-type': { fontWeight: '600', backgroundColor: '#f5f5f5', fontSize: '0.98rem', } }
            },
        },
        MuiChip: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    boxShadow: theme.shadows[2], borderRadius: '16px', padding: '8px 12px', fontSize: '0.95rem', height: 'auto',
                    transition: 'opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease', cursor: 'grab',
                    '&:active': { cursor: 'grabbing', boxShadow: theme.shadows[4], transform: 'scale(1.03)' },
                    '&.source-chip': { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, '&:hover': { backgroundColor: theme.palette.secondary.dark } },
                    '&.placed-chip': {
                        backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.grey[400]}`,
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                        '&.verified': { cursor: 'default', '&:active': { cursor: 'default', transform: 'scale(1)' } },
                        '&.correct': { borderColor: theme.palette.success.dark, backgroundColor: theme.palette.success.light, borderWidth: '1.5px' },
                        '&.incorrect': { borderColor: theme.palette.error.dark, backgroundColor: theme.palette.error.light, borderWidth: '1.5px' }
                    },
                    '&.disabled-chip': { opacity: 0.55, cursor: 'default', backgroundColor: theme.palette.grey[300], boxShadow: 'none', '&:active': { cursor: 'default', transform: 'scale(1)' }, '& .MuiChip-icon': { display: 'none' } }
                }),
                icon: { marginLeft: '8px', marginRight: '-4px', },
                label: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '4px', paddingRight: '4px', }
            },
        },
        MuiButton: { styleOverrides: { root: { borderRadius: '20px', padding: '8px 18px' } } },
        MuiPaper: { styleOverrides: { root: { borderRadius: '16px', padding: '1.5rem' } } },
        MuiAlert: { styleOverrides: { root: { borderRadius: '12px', alignItems: 'center' } } }
    },
});
// ========================================================================
//                         FIN DU THÈME
// ========================================================================

function shuffleArray(array) { let currentIndex = array.length, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; } return array; }

// --- Composant BOÎTE CIBLE sur l'image (Modifié pour dimensions dynamiques) ---
const TargetDropZone = React.memo(({ part, placedLabelData, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip }) => {
    let borderColor = gameTheme.palette.info.main;
    let backgroundColor = gameTheme.palette.info.light + '40';

    if (isVerified) {
        if (verificationResult === true) { borderColor = gameTheme.palette.success.dark; }
        else if (verificationResult === false) { borderColor = gameTheme.palette.error.dark; }
        else { borderColor = gameTheme.palette.grey[500]; }
        backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }

    return (
        <Box
            key={part.id}
            id={`target-${part.id}`}
            sx={{
                position: 'absolute',
                border: `2px dashed ${borderColor}`,
                borderRadius: '10px',
                width: part.targetDimensions.width, // Utilise la largeur de la config
                height: part.targetDimensions.height, // Utilise la hauteur de la config
                top: part.targetPosition.top,
                left: part.targetPosition.left,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2px',
                backgroundColor: backgroundColor,
                transition: 'border-color 0.3s ease, background-color 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': !isVerified ? {
                    borderColor: gameTheme.palette.primary.main,
                    backgroundColor: gameTheme.palette.info.light + '80',
                    boxShadow: '0 0 8px rgba(0, 121, 107, 0.4)'
                } : {},
            }}
            onDragOver={onDragOver}
            onDrop={(e) => !isVerified && onDrop(e, part.id)}
        >
            {placedLabelData && (
                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : (verificationResult ? "Correct !" : "Incorrect")} arrow>
                    <Chip
                        label={placedLabelData.label}
                        size="small"
                        className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`}
                        icon={isVerified ? (verificationResult ? <CheckCircleIcon /> : <CancelIcon />) : null}
                        draggable={!isVerified}
                        onDragStart={(e) => {
                            if (!isVerified) onDragStartChip(e, placedLabelData.label, part.id);
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
        </Box>
    );
});

// --- Composant Tableau Récapitulatif (Inchangé fonctionnellement) ---
const GameSummaryTable = ({ studentName, attemptCount, firstAttemptScore, bestScore, worstScore, maxScore }) => (
    <TableContainer component={Paper} elevation={2} sx={{ mt: 3, borderRadius: '12px' }}>
        <Table size="small" aria-label="Tableau récapitulatif">
            <TableHead sx={{ backgroundColor: gameTheme.palette.primary.light }}>
                <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statistique</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Valeur</TableCell>
                </TableRow>
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
function PlantPartGame({ imageUrl = "./plante.png" }) { // Mise à jour du nom et de l'URL de l'image par défaut

    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [draggableLabels, setDraggableLabels] = useState(() => shuffleArray([...allPlantLabelsList])); // Utilise la nouvelle liste
    const [placedLabels, setPlacedLabels] = useState({});
    const [verificationResults, setVerificationResults] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    const [attemptCount, setAttemptCount] = useState(0);
    const [firstAttemptScore, setFirstAttemptScore] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [worstScore, setWorstScore] = useState(null);

    const initialPlantParts = plantPartsConfig; // Référence à la config de la plante

    const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        if (isVerified) { event.preventDefault(); return; }
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.6';
        if (sourceTargetId) {
            setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({});
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
            setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({});
        }
    }, [isVerified]);

    const handleVerify = useCallback(() => {
        if (isVerified) return;
        const results = {}; let currentScore = 0;
        initialPlantParts.forEach(part => { // Utilise initialPlantParts
            const placed = placedLabels[part.id];
            const isCorrect = placed && placed.trim().toLowerCase() === part.name.trim().toLowerCase();
            results[part.id] = !!isCorrect; if (isCorrect) currentScore++;
        });
        const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt);
        if (currentAttempt === 1) { setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore); }
        else { setBestScore(prev => Math.max(prev ?? -1, currentScore)); setWorstScore(prev => Math.min(prev ?? MAX_SCORE + 1, currentScore)); }
        setVerificationResults(results); setScore(currentScore); setIsVerified(true);
        setFeedback({ type: currentScore === MAX_SCORE ? 'success' : 'error', message: currentScore === MAX_SCORE ? `Félicitations ${studentName || ''}! Score Parfait !` : `Essai ${currentAttempt}: ${MAX_SCORE - currentScore} erreur${(MAX_SCORE - currentScore) > 1 ? 's' : ''}. Vérifie les cases rouges.` });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placedLabels, initialPlantParts, attemptCount, studentName, isVerified]);

    const handleReset = useCallback(() => {
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setDraggableLabels(shuffleArray([...allPlantLabelsList])); // Utilise la nouvelle liste
    }, []);

    const handleStartGame = () => { if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); } else { setFeedback({ type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.' }); } };
    const placedCount = Object.keys(placedLabels).length;
    const allCellsFilled = placedCount === MAX_SCORE;

    return (
        <ThemeProvider theme={gameTheme}>
            <Box sx={{ backgroundColor: gameTheme.palette.background.default, padding: { xs: 1, sm: 2, md: 3 }, minHeight: '100vh' }}>
                <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '1100px', width: '100%', margin: 'auto' }}>
                    {!isGameStarted ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: 4 }}>
                            <Typography variant="h5" sx={{ color: gameTheme.palette.primary.dark, textAlign: 'center' }}> Identification : Parties de la Plante </Typography> {/* Titre mis à jour */}
                            <PersonIcon sx={{ fontSize: 80, color: gameTheme.palette.secondary.light, mb: 1 }} />
                            <TextField label="Quel est ton prénom ?" variant="filled" value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '%', maxWidth: '350px' }} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); } }} autoFocus />
                            {feedback.message && <Alert severity={feedback.type || 'info'} sx={{ width: '90%', maxWidth: '350px' }}>{feedback.message}</Alert>}
                            <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()}> C'est Parti ! </Button>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h5" align="center" sx={{ color: gameTheme.palette.primary.dark, mb: 1 }}> Place les Étiquettes sur la Plante </Typography> {/* Titre mis à jour */}
                            <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 3 }}> Élève : <strong>{studentName}</strong> </Typography>

                            <Grid container spacing={3} alignItems="flex-start">
                                <Grid item xs={12} md={7}>
                                    <Paper elevation={2} sx={{ position: 'relative', width: '100%', maxWidth: '550px', margin: 'auto', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                                        <img src={imageUrl} alt="Schéma d'une plante avec zones pour étiquettes" style={{ display: 'block', width: '100%', height: 'auto' }} /> {/* Alt text mis à jour */}
                                        {initialPlantParts.map((part) => ( // Utilise initialPlantParts
                                            <TargetDropZone
                                                key={part.id}
                                                part={part}
                                                placedLabelData={placedLabels[part.id] ? { label: placedLabels[part.id] } : null}
                                                verificationResult={verificationResults[part.id]}
                                                isVerified={isVerified}
                                                onDrop={handleDropOnTarget}
                                                onDragOver={handleDragOver}
                                                onDragStartChip={handleDragStart}
                                                onDragEndChip={handleDragEnd}
                                            />
                                        ))}
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '12px', height: '100%', background: '#f8f8ff' }}>
                                        <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.secondary.dark }}> Étiquettes à Placer </Typography>
                                        <Typography variant="body2" align="center" sx={{ mb: 1 }}> Glisse chaque mot sur la bonne partie de la plante. </Typography> {/* Instruction mise à jour */}
                                        <MuiDivider />
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 1.5, p: 1.5, flexGrow: 1, minHeight: '200px', maxHeight: '55vh', overflowY: 'auto', alignContent: 'flex-start', border: '1px dashed', borderColor: 'grey.400', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.8)' }} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea} >
                                            {draggableLabels.map((labelName, index) => {
                                                const isUsed = Object.values(placedLabels).includes(labelName);
                                                const isDisabled = isUsed || isVerified;
                                                if (isUsed && isVerified) return null;
                                                return (<Chip key={`${labelName}-${index}`} label={labelName} icon={<DragIndicatorIcon />} className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`} draggable={!isDisabled} onDragStart={(e) => handleDragStart(e, labelName)} onDragEnd={handleDragEnd} sx={{ justifyContent: 'flex-start' }} />);
                                            })}
                                        </Box>
                                        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <Box sx={{ minHeight: '50px' }}>
                                                {feedback.message && (<Alert severity={feedback.type || 'info'} variant='filled' sx={{ width: '100%', justifyContent: 'center' }}>{feedback.message}</Alert>)}
                                                {allCellsFilled && !isVerified && !feedback.message && (<Alert severity="info" variant="outlined" icon={<InfoIcon />} sx={{ width: '100%', justifyContent: 'center' }}>Prêt ? Clique sur Vérifier !</Alert>)}
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                                <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allCellsFilled} size="medium" sx={{ flexGrow: 1 }}> Vérifier </Button>
                                                <Tooltip title="Recommencer"><Button variant="outlined" color="secondary" onClick={handleReset} size="small" sx={{ minWidth: 'auto', p: '10px' }}> <RefreshIcon /> </Button></Tooltip>
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 1, color: gameTheme.palette.primary.dark }}> Score : {score} / {MAX_SCORE} </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {attemptCount > 0 && (
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <Typography variant="h6" align="center" sx={{ mb: 1, color: gameTheme.palette.primary.dark }}> 📊 Tableau Récapitulatif </Typography>
                                        <GameSummaryTable
                                            studentName={studentName} attemptCount={attemptCount} firstAttemptScore={firstAttemptScore}
                                            bestScore={bestScore} worstScore={worstScore} maxScore={MAX_SCORE}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </>
                    )}
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default PlantPartGame; // Nom d'export mis à jour