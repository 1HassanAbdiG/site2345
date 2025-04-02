// src/Game.js
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NameCard from './NameCard';
import ImageTarget from './ImageTarget';
import { familyMembers, shuffleArray } from './data';

// Importations MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
//import Grid from '@mui/material/Grid'; // Pour un layout responsive facile
import ReplayIcon from '@mui/icons-material/Replay'; // Icône rejouer

// Pas besoin d'importer Game.css

const Game = () => {
  const [names, setNames] = useState([]);
  const [targets, setTargets] = useState([]);
  const [associations, setAssociations] = useState({});
  const [correctAssociations, setCorrectAssociations] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  
  useEffect(() => {
    const totalTargets = targets.length;
    if (totalTargets === 0) return; // Evite la complétion au premier rendu
    const correctCount = Object.values(correctAssociations).filter(Boolean).length;
    const droppedCount = Object.keys(associations).length; // Compte combien de cibles ont reçu un nom

    // Le jeu est complet si toutes les cibles ont un nom *et* toutes les associations sont correctes
    if (droppedCount === totalTargets && correctCount === totalTargets) {
       setIsComplete(true);
    } else {
       setIsComplete(false); // Réinitialise si une condition n'est plus remplie (ex: après reset)
    }
  }, [associations, correctAssociations, targets]);

  const resetGame = useCallback(() => {
    const shuffledNamesData = shuffleArray([...familyMembers]);
    const shuffledTargetsData = shuffleArray([...familyMembers]);

    setNames(shuffledNamesData.map(m => ({ id: m.id, name: m.name })));
    setTargets(shuffledTargetsData.map(m => ({ id: m.id, image: m.image, correctName: m.name })));
    setAssociations({});
    setCorrectAssociations({});
    setIsComplete(false); // S'assurer que l'état complet est réinitialisé
  }, []); // useCallback avec tableau de dépendances vide pour ne la créer qu'une fois

  useEffect(() => {
    resetGame();
  }, [resetGame]); // Ajoute resetGame comme dépendance
  
  const handleDrop = useCallback((targetId, droppedItem) => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    const isCorrectMatch = droppedItem.id === targetId;

    // Mettre à jour l'état de manière immuable
    setAssociations(prev => ({
      ...prev,
      [targetId]: { nameId: droppedItem.id, name: droppedItem.name },
    }));
    setCorrectAssociations(prev => ({
      ...prev,
      [targetId]: isCorrectMatch,
    }));
  }, [targets]); // Dépend de targets pour trouver la bonne cible

  // Détermine si un nom a été correctement placé quelque part
  const isNamePlacedCorrectly = useCallback((nameId) => {
    for (const targetId in correctAssociations) {
      if (correctAssociations[targetId] && associations[targetId]?.nameId === nameId) {
        return true;
      }
    }
    return false;
  }, [associations, correctAssociations]); // Dépend des états d'association


  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}> {/* Conteneur principal centré */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}> {/* Fond avec ombre */}
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Associe le nom à l'image
          </Typography>
          <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
            Fais glisser chaque nom sur l'image qui correspond.
          </Typography>

          {/* Zone des Noms */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: 'grey.100' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Noms à placer :
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', minHeight: '50px' }}>
              {names.map((name) => (
                <NameCard
                  key={name.id}
                  id={name.id}
                  name={name.name}
                  isPlaced={isNamePlacedCorrectly(name.id)}
                />
              ))}
              {names.length === 0 && <Typography variant="caption">Chargement...</Typography>}
            </Box>
          </Paper>

          {/* Zone des Cibles (Images) */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
             <Typography variant="h6" component="h2" gutterBottom>
              Place les noms sur ces images :
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
              {targets.map((target) => (
                <ImageTarget
                  key={target.id}
                  id={target.id}
                  image={target.image}
                  correctName={target.correctName}
                  onDrop={handleDrop}
                  droppedItem={associations[target.id] || null}
                  isCorrect={correctAssociations[target.id] === true} // Force booléen
                />
              ))}
               {targets.length === 0 && <Typography variant="caption">Chargement...</Typography>}
            </Box>
          </Paper>

          {/* Message de Fin */}
          {isComplete && (
            <Alert severity="success" variant="filled" sx={{ mt: 3 }}>
              <AlertTitle>Bravo !</AlertTitle>
              Tu as tout trouvé ! 🎉 C'est super !
            </Alert>
          )}

          {/* Bouton Rejouer / Recommencer */}
          {/* Affiché si le jeu est fini OU si au moins une association a été faite */}
          {(isComplete || Object.keys(associations).length > 0) && (
             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  color={isComplete ? "primary" : "secondary"}
                  onClick={resetGame}
                  startIcon={<ReplayIcon />}
                  size="large"
                >
                  {isComplete ? 'Rejouer !' : 'Recommencer'}
                </Button>
             </Box>
          )}

        </Paper>
      </Container>
    </DndProvider>
  );
};

export default Game;