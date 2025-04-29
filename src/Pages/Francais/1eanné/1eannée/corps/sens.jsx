import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, AlertTitle, Grid, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, Check as VerifyIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon, LooksOne as LooksOneIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    Visibility as SightIcon, // Icônes pour les sens (exemples)
    Restaurant as TasteIcon,
    TouchApp as TouchIcon,
    Hearing as HearingIcon,
    Air as SmellIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Optionnel: Importer le composant Confetti
// import { ConfettiEffect } from './ConfettiEffect';

// --- Configuration Spécifique au Jeu des 5 Sens ---
// Structure: [ { columnId, headerIcon, headerImage?(optionnel), correctAnswers: { sens, organe, action }, targetIds: { sens, organe, action } } ]
const sensesGameConfig = [
    { columnId: 'vue', headerIcon: <SightIcon />, correctAnswers: { sens: 'la vue', organe: 'l\'oeil / les yeux', action: 'voir / regarder' }, targetIds: { sens: 'sens-vue', organe: 'organe-vue', action: 'action-vue' } },
    { columnId: 'gout', headerIcon: <TasteIcon />, correctAnswers: { sens: 'le goût', organe: 'la langue', action: 'goûter / déguster' }, targetIds: { sens: 'sens-gout', organe: 'organe-gout', action: 'action-gout' } },
    { columnId: 'toucher', headerIcon: <TouchIcon />, correctAnswers: { sens: 'le toucher', organe: 'la peau', action: 'toucher' }, targetIds: { sens: 'sens-toucher', organe: 'organe-toucher', action: 'action-toucher' } },
    { columnId: 'ouie', headerIcon: <HearingIcon />, correctAnswers: { sens: 'l\'ouïe', organe: 'l\'oreille', action: 'entendre / écouter' }, targetIds: { sens: 'sens-ouie', organe: 'organe-ouie', action: 'action-ouie' } },
    { columnId: 'odorat', headerIcon: <SmellIcon />, correctAnswers: { sens: 'l\'odorat', organe: 'le nez', action: 'sentir' }, targetIds: { sens: 'sens-odorat', organe: 'organe-odorat', action: 'action-odorat' } },
];

// Liste de toutes les étiquettes uniques à faire glisser
const allLabelsList = [
    'la vue', 'le goût', 'le toucher', 'l\'ouïe', 'l\'odorat', // Sens
    'l\'oeil / les yeux', 'la langue', 'la peau', 'l\'oreille', 'le nez', // Organes (formatés comme réponse attendue)
    'voir / regarder', 'goûter / déguster', 'toucher', 'entendre / écouter', 'sentir' // Actions (formatées comme réponse attendue)
];

const CATEGORY_ROWS = [ // Pour itérer sur les lignes du tableau
    { id: 'sens', label: 'Le sens' },
    { id: 'organe', label: 'L\'organe' },
    { id: 'action', label: 'L\'action' },
];

const MAX_SCORE = sensesGameConfig.length * CATEGORY_ROWS.length; // 5 colonnes * 3 lignes = 15

