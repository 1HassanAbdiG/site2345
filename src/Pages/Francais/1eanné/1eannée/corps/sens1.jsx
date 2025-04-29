import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, AlertTitle, Grid, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, // Gardés pour le bilan
    TextField, InputAdornment, Divider
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon,
    DragIndicator as DragIndicatorIcon, Check as VerifyIcon,
    EmojiEvents as EmojiEventsIcon, TrendingDown as TrendingDownIcon, LooksOne as LooksOneIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Person as PersonIcon, PlayArrow as PlayArrowIcon,
    Visibility as SightIcon, Restaurant as TasteIcon, TouchApp as TouchIcon,
    Hearing as HearingIcon, Air as SmellIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Optionnel: Importer le composant Confetti
// import { ConfettiEffect } from './ConfettiEffect';

// --- Configuration Spécifique à la Disposition ---
// !! POSITIONS (top, left en %) SONT DES ESTIMATIONS À AJUSTER PRÉCISÉMENT !!
const sensesLayoutConfig = [
    { senseId: 'vue', correctAnswers: { sens: 'la vue', organe: 'l\'oeil / les yeux', action: 'voir / regarder' },
      targets: {
          sens:   { id: 'target-sens-vue',   position: { top: '5%',  left: '5%' } }, // Près de l'oeil
          organe: { id: 'target-organe-vue', position: { top: '20%', left: '5%' } },
          action: { id: 'target-action-vue', position: { top: '35%', left: '5%' } }
      }
    },
    { senseId: 'gout', correctAnswers: { sens: 'le goût', organe: 'la langue', action: 'goûter / déguster' },
      targets: {
          sens:   { id: 'target-sens-gout',   position: { top: '5%',  left: '25%' } }, // Près de la langue
          organe: { id: 'target-organe-gout', position: { top: '20%', left: '25%' } },
          action: { id: 'target-action-gout', position: { top: '35%', left: '25%' } }
      }
    },
    { senseId: 'toucher', correctAnswers: { sens: 'le toucher', organe: 'la peau', action: 'toucher' },
      targets: {
          sens:   { id: 'target-sens-toucher',   position: { top: '5%',  left: '45%' } }, // Près de la main
          organe: { id: 'target-organe-toucher', position: { top: '20%', left: '45%' } },
          action: { id: 'target-action-toucher', position: { top: '35%', left: '45%' } }
      }
    },
    { senseId: 'ouie', correctAnswers: { sens: 'l\'ouïe', organe: 'l\'oreille', action: 'entendre / écouter' },
      targets: {
          sens:   { id: 'target-sens-ouie',   position: { top: '5%',  left: '65%' } }, // Près de l'oreille
          organe: { id: 'target-organe-ouie', position: { top: '20%', left: '65%' } },
          action: { id: 'target-action-ouie', position: { top: '35%', left: '65%' } }
      }
    },
    { senseId: 'odorat', correctAnswers: { sens: 'l\'odorat', organe: 'le nez', action: 'sentir' },
      targets: {
          sens:   { id: 'target-sens-odorat',   position: { top: '5%',  left: '85%' } }, // Près du nez
          organe: { id: 'target-organe-odorat', position: { top: '20%', left: '85%' } },
          action: { id: 'target-action-odorat', position: { top: '35%', left: '85%' } }
      }
    },
];

// Listes séparées pour les zones sources
const senseLabels = ['la vue', 'le goût', 'le toucher', 'l\'ouïe', 'l\'odorat'];
const organLabels = ['l\'oeil / les yeux', 'la langue', 'la peau', 'l\'oreille', 'le nez'];
const actionLabels = ['voir / regarder', 'goûter / déguster', 'toucher', 'entendre / écouter', 'sentir'];
// Liste plate pour retrouver facilement la catégorie d'une étiquette
const allLabelsMap = new Map([
    ...senseLabels.map(l => [l, 'sens']),
    ...organLabels.map(l => [l, 'organe']),
    ...actionLabels.map(l => [l, 'action']),
]);

const TARGET_BOX_WIDTH = '140px'; // Largeur cible
const TARGET_BOX_HEIGHT = '45px'; // Hauteur cible
const MAX_SCORE = sensesLayoutConfig.length * 3; // 15 cibles

// Thème (Adapté légèrement)
const gameTheme = createTheme({
    palette: {
        primary: { main: '#4CAF50' }, // Vert
        secondary: { main: '#FF9800' }, // Orange
        sens: { main: '#2196F3', light: '#BBDEFB', contrastText: '#fff' }, // Bleu pour Sens
        organe: { main: '#E91E63', light: '#F8BBD0', contrastText: '#fff' }, // Rose pour Organe
        action: { main: '#9C27B0', light: '#E1BEE7', contrastText: '#fff' }, // Violet pour Action
        success: { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },
        error: { main: '#F44336', light: '#FFCDD2', dark: '#D32F2F'},
        background: { default: '#f4f8f4', paper: '#ffffff' } // Fond légèrement vert
    },
    typography: { fontFamily: '"Comic Sans MS", "Poppins", "Roboto", sans-serif', /* ... */ },
    components: { MuiChip: { /* ... styles chip (gardés) ... */ }, /* ... */ }
     // Recopier les styles MuiChip ici, adaptés si besoin
});

// Fonction pour mélanger
function shuffleArray(array) { /* ... code inchangé ... */ }

// --- Composant DropTargetBox (simplifié pour cette disposition) ---
const DropTargetBox = ({ targetId, category, position, placedLabel, verificationResult, isVerified, onDrop, onDragOver, onDragStartChip, onDragEndChip }) => {
    const categoryColor = gameTheme.palette[category]?.main || gameTheme.palette.info.main;
    const categoryLightColor = gameTheme.palette[category]?.light || gameTheme.palette.info.light;
    let borderColor = categoryColor;
    let backgroundColor = categoryLightColor + '40'; // Transparent par défaut

    if (isVerified) {
        if (verificationResult === true) { borderColor = gameTheme.palette.success.main; backgroundColor = gameTheme.palette.success.light + '70'; }
        else if (verificationResult === false) { borderColor = gameTheme.palette.error.main; backgroundColor = gameTheme.palette.error.light + '70'; }
        else { borderColor = gameTheme.palette.grey[400]; backgroundColor = 'rgba(224, 224, 224, 0.3)'; }
    }

    return (
        <Box
            id={targetId}
            sx={{
                position: 'absolute', top: position.top, left: position.left,
                transform: 'translateX(-50%)', // Centre la boîte horizontalement
                width: TARGET_BOX_WIDTH, height: TARGET_BOX_HEIGHT,
                border: `2px dashed ${borderColor}`, borderRadius: '8px',
                backgroundColor: backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2px', transition: 'all 0.3s ease',
                zIndex: 1, // Pour être au-dessus de l'image
                ...(!isVerified && { '&:hover': { borderColor: gameTheme.palette.primary.dark, backgroundColor: categoryLightColor + '70', transform: 'translateX(-50%) scale(1.05)', } }),
            }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, targetId, category)} // Passe la catégorie
        >
            {placedLabel && (
                <Tooltip title={!isVerified ? "Fais glisser pour déplacer" : ""}>
                    <Chip /* ... Chip placé (similaire à avant) ... */
                         label={placedLabel} size="small"
                         className={`placed-chip ${isVerified ? 'verified' : ''} ${isVerified ? (verificationResult ? 'correct' : 'incorrect') : ''}`}
                         icon={isVerified ? (verificationResult ? <CheckCircleIcon fontSize="small"/> : <CancelIcon fontSize="small"/>) : null}
                         draggable={!isVerified}
                         onDragStart={(e) => onDragStartChip(e, placedLabel, targetId)}
                         onDragEnd={onDragEndChip}
                         sx={{ /* ... styles chip placé (similaire à avant) ... */ }}
                    />
                </Tooltip>
            )}
        </Box>
    );
};


// --- Le Composant Jeu Principal ---
function FiveSensesLayoutGame({ imageUrl = "input_file_0.jpeg" }) { // Utilise l'image fournie

    // États Nom & Démarrage
    const [studentName, setStudentName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);

    // États Jeu
    // Garde une seule liste pour la source, on la filtrera à l'affichage
    const [availableLabels, setAvailableLabels] = useState(() => shuffleArray([...allLabelsList]));
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

    // --- Handlers D&D (Adaptés) ---
    const handleDragStart = useCallback((event, labelName, sourceTargetId = null) => {
        if (isVerified) { event.preventDefault(); return; }
        const category = allLabelsMap.get(labelName) || 'unknown'; // Trouve la catégorie de l'étiquette
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.setData("labelCategory", category); // Ajoute la catégorie
        event.dataTransfer.setData("sourceTargetId", sourceTargetId || '');
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.5';
        if (sourceTargetId) { // Si on déplace depuis une cible
            setPlacedLabels(prev => { const n = { ...prev }; delete n[sourceTargetId]; return n; });
            setIsVerified(false); setGameOver(false); setFeedback({ type: '', message: '' });
        }
    }, [isVerified]);

    const handleDragEnd = useCallback((event) => { event.currentTarget.style.opacity = '1'; }, []);

    const handleDragOver = useCallback((event) => {
        if (isVerified) return;
        event.preventDefault();
        // Optionnel : Vérifier si la catégorie de l'étiquette draguée correspond à la catégorie de la cible survolée
        // const targetCategory = event.currentTarget.dataset.category; // Nécessite d'ajouter data-category à DropTargetBox
        // const draggedCategory = event.dataTransfer.types.includes("labelcategory") ? event.dataTransfer.getData("labelCategory") : null;
        // if (targetCategory && draggedCategory && targetCategory === draggedCategory) {
             event.dataTransfer.dropEffect = "move";
        // } else {
        //     event.dataTransfer.dropEffect = "none";
        // }
    }, [isVerified]);

    // Drop sur une cible spécifique
    const handleDropOnTarget = useCallback((event, targetId, targetCategory) => {
        if (isVerified) return;
        event.preventDefault(); event.stopPropagation();
        const droppedLabelName = event.dataTransfer.getData("text/plain");
        const droppedCategory = event.dataTransfer.getData("labelCategory");

        // Vérifie si la catégorie de l'étiquette correspond à la cible
        if (!droppedLabelName || droppedCategory !== targetCategory) {
            setFeedback({type: 'warning', message: `Cette étiquette ne va pas dans la catégorie "${targetCategory}" !`});
            return; // Empêche le drop si catégorie incorrecte
        }

        setPlacedLabels(prev => ({ ...prev, [targetId]: droppedLabelName }));
        setIsVerified(false); setGameOver(false); setFeedback({ type: '', message: '' });

    }, [isVerified]);

    // Drop sur une zone source (pour retour)
    const handleDropOnSourceArea = useCallback((event) => {
        if (isVerified) return;
        event.preventDefault();
        const sourceTargetId = event.dataTransfer.getData("sourceTargetId");
        if (sourceTargetId) { // Vient bien d'une cible ?
            setFeedback({ type: '', message: '' }); setIsVerified(false); setGameOver(false);
        }
     }, [isVerified]);
    // --- Fin D&D ---

    // --- Vérification ---
    const handleVerify = useCallback(() => {
        if (isVerified) return;
        const results = {}; let currentScore = 0;
        sensesLayoutConfig.forEach(sense => {
            Object.keys(sense.targets).forEach(category => { // sens, organe, action
                const targetId = sense.targets[category].id;
                const placed = placedLabels[targetId];
                const isCorrect = placed && placed === sense.correctAnswers[category];
                results[targetId] = !!isCorrect;
                if (isCorrect) currentScore++;
            });
        });
        // MAJ Stats...
        const currentAttempt = attemptCount + 1; setAttemptCount(currentAttempt);
        if (currentAttempt === 1) { setFirstAttemptScore(currentScore); setBestScore(currentScore); setWorstScore(currentScore); }
        else { setBestScore(prev => Math.max(prev ?? -1, currentScore)); setWorstScore(prev => Math.min(prev ?? MAX_SCORE + 1, currentScore)); }
        // Reste logique...
        setVerificationResults(results); setScore(currentScore); setIsVerified(true); setGameOver(true);
        if (currentScore === MAX_SCORE) { setFeedback({ type: 'success', message: `Bravo ${studentName || ''} (Tentative ${currentAttempt}) ! Tout est correct !` }); setShowConfetti(true); }
        else { const errors = MAX_SCORE - currentScore; setFeedback({ type: 'error', message: `Tentative ${currentAttempt}: ${errors} erreur${errors > 1 ? 's' : ''}.` }); setShowConfetti(false); }
    }, [placedLabels, attemptCount, studentName, isVerified]);

    // --- Réinitialisation ---
    const handleReset = useCallback(() => { /* ... inchangé ... */
        setPlacedLabels({}); setVerificationResults({}); setIsVerified(false); setScore(0);
        setFeedback({ type: '', message: '' }); setGameOver(false); setShowConfetti(false);
        setAvailableLabels(shuffleArray([...allLabelsList])); // Assure que toutes les étiquettes sont à nouveau dispo
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
   

    // Labels disponibles (non placés)
    const labelsInSource = useMemo(() => {
        const placedValues = new Set(Object.values(placedLabels));
        return availableLabels.filter(label => !placedValues.has(label));
    }, [placedLabels, availableLabels]);

    const allTargetsFilled = Object.keys(placedLabels).length === MAX_SCORE;

    // --- RENDER ---
    return (
        <ThemeProvider theme={gameTheme}>
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1200, margin: 'auto', borderRadius: '16px' }}>
                {/* <ConfettiEffect active={showConfetti} /> */}

                {!isGameStarted ? (
                    // --- Formulaire Nom ---
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3, minWidth: 300 }}>
                         {/* ... (Formulaire identique à la version précédente) ... */}
                         <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', textAlign: 'center' }}>Les Cinq Sens - Association</Typography>
                         <Box sx={{display: 'flex', gap: 1, color:'secondary.main', mb: 1}}><SightIcon/><TasteIcon/><TouchIcon/><HearingIcon/><SmellIcon/></Box>
                         <TextField label="Quel est ton prénom ?" variant="outlined" value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ width: '90%', maxWidth: '300px' }} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action"/></InputAdornment>), }} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); handleStartGame(); }}} autoFocus />
                         {feedback.message && <Alert severity={feedback.type || 'info'} sx={{width: '90%', maxWidth: '300px'}}>{feedback.message}</Alert>}
                         <Button variant="contained" color="primary" size="large" startIcon={<PlayArrowIcon />} onClick={handleStartGame} disabled={!studentName.trim()} > Démarrer </Button>
                    </Box>
                ) : (
                    // --- Jeu Principal ---
                    <Box>
                        <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.dark' }}>
                            Associe chaque sens, organe et action
                            {studentName && <Typography component="span" sx={{fontWeight:'normal', color:'text.secondary'}}> - {studentName}</Typography>}
                        </Typography>

                        <Grid container spacing={2} justifyContent="center">

                             {/* Zone Source Sens (Gauche) */}
                            <Grid item xs={12} sm={4} md={2.5} order={{ xs: 2, sm: 1 }}>
                                <Paper elevation={1} sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, background: gameTheme.palette.sens.light + '50', height:'100%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: gameTheme.palette.sens.main }}>
                                        <SightIcon sx={{verticalAlign:'bottom', mr:0.5}}/> Les Sens
                                    </Typography>
                                    <Divider/>
                                    <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, flexGrow: 1, pt: 1 }} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea}>
                                         {senseLabels.map(label => {
                                            const isPlaced = !labelsInSource.includes(label);
                                            const isDisabled = isPlaced || isVerified;
                                            return ( <Chip key={label} label={label} icon={<DragIndicatorIcon/>} className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`} draggable={!isDisabled} onDragStart={(e)=>handleDragStart(e, label)} onDragEnd={handleDragEnd} sx={{bgcolor: gameTheme.palette.sens.main, color: gameTheme.palette.sens.contrastText}} /> );
                                         })}
                                    </Box>
                                </Paper>
                            </Grid>

                             {/* Zone Centrale Image + Cibles */}
                             <Grid item xs={12} sm={8} md={5} order={{ xs: 1, sm: 2 }}>
                                <Box sx={{ position: 'relative', width: '100%', maxWidth: '400px', /* Ajustable */ margin: 'auto', aspectRatio: '5/1' /* Approx. pour la bande image */ }}>
                                    <img src={imageUrl} alt="Organes des sens" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ccc' }}/>
                                    {/* Placement des Drop Targets */}
                                    {sensesLayoutConfig.map(sense => (
                                        <React.Fragment key={sense.senseId}>
                                            {Object.entries(sense.targets).map(([category, target]) => (
                                                <DropTargetBox
                                                    key={target.id}
                                                    targetId={target.id}
                                                    category={category}
                                                    position={target.position}
                                                    placedLabel={placedLabels[target.id]}
                                                    verificationResult={verificationResults[target.id]}
                                                    isVerified={isVerified}
                                                    onDrop={handleDropOnTarget}
                                                    onDragOver={handleDragOver}
                                                    onDragStartChip={handleDragStart}
                                                    onDragEndChip={handleDragEnd}
                                                />
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </Box>
                             </Grid>

                              {/* Zone Source Organes (Droite) */}
                            <Grid item xs={12} sm={6} md={2.5} order={{ xs: 3, md: 3 }}>
                                 <Paper elevation={1} sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, background: gameTheme.palette.organe.light + '50', height:'100%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: gameTheme.palette.organe.main }}>
                                       <PersonIcon sx={{verticalAlign:'bottom', mr:0.5}}/> Les Organes
                                    </Typography>
                                    <Divider/>
                                     <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, flexGrow: 1, pt: 1 }} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea}>
                                        {organLabels.map(label => {
                                            const isPlaced = !labelsInSource.includes(label); const isDisabled = isPlaced || isVerified;
                                            return ( <Chip key={label} label={label} icon={<DragIndicatorIcon/>} className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`} draggable={!isDisabled} onDragStart={(e)=>handleDragStart(e, label)} onDragEnd={handleDragEnd} sx={{bgcolor: gameTheme.palette.organe.main, color: gameTheme.palette.organe.contrastText}} /> );
                                        })}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Zone Source Actions (Droite ou Bas) */}
                             <Grid item xs={12} sm={6} md={2} order={{ xs: 4, md: 4 }}>
                                <Paper elevation={1} sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, background: gameTheme.palette.action.light + '50', height:'100%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: gameTheme.palette.action.main }}>
                                        <PlayArrowIcon sx={{verticalAlign:'bottom', mr:0.5}}/> Les Actions
                                    </Typography>
                                    <Divider/>
                                     <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, flexGrow: 1, pt: 1 }} onDragOver={handleDragOver} onDrop={handleDropOnSourceArea}>
                                        {actionLabels.map(label => {
                                            const isPlaced = !labelsInSource.includes(label); const isDisabled = isPlaced || isVerified;
                                            return ( <Chip key={label} label={label} icon={<DragIndicatorIcon/>} className={`source-chip ${isDisabled ? 'disabled-chip' : ''}`} draggable={!isDisabled} onDragStart={(e)=>handleDragStart(e, label)} onDragEnd={handleDragEnd} sx={{bgcolor: gameTheme.palette.action.main, color: gameTheme.palette.action.contrastText}} /> );
                                        })}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Zone Contrôles et Bilan */}
                            <Grid item xs={12} order={5} sx={{ mt: 2 }}>
                                <Paper elevation={1} sx={{ p: 2, background: '#fff' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{minHeight: {xs: '40px', sm:'50px'} }}>
                                                {feedback.message && ( <Alert severity={feedback.type || 'info'} variant={feedback.type === 'success' || feedback.type === 'error' ? 'filled' : 'outlined'} sx={{py: 0.5, px: 1}}>{feedback.message}</Alert> )}
                                                {allTargetsFilled && !isVerified && !feedback.message && ( <Alert severity="info" variant="outlined" sx={{py: 0.5, px: 1}}>Prêt à vérifier ?</Alert> )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: {xs:'center', sm:'flex-end'}, alignItems: 'center', gap: 1}}>
                                             <Typography variant="body1" sx={{ fontWeight: 'bold' }}> Score : {score} / {MAX_SCORE} </Typography>
                                             <Button variant="contained" color="success" startIcon={<VerifyIcon />} onClick={handleVerify} disabled={isVerified || !allTargetsFilled} size="medium"> Vérifier </Button>
                                             <Tooltip title="Recommencer"><Button variant="outlined" color="primary" onClick={handleReset} size="small" sx={{minWidth:'auto', p: '8px'}}> <RefreshIcon /> </Button></Tooltip>
                                        </Grid>
                                    </Grid>
                                    {attemptCount > 0 && <GameSummaryTable />}
                                </Paper>
                            </Grid>

                        </Grid>
                    </Box>
                 )}
            </Paper>
        </ThemeProvider>
    );
}

export default FiveSensesLayoutGame;