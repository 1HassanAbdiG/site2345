import React, { useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, /*AlertTitle,*/ Button, Grid, // AlertTitle supprimé
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Tooltip, Divider as MuiDivider // Ajout Divider
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, /*HelpOutline as HelpIcon,*/ Check as VerifyIcon, // HelpIcon non utilisé
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon, LooksOne as LooksOneIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    InfoOutlined as InfoIcon // Ajouté pour Alert
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Supprimer les imports des autres jeux s'ils ne sont pas utilisés DANS CE FICHIER
// import FiveSensesGame from './sens';
// import Organesens from './5sens2';
// import FiveSensesGame2 from './5sens2';


// --- Configuration Spécifique au Jeu des Parties du Corps ---
const bodyPartsConfig = [
    // ... (VOTRE CONFIGURATION bodyPartsConfig reste inchangée) ...
    { id: 'target-l1', name: 'Les cheveux', targetPosition: { top: '11%', left: '10%' } }, { id: 'target-l2', name: 'L\'oeil', targetPosition: { top: '18%', left: "10%" } }, { id: 'target-l3', name: 'La bouche', targetPosition: { top: '25%', left: '10%' } }, { id: 'target-l4', name: 'L\'épaule', targetPosition: { top: '33%', left: '10%' } }, { id: 'target-l5', name: 'Les doigts', targetPosition: { top: '41%', left: '10%' } }, { id: 'target-l6', name: 'Le ventre', targetPosition: { top: '64.5%', left: '10%' } }, { id: 'target-l7', name: 'Le pied', targetPosition: { top: '73%', left: '10%' } }, { id: 'target-r1', name: 'Le nez', targetPosition: { top: '12%', left: '65%' } }, { id: 'target-r2', name: 'L\'oreille', targetPosition: { top: '19%', left: '65%' } }, { id: 'target-r3', name: 'Le cou', targetPosition: { top: '27%', left: '65%' } }, { id: 'target-r4', name: 'Le bras', targetPosition: { top: '36%', left: '65%' } }, { id: 'target-r5', name: 'La main', targetPosition: { top: '64%', left: '65%' } }, { id: 'target-r6', name: 'La jambe', targetPosition: { top: '73%', left: '65%' } },
];
const allLabelsList = ['Les cheveux', "L'oeil", "Le cou", 'Le ventre', 'La main', "L'épaule", "L'oreille", 'Le nez', 'La bouche', 'Le bras', 'La jambe', 'Le pied', "Les doigts"];
const TARGET_BOX_WIDTH = '130px';
const TARGET_BOX_HEIGHT = '40px';
const MAX_SCORE = bodyPartsConfig.length;

// ========================================================================
// --- THÈME COPIÉ DEPUIS FiveSensesGame2 (Version avec légendes) ---
// ========================================================================
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
        button: { fontSize: '0.95rem', fontWeight: 'bold', textTransform: 'none' },
    },
    components: {
        MuiTableCell: { // Styles spécifiques au tableau (si utilisé, sinon peut être simplifié)
            styleOverrides: {
                root: { border: '1px solid rgba(200, 200, 200, 0.8)', textAlign: 'center', padding: '10px 8px', fontSize: '0.95rem', height: 'auto', }, // Hauteur auto pour ce jeu
                head: { fontWeight: 'bold', backgroundColor: '#ede7f6', fontSize: '1rem', color: '#4a148c', },
                body: { '&:first-of-type': { fontWeight: '600', backgroundColor: '#f5f5f5', fontSize: '0.98rem', } }
            },
        },
        MuiChip: { // Styles des étiquettes (draggable) - COPIÉS
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    boxShadow: theme.shadows[2], borderRadius: '16px', padding: '8px 12px', fontSize: '0.95rem', height: 'auto',
                    transition: 'opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease', cursor: 'grab',
                    '&:active': { cursor: 'grabbing', boxShadow: theme.shadows[4], transform: 'scale(1.03)' },
                    '&.source-chip': { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, '&:hover': { backgroundColor: theme.palette.secondary.dark } },
                    // Style pour les chips PLACÉS DANS LES CASES (utilisation via className)
                    '&.placed-chip': {
                        backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.grey[400]}`,
                        cursor: 'grab', // Reste déplaçable avant vérif
                        '&:active': { cursor: 'grabbing' },
                        '&.verified': { cursor: 'default', '&:active': { cursor: 'default', transform: 'scale(1)' } },
                        '&.correct': { borderColor: theme.palette.success.dark, backgroundColor: theme.palette.success.light, borderWidth: '1.5px' }, // Fond + bordure
                        '&.incorrect': { borderColor: theme.palette.error.dark, backgroundColor: theme.palette.error.light, borderWidth: '1.5px' }   // Fond + bordure
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
//                         FIN DU THÈME COPIÉ
// ========================================================================


// Fonction pour mélanger (inchangée)
function shuffleArray(array) { /* ... */ let currentIndex = array.length, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; } return array; }


// --- Composant BOÎTE CIBLE sur l'image ---
// Simplifié car le Chip interne gérera son propre style via className
const TargetDropZone = React.memo(({ part, placedLabelData, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip }) => {
    let borderColor = gameTheme.palette.info.main;
    let backgroundColor = gameTheme.palette.info.light + '40'; // Fond cible par défaut

    // Style de la *zone* si vérifié (bordure principalement)
    if (isVerified) {
        if (verificationResult === true) { borderColor = gameTheme.palette.success.dark; }
        else if (verificationResult === false) { borderColor = gameTheme.palette.error.dark; }
        else { borderColor = gameTheme.palette.grey[500]; } // Vide si vérifié
        backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Fond quasi transparent après vérif
    }

    return (
        <Box
            key={part.id}
            id={`target-${part.id}`} // Garder un ID si utile
            sx={{
                position: 'absolute',
                border: `2px dashed ${borderColor}`, // Bordure indique état/cible
                borderRadius: '10px',
                width: TARGET_BOX_WIDTH, height: TARGET_BOX_HEIGHT,
                top: part.targetPosition.top, left: part.targetPosition.left,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2px', // Petit padding interne
                backgroundColor: backgroundColor, // Fond léger
                transition: 'border-color 0.3s ease, background-color 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': !isVerified ? { // Effet hover pour cible active
                    borderColor: gameTheme.palette.primary.main,
                    backgroundColor: gameTheme.palette.info.light + '80',
                    boxShadow: '0 0 8px rgba(0, 121, 107, 0.4)' // Ombre teal
                } : {},
            }}
            onDragOver={onDragOver}
            onDrop={(e) => !isVerified && onDrop(e, part.id)} // Drop seulement si non vérifié
        >
            {/* Afficher le Chip si une étiquette est placée */}
            {placedLabelData && (
                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : (verificationResult ? "Correct !" : "Incorrect")} arrow>
                    <Chip
                        label={placedLabelData.label}
                        size="small" // Taille cohérente
                        // Application des classes pour le style via le thème
                        className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`}
                        // Icône seulement après vérification
                        icon={isVerified ? (verificationResult ? <CheckCircleIcon /> : <CancelIcon />) : null}
                        draggable={!isVerified} // Draggable seulement avant vérification
                        onDragStart={(e) => {
                            if (!isVerified) onDragStartChip(e, placedLabelData.label, part.id);
                            else e.preventDefault();
                        }}
                        onDragEnd={onDragEndChip}
                        sx={{
                            width: '100%', // Prend la largeur de la zone
                            maxWidth: '100%',
                            '.MuiChip-icon': { // Style icônes correct/incorrect
                                color: verificationResult ? gameTheme.palette.success.dark : gameTheme.palette.error.dark
                            },
                        }}
                    />
                </Tooltip>
            )}
        </Box>
    );
});


// --- Composant Tableau Récapitulatif --- (Inchangé fonctionnellement, mais utilise le thème global)
const GameSummaryTable = ({ studentName, attemptCount, firstAttemptScore, bestScore, worstScore, maxScore }) => (
    <TableContainer component={Paper} elevation={2} sx={{ mt: 3, borderRadius: '12px' }}>
        {/* ... contenu identique à la version précédente ... */}
        <Table size="small" aria-label="Tableau récapitulatif"> <TableHead sx={{ backgroundColor: gameTheme.palette.primary.light }}> <TableRow><TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statistique</TableCell><TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Valeur</TableCell></TableRow> </TableHead> <TableBody> <TableRow><TableCell><PersonIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Élève</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>{studentName || '-'}</TableCell></TableRow> <TableRow><TableCell><FormatListNumberedIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Nbr. tentatives</TableCell><TableCell align="right">{attemptCount}</TableCell></TableRow> <TableRow><TableCell><LooksOneIcon sx={{ verticalAlign: 'bottom', mr: 1 }} /> Score 1ère tentative</TableCell><TableCell align="right">{firstAttemptScore === null ? '-' : `${firstAttemptScore} / ${maxScore}`}</TableCell></TableRow> <TableRow><TableCell><EmojiEventsIcon sx={{ verticalAlign: 'bottom', mr: 1, color: '#ffc107' }} /> Meilleur score</TableCell><TableCell align="right">{bestScore === null ? '-' : `${bestScore} / ${maxScore}`}</TableCell></TableRow> <TableRow><TableCell><TrendingDownIcon sx={{ verticalAlign: 'bottom', mr: 1, color: gameTheme.palette.error.main }} /> Plus mauvais score</TableCell><TableCell align="right">{worstScore === null ? '-' : `${worstScore} / ${maxScore}`}</TableCell></TableRow> </TableBody> </Table>
    </TableContainer>
);


// --- Le Composant Jeu Principal ---
function BodyPartGameFinalVerify5({ imageUrl = "./corps.jpeg" }) { // Chemin image mis à jour

    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [draggableLabels, setDraggableLabels] = useState(() => shuffleArray([...allLabelsList]));
    const [placedLabels, setPlacedLabels] = useState({}); // { targetId: 'Label Name' }
    const [verificationResults, setVerificationResults] = useState({}); // { targetId: boolean }
    const [isVerified, setIsVerified] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    // Stats
    const [attemptCount, setAttemptCount] = useState(0);
    const [firstAttemptScore, setFirstAttemptScore] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [worstScore, setWorstScore] = useState(null);

    const initialBodyParts = bodyPartsConfig; // Référence locale

    // --- Handlers D&D (Logique similaire à FiveSenses, ajustée pour ce jeu) ---
    const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        if (isVerified) { event.preventDefault(); return; }
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.6';
        if (sourceTargetId) { // Si on déplace depuis une zone cible
            setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            // Annuler la vérification si on déplace une étiquette
            setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({});
        }
    }, [isVerified]); // Dépend seulement de isVerified

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
            // Si on vient d'une *autre* zone cible ET que la destination avait déjà une étiquette, on les échange
            if (sourceTargetId && sourceTargetId !== targetId && labelAlreadyInTarget) {
                newState[sourceTargetId] = labelAlreadyInTarget;
            }
            // Si on vient du pool vers une zone occupée, l'ancienne est juste écrasée (pas de newState[sourceTargetId])
            // Si on vient d'une zone vers une zone vide, sourceTargetId est géré par handleDragStart
            return newState;
        });
        setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({}); // Annule vérif
    }, [isVerified, placedLabels]);

    const handleDropOnSourceArea = useCallback((event) => {
        if (isVerified) return; event.preventDefault();
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        // Si on drop ici une étiquette venant d'une zone cible (elle a été retirée au dragStart)
        if (sourceTargetId) {
            setIsVerified(false); setFeedback({ type: '', message: '' }); setVerificationResults({}); // Annule vérif
        }
    }, [isVerified]);
    // --- Fin D&D ---

    // --- Logique de Vérification ---
    const handleVerify = useCallback(() => {
        if (isVerified) return;
        const results = {}; let currentScore = 0;
        initialBodyParts.forEach(part => { // Utilise initialBodyParts
            const placed = placedLabels[part.id];
            // Comparaison simple (peut être rendue insensible à la casse/espaces si besoin)
            const isCorrect = placed && placed.trim().toLowerCase() === part.name.trim().toLowerCase();
            results[part.id] = !!isCorrect; if (isCorrect) currentScore++;
        });
        const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt);
        if (currentAttempt === 1) { setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore); }
        else { setBestScore(prev => Math.max(prev ?? -1, currentScore)); setWorstScore(prev => Math.min(prev ?? MAX_SCORE + 1, currentScore)); }
        setVerificationResults(results); setScore(currentScore); setIsVerified(true);
        setFeedback({ type: currentScore === MAX_SCORE ? 'success' : 'error', message: currentScore === MAX_SCORE ? `Félicitations ${studentName || ''}! Score Parfait !` : `Essai ${currentAttempt}: ${MAX_SCORE - currentScore} erreur${(MAX_SCORE - currentScore) > 1 ? 's' : ''}. Vérifie les cases rouges.` });
        // setShowConfetti(currentScore === MAX_SCORE); // Activer si confetti est importé
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placedLabels, initialBodyParts, attemptCount, studentName, isVerified]); // attemptCount nécessaire

    // --- Réinitialisation ---
    const handleReset = useCallback(() => {
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setDraggableLabels(shuffleArray([...allLabelsList]));
        // setShowConfetti(false); // Désactiver si confetti est importé
        // Optionnel : reset stats?
        // setAttemptCount(0); setFirstAttemptScore(null); setBestScore(null); setWorstScore(null);
    }, []); // Pas de dépendances

    // --- Démarrage Jeu ---
    const handleStartGame = () => { /* ... inchangé ... */ if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); } else { setFeedback({ type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.' }); } };
    const placedCount = Object.keys(placedLabels).length;
    const allCellsFilled = placedCount === MAX_SCORE; // Vérifier si toutes les cibles ont une étiquette

    return (
        <ThemeProvider theme={gameTheme}>
            <Box sx={{ backgroundColor: gameTheme.palette.background.default, padding: { xs: 1, sm: 2, md: 3 }, minHeight: '100vh' }}>
                <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '1100px', width: '100%', margin: 'auto' }}>
                    {!isGameStarted ? (
                        // --- Formulaire de Nom (Style FiveSensesGame2) ---
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: 4 }}>
                            <Typography variant="h5" sx={{ color: gameTheme.palette.primary.dark, textAlign: 'center' }}> Identification : Parties du Corps </Typography>
                            <PersonIcon sx={{ fontSize: 80, color: gameTheme.palette.secondary.light, mb: 1 }} />
                            <TextField label="Quel est ton prénom ?" variant="filled" value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '90%', maxWidth: '350px' }} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); } }} autoFocus />
                            {feedback.message && <Alert severity={feedback.type || 'info'} sx={{ width: '90%', maxWidth: '350px' }}>{feedback.message}</Alert>}
                            <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()}> C'est Parti ! </Button>
                        </Box>
                    ) : (
                        // --- Jeu Principal ---
                        <> {/* Fragment pour éviter un div inutile */}
                            {/* Section Titre */}
                            <Typography variant="h5" align="center" sx={{ color: gameTheme.palette.primary.dark, mb: 1 }}> Place les Étiquettes sur le Corps </Typography>
                            <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 3 }}> Élève : <strong>{studentName}</strong> </Typography>

                            <Grid container spacing={3} alignItems="flex-start">
                                {/* Colonne Image avec Zones Cibles */}
                                <Grid item xs={12} md={7}>
                                    <Paper elevation={2} sx={{ position: 'relative', width: '100%', maxWidth: '550px', margin: 'auto', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                                        <img src={imageUrl} alt="Schéma corps humain" style={{ display: 'block', width: '100%', height: 'auto' }} />
                                        {/* Mapping des zones cibles */}
                                        {initialBodyParts.map((part) => (
                                            <TargetDropZone
                                                key={part.id} // Utiliser part.id comme clé
                                                part={part}
                                                placedLabelData={placedLabels[part.id] ? { label: placedLabels[part.id] } : null} // Passer l'objet ou null
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

                                {/* Colonne Étiquettes et Contrôles */}
                                <Grid item xs={12} md={5}>
                                    <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '12px', height: '100%', background: '#f8f8ff' /* Fond très léger */ }}>
                                        {/* Titre et Instruction */}
                                        <Typography variant="h6" sx={{ textAlign: 'center', color: gameTheme.palette.secondary.dark }}> Étiquettes à Placer </Typography>
                                        <Typography variant="body2" align="center" sx={{ mb: 1 }}> Glisse chaque mot sur la bonne partie du corps. </Typography>
                                        <MuiDivider />

                                        {/* Zone Source des Étiquettes */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', /* Grid responsive */ gap: 1.5, p: 1.5, flexGrow: 1, /* Prend l'espace restant */ minHeight: '200px', maxHeight: '55vh', overflowY: 'auto', alignContent: 'flex-start', border: '1px dashed', borderColor: 'grey.400', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.8)' }} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea} >
                                            {draggableLabels.map((labelName, index) => {
                                                const isUsed = Object.values(placedLabels).includes(labelName);
                                                const isDisabled = isUsed || isVerified;
                                                // Ne pas afficher si déjà utilisée ET vérification terminée
                                                if (isUsed && isVerified) return null;
                                                return (<Chip key={`${labelName}-${index}`} label={labelName} icon={<DragIndicatorIcon />} className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`} draggable={!isDisabled} onDragStart={(e) => handleDragStart(e, labelName)} onDragEnd={handleDragEnd} sx={{ justifyContent: 'flex-start' }} />);
                                            })}
                                        </Box>

                                        {/* Zone Contrôles/Feedback (bas) */}
                                        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <Box sx={{ minHeight: '50px' }}>
                                                {feedback.message && (<Alert severity={feedback.type || 'info'} variant='filled' sx={{ width: '100%', justifyContent: 'center' }}>{feedback.message}</Alert>)}
                                                {allCellsFilled && !isVerified && !feedback.message && (<Alert severity="info" variant="outlined" icon={<InfoIcon />} sx={{ width: '100%', justifyContent: 'center' }}>Prêt ? Clique sur Vérifier !</Alert>)}
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                                <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allCellsFilled} size="medium" sx={{ flexGrow: 1 }}> Vérifier </Button>
                                                <Tooltip title="Recommencer"><Button variant="outlined" color="secondary" /* Changé couleur */ onClick={handleReset} size="small" sx={{ minWidth: 'auto', p: '10px' }}> <RefreshIcon /> </Button></Tooltip>
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 1, color: gameTheme.palette.primary.dark }}> Score : {score} / {MAX_SCORE} </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Tableau Récapitulatif (conditionnel, pleine largeur si affiché) */}
                                {attemptCount > 0 && (
                                    <Grid item xs={12} sx={{ mt: 2 }}> {/* Prend toute la largeur */}
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

export default BodyPartGameFinalVerify5; // Assurez-vous que le nom d'export correspond