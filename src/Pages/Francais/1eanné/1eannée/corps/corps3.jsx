import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, AlertTitle, Grid, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, // Ajout pour le champ de nom
    InputAdornment // Optionnel pour icône dans TextField
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, HelpOutline as HelpIcon, Check as VerifyIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon, LooksOne as LooksOneIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, // Ajout pour le nom de l'élève
    PlayArrow as PlayArrowIcon // Pour le bouton commencer
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FiveSensesGame from './sens';
import Organesens from './5sens2';
import FiveSensesGame2 from './5sens2';
import BodyPartGameFinalVerify5 from './corpsok';
import SenseDefinitionMatchGame from './definition';
import SensesQuiz from './sensesList';

// Optionnel: Importer le composant Confetti
// import { ConfettiEffect } from './ConfettiEffect';

// --- Configuration AVEC VOS POSITIONS CORRIGÉES ---
const bodyPartsConfig = [
    // Colonne Gauche (VOS POSITIONS)
    { id: 'target-l1', name: 'Les cheveux', targetPosition: { top: '8%', left: '6%' } },
    { id: 'target-l2', name: 'L\'oeil', targetPosition: { top: '16%', left: '6%' } },
    { id: 'target-l3', name: 'La bouche', targetPosition: { top: '24%', left: '6%' } },
    { id: 'target-l4', name: 'L\'épaule', targetPosition: { top: '32%', left: '6%' } },
    { id: 'target-l5', name: 'Les doigts', targetPosition: { top: '40%', left: '6%' } },
    { id: 'target-l6', name: 'Le ventre', targetPosition: { top: '65.5%', left: '6%' } },
    { id: 'target-l7', name: 'Le pied', targetPosition: { top: '74.5%', left: '6%' } },
    // Colonne Droite (VOS POSITIONS)
    { id: 'target-r1', name: 'Le nez', targetPosition: { top: '9%', left: '66%' } },
    { id: 'target-r2', name: 'L\'oreille', targetPosition: { top: '17%', left: '66%' } },
    { id: 'target-r3', name: 'Le cou', targetPosition: { top: '25.5%', left: '66%' } },
    { id: 'target-r4', name: 'Le bras', targetPosition: { top: '34.5%', left: '66%' } },
    { id: 'target-r5', name: 'La main', targetPosition: { top: '65.5%', left: '66%' } },
    { id: 'target-r6', name: 'La jambe', targetPosition: { top: '74.5%', left: '66%' } },
];
// Liste des étiquettes (VOTRE LISTE) - Assurez-vous qu'elle correspond aux noms dans bodyPartsConfig
const allLabelsList = [
    'Les cheveux', "L'oeil", "Le cou", 'Le ventre', 'La main', "L'épaule",
    "L'oreille", 'Le nez', 'La bouche', 'Le bras', 'La jambe', 'Le pied',"Les doigts"
];
const TARGET_BOX_WIDTH = '130px'; // Gardé de votre version
const TARGET_BOX_HEIGHT = '40px'; // Gardé de votre version
const MAX_SCORE = bodyPartsConfig.length; // Calculé à partir de VOTRE config

// Thème (peut être ajusté si besoin)
const gameTheme = createTheme({
    palette: {
        primary: { main: '#2196F3' }, secondary: { main: '#FFC107' },
        success: { main: '#4CAF50', light: '#C8E6C9' }, error: { main: '#F44336', light: '#FFCDD2' },
        info: { main: '#03A9F4', light: '#B3E5FC' }
    },
    typography: { fontFamily: '"Comic Sans MS", "Poppins", "Roboto", sans-serif', h6: { fontWeight: 'bold' },},
    components: { MuiChip: { /* ... styles chip (gardés) ... */ } } // Recopier les styles de MuiChip ici si besoin
});

// Fonction pour mélanger (inchangée)
function shuffleArray(array) { /* ... code ... */
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


// --- Le Composant Jeu ---
function BodyPartGameFinalVerify({ imageUrl = "./corps.jpeg" }) { // Image par défaut de votre code

    // --- ÉTATS POUR LE NOM ET LE DÉMARRAGE ---
    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    // ---

    // États du jeu
    const [draggableLabels, setDraggableLabels] = useState(() => shuffleArray([...allLabelsList]));
    const [placedLabels, setPlacedLabels] = useState({});
    const [verificationResults, setVerificationResults] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // États pour les statistiques
    const [attemptCount, setAttemptCount] = useState(0);
    const [firstAttemptScore, setFirstAttemptScore] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [worstScore, setWorstScore] = useState(null);

    const initialBodyParts = bodyPartsConfig; // Référence locale

    // --- Gestion Drag and Drop (Réintégrée depuis la version précédente) ---
     const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.5';
        if (sourceTargetId) {
            setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            setVerificationResults(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            setIsVerified(false); setGameOver(false); setFeedback({ type: '', message: '' });
        }
    }, []);
    const handleDragEnd = useCallback((event) => { event.currentTarget.style.opacity = '1'; }, []);
    const handleDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }, []);
    const handleDropOnTarget = useCallback((event, targetId) => {
        event.preventDefault(); event.stopPropagation();
        const droppedLabelName = event.dataTransfer.getData("text/plain");
        if (!droppedLabelName) return;
        setPlacedLabels(prev => ({ ...prev, [targetId]: droppedLabelName }));
        setVerificationResults(prev => { const n = { ...prev }; delete n[targetId]; return n; });
        setIsVerified(false); setGameOver(false); setFeedback({ type: '', message: '' });
    }, []);
     const handleDropOnSourceArea = useCallback((event) => {
        event.preventDefault();
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        if (sourceTargetId) {
             setFeedback({ type: '', message: '' }); setIsVerified(false); setGameOver(false);
        }
     }, []);
    // --- Fin D&D ---

    // --- Logique de Vérification (Réintégrée) ---
    const handleVerify = useCallback(() => {
        const results = {}; let currentScore = 0;
        initialBodyParts.forEach(part => {
            const placed = placedLabels[part.id]; const isCorrect = placed && placed === part.name;
            results[part.id] = !!isCorrect; if (isCorrect) currentScore++;
        });
        const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt);
        if (currentAttempt === 1) {
            setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore);
        } else {
            setBestScore(prev => (prev === null || currentScore > prev ? currentScore : prev));
            setWorstScore(prev => (prev === null || currentScore < prev ? currentScore : prev));
        }
        setVerificationResults(results); setScore(currentScore); setIsVerified(true); setGameOver(true);
        if (currentScore === MAX_SCORE) {
            setFeedback({ type: 'success', message: `Excellent (Tentative ${currentAttempt})! Tout est correct !` }); setShowConfetti(true);
        } else {
             const errors = MAX_SCORE - currentScore; setFeedback({ type: 'error', message: `Tentative ${currentAttempt}: ${errors} erreur${errors > 1 ? 's' : ''}. Regarde.` }); setShowConfetti(false);
        }
    }, [placedLabels, initialBodyParts, attemptCount]);

    // --- Réinitialisation (Réintégrée) ---
    const handleReset = useCallback(() => {
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setGameOver(false); setShowConfetti(false);
        setDraggableLabels(shuffleArray([...allLabelsList]));
    }, []);

    // --- Style des Zones Cibles (Réintégré) ---
    const getTargetBoxStyle = (targetId) => {
        const result = verificationResults[targetId];
        let borderColor = gameTheme.palette.info.main; let backgroundColor = gameTheme.palette.info.light + '60';
        if (isVerified) {
            if (result === true) { borderColor = gameTheme.palette.success.main; backgroundColor = gameTheme.palette.success.light + '90'; }
            else if (result === false) { borderColor = gameTheme.palette.error.main; backgroundColor = gameTheme.palette.error.light + '90'; }
            else { borderColor = gameTheme.palette.grey[400]; backgroundColor = 'rgba(224, 224, 224, 0.5)'; }
        }
        return {
            position: 'absolute', border: `2px solid`, borderColor: borderColor, borderRadius: '10px',
            width: TARGET_BOX_WIDTH, height: TARGET_BOX_HEIGHT, padding: '2px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', backgroundColor: backgroundColor,
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
            boxShadow: isVerified ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
            ...(!isVerified && { '&:hover': { borderColor: gameTheme.palette.primary.dark, boxShadow: '0 0 8px rgba(33, 150, 243, 0.6)' } }),
        };
     };

    const placedCount = Object.keys(placedLabels).length;
    const remainingCount = MAX_SCORE - placedCount;

    // --- Composant Tableau Récapitulatif (mis à jour avec le nom) ---
    const GameSummaryTable = () => (
        <TableContainer component={Paper} elevation={2} sx={{ mt: 3 }}>
            <Table size="small" aria-label="Tableau récapitulatif des tentatives">
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                    <TableRow><TableCell sx={{color:'white', fontWeight:'bold'}}>Statistique</TableCell><TableCell align="right" sx={{color:'white', fontWeight:'bold'}}>Valeur</TableCell></TableRow>
                </TableHead>
                <TableBody>
                     {/* Ligne Nom de l'élève ajoutée */}
                    <TableRow>
                        <TableCell><PersonIcon sx={{verticalAlign:'bottom', mr:1, fontSize:'1.1rem'}}/> Élève</TableCell>
                        <TableCell align="right" sx={{fontWeight:'bold'}}>{studentName || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><FormatListNumberedIcon sx={{verticalAlign:'bottom', mr:1, fontSize:'1.1rem'}}/> Nbr. tentatives</TableCell>
                        <TableCell align="right">{attemptCount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><LooksOneIcon sx={{verticalAlign:'bottom', mr:1, fontSize:'1.1rem'}}/> Score 1ère tentative</TableCell>
                        <TableCell align="right">{firstAttemptScore === null ? '-' : `${firstAttemptScore} / ${MAX_SCORE}`}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><EmojiEventsIcon sx={{verticalAlign:'bottom', mr:1, color:'gold', fontSize:'1.1rem'}}/> Meilleur score</TableCell>
                        <TableCell align="right">{bestScore === null ? '-' : `${bestScore} / ${MAX_SCORE}`}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><TrendingDownIcon sx={{verticalAlign:'bottom', mr:1, color:'error.main', fontSize:'1.1rem'}}/> Plus mauvais score</TableCell>
                        <TableCell align="right">{worstScore === null ? '-' : `${worstScore} / ${MAX_SCORE}`}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );

    // --- Handler pour démarrer le jeu ---
    const handleStartGame = () => {
        if (studentName.trim()) { setIsGameStarted(true); setFeedback({ type: '', message: '' }); }
        else { setFeedback({type: 'warning', message: 'Merci d\'entrer ton nom pour commencer.'}); }
    };

    return (
        <ThemeProvider theme={gameTheme}>
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1000, margin: 'auto', borderRadius: '16px' }}>
                {/* <ConfettiEffect active={showConfetti} /> */}

                {!isGameStarted ? (
                    // --- Formulaire de Nom ---
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark' }}>Bienvenue !</Typography>
                        <PersonIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 1 }} />
                        <TextField
                            label="Quel est ton prénom ?" variant="outlined" value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            sx={{ width: '80%', maxWidth: '300px' }}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action"/></InputAdornment>), }}
                            onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); }}}
                        />
                         {feedback.message && <Alert severity={feedback.type || 'info'} sx={{width: '80%', maxWidth: '300px'}}>{feedback.message}</Alert>}
                        <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />}
                            onClick={handleStartGame} disabled={!studentName.trim()} >
                            Commencer le jeu
                        </Button>
                    </Box>

                ) : (
                    // --- Jeu Principal ---
                    <>
                        <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.dark' }}>
                            Le Corps Humain
                            {studentName && <Typography component="span" sx={{fontWeight:'normal', color:'text.secondary'}}> - {studentName}</Typography>}
                        </Typography>
                         <Typography variant="body1" gutterBottom align="center" sx={{ mb: 2 }}>
                            Place les étiquettes, puis clique sur "Vérifier".
                        </Typography>

                        <Grid container spacing={3} alignItems="flex-start" justifyContent="center">
                            {/* Colonne Image */}
                            <Grid item xs={12} md={7}>
                                <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', margin: 'auto', border: '3px solid #D32F2F', borderRadius: '8px', overflow: 'hidden', background:'#FFF8E1' }}>
                                    <img src={imageUrl} alt="Schéma du corps humain vierge" style={{ display: 'block', width: '100%', height: 'auto' }}/>
                                    {initialBodyParts.map((part) => (
                                        <Box key={part.id} id={`target-${part.id}`}
                                            sx={{ ...getTargetBoxStyle(part.id), top: part.targetPosition.top, left: part.targetPosition.left }}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => !isVerified && handleDropOnTarget(e, part.id)}
                                        >
                                            {placedLabels[part.id] && (
                                                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : ""}>
                                                    <Chip
                                                        label={placedLabels[part.id]} size="small" color="secondary"
                                                        icon={isVerified ? (verificationResults[part.id] ? <CheckCircleIcon fontSize="small" sx={{color: 'success.dark'}}/> : <CancelIcon fontSize="small" sx={{color: 'error.dark'}}/>) : null}
                                                        draggable={!isVerified}
                                                        onDragStart={(e) => !isVerified && handleDragStart(e, placedLabels[part.id], part.id)}
                                                        onDragEnd={handleDragEnd}
                                                        sx={{ /* ... styles chip placé ... */
                                                            width: '95%', overflow: 'hidden', textOverflow: 'ellipsis',
                                                            '.MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft:'4px', paddingRight:'4px' },
                                                            '.MuiChip-icon': { marginLeft: '2px', marginRight: '-2px'},
                                                            cursor: isVerified ? 'default' : 'grab',
                                                            '&:active': { cursor: isVerified ? 'default' : 'grabbing' },
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Colonne Étiquettes et Contrôles */}
                            <Grid item xs={12} md={5}>
                                <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, background: '#f0f4f8', borderRadius: '12px', height: '100%' }}>
                                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'secondary.darker' }}>
                                        Étiquettes à Placer ({remainingCount} restantes)
                                    </Typography>
                                    <Box sx={{ /* ... styles zone source ... */
                                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, p:1, minHeight: '250px',
                                            alignContent: 'flex-start', border:'1px dashed', borderColor:'grey.400',
                                            borderRadius:'8px', backgroundColor:'rgba(255,255,255,0.7)', overflowY: 'auto'
                                        }}
                                        onDragOver={handleDragOver} onDrop={handleDropOnSourceArea}
                                    >
                                         {draggableLabels.map((labelName, index) => {
                                             const isUsed = Object.values(placedLabels).includes(labelName);
                                             if (isUsed && !gameOver) return null;
                                            return ( <Chip key={`${labelName}-${index}-${isUsed}`} /* ... props chip source ... */
                                                        label={labelName} icon={<DragIndicatorIcon />} color="primary" variant="filled"
                                                        draggable={!isUsed && !gameOver}
                                                        onDragStart={(e) => !isUsed && !gameOver && handleDragStart(e, labelName)}
                                                        onDragEnd={handleDragEnd}
                                                         sx={{ justifyContent: 'flex-start', opacity: isUsed ? 0.4 : 1, cursor: isUsed || gameOver ? 'default' : 'grab', '&:active': { cursor: isUsed || gameOver ? 'default' : 'grabbing' }, }}
                                                    /> );
                                         })}
                                         {placedCount === MAX_SCORE && !isVerified && (
                                             <Typography sx={{gridColumn: '1 / -1', textAlign:'center', color:'primary.main', fontWeight: 'bold', p: 1}}>
                                                 Prêt ? Clique sur "Vérifier".
                                             </Typography>
                                         )}
                                    </Box>
                                    <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection:'column', gap: 2 }}>
                                        <Box sx={{minHeight: '60px' }}>
                                            {feedback.message && ( <Alert severity={feedback.type || 'info'} variant={feedback.type === 'success' || feedback.type === 'error' ? 'filled' : 'outlined'} sx={{py: 0.5, px: 1}}>{feedback.message}</Alert> )}
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1}}>
                                            <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || placedCount !== MAX_SCORE} size="medium" sx={{flexGrow: 1}}> Vérifier </Button>
                                            <Tooltip title="Recommencer"><Button variant="outlined" color="primary" onClick={handleReset} size="small" sx={{minWidth:'auto', p: '8px'}}> <RefreshIcon /> </Button></Tooltip>
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}> Score Actuel : {score} / {MAX_SCORE} </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Tableau Récapitulatif */}
                            {attemptCount > 0 && (
                                <Grid item xs={12} md={7}> <GameSummaryTable /> </Grid>
                            )}
                        </Grid>
                    </>
                )}
            </Paper>
            
            <FiveSensesGame2></FiveSensesGame2>
            <BodyPartGameFinalVerify5></BodyPartGameFinalVerify5>
            <SenseDefinitionMatchGame></SenseDefinitionMatchGame>
            <SensesQuiz></SensesQuiz>
          
            
        </ThemeProvider>
    );
}

export default BodyPartGameFinalVerify;