// Thème (peut être ajusté)
const gameTheme = createTheme({
    palette: {
        primary: { main: '#00796b' }, // Teal plus foncé
        secondary: { main: '#ff6f00' }, // Orange foncé pour étiquettes source
        success: { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },
        error: { main: '#F44336', light: '#FFCDD2', dark: '#D32F2F'},
        info: { main: '#607d8b', light: '#cfd8dc' }, // Gris-bleu pour cibles
        background: { default: '#eceff1', paper: '#ffffff' } // Fond gris très clair
    },
    typography: {
        fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif', // Police arrondie
        h6: { fontWeight: 'bold' },
        button: { fontWeight: 'bold', textTransform:'none' },
        body1: { fontSize: '0.95rem' }
    },
    components: {
         MuiTableCell: {
             styleOverrides: {
                 root: {
                     border: '1px solid rgba(224, 224, 224, 1)', // Bordures visibles
                     textAlign: 'center',
                     padding: '8px',
                 },
                 head: {
                     fontWeight: 'bold',
                     backgroundColor: '#f5f5f5' // Fond léger pour l'entête
                 }
             }
         },
         MuiChip: {
             styleOverrides: { // Styles Chip identiques au précédent jeu
               
                 colorPrimary: { /* ... */ },
                 colorSecondary: { /* ... */ },
                 icon: { /* ... */ },
                 // --- Copier les styles MuiChip de la réponse précédente ici ---
                  root: {
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', padding: '10px 8px', fontSize: '0.9rem',
                    height: 'auto', borderRadius: '8px', transition: 'opacity 0.3s ease, background-color 0.3s ease',
                    '&.source-chip': { backgroundColor: '#ff6f00', color: '#fff', cursor: 'grab', '&:active': { cursor: 'grabbing' }, }, // Orange foncé
                    '&.placed-chip': { backgroundColor: 'white', color: '#000', border: '1px solid #ccc', cursor: 'grab', '&:active': { cursor: 'grabbing' },
                        '&.verified': { cursor: 'default', '&:active': { cursor: 'default' }, },
                        '&.correct': { borderColor: '#4CAF50', }, '&.incorrect': { borderColor: '#F44336', }
                    },
                    '&.disabled-chip': { opacity: 0.5, cursor: 'default', backgroundColor: '#E0E0E0', boxShadow: 'none', }
                },
                icon: { marginLeft: '6px' }
                 // --- Fin Copier/Coller ---
             }
         },
         MuiButton: { styleOverrides: { root: { borderRadius: '16px' } } }
    }
});

// Fonction utilitaire pour mélanger
function shuffleArray(array) { /* ... code inchangé ... */
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- Composant Cellule Cible Draggable/Droppable ---
const DropTargetCell = ({ targetId, placedLabel, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip }) => {
    let borderColor = gameTheme.palette.info.main;
    let backgroundColor = gameTheme.palette.info.light + '40'; // Transparent

    if (isVerified) {
        if (verificationResult === true) { borderColor = gameTheme.palette.success.main; backgroundColor = gameTheme.palette.success.light + '70'; }
        else if (verificationResult === false) { borderColor = gameTheme.palette.error.main; backgroundColor = gameTheme.palette.error.light + '70'; }
        else { borderColor = gameTheme.palette.grey[400]; backgroundColor = 'rgba(224, 224, 224, 0.3)'; }
    }

    return (
        <TableCell
            sx={{
                minWidth: 120, // Largeur minimale
                height: 60, // Hauteur fixe pour alignement
                border: `2px dashed ${borderColor}`,
                backgroundColor: backgroundColor,
                transition: 'border-color 0.3s ease, background-color 0.3s ease',
                verticalAlign: 'middle',
                position: 'relative', // Pour positionner l'alerte si nécessaire
                ...(!isVerified && { // Effet Hover uniquement avant vérification
                    '&:hover': {
                        borderColor: gameTheme.palette.primary.dark,
                        backgroundColor: gameTheme.palette.info.light + '60', // Légèrement plus opaque
                    }
                }),
            }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, targetId)}
        >
            {placedLabel && (
                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : ""}>
                    <Chip
                        label={placedLabel}
                        size="small"
                        className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`}
                        icon={isVerified ? (verificationResult ? <CheckCircleIcon fontSize="small"/> : <CancelIcon fontSize="small"/>) : null}
                        draggable={!isVerified}
                        onDragStart={(e) => onDragStartChip(e, placedLabel, targetId)}
                        onDragEnd={onDragEndChip}
                        sx={{
                            width: '95%', maxWidth: 'calc(100% - 8px)', // Empêche dépassement
                             overflow: 'hidden', textOverflow: 'ellipsis',
                            '.MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', padding: '0 4px' }, // S'assure que le label ne dépasse pas
                             '.MuiChip-icon': { marginLeft: '2px', marginRight: '-2px', color: isVerified ? (verificationResult ? 'success.dark' : 'error.dark') : 'inherit' },
                        }}
                    />
                </Tooltip>
            )}
        </TableCell>
    );
};


// --- Le Composant Jeu Principal ---
function FiveSensesGame({ /* Pas d'imageUrl nécessaire ici */ }) {

    // États Nom & Démarrage
    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);

    // États Jeu
    const [draggableLabels, setDraggableLabels] = useState(() => shuffleArray([...allLabelsList]));
    const [placedLabels, setPlacedLabels] = useState({}); // { targetId: 'Label Name' }
    const [verificationResults, setVerificationResults] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // États Stats
    const [attemptCount, setAttemptCount] = useState(0);
    const [firstAttemptScore, setFirstAttemptScore] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [worstScore, setWorstScore] = useState(null);

    // --- Handlers D&D ---
    const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        if (isVerified) { event.preventDefault(); return; }
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.5';
        if (sourceTargetId) {
            setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            setIsVerified(false); setGameOver(false); setFeedback({ type: '', message: '' });
        }
    }, [isVerified]);
    const handleDragEnd = useCallback((event) => { event.currentTarget.style.opacity = '1'; }, []);
    const handleDragOver = useCallback((event) => { if (isVerified) return; event.preventDefault(); event.dataTransfer.dropEffect = "move"; }, [isVerified]);
    const handleDropOnTarget = useCallback((event, targetId) => {
        if (isVerified) return; event.preventDefault(); event.stopPropagation();
        const droppedLabelName = event.dataTransfer.getData("text/plain");
        if (!droppedLabelName) return;
        setPlacedLabels(prev => ({ ...prev, [targetId]: droppedLabelName }));
        setIsVerified(false); setGameOver(false); setFeedback({ type: '', message: '' });
    }, [isVerified]);
    const handleDropOnSourceArea = useCallback((event) => {
        if (isVerified) return; event.preventDefault();
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        if (sourceTargetId) { setFeedback({ type: '', message: '' }); setIsVerified(false); setGameOver(false); }
     }, [isVerified]);
    // --- Fin Handlers D&D ---

    // --- Vérification ---
    const handleVerify = useCallback(() => {
        if (isVerified) return;
        const results = {}; let currentScore = 0;
        sensesGameConfig.forEach(col => {
            CATEGORY_ROWS.forEach(row => {
                const targetId = col.targetIds[row.id];
                const placed = placedLabels[targetId];
                const isCorrect = placed && placed === col.correctAnswers[row.id];
                results[targetId] = !!isCorrect;
                if (isCorrect) currentScore++;
            });
        });
        // MAJ Stats...
        const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt);
        if (currentAttempt === 1) { setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore); }
        else { setBestScore(prev => Math.max(prev ?? -1, currentScore)); setWorstScore(prev => Math.min(prev ?? MAX_SCORE + 1, currentScore)); }
        // Reste de la logique...
        setVerificationResults(results); setScore(currentScore); setIsVerified(true); setGameOver(true);
        if (currentScore === MAX_SCORE) { setFeedback({ type: 'success', message: `Bravo ${studentName || ''} (Tentative ${currentAttempt}) ! Tout est correct !` }); setShowConfetti(true); }
        else { const errors = MAX_SCORE - currentScore; setFeedback({ type: 'error', message: `Tentative ${currentAttempt}: ${errors} erreur${errors > 1 ? 's' : ''}. Regarde.` }); setShowConfetti(false); }
    }, [placedLabels, attemptCount, studentName, isVerified]);

    // --- Réinitialisation ---
    const handleReset = useCallback(() => {
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setGameOver(false); setShowConfetti(false);
        setDraggableLabels(shuffleArray([...allLabelsList]));
    }, []);

    // --- Tableau Récapitulatif ---
    const GameSummaryTable = () => ( /* ... Code Table Inchangé ... */
         <TableContainer component={Paper} elevation={2} sx={{ mt: 3 }}>
            <Table size="small" aria-label="Tableau récapitulatif">
                <TableHead sx={{ backgroundColor: 'primary.light' }}><TableRow><TableCell sx={{color:'white', fontWeight:'bold'}}>Statistique</TableCell><TableCell align="right" sx={{color:'white', fontWeight:'bold'}}>Valeur</TableCell></TableRow></TableHead>
                <TableBody>
                    <TableRow><TableCell><PersonIcon sx={{verticalAlign:'bottom', mr:1, fontSize:'1.1rem'}}/> Élève</TableCell><TableCell align="right" sx={{fontWeight:'bold'}}>{studentName || '-'}</TableCell></TableRow>
                    <TableRow><TableCell><FormatListNumberedIcon sx={{verticalAlign:'bottom', mr:1, fontSize:'1.1rem'}}/> Nbr. tentatives</TableCell><TableCell align="right">{attemptCount}</TableCell></TableRow>
                    <TableRow><TableCell><LooksOneIcon sx={{verticalAlign:'bottom', mr:1, fontSize:'1.1rem'}}/> Score 1ère tentative</TableCell><TableCell align="right">{firstAttemptScore === null ? '-' : `${firstAttemptScore} / ${MAX_SCORE}`}</TableCell></TableRow>
                    <TableRow><TableCell><EmojiEventsIcon sx={{verticalAlign:'bottom', mr:1, color:'gold', fontSize:'1.1rem'}}/> Meilleur score</TableCell><TableCell align="right">{bestScore === null ? '-' : `${bestScore} / ${MAX_SCORE}`}</TableCell></TableRow>
                    <TableRow><TableCell><TrendingDownIcon sx={{verticalAlign:'bottom', mr:1, color:'error.main', fontSize:'1.1rem'}}/> Plus mauvais score</TableCell><TableCell align="right">{worstScore === null ? '-' : `${worstScore} / ${MAX_SCORE}`}</TableCell></TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );


    // --- Démarrage Jeu ---
    const handleStartGame = () => {
        if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); }
        else { setFeedback({type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.'}); }
    };

    const placedCount = Object.keys(placedLabels).length;
    const allCellsFilled = placedCount === MAX_SCORE;

    // --- RENDER ---
    return (
        <ThemeProvider theme={gameTheme}>
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '95%', width: 'fit-content', margin: 'auto', borderRadius: '16px' }}>
                 {/* <ConfettiEffect active={showConfetti} /> */}

                 {!isGameStarted ? (
                    // --- Formulaire de Nom ---
                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3, minWidth: 300 }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', textAlign: 'center' }}>
                            Les Cinq Sens
                        </Typography>
                        <PersonIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 1 }} />
                        <TextField label="Quel est ton prénom ?" variant="outlined" value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '90%', maxWidth: '300px' }} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action"/></InputAdornment>), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); }}} autoFocus />
                        {feedback.message && <Alert severity={feedback.type || 'info'} sx={{width: '90%', maxWidth: '300px'}}>{feedback.message}</Alert>}
                        <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()} > Démarrer </Button>
                    </Box>
                 ) : (
                    // --- Jeu Principal ---
                    <Grid container spacing={3} alignItems="flex-start">

                         {/* Colonne Gauche: Tableau à compléter */}
                        <Grid item xs={12} lg={8}>
                            <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.dark' }}>
                                Complète le tableau des sens
                                {studentName && <Typography component="span" sx={{fontWeight:'normal', color:'text.secondary'}}> - {studentName}</Typography>}
                            </Typography>
                             <TableContainer component={Paper} elevation={2}>
                                <Table sx={{ minWidth: 650 }} aria-label="Tableau des cinq sens">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Catégorie</TableCell> {/* Entête colonne catégorie */}
                                            {sensesGameConfig.map(col => (
                                                <TableCell key={col.columnId} align="center" sx={{ fontSize: '1.2rem' }}>
                                                    {col.headerIcon} {/* Affiche l'icône du sens */}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {CATEGORY_ROWS.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', backgroundColor: '#eee' }}>
                                                    {row.label}
                                                </TableCell>
                                                {/* Génère les cellules cibles pour cette ligne */}
                                                {sensesGameConfig.map(col => (
                                                    <DropTargetCell
                                                        key={col.targetIds[row.id]}
                                                        targetId={col.targetIds[row.id]}
                                                        placedLabel={placedLabels[col.targetIds[row.id]]}
                                                        verificationResult={verificationResults[col.targetIds[row.id]]}
                                                        isVerified={isVerified}
                                                        onDrop={handleDropOnTarget}
                                                        onDragOver={handleDragOver}
                                                        onDragStartChip={handleDragStart} // Passer les handlers pour le chip interne
                                                        onDragEndChip={handleDragEnd}
                                                    />
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                             {/* Affichage du Bilan sous le tableau */}
                             {attemptCount > 0 && <GameSummaryTable />}
                        </Grid>

                         {/* Colonne Droite: Étiquettes Source et Contrôles */}
                        <Grid item xs={12} lg={4}>
                            <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, background: '#f0f4f8', borderRadius: '12px', height: '100%' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: gameTheme.palette.secondary.dark }}>
                                    Étiquettes ({allLabelsList.length})
                                </Typography>
                                {/* Zone Source */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p:1, minHeight: '300px', maxHeight: '45vh', overflowY:'auto', alignContent: 'flex-start', border:'1px dashed', borderColor:'grey.400', borderRadius:'8px', backgroundColor:'rgba(255,255,255,0.7)'}}
                                    onDragOver={handleDragOver} onDrop={handleDropOnSourceArea}
                                >
                                    {draggableLabels.map((labelName, index) => {
                                        const isUsed = Object.values(placedLabels).includes(labelName);
                                        const isDisabled = isUsed || isVerified; // Désactivé si utilisé OU vérifié
                                        return (
                                            <Chip
                                                key={`${labelName}-${index}`} label={labelName}
                                                icon={<DragIndicatorIcon />}
                                                className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`}
                                                draggable={!isDisabled}
                                                onDragStart={(e) => handleDragStart(e, labelName)}
                                                onDragEnd={handleDragEnd}
                                            />
                                        );
                                    })}
                                </Box>
                                {/* Zone Feedback et Boutons */}
                                <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection:'column', gap: 2 }}>
                                    <Box sx={{minHeight: {xs: '40px', sm:'60px'} }}>
                                        {feedback.message && ( <Alert severity={feedback.type || 'info'} variant={feedback.type === 'success' || feedback.type === 'error' ? 'filled' : 'outlined'} sx={{py: 0.5, px: 1}}>{feedback.message}</Alert> )}
                                         {allCellsFilled && !isVerified && !feedback.message && ( // Message spécifique si tout est rempli mais pas vérifié
                                            <Alert severity="info" variant="outlined" sx={{py: 0.5, px: 1}}>Toutes les cases sont remplies. Prêt à vérifier ?</Alert>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1}}>
                                        <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allCellsFilled} /* Désactivé si pas tout rempli */ size="medium" sx={{flexGrow: 1}}> Vérifier </Button>
                                        <Tooltip title="Recommencer"><Button variant="outlined" color="primary" onClick={handleReset} size="small" sx={{minWidth:'auto', p: '8px'}}> <RefreshIcon /> </Button></Tooltip>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}> Score Actuel : {score} / {MAX_SCORE} </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                    </Grid>
                 )}

            </Paper>
        </ThemeProvider>
    );
}

export default FiveSensesGame;