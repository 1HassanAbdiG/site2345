import React, { useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, Grid, // AlertTitle supprimé
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Tooltip, Divider as MuiDivider // Ajout Divider
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, Check as VerifyIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon,
    LooksOne as LooksOneIcon, FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    InfoOutlined as InfoIcon // Pour sous-titre
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- Configuration Spécifique au Jeu des 5 Sens (AVEC IMAGES) ---
const sensesGameConfig = [
    { columnId: 'vue', headerImage: '/5sensorgane/yeux.png', correctAnswers: { sens: 'la vue', organe: 'l\'oeil / les yeux', action: 'voir / regarder' }, targetIds: { sens: 'sens-vue', organe: 'organe-vue', action: 'action-vue' } },
    { columnId: 'gout', headerImage: '/5sensorgane/langue.png', correctAnswers: { sens: 'le goût', organe: 'la langue', action: 'goûter / déguster' }, targetIds: { sens: 'sens-gout', organe: 'organe-gout', action: 'action-gout' } },
    { columnId: 'toucher', headerImage: '/5sensorgane/toucher.png', correctAnswers: { sens: 'le toucher', organe: 'la peau', action: 'toucher' }, targetIds: { sens: 'sens-toucher', organe: 'organe-toucher', action: 'action-toucher' } },
    { columnId: 'ouie', headerImage: '/5sensorgane/oreille.png', correctAnswers: { sens: 'l\'ouïe', organe: 'l\'oreille', action: 'entendre / écouter' }, targetIds: { sens: 'sens-ouie', organe: 'organe-ouie', action: 'action-ouie' } },
    { columnId: 'odorat', headerImage: '/5sensorgane/nez.png', correctAnswers: { sens: 'l\'odorat', organe: 'le nez', action: 'sentir' }, targetIds: { sens: 'sens-odorat', organe: 'organe-odorat', action: 'action-odorat' } },
];

// Liste de toutes les étiquettes uniques
const allLabelsList = ['la vue', 'le goût', 'le toucher', 'l\'ouïe', 'l\'odorat', 'l\'oeil / les yeux', 'la langue', 'la peau', 'l\'oreille', 'le nez', 'voir / regarder', 'goûter / déguster', 'toucher', 'entendre / écouter', 'sentir'];
const CATEGORY_ROWS = [{ id: 'sens', label: 'Le sens' }, { id: 'organe', label: 'L\'organe' }, { id: 'action', label: 'L\'action' }];
const MAX_SCORE = sensesGameConfig.length * CATEGORY_ROWS.length;

// Thème personnalisé (Ajusté)
const gameTheme = createTheme({
    palette: {
        primary: { main: '#6a1b9a' }, // Violet plus profond
        secondary: { main: '#d81b60' }, // Rose plus vif
        success: { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },
        error: { main: '#F44336', light: '#FFCDD2', dark: '#D32F2F' },
        info: { main: '#1976d2', light: '#e3f2fd' }, // Bleu pour info/cibles
        background: { default: '#f3e5f5', paper: '#ffffff' },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // Police plus moderne
        h5: { fontWeight: 'bold', fontSize: '1.6rem', marginBottom: '0.5em' }, // Titre principal
        h6: { fontWeight: '600', fontSize: '1.25rem', marginBottom: '0.6em' }, // Titres de section
        subtitle1: { fontWeight: '500', fontSize: '1.1rem', color: '#555' }, // Sous-titres/Légendes
        body1: { fontSize: '1.0rem' }, // Texte courant légèrement plus grand
        body2: { fontSize: '0.9rem', color: '#666' }, // Instructions/Texte secondaire
        button: { fontSize: '0.95rem', fontWeight: 'bold', textTransform:'none' },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    border: '1px solid rgba(200, 200, 200, 0.8)', // Bordure un peu plus visible
                    textAlign: 'center',
                    padding: '10px 8px', // Légèrement plus d'espace vertical
                    fontSize: '0.95rem', // Taille police cellules
                    height: '65px', // Hauteur fixe cellules
                },
                head: {
                    fontWeight: 'bold',
                    backgroundColor: '#ede7f6', // Fond Lavande très léger pour head
                    fontSize: '1rem',
                    color: '#4a148c', // Texte violet foncé pour head
                },
                 body: { // Styles pour les cellules du corps
                    '&:first-of-type': { // Première colonne (Catégories)
                        fontWeight: '600', // Plus gras
                        backgroundColor: '#f5f5f5', // Fond gris léger
                        fontSize: '0.98rem',
                    }
                 }
            },
        },
        MuiChip: { // Styles des étiquettes (draggable)
            styleOverrides: {
                root: ({ ownerState, theme }) => ({ // Utilisation de la fonction pour accès au thème
                    boxShadow: theme.shadows[2],
                    borderRadius: '16px', // Plus arrondi
                    padding: '8px 12px',
                    fontSize: '0.95rem',
                    height: 'auto',
                    transition: 'opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease',
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing', boxShadow: theme.shadows[4], transform: 'scale(1.03)' },

                    // Styles spécifiques via className
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
                        '& .MuiChip-icon': { display: 'none' } // Cacher l'icône si désactivé
                    },
                }),
                icon: {
                    marginLeft: '8px', // Plus d'espace pour l'icône
                    marginRight: '-4px',
                },
                label: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', // Empêche le retour à la ligne
                    paddingLeft: '4px',
                    paddingRight: '4px',
                }
            },
        },
        MuiButton: { styleOverrides: { root: { borderRadius: '20px', padding: '8px 18px' } } }, // Boutons plus arrondis
        MuiPaper: { styleOverrides: { root: { borderRadius: '16px', padding: '1.5rem' } } }, // Paper plus arrondi
        MuiAlert: { styleOverrides: { root: { borderRadius: '12px', alignItems: 'center' } } } // Alertes arrondies
    },
});

// Fonction utilitaire pour mélanger (Inchangé)
function shuffleArray(array) { /* ... */ let currentIndex = array.length, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--; [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; } return array; }

// --- Composant Cellule Cible Draggable/Droppable ---
const DropTargetCell = React.memo(({ // Ajout de React.memo pour optimiser
    targetId, placedLabel, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip
}) => {
    let borderColor = gameTheme.palette.info.main;
    let backgroundColor = gameTheme.palette.info.light + '20'; // Légèrement transparent

    if (isVerified) {
        if (verificationResult === true) {
            borderColor = gameTheme.palette.success.dark; // Bordure foncée pour contraste
            backgroundColor = gameTheme.palette.success.light; // Fond clair
        } else if (verificationResult === false) {
            borderColor = gameTheme.palette.error.dark; // Bordure foncée
            backgroundColor = gameTheme.palette.error.light; // Fond clair
        } else { // Cas où la case est vide lors de la vérification
            borderColor = gameTheme.palette.grey[500];
            backgroundColor = 'rgba(220, 220, 220, 0.4)';
        }
    }

    return (
        <TableCell
            sx={{
                minWidth: 130, // Légèrement plus large
                border: `2px dashed ${borderColor}`,
                backgroundColor: backgroundColor,
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
                verticalAlign: 'middle',
                position: 'relative',
                '&:hover': !isVerified ? { // Effet hover uniquement si non vérifié
                    borderColor: gameTheme.palette.primary.main,
                    backgroundColor: gameTheme.palette.info.light + '80', // Plus opaque
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)'
                 } : {},
            }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, targetId)}
        >
            {/* Condition pour afficher le Chip */}
            {placedLabel && (
                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : (verificationResult ? "Correct !" : "Incorrect")} arrow>
                    <Chip
                        label={placedLabel}
                        size="medium" // Légèrement plus grand
                        className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`}
                        // Afficher l'icône seulement après vérification
                        icon={isVerified ? (verificationResult ? <CheckCircleIcon /> : <CancelIcon />) : null}
                        draggable={!isVerified} // Draggable seulement si non vérifié
                        onDragStart={(e) => {
                            if (!isVerified) onDragStartChip(e, placedLabel, targetId);
                            else e.preventDefault(); // Empêche le drag si vérifié
                        }}
                        onDragEnd={onDragEndChip}
                        sx={{
                            width: '100%', // Prend toute la largeur disponible
                            maxWidth: '100%', // Évite dépassement théorique
                             '.MuiChip-icon': { // Style pour icônes correct/incorrect
                                 color: verificationResult ? gameTheme.palette.success.dark : gameTheme.palette.error.dark
                             },
                        }}
                    />
                </Tooltip>
            )}
        </TableCell>
    );
}); // Fin React.memo

// --- Composant Tableau Récapitulatif (EXTRAIT) --- (Inchangé fonctionnellement)
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
function FiveSensesGame2() {
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

    // --- Handlers D&D --- (Logique interne globalement inchangée, mais dépendances vérifiées)
    const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        if (isVerified) { event.preventDefault(); return; }
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.6'; // Plus transparent
        if (sourceTargetId) { // Si on déplace depuis une cellule
             setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
             // On annule la vérification si on déplace un élément déjà placé
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
            newState[targetId] = droppedLabelName; // Place la nouvelle
            if (sourceTargetId && sourceTargetId !== targetId && labelAlreadyInTarget) {
                 newState[sourceTargetId] = labelAlreadyInTarget; // Remet l'ancienne dans la source
            } else if (!sourceTargetId && labelAlreadyInTarget){
                // Si vient du pool et la cible est occupée, l'ancienne étiquette n'est PAS remise
                // (implicitement retournée au pool car non présente dans newState)
            }
            // Si on déplace vers une case vide, ou de cellule à cellule vide, sourceTargetId est géré par le dragStart
            return newState;
        });
        // Annuler la vérif si on modifie
        setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({});
    }, [isVerified, placedLabels]);

    const handleDropOnSourceArea = useCallback((event) => {
        if (isVerified) return; event.preventDefault();
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        // Si on drop sur la source une étiquette qui venait d'une cellule,
        // elle a déjà été retirée dans handleDragStart. On annule juste la vérif.
        if (sourceTargetId) {
             setIsVerified(false);
             setFeedback({ type: '', message: '' });
             setVerificationResults({});
        }
    }, [isVerified]);
    // --- Fin Handlers D&D ---

    // --- Vérification --- (Logique de calcul inchangée, dépendances vérifiées)
    const handleVerify = useCallback(() => {
        if (isVerified) return;
        const results = {}; let currentScore = 0;
        sensesGameConfig.forEach(col => {
            CATEGORY_ROWS.forEach(row => {
                const targetId = col.targetIds[row.id];
                const placed = placedLabels[targetId];
                const isCorrect = placed && col.correctAnswers[row.id].split('/').map(ans => ans.trim().toLowerCase()).includes(placed.trim().toLowerCase());
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
    }, [placedLabels, attemptCount, studentName, isVerified]); // attemptCount est nécessaire

    // --- Réinitialisation --- (Option de reset les stats commentée)
    const handleReset = useCallback(() => {
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setDraggableLabels(shuffleArray([...allLabelsList]));
        // Optionnel: Réinitialiser aussi les stats ?
        // setAttemptCount(0); setFirstAttemptScore(null); setBestScore(null); setWorstScore(null);
    }, []);

    // --- Démarrage Jeu --- (Inchangé)
    const handleStartGame = () => { /* ... */ if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); } else { setFeedback({ type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.' }); } };
    const placedCount = Object.keys(placedLabels).length; const allCellsFilled = placedCount === MAX_SCORE;

    // --- RENDER ---
    return (
        <ThemeProvider theme={gameTheme}>
            {/* Utiliser un Box global pour le fond si Paper ne le couvre pas entièrement */}
             <Box sx={{ backgroundColor: gameTheme.palette.background.default, padding: {xs: 1, sm: 2, md: 3}, minHeight: '100vh' }}>
                <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '1200px', /* Largeur max augmentée */ width: '100%', margin: 'auto' }}>
                    {!isGameStarted ? (
                        // --- Formulaire de Nom ---
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: 4 }}>
                            <Typography variant="h5" sx={{ color: gameTheme.palette.primary.dark, textAlign: 'center' }}> Jeu Interactif : Les Cinq Sens </Typography>
                            <PersonIcon sx={{ fontSize: 80, color: gameTheme.palette.secondary.light, mb: 1 }} />
                            <TextField label="Quel est ton prénom ?" variant="filled" /* Style différent */ value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '90%', maxWidth: '350px' }} InputProps={{ startAdornment: ( <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> ), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); } }} autoFocus />
                            {feedback.message && <Alert severity={feedback.type || 'info'} sx={{ width: '90%', maxWidth: '350px' }}>{feedback.message}</Alert>}
                            <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()}> C'est Parti ! </Button>
                        </Box>
                    ) : (
                        // --- Jeu Principal ---
                        <Grid container spacing={3}> {/* Augmenter spacing */}
                            <Grid item xs={12}> {/* Conteneur pleine largeur */}

                                {/* Section Titre Principal du Jeu */}
                                <Typography variant="h5" align="center" sx={{ color: gameTheme.palette.primary.dark, mb: 1 }}>
                                    À Chaque Sens son Organe et son Action !
                                </Typography>
                                <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                                    Élève : <strong>{studentName}</strong>
                                </Typography>

                                {/* Section Étiquettes Source */}
                                <Paper elevation={1} sx={{ p: 2, mb: 3, background: '#fff', borderRadius: '12px' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.secondary.dark }}>
                                        ❶ Choisis et Glisse les Étiquettes
                                    </Typography>
                                    <Typography variant="body2" align="center" sx={{ mb: 1.5 }}>
                                        Prends un mot et déplace-le dans la case correspondante du tableau ci-dessous.
                                     </Typography>
                                    <MuiDivider sx={{ mb: 1.5 }} />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, /* Espace augmenté */ p: 1.5, minHeight: '100px', maxHeight: '20vh', /* Plus haut */ overflowY:'auto', alignContent: 'flex-start', border:'1px dashed', borderColor:'grey.400', borderRadius:'8px', backgroundColor:'rgba(255,255,255,0.8)'}} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea} >
                                        {draggableLabels.map((labelName, index) => {
                                            const isUsed = Object.values(placedLabels).includes(labelName);
                                            const isDisabled = isUsed || isVerified;
                                            return ( <Chip key={`${labelName}-${index}`} label={labelName} icon={<DragIndicatorIcon />} className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`} draggable={!isDisabled} onDragStart={(e) => handleDragStart(e, labelName)} onDragEnd={handleDragEnd} sx={{cursor: isDisabled ? 'default':'grab'}}/> );
                                        })}
                                    </Box>
                                </Paper>

                                 {/* Section Tableau Principal */}
                                 <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.primary.dark }}>
                                     ❷ Complète le Tableau
                                 </Typography>
                                <TableContainer component={Paper} elevation={2} sx={{ mt: 1, borderRadius: '12px', overflowX: 'auto' }}> {/* Permet scroll horizontal si besoin */}
                                    <Table sx={{ minWidth: 700 }} aria-label="Tableau des cinq sens">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{minWidth: '100px'}}>Catégorie</TableCell> {/* Légèrement plus large */}
                                                {sensesGameConfig.map(col => (
                                                    <TableCell key={col.columnId} align="center" sx={{ padding: '10px' }}>
                                                        <Tooltip title={col.columnId.charAt(0).toUpperCase() + col.columnId.slice(1)} arrow>
                                                             <img src={col.headerImage} alt={col.columnId} style={{ width: '120px', height: '120px', objectFit: 'contain', verticalAlign: 'middle' }} />
                                                        </Tooltip>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {CATEGORY_ROWS.map((row) => (
                                                <TableRow key={row.id} hover> {/* Effet hover sur lignes */}
                                                    <TableCell component="th" scope="row"> {row.label} </TableCell>
                                                    {sensesGameConfig.map(col => (
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

                                 {/* Section Contrôles et Feedback */}
                                <Paper elevation={1} sx={{ p: 2, mt: 3, background: '#fff', borderRadius: '12px' }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.success.dark }}>
                                        ❸ Vérifie tes Réponses
                                    </Typography>
                                    <MuiDivider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ flexGrow: 1, minHeight: '50px', width: '100%' }}>
                                            {feedback.message && ( <Alert severity={feedback.type || 'info'} variant='filled' sx={{ width: '100%', justifyContent: 'center' }}>{feedback.message}</Alert> )}
                                            {allCellsFilled && !isVerified && !feedback.message && ( <Alert severity="info" variant="outlined" icon={<InfoIcon />} sx={{ width: '100%', justifyContent: 'center' }}>Toutes les cases sont remplies. Clique sur Vérifier !</Alert> )}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                                            <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allCellsFilled} size="large" sx={{ flexGrow: { xs: 1, sm: 0 }}}> Vérifier </Button>
                                            <Tooltip title="Recommencer">
                                                <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ minWidth: 'auto', p: '10px' }}> <RefreshIcon /> </Button>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                     <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 2, color: gameTheme.palette.primary.dark }}>
                                         Score Actuel : {score} / {MAX_SCORE}
                                     </Typography>
                                </Paper>

                                {/* Section Récapitulatif (conditionnel) */}
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

export default FiveSensesGame2;