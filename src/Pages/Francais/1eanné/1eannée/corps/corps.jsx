import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, Chip, Alert, Button, AlertTitle, Avatar
} from '@mui/material';
import { CheckCircleOutline as CheckCircleIcon, Cancel as CancelIcon, Refresh as RefreshIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Pour un thème simple si nécessaire

// Optionnel: Importer le composant Confetti si vous l'avez séparé
// import { ConfettiEffect } from './ConfettiEffect'; // Ajustez le chemin

// --- Configuration des Parties du Corps ---
// IMPORTANT: Les positions (top, left) sont approximatives et devront
//            probablement être ajustées en fonction de la taille réelle
//            de l'image affichée et du conteneur. Utilisez des pourcentages
//            pour une meilleure flexibilité.
const initialBodyParts = [
    { id: 'head', name: 'Tête', targetPosition: { top: '18%', left: '65%' } },
    { id: 'hair', name: 'Cheveux', targetPosition: { top: '10%', left: '65%' } }, // Estimation ajoutée
    { id: 'arm-right', name: 'Bras', targetPosition: { top: '30%', left: '75%' } },
    { id: 'hand-right', name: 'Main', targetPosition: { top: '42%', left: '80%' } }, // Estimation ajoutée
    { id: 'chest', name: 'Poitrine', targetPosition: { top: '40%', left: '30%' } },
    { id: 'stomach', name: 'Ventre', targetPosition: { top: '48%', left: '30%' } },
    { id: 'hip', name: 'Hanche', targetPosition: { top: '51%', left: '70%' } }, // Estimation ajoutée
    { id: 'leg-right', name: 'Jambe', targetPosition: { top: '60%', left: '70%' } },
    { id: 'foot-right', name: 'Pied', targetPosition: { top: '75%', left: '75%' } },
    { id: 'leg-left', name: 'Jambe', targetPosition: { top: '65%', left: '20%' } }, // Attention: 2 jambes, 2 pieds -> noms identiques
    { id: 'foot-left', name: 'Pied', targetPosition: { top: '85%', left: '35%' } },
    // Ajoutez d'autres parties si nécessaire (ex: épaule, genou, cou...)
];

// Thème simple (optionnel, peut utiliser le thème global de l'app)
const gameTheme = createTheme({
    palette: {
        primary: { main: '#009688' }, // Teal
        secondary: { main: '#FF9800' }, // Orange
        success: { main: '#4CAF50' }, // Green
        error: { main: '#F44336' }, // Red
    },
    typography: {
        fontFamily: '"Comic Sans MS", "Poppins", "Roboto", sans-serif', // Police adaptée aux enfants
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
                    fontSize: '1rem',
                    height: 'auto',
                },
                icon: { marginLeft: '8px' }
            }
        }
    }
});

// Fonction pour mélanger un tableau (algorithme Fisher-Yates)
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- Le Composant Jeu ---
function BodyPartGame({ imageUrl = "./corps.png" }) { // Prend l'URL de l'image en prop

    // Noms uniques des étiquettes à afficher
    const allLabels = useMemo(() => shuffleArray([...new Set(initialBodyParts.map(part => part.name))]), []);

    // État pour suivre quelle étiquette est placée sur quelle cible
    // Format: { targetId: { label: 'Nom Étiquette', isCorrect: true/false/null } }
    const [placedLabels, setPlacedLabels] = useState({});

    // État pour le feedback à l'utilisateur
    const [feedback, setFeedback] = useState({ type: '', message: '' }); // type: 'success', 'error', 'info'

    // État pour le score et la fin du jeu
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); // Pour l'effet final

    // Calculer le score max possible (basé sur le nombre de cibles uniques)
    const maxScore = initialBodyParts.length;

    // --- Gestion Drag and Drop ---

    const handleDragStart = useCallback((event, labelName) => {
        event.dataTransfer.setData("text/plain", labelName);
        event.dataTransfer.effectAllowed = "move";
        // Optionnel: style pour l'élément en cours de drag
        event.currentTarget.style.opacity = '0.6';
    }, []);

    const handleDragEnd = useCallback((event) => {
        // Rétablir le style
        event.currentTarget.style.opacity = '1';
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault(); // Nécessaire pour autoriser le drop
        event.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop = useCallback((event, targetId) => {
        event.preventDefault();
        const droppedLabelName = event.dataTransfer.getData("text/plain");

        // Trouver la définition de la partie du corps cible
        const targetPart = initialBodyParts.find(part => part.id === targetId);
        if (!targetPart || !droppedLabelName) return; // Sécurité

        const isCorrect = targetPart.name === droppedLabelName;

        // Mettre à jour l'état des étiquettes placées
        setPlacedLabels(prev => ({
            ...prev,
            [targetId]: { label: droppedLabelName, isCorrect: isCorrect }
        }));

        // Donner du feedback
        if (isCorrect) {
            setFeedback({ type: 'success', message: `Bien joué ! C'est ${targetPart.name}.` });
            // Mettre à jour le score (seulement si ce n'était pas déjà correct)
            // Note: cette logique simple incrémente même si on remplace une bonne par une bonne.
            // Une logique plus complexe vérifierait l'état précédent.
            // setScore(prevScore => prevScore + 1); // Simplifié pour l'instant, voir useEffect pour le score final
        } else {
            setFeedback({ type: 'error', message: `Oups ! Essaie encore.` });
        }

    }, []); // Pas de dépendances externes complexes ici

    // --- Effet pour vérifier la fin du jeu ---
    useEffect(() => {
        const correctlyPlacedCount = Object.values(placedLabels).filter(p => p.isCorrect).length;
        setScore(correctlyPlacedCount); // Met à jour le score basé sur l'état actuel

        if (correctlyPlacedCount === maxScore && Object.keys(placedLabels).length === maxScore) {
            setGameOver(true);
            setFeedback({ type: 'success', message: 'Bravo ! Tu as tout trouvé !' });
            setShowConfetti(true);
            // Optionnel: Cacher les confettis après un délai
            // setTimeout(() => setShowConfetti(false), 5000);
        } else {
            setGameOver(false); // S'assurer que ce n'est pas game over si on change une réponse
            setShowConfetti(false);
        }
    }, [placedLabels, maxScore]);

    // --- Fonction de Réinitialisation ---
    const handleReset = () => {
        setPlacedLabels({});
        setScore(0);
        setFeedback({ type: '', message: '' });
        setGameOver(false);
        setShowConfetti(false);
        // Re-mélanger les étiquettes pourrait être bien aussi, mais allLabels est déjà memoized
    };

    // Style pour les zones cibles (les boîtes vides)
    const getTargetBoxStyle = (targetId) => {
        const placement = placedLabels[targetId];
        let borderColor = 'grey.400'; // Défaut
        let backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Légèrement transparent

        if (placement) {
            borderColor = placement.isCorrect ? 'success.main' : 'error.main';
            backgroundColor = placement.isCorrect ? 'success.light' : 'error.light';
            backgroundColor = `${backgroundColor}60`; // Ajoute de la transparence (hex alpha)
        }

        return {
            position: 'absolute',
            border: `2px dashed ${borderColor}`,
            borderRadius: '8px',
            minWidth: '80px', // Largeur minimale
            minHeight: '35px', // Hauteur minimale
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor,
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
            // Style pour l'état de survol pendant le drag
            '&:hover': {
                 borderColor: 'primary.main',
                 boxShadow: '0 0 5px rgba(0, 150, 136, 0.5)',
            }
        };
    };

    return (
        <ThemeProvider theme={gameTheme}>
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 800, margin: 'auto', borderRadius: '16px' }}>
                {/* Optionnel: Afficher les confettis */}
                {/* <ConfettiEffect active={showConfetti} /> */}

                <Typography variant="h6" gutterBottom align="center" sx={{ color: 'primary.dark' }}>
                    Apprends les parties du corps !
                </Typography>
                <Typography variant="body1" gutterBottom align="center" sx={{ mb: 2 }}>
                    Fais glisser les étiquettes sur les bonnes cases.
                </Typography>

                {/* Zone Principale du Jeu */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>

                    {/* Colonne Image et Cibles */}
                    <Box sx={{ position: 'relative', width: { xs: '100%', md: '60%' }, maxWidth: '450px', margin: 'auto' }}>
                        <img
                            src={imageUrl}
                            alt="Schéma du corps humain à étiqueter"
                            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '8px' }}
                        />

                        {/* Générer les zones cibles superposées */}
                        {initialBodyParts.map((part) => (
                            <Box
                                key={part.id}
                                id={`target-${part.id}`}
                                sx={{
                                    ...getTargetBoxStyle(part.id),
                                    top: part.targetPosition.top,
                                    left: part.targetPosition.left,
                                }}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, part.id)}
                            >
                                {/* Afficher l'étiquette si elle est placée */}
                                {placedLabels[part.id] && (
                                    <Chip
                                        label={placedLabels[part.id].label}
                                        size="small"
                                        color={placedLabels[part.id].isCorrect ? 'success' : 'error'}
                                        icon={placedLabels[part.id].isCorrect ? <CheckCircleIcon fontSize="small"/> : <CancelIcon fontSize="small"/>}
                                        sx={{ cursor: 'default', '&:active': { cursor: 'default'} }} // Non draggable une fois placé
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>

                    {/* Colonne Étiquettes et Contrôles */}
                    <Box sx={{ width: { xs: '100%', md: '35%' }, display: 'flex', flexDirection: 'column', gap: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: '8px', background: '#f9f9f9' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'secondary.dark' }}>
                            Étiquettes à placer :
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', minHeight: '150px', alignItems: 'center' }}>
                            {allLabels.map((labelName, index) => (
                                <Chip
                                    key={`${labelName}-${index}`} // Clé unique
                                    label={labelName}
                                    icon={<DragIndicatorIcon />}
                                    color="secondary"
                                    variant="filled"
                                    draggable // Rendre l'élément draggable
                                    onDragStart={(e) => handleDragStart(e, labelName)}
                                    onDragEnd={handleDragEnd} // Pour rétablir l'opacité
                                    sx={{ visibility: gameOver ? 'hidden' : 'visible' }} // Cacher si jeu terminé
                                />
                            ))}
                            {gameOver && <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>Super !</Typography>}
                        </Box>

                        {/* Zone de Feedback */}
                        <Box sx={{ mt: 2, minHeight: '60px' }}>
                            {feedback.message && (
                                <Alert severity={feedback.type || 'info'} variant="outlined">
                                    {feedback.message}
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

export default BodyPartGame;