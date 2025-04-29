import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, AlertTitle, Avatar
} from '@mui/material';
import { CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Optionnel: Importer le composant Confetti
// import { ConfettiEffect } from './ConfettiEffect';

// --- Configuration Spécifique à l'Image Wordwall ---
// IDs uniques pour chaque cible bleue.
// Noms = Les réponses correctes pour ces cibles.
// Positions = % estimés par rapport au conteneur de l'image.
// !! CES POSITIONS SONT DES ESTIMATIONS ET DEVRONT ÊTRE AJUSTÉES PRÉCISÉMENT !!
const wordwallBodyParts = [
    // Colonne Gauche (estimations top/left)
    { id: 'target-left-1', name: 'Le nez', targetPosition: { top: '14%', left: '21%' } },
    { id: 'target-left-2', name: 'Le cou', targetPosition: { top: '28%', left: '19%' } }, // Pointe vers le cou
    { id: 'target-left-3', name: 'Le bras', targetPosition: { top: '42%', left: '17%' } }, // Pointe vers le bras gauche
    { id: 'target-left-4', name: 'Le ventre', targetPosition: { top: '56%', left: '18%' } },// Pointe vers le ventre
    { id: 'target-left-5', name: 'La main', targetPosition: { top: '70%', left: '16%' } }, // Pointe vers la main gauche
    { id: 'target-left-6', name: 'La jambe', targetPosition: { top: '84%', left: '22%' } }, // Pointe vers la jambe gauche

    // Colonne Droite (estimations top/left)
    { id: 'target-right-1', name: 'L\'épaule', targetPosition: { top: '14%', left: '68%' } }, // Pointe vers l'épaule droite
    { id: 'target-right-2', name: 'Les cheveux', targetPosition: { top: '28%', left: '70%' } },
    { id: 'target-right-3', name: 'La bouche', targetPosition: { top: '42%', left: '72%' } },
    { id: 'target-right-4', name: 'Les oreilles', targetPosition: { top: '56%', left: '73%' } },// Pointe vers l'oreille droite
    { id: 'target-right-5', name: 'Les yeux', targetPosition: { top: '70%', left: '71%' } }, // Pointe vers l'oeil droit
    { id: 'target-right-6', name: 'Le pied', targetPosition: { top: '84%', left: '67%' } }, // Pointe vers le pied droit
];

// Liste COMPLÈTE des 13 étiquettes visibles sur l'image
const allWordwallLabels = [
    'Le nez', 'La jambe', 'Le ventre', 'Le bras', 'La main', 'Le cou', 'Les doigts',
    'L\'épaule', 'Les cheveux', 'La bouche', 'Les oreilles', 'Les yeux', 'Le pied'
];

// Thème adapté
const gameTheme = createTheme({
    palette: {
        primary: { main: '#2196F3' }, // Bleu principal
        secondary: { main: '#FF9800' }, // Orange pour les étiquettes
        success: { main: '#4CAF50' },
        error: { main: '#F44336' },
        info: { main: '#03A9F4' } // Bleu clair pour les cibles
    },
    typography: {
        fontFamily: '"Comic Sans MS", "Poppins", "Roboto", sans-serif',
        h6: { fontWeight: 'bold' },
    },
    components: {
        MuiChip: {
            styleOverrides: {
                root: {
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    padding: '12px 8px',
                    fontSize: '0.9rem', // Légèrement plus petit
                    height: 'auto',
                    borderRadius: '8px', // Moins arrondi
                },
                icon: { marginLeft: '8px' }
            }
        }
    }
});

// Fonction pour mélanger (inchangée)
function shuffleArray(array) { /* ... code de shuffle ... */
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


// --- Le Composant Jeu Adapté ---
function BodyPartGameWordwall({ imageUrl = "./corps.jpeg" }) { // Image par défaut

    const initialBodyParts = wordwallBodyParts; // Utilise la config Wordwall
    const maxScore = initialBodyParts.length; // Score max est 12

    // Utilise les 13 étiquettes Wordwall, mélangées
    const labelsToDrag = useMemo(() => shuffleArray([...allWordwallLabels]), []);

    // États (inchangés)
    const [placedLabels, setPlacedLabels] = useState({}); // { targetId: { label: 'Nom', isCorrect: bool } }
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // --- Gestion Drag and Drop (inchangée) ---
    const handleDragStart = useCallback(/* ... */ (event, labelName) => {
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.effectAllowed = "move";
        event.currentTarget.style.opacity = '0.6';
    }, []);
    const handleDragEnd = useCallback(/* ... */ (event) => {
        event.currentTarget.style.opacity = '1';
    }, []);
    const handleDragOver = useCallback(/* ... */ (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    // Drop Handler (inchangé, mais utilise initialBodyParts = wordwallBodyParts)
    const handleDrop = useCallback((event, targetId) => {
        event.preventDefault();
        const droppedLabelName = event.dataTransfer.getData("text/plain");
        const targetPart = initialBodyParts.find(part => part.id === targetId);

        if (!targetPart || !droppedLabelName) return;

        const isCorrect = targetPart.name === droppedLabelName;

        setPlacedLabels(prev => ({
            ...prev,
            [targetId]: { label: droppedLabelName, isCorrect: isCorrect }
        }));

        if (isCorrect) {
            setFeedback({ type: 'success', message: `Oui ! C'est bien "${targetPart.name}".` });
        } else {
            setFeedback({ type: 'error', message: `Ce n'est pas "${droppedLabelName}". Essaie encore !` });
        }
    }, [initialBodyParts]); // Important: dépend maintenant de la bonne config

    // --- Effet MAJ Score & Fin de Jeu (inchangé) ---
    useEffect(() => {
        const correctlyPlacedCount = Object.values(placedLabels).filter(p => p.isCorrect).length;
        setScore(correctlyPlacedCount);

        // Vérifie si *toutes* les cibles sont remplies *correctement*
        const allTargetsFilled = Object.keys(placedLabels).length === maxScore;
        const allCorrect = correctlyPlacedCount === maxScore;

        if (allTargetsFilled && allCorrect) {
            setGameOver(true);
            setFeedback({ type: 'success', message: 'Félicitations ! Tu as tout placé correctement !' });
            setShowConfetti(true);
             // setTimeout(() => setShowConfetti(false), 5000);
        } else {
             // Si on change une réponse et qu'elle devient fausse, on n'est plus en game over
            if(gameOver && !allCorrect) {
                 setGameOver(false);
                 setShowConfetti(false);
                 // Garder le dernier feedback d'erreur/succès de l'action en cours
            } else if (!gameOver) {
                 // Pas encore terminé, pas de changement d'état gameOver
            }
        }
    }, [placedLabels, maxScore, gameOver]); // Ajout de gameOver pour éviter boucle si on revient en arrière

    // --- Réinitialisation (inchangée) ---
    const handleReset = useCallback(() => {
        setPlacedLabels({});
        setScore(0);
        setFeedback({ type: '', message: '' });
        setGameOver(false);
        setShowConfetti(false);
        // On pourrait aussi re-mélanger labelsToDrag ici si on veut un nouvel ordre
    }, []);

    // --- Style des Zones Cibles (Adapté à l'image) ---
    const getTargetBoxStyle = (targetId) => {
        const placement = placedLabels[targetId];
        let borderColor = 'info.light'; // Bleu clair par défaut
        let backgroundColor = 'rgba(179, 229, 252, 0.6)'; // Fond bleu très clair (B3E5FC avec alpha)
        let showPlaceholder = true; // Afficher le petit cercle ?

        if (placement) {
            showPlaceholder = false; // Cache le cercle si une étiquette est placée
            borderColor = placement.isCorrect ? 'success.main' : 'error.main';
            // On garde le fond bleu clair même si correct/incorrect pour ressembler à l'original
            // Ou on peut changer:
            // backgroundColor = placement.isCorrect ? 'rgba(200, 230, 201, 0.6)' : 'rgba(255, 205, 210, 0.6)'; // Vert/Rouge clair
        }

        return {
            position: 'absolute',
            border: `2px solid ${borderColor}`, // Bordure solide
            borderRadius: '8px',
            width: '100px', // Largeur fixe (ajuster si besoin)
            height: '35px', // Hauteur fixe (ajuster si besoin)
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor,
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
            // Effet au survol pendant le drag
            '&:hover': {
                 borderColor: 'primary.main',
                 boxShadow: '0 0 8px rgba(33, 150, 243, 0.6)', // Ombre bleue
            },
            // Petit cercle placeholder comme dans l'image
            '::before': showPlaceholder ? {
                content: '""',
                display: 'block',
                width: '10px',
                height: '10px',
                border: '1px solid grey',
                borderRadius: '50%',
                backgroundColor: 'white',
            } : {} // Ne rien afficher si une étiquette est là
        };
    };

    return (
        <ThemeProvider theme={gameTheme}>
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 900, margin: 'auto', borderRadius: '16px' }}>
                {/* <ConfettiEffect active={showConfetti} /> */}

                <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.dark' }}>
                    Le Corps Humain
                </Typography>
                <Typography variant="body1" gutterBottom align="center" sx={{ mb: 2 }}>
                    Fais glisser les étiquettes dans les bonnes cases bleues.
                </Typography>

                {/* Zone Principale du Jeu */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start', justifyContent: 'center' }}>

                    {/* Colonne Image et Cibles */}
                    {/* Ajuster maxWidth pour mieux correspondre à l'aspect ratio de l'image */}
                    <Box sx={{ position: 'relative', width: { xs: '90%', sm: '70%', md: '55%' }, maxWidth: '400px', margin: 'auto', border: '2px solid brown', borderRadius: '8px', overflow: 'hidden' }}>
                        <img
                            src={imageUrl}
                            alt="Le corps - Jeu Wordwall"
                            // Ajuster object-fit si l'image ne remplit pas bien le conteneur
                            style={{ display: 'block', width: '100%', height: 'auto' }}
                        />

                        {/* Générer les zones cibles (Boxes) */}
                        {initialBodyParts.map((part) => (
                            <Box
                                key={part.id}
                                id={`target-${part.id}`} // ID pour le drop handler
                                sx={{
                                    ...getTargetBoxStyle(part.id),
                                    top: part.targetPosition.top,
                                    left: part.targetPosition.left,
                                    // Ajuster la taille si getTargetBoxStyle ne le fait pas
                                    // width: '100px', height: '35px'
                                }}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, part.id)}
                            >
                                {/* Afficher l'étiquette placée */}
                                {placedLabels[part.id] && (
                                    <Chip
                                        label={placedLabels[part.id].label}
                                        size="small"
                                        // Utilise la couleur d'erreur/succès pour l'icône seulement
                                        icon={placedLabels[part.id].isCorrect
                                              ? <CheckCircleIcon sx={{color: 'success.main'}} fontSize="small"/>
                                              : <CancelIcon sx={{color: 'error.main'}} fontSize="small"/>}
                                        sx={{
                                            cursor: 'default', '&:active': { cursor: 'default'},
                                            backgroundColor: 'white', // Fond blanc une fois placé
                                            border: `1px solid ${placedLabels[part.id].isCorrect ? 'success.main' : 'error.main'}`,
                                            color: 'text.primary',
                                            '.MuiChip-icon': { mr: '4px'} // Espacement icone
                                        }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>

                    {/* Colonne Étiquettes et Contrôles */}
                    <Box sx={{ width: { xs: '100%', md: '35%' }, display: 'flex', flexDirection: 'column', gap: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px', background: '#f0f4f8' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'secondary.dark' }}>
                            Étiquettes :
                        </Typography>
                        {/* Zone pour les étiquettes à glisser */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', p:1, minHeight: '200px', alignItems: 'flex-start', border:'1px dashed', borderColor:'grey.300', borderRadius:'8px', backgroundColor:'white' }}>
                            {labelsToDrag.map((labelName, index) => {
                                // Ne pas afficher l'étiquette si elle est déjà placée quelque part
                                const isPlaced = Object.values(placedLabels).some(p => p.label === labelName);
                                if (isPlaced && !gameOver) return null; // Cache si placé (sauf si jeu fini)

                                return (
                                    <Chip
                                        key={`${labelName}-${index}-${isPlaced}`} // Clé change si placé/replacé
                                        label={labelName}
                                        icon={<DragIndicatorIcon />}
                                        color="secondary" // Couleur orange pour toutes
                                        variant="filled"
                                        draggable={!gameOver} // Non draggable si jeu terminé
                                        onDragStart={(e) => !gameOver && handleDragStart(e, labelName)}
                                        onDragEnd={handleDragEnd}
                                        sx={{
                                            visibility: gameOver && isPlaced ? 'hidden' : 'visible', // Cache si fini et placé
                                            opacity: gameOver && !isPlaced ? 0.5 : 1 // Grise si fini et non placé
                                            // On pourrait ajouter des couleurs différentes ici basées sur labelName
                                        }}
                                    />
                                );
                            })}
                             {gameOver && <Typography sx={{ color: 'success.dark', fontWeight: 'bold', p:2, textAlign:'center', width:'100%' }}>Bien joué !</Typography>}
                        </Box>

                        {/* Zone de Feedback */}
                        <Box sx={{ mt: 1, mb: 1, minHeight: '60px' }}>
                             {/* Affiche le feedback seulement s'il y a un message ET si le jeu n'est pas terminé avec succès */}
                            {feedback.message && !(gameOver && feedback.type === 'success') && (
                                <Alert severity={feedback.type || 'info'} variant="outlined" sx={{py: 0.5, px: 1}}>
                                    {feedback.message}
                                </Alert>
                            )}
                             {/* Affiche le message final de succès séparément */}
                            {gameOver && feedback.type === 'success' && (
                                <Alert severity="success" variant="filled">
                                     <AlertTitle>Félicitations !</AlertTitle>
                                    Tu as tout placé correctement !
                                </Alert>
                            )}
                        </Box>

                        {/* Score et Bouton Reset */}
                        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Score : {score} / {maxScore}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<RefreshIcon />}
                                onClick={handleReset}
                                size="small"
                            >
                                Recommencer
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </ThemeProvider>
    );
}

export default BodyPartGameWordwall;