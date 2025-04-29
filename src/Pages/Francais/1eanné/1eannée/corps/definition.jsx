import React, { useState, useCallback, useMemo } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, Grid, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, List, ListItem, ListItemText, Divider as MuiDivider
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, Check as VerifyIcon, InfoOutlined as InfoIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon, LooksOne as LooksOneIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    Link as LinkIcon,
    LabelImportant as TermIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- Configuration et Listes ---
const senseDefinitionPairs = [ { id: 'pair-vue-sens', term: 'La vue', definition: 'nous renseigne sur la forme et la couleur des choses.', targetId: 'target-def-vue-sens' }, { id: 'pair-vue-organe', term: 'Les yeux', definition: 'sont l\'organe qui permet de voir.', targetId: 'target-def-vue-organe' }, { id: 'pair-ouie-sens', term: 'L\'ouïe', definition: 'nous permet d\'entendre les sons.', targetId: 'target-def-ouie-sens' }, { id: 'pair-ouie-organe', term: 'Les oreilles', definition: 'reçoivent les sons pour l\'ouïe.', targetId: 'target-def-ouie-organe' }, { id: 'pair-odorat-sens', term: 'L\'odorat', definition: 'nous fait apprécier les odeurs que l\'air transporte.', targetId: 'target-def-odorat-sens' }, { id: 'pair-odorat-organe', term: 'Le nez', definition: 'est l\'organe qui permet de sentir les odeurs.', targetId: 'target-def-odorat-organe' }, { id: 'pair-toucher-sens', term: 'Le toucher', definition: 'permet de sentir le poids, la température, la texture (doux/rugueux).', targetId: 'target-def-toucher-sens' }, { id: 'pair-toucher-organe', term: 'La peau', definition: 'perçoit les sensations du toucher et est sensible à la douleur.', targetId: 'target-def-toucher-organe' }, { id: 'pair-gout-sens', term: 'Le goût', definition: 'nous permet de reconnaître les saveurs (sucré, salé, acide, amer).', targetId: 'target-def-gout-sens' }, { id: 'pair-gout-organe', term: 'La langue', definition: 'est l\'organe qui permet de goûter les saveurs.', targetId: 'target-def-gout-organe' } ];
const allTermsList = senseDefinitionPairs.map(pair => pair.term);
const MAX_SCORE_DEF = senseDefinitionPairs.length;

// --- Thème ---
const gameTheme = createTheme({ palette: { primary: { main: '#6a1b9a' }, secondary: { main: '#d81b60' }, success: { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' }, error: { main: '#F44336', light: '#FFCDD2', dark: '#D32F2F' }, info: { main: '#1976d2', light: '#e3f2fd' }, background: { default: '#f3e5f5', paper: '#ffffff' }, }, typography: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', h5: { fontWeight: 'bold', fontSize: '1.6rem', marginBottom: '0.5em' }, h6: { fontWeight: '600', fontSize: '1.25rem', marginBottom: '0.6em' }, subtitle1: { fontWeight: '500', fontSize: '1.1rem', color: '#555' }, body1: { fontSize: '1.0rem' }, body2: { fontSize: '0.9rem', color: '#666' }, button: { fontSize: '0.95rem', fontWeight: 'bold', textTransform:'none' }, }, components: { MuiTableCell: { styleOverrides: { root: { border: '1px solid rgba(200, 200, 200, 0.8)', textAlign: 'center', padding: '10px 8px', fontSize: '0.95rem', height: 'auto', }, head: { fontWeight: 'bold', backgroundColor: '#ede7f6', fontSize: '1rem', color: '#4a148c', }, body: { '&:first-of-type': { fontWeight: '600', backgroundColor: '#f5f5f5', fontSize: '0.98rem', } } } }, MuiChip: { styleOverrides: { root: ({ ownerState, theme }) => ({ boxShadow: theme.shadows[2], borderRadius: '16px', padding: '8px 12px', fontSize: '0.95rem', height: 'auto', transition: 'opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease', cursor: 'grab', '&:active': { cursor: 'grabbing', boxShadow: theme.shadows[4], transform: 'scale(1.03)' }, '&.source-chip': { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, '&:hover': { backgroundColor: theme.palette.secondary.dark } }, '&.placed-chip': { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, border: `1px solid ${theme.palette.grey[400]}`, '&.verified': { cursor: 'default', '&:active': { cursor: 'default', transform: 'scale(1)' } }, '&.correct': { borderColor: theme.palette.success.dark, backgroundColor: theme.palette.success.light, borderWidth: '1.5px' }, '&.incorrect': { borderColor: theme.palette.error.dark, backgroundColor: theme.palette.error.light, borderWidth: '1.5px' } }, '&.disabled-chip': { opacity: 0.55, cursor: 'default', backgroundColor: theme.palette.grey[300], boxShadow: 'none', '&:active': { cursor: 'default', transform: 'scale(1)' }, '& .MuiChip-icon': { display: 'none' } } }), icon: { marginLeft: '8px', marginRight: '-4px', }, label: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '4px', paddingRight: '4px', } } }, MuiButton: { styleOverrides: { root: { borderRadius: '20px', padding: '8px 18px' } } }, MuiPaper: { styleOverrides: { root: { borderRadius: '16px', padding: '1.5rem' } } }, MuiAlert: { styleOverrides: { root: { borderRadius: '12px', alignItems: 'center' } } } } });

// Fonction utilitaire pour mélanger
function shuffleArray(array) { let currentIndex = array.length, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--; [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; } return array; }

// --- Composant Zone de Dépôt pour Définition ---
const DefinitionDropTarget = React.memo(({ pair, placedTerm, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip }) => {
    const targetId = pair.targetId;
    let borderColor = gameTheme.palette.info.main; let backgroundColor = 'transparent';
    if (isVerified) { if (verificationResult === true) { borderColor = gameTheme.palette.success.dark; } else if (verificationResult === false) { borderColor = gameTheme.palette.error.dark; } else { borderColor = gameTheme.palette.grey[400]; } backgroundColor = isVerified ? (verificationResult ? gameTheme.palette.success.light+'50' : verificationResult === false ? gameTheme.palette.error.light+'50' : gameTheme.palette.grey[100]) : gameTheme.palette.background.paper; }

    return (
        <Paper elevation={1} sx={{ p: 1.5, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderLeft: `4px solid ${borderColor}`, transition: 'border-color 0.3s ease', backgroundColor: backgroundColor }} onDragOver={onDragOver} onDrop={(e) => !isVerified && onDrop(e, targetId)} >
            <Box sx={{ minWidth: 150, minHeight: 40, border: `2px dashed ${isVerified ? 'transparent' : gameTheme.palette.grey[400]}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', transition: 'background-color 0.2s ease, border-color 0.2s ease', backgroundColor: isVerified ? 'transparent' : 'rgba(240, 240, 240, 0.5)', '&:hover': !isVerified ? { borderColor: gameTheme.palette.primary.main, backgroundColor: gameTheme.palette.info.light + '60' } : {}, }} >
                {placedTerm && ( <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : (verificationResult ? "Correct !" : "Incorrect")} arrow> <Chip label={placedTerm} size="medium" className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`} icon={isVerified ? (verificationResult ? <CheckCircleIcon /> : <CancelIcon />) : null} draggable={!isVerified} onDragStart={(e) => { if (!isVerified) onDragStartChip(e, placedTerm, targetId); else e.preventDefault(); }} onDragEnd={onDragEndChip} sx={{ width: '100%', maxWidth: '100%', '.MuiChip-icon': { color: verificationResult ? gameTheme.palette.success.dark : gameTheme.palette.error.dark }, }} /> </Tooltip> )}
                {!placedTerm && !isVerified && <Typography variant="caption" color="text.secondary">Déposer ici</Typography>}
            </Box>
            <ListItemText primary={pair.definition} primaryTypographyProps={{ variant: 'body1', sx:{ color: isVerified && verificationResult === false ? 'error.dark' : 'text.primary' } }} />
        </Paper>
    );
});

// --- Composant Tableau Récapitulatif ---
const GameSummaryTable = ({ studentName, attemptCount, firstAttemptScore, bestScore, worstScore, maxScore }) => ( /* ... inchangé ... */ <TableContainer component={Paper} elevation={2} sx={{ mt: 3, borderRadius: '12px' }}> <Table size="small" aria-label="Tableau récapitulatif"> <TableHead sx={{ backgroundColor: gameTheme.palette.primary.light }}> <TableRow><TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statistique</TableCell><TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Valeur</TableCell></TableRow> </TableHead> <TableBody> <TableRow><TableCell><PersonIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Élève</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>{studentName || '-'}</TableCell></TableRow> <TableRow><TableCell><FormatListNumberedIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Nbr. tentatives</TableCell><TableCell align="right">{attemptCount}</TableCell></TableRow> <TableRow><TableCell><LooksOneIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Score 1ère tentative</TableCell><TableCell align="right">{firstAttemptScore === null ? '-' : `${firstAttemptScore} / ${maxScore}`}</TableCell></TableRow> <TableRow><TableCell><EmojiEventsIcon sx={{ verticalAlign: 'bottom', mr: 1, color: '#ffc107' }} /> Meilleur score</TableCell><TableCell align="right">{bestScore === null ? '-' : `${bestScore} / ${maxScore}`}</TableCell></TableRow> <TableRow><TableCell><TrendingDownIcon sx={{ verticalAlign: 'bottom', mr: 1, color: gameTheme.palette.error.main }} /> Plus mauvais score</TableCell><TableCell align="right">{worstScore === null ? '-' : `${worstScore} / ${maxScore}`}</TableCell></TableRow> </TableBody> </Table> </TableContainer> );

// --- Le Composant Jeu Principal ---
function SenseDefinitionMatchGame() {
    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const initialDraggableTerms = useMemo(() => shuffleArray([...allTermsList]), []);
    const [draggableTerms, setDraggableTerms] = useState(initialDraggableTerms);
    const [placedTerms, setPlacedTerms] = useState({});
    const [verificationResults, setVerificationResults] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    const [attemptCount, setAttemptCount] = useState(0);
    const [firstAttemptScore, setFirstAttemptScore] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [worstScore, setWorstScore] = useState(null);

    // --- Handlers D&D Adaptés ---
    const handleDragStart = useCallback((event, term, sourceTargetId = null) => { if (isVerified) { event.preventDefault(); return; } event.dataTransfer.setData("term", term); event.dataTransfer.setData("sourceTargetId", sourceTargetId || ''); event.dataTransfer.effectAllowed = "move"; event.currentTarget.style.opacity = '0.6'; if (sourceTargetId) { setPlacedTerms(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; }); setDraggableTerms(prev => [...prev, term].filter((t, i, a) => a.indexOf(t) === i)); setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({}); } else { setDraggableTerms(prev => prev.filter(t => t !== term)); } }, [isVerified]);
    const handleDragEnd = useCallback((event) => { event.currentTarget.style.opacity = '1'; }, []);
    const handleDragOver = useCallback((event) => { if (isVerified) return; event.preventDefault(); event.dataTransfer.dropEffect = "move"; }, [isVerified]);

    // ****** handleDropOnTarget CORRIGÉ ******
    const handleDropOnTarget = useCallback((event, targetId) => {
        if (isVerified) return;
        event.preventDefault(); event.stopPropagation();
        const droppedTerm = event.dataTransfer.getData("term");
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        if (!droppedTerm) return;

        const termAlreadyInTarget = placedTerms[targetId]; // Terme actuellement dans la cible

        setPlacedTerms(prev => {
            const newState = { ...prev };
            newState[targetId] = droppedTerm; // Place la nouvelle
            if (sourceTargetId && sourceTargetId !== targetId && termAlreadyInTarget) {
                 newState[sourceTargetId] = termAlreadyInTarget; // Remet l'ancienne dans la source
            }
            return newState;
        });

        // Remettre l'ancien terme (s'il y en avait un et qu'il n'a pas été replacé) dans le pool draggable
        if (termAlreadyInTarget && !(sourceTargetId && sourceTargetId !== targetId && termAlreadyInTarget)) { // <<-- Utilisation de termAlreadyInTarget
             setDraggableTerms(prev => {
                 // Éviter les doublons
                 if (prev.includes(termAlreadyInTarget)) return prev;
                 return [...prev, termAlreadyInTarget];
             });
        }

        setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({});
    }, [isVerified, placedTerms]);
    // ****** Fin handleDropOnTarget CORRIGÉ ******

    const handleDropOnSourceArea = useCallback((event) => { if (isVerified) return; event.preventDefault(); const sourceTargetId = event.dataTransfer.getData("sourceTargetId"); if (sourceTargetId) { setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({}); } }, [isVerified]);

    // --- Vérification Adaptée ---
    const handleVerify = useCallback(() => { if (isVerified) return; const results = {}; let currentScore = 0; senseDefinitionPairs.forEach(pair => { const targetId = pair.targetId; const placed = placedTerms[targetId]; const isCorrect = placed && placed.trim().toLowerCase() === pair.term.trim().toLowerCase(); results[targetId] = !!isCorrect; if (isCorrect) currentScore++; }); const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt); if (currentAttempt === 1) { setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore); } else { setBestScore(prev => Math.max(prev ?? -1, currentScore)); setWorstScore(prev => Math.min(prev ?? MAX_SCORE_DEF + 1, currentScore)); } setVerificationResults(results); setScore(currentScore); setIsVerified(true); setFeedback({ type: currentScore === MAX_SCORE_DEF ? 'success' : 'error', message: currentScore === MAX_SCORE_DEF ? `Félicitations ${studentName || ''}! Tout est lié correctly !` : `Essai ${currentAttempt}: ${MAX_SCORE_DEF - currentScore} erreur${(MAX_SCORE_DEF - currentScore) > 1 ? 's' : ''}. Vérifie les lignes rouges.` }); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placedTerms, attemptCount, studentName, isVerified]);

    // --- Réinitialisation Adaptée ---
    const handleReset = useCallback(() => { setPlacedTerms({}); setVerificationResults({}); setIsVerified(false); setScore(0); setFeedback({ type: '', message: '' }); setDraggableTerms(shuffleArray([...allTermsList])); }, []);
    const handleStartGame = () => { if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); } else { setFeedback({ type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.' }); } };
    const allTargetsFilled = Object.keys(placedTerms).length === MAX_SCORE_DEF;

    // --- RENDER ---
    return (
        <ThemeProvider theme={gameTheme}>
            <Box sx={{ backgroundColor: gameTheme.palette.background.default, padding: {xs: 1, sm: 2, md: 3}, minHeight: '100vh' }}>
                <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: '1200px', width: '100%', margin: 'auto' }}>
                     {!isGameStarted ? ( /* ... Formulaire Nom ... */ <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: 4 }}> <Typography variant="h5" sx={{ color: gameTheme.palette.primary.dark, textAlign: 'center' }}> Associe le Mot à sa Définition </Typography> <LinkIcon sx={{ fontSize: 80, color: gameTheme.palette.secondary.light, mb: 1 }} /> <TextField label="Quel est ton prénom ?" variant="filled" value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '90%', maxWidth: '350px' }} InputProps={{ startAdornment: ( <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> ), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); } }} autoFocus /> {feedback.message && <Alert severity={feedback.type || 'info'} sx={{ width: '90%', maxWidth: '350px' }}>{feedback.message}</Alert>} <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()}> C'est Parti ! </Button> </Box>
                    ) : ( /* --- Jeu Principal --- */ <Grid container spacing={3} alignItems="flex-start">
                            <Grid item xs={12} md={4}> {/* Colonne Gauche: Termes */}
                                <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '12px', height: {md: 'calc(80vh - 100px)'}, background: '#fff' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.secondary.dark }}>❶ Termes à Placer</Typography>
                                    <Typography variant="body2" align="center" sx={{ mb: 1 }}> Glisse chaque terme vers sa définition.</Typography>
                                    <MuiDivider sx={{ mb: 1 }} />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 1.5, flexGrow: 1, overflowY: 'auto', alignContent: 'flex-start', border: '1px dashed', borderColor: 'grey.400', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.8)' }} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea} >
                                         {draggableTerms.map((term, index) => ( <Chip key={`${term}-${index}`} label={term} icon={<TermIcon />} className={`source-chip`} draggable={!isVerified} onDragStart={(e) => handleDragStart(e, term)} onDragEnd={handleDragEnd} /> ))}
                                         {draggableTerms.length === 0 && !isVerified && ( <Typography sx={{width: '100%', textAlign: 'center', p: 2, color: 'text.secondary'}}>Tous les termes sont placés !</Typography> )}
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={8}> {/* Colonne Droite: Définitions et Contrôles */}
                                <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.primary.dark }}>❷ Définitions</Typography>
                                <Typography variant="body2" align="center" sx={{ mb: 1.5 }}> Dépose le bon terme dans la case à gauche.</Typography>
                                <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                                     {senseDefinitionPairs.map((pair) => ( <DefinitionDropTarget key={pair.targetId} pair={pair} placedTerm={placedTerms[pair.targetId]} verificationResult={verificationResults[pair.targetId]} isVerified={isVerified} onDrop={handleDropOnTarget} onDragOver={handleDragOver} onDragStartChip={handleDragStart} onDragEndChip={handleDragEnd} /> ))}
                                </Box>
                                <Paper elevation={1} sx={{ p: 2, mt: 2, background: '#fff', borderRadius: '12px' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.success.dark }}>❸ Vérification</Typography>
                                    <MuiDivider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ flexGrow: 1, minHeight: '50px', width: '100%' }}>
                                            {feedback.message && ( <Alert severity={feedback.type || 'info'} variant='filled' sx={{ width: '100%', justifyContent: 'center' }}>{feedback.message}</Alert> )}
                                            {allTargetsFilled && !isVerified && !feedback.message && ( <Alert severity="info" variant="outlined" icon={<InfoIcon />} sx={{ width: '100%', justifyContent: 'center' }}>Prêt ? Clique sur Vérifier !</Alert> )}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                                            <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allTargetsFilled} size="large" sx={{ flexGrow: { xs: 1, sm: 0 }}}> Vérifier </Button>
                                            <Tooltip title="Recommencer"><Button variant="outlined" color="secondary" onClick={handleReset} sx={{ minWidth: 'auto', p: '10px' }}> <RefreshIcon /> </Button></Tooltip>
                                        </Box>
                                    </Box>
                                     <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 2, color: gameTheme.palette.primary.dark }}> Score Actuel : {score} / {MAX_SCORE_DEF} </Typography>
                                </Paper>
                                {attemptCount > 0 && ( <> <Typography variant="h6" align="center" sx={{ mt: 4, mb: 1, color: gameTheme.palette.primary.dark }}> 📊 Tableau Récapitulatif </Typography> <GameSummaryTable studentName={studentName} attemptCount={attemptCount} firstAttemptScore={firstAttemptScore} bestScore={bestScore} worstScore={worstScore} maxScore={MAX_SCORE_DEF} /> </> )}
                            </Grid>
                        </Grid> )}
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default SenseDefinitionMatchGame;