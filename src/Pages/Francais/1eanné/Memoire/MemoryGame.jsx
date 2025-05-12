// src/Pages/Francais/1eanné/Memoire/MemoryGame.jsx
import React, { useEffect, useState, useCallback } from 'react';
import MemoryCard from './MemoryCard'; 
import QuestionBox from './QuestionBox';
import {
  Box, Button, Grid, Typography, Stack, TextField, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import combinedGameData from './memoire.json'; 

// Helper function to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// Importation dynamique des images (nécessite Webpack ou configuration similaire)
// Assurez-vous que le dossier 'imAnimaux' est au même niveau que ce fichier.
function importAll(r) { 
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}
// Gestion d'erreur si require.context n'est pas disponible (ex: Vite en mode dev sans plugin)
let assetImages = {};
try {
    assetImages = importAll(require.context('./imAnimaux', false, /\.(png|jpe?g|svg)$/));
} catch (e) {
    console.error("Erreur lors de l'importation dynamique des images. Vérifiez la configuration de votre bundler (require.context) ou le chemin vers './imAnimaux'.", e);
    // Vous pourriez vouloir charger des images placeholder ici ou afficher un message à l'utilisateur.
}


const LOCAL_STORAGE_KEY_PLAYERS = 'memoryGamePlayerStats_v5'; // Clé incrémentée si la structure des données change significativement
const GAME_SEQUENCE = [4, 12, 16]; // Nombre de cartes par niveau

// Constantes pour le dimensionnement de la grille des cartes
const CARD_BASE_WIDTH = 150; // Doit correspondre à cardWidth dans MemoryCard.jsx
const CARD_MARGIN_SPACING_UNIT = 1; // Doit correspondre à margin (en unités de theme.spacing) dans MemoryCard.jsx
const GRID_CONTAINER_SPACING_UNIT = 1; // Correspond à spacing={GRID_CONTAINER_SPACING_UNIT} sur le Grid container
const MUI_SPACING_UNIT_IN_PX = 8; // Valeur typique pour theme.spacing(1) en pixels

const getDefaultPlayerData = () => {
    const defaultLevelStats = {};
    GAME_SEQUENCE.forEach(size => {
        defaultLevelStats[size.toString()] = {
            attemptsToSucceed: null, // Nombre d'essais pour la première réussite de ce niveau
            timesPlayed: 0,          // Nombre de fois que ce niveau a été joué
            succeededOnce: false,    // Si le joueur a déjà réussi ce niveau au moins une fois
            firstAttemptScore: null, // Score (nb d'essais) de la toute première partie jouée pour ce niveau (réussie ou non)
        };
    });
    return {
        currentSequenceIndex: 0, // Index du niveau actuel dans GAME_SEQUENCE
        levelStats: defaultLevelStats,
        allStagesCompleted: false, // Si tous les niveaux de la séquence ont été réussis
    };
};

const MemoryGame = () => {
  const [inputName, setInputName] = useState('');
  const [currentPlayerName, setCurrentPlayerName] = useState(null);
  const [playerData, setPlayerData] = useState(getDefaultPlayerData());

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0); // Essais pour la partie en cours
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false); // Si une partie de memory est active
  const [isCurrentStageWon, setIsCurrentStageWon] = useState(false); // Si le niveau actuel vient d'être gagné

  // Charger les données du joueur depuis localStorage ou initialiser
  useEffect(() => {
    if (currentPlayerName) {
      const allPlayersData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PLAYERS)) || {};
      let playerDataToSet = allPlayersData[currentPlayerName];

      // Initialisation ou migration simple si la structure des données du joueur n'est pas trouvée ou est obsolète
      if (!playerDataToSet || !playerDataToSet.levelStats || 
          !GAME_SEQUENCE.every(size => playerDataToSet.levelStats[size.toString()]?.hasOwnProperty('firstAttemptScore'))) {
        playerDataToSet = getDefaultPlayerData();
        allPlayersData[currentPlayerName] = playerDataToSet;
        localStorage.setItem(LOCAL_STORAGE_KEY_PLAYERS, JSON.stringify(allPlayersData));
      }
      // Assurer que tous les niveaux définis dans GAME_SEQUENCE existent pour le joueur
      GAME_SEQUENCE.forEach(size => {
        const sizeKey = size.toString();
        if (!playerDataToSet.levelStats[sizeKey]) {
          playerDataToSet.levelStats[sizeKey] = getDefaultPlayerData().levelStats[sizeKey];
        }
      });
      
      setPlayerData(playerDataToSet);
    }
  }, [currentPlayerName]);

  // Sauvegarder les données du joueur (état + localStorage)
  const savePlayerDataStateAndStorage = useCallback((updatedData) => {
    if (!currentPlayerName) return;
    const allPlayersData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PLAYERS)) || {};
    allPlayersData[currentPlayerName] = updatedData;
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYERS, JSON.stringify(allPlayersData));
    setPlayerData(updatedData);
  }, [currentPlayerName]);

  // Démarrer un niveau du jeu
  const startGame = useCallback((size) => {
    setGameInProgress(true);
    setIsCurrentStageWon(false);
    setAttempts(0);
    const numPairs = size / 2;

    if (!combinedGameData.cards || numPairs > combinedGameData.cards.length) {
      console.error(`Pas assez de données de cartes (besoin de ${numPairs}, disponibles ${combinedGameData.cards.length}) ou format incorrect. Vérifiez memoire.json.`);
      alert(`Problème de configuration des cartes. Impossible de démarrer le jeu de ${size} cartes.`);
      setGameInProgress(false);
      return;
    }

    // Mise à jour des statistiques du joueur pour ce niveau (timesPlayed)
    // Note: currentPlayerName est une dépendance de startGame
    setPlayerData(prevPlayerData => {
        const currentLevelKey = size.toString();
        const updatedStats = JSON.parse(JSON.stringify(prevPlayerData)); // Deep clone
        if (!updatedStats.levelStats[currentLevelKey]) { // Au cas où, devrait être initialisé avant
            updatedStats.levelStats[currentLevelKey] = getDefaultPlayerData().levelStats[currentLevelKey];
        }
        updatedStats.levelStats[currentLevelKey].timesPlayed += 1;
        
        // Sauvegarde directe dans localStorage ici, car setPlayerData est asynchrone
        const allPlayersData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PLAYERS)) || {};
        allPlayersData[currentPlayerName] = updatedStats; // currentPlayerName est disponible via la closure de startGame
        localStorage.setItem(LOCAL_STORAGE_KEY_PLAYERS, JSON.stringify(allPlayersData));
        
        return updatedStats;
    });

    const selectedPairs = shuffleArray(combinedGameData.cards).slice(0, numPairs);
    const initialCards = shuffleArray(
      selectedPairs.flatMap((cardData, index) => {
        if (typeof cardData.imageUrl !== 'string' || !cardData.name) {
            console.error("Format de carte incorrect (imageUrl ou name manquant):", cardData);
            return []; 
        }
        if (!assetImages[cardData.imageUrl]) {
            console.warn(`Image ${cardData.imageUrl} non trouvée. Vérifiez le nom et le dossier imAnimaux.`);
        }
        const imageSrc = assetImages[cardData.imageUrl] || '/path/to/placeholder.jpg'; // Fournir un placeholder
        return [
          { ...cardData, id: `card-${index}-a`, displayImageUrl: imageSrc },
          { ...cardData, id: `card-${index}-b`, displayImageUrl: imageSrc },
        ];
      }).filter(card => card.id) 
    );

    if (initialCards.length !== size && initialCards.length > 0) {
        alert(`Attention: ${size - initialCards.length} carte(s) n'ont pas pu être chargées (images manquantes/format).`);
    } else if (initialCards.length === 0 && size > 0) {
        alert("Erreur critique: Aucune carte n'a pu être chargée. Vérifiez vos données (memoire.json) et images (imAnimaux).");
        setGameInProgress(false);
        return;
    }

    setCards(initialCards);
    setMatched([]);
    setFlipped([]);
    setQuestionIndex(0);
    setShowQuestion(false);
  }, [currentPlayerName]); // setPlayerData et les autres setters sont stables

  // Gestion de la soumission du nom
  const handleNameInputChange = (event) => setInputName(event.target.value);
  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (inputName.trim()) {
      setCurrentPlayerName(inputName.trim());
    }
  };

  // Gestion du clic sur une carte
  const handleCardClick = useCallback((index) => {
    if (!gameInProgress || isCurrentStageWon || flipped.length === 2 || flipped.includes(index) || matched.some(matchIndex => cards[matchIndex]?.id === cards[index]?.id)) {
      return;
    }
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prevAttempts => prevAttempts + 1);
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex]?.name === cards[secondIndex]?.name) {
        setMatched(prevMatched => [...prevMatched, firstIndex, secondIndex]);
        setFlipped([]);
        if (matched.length + 2 < cards.length) { // Si ce n'est pas la dernière paire trouvée
          setShowQuestion(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [gameInProgress, isCurrentStageWon, flipped, matched, cards]); // setters stables

  // Détection de victoire et mise à jour des stats
  useEffect(() => {
    if (!gameInProgress && !cards.length) return; // Pas de jeu ou pas de cartes chargées
    
    const victoryCondition = cards.length > 0 && matched.length === cards.length;
    if (victoryCondition && gameInProgress && !isCurrentStageWon) {
      setIsCurrentStageWon(true); // Marquer la victoire pour ce rendu
      setGameInProgress(false); // Arrêter le jeu actif

      const currentLevelSize = GAME_SEQUENCE[playerData.currentSequenceIndex];
      const currentLevelKey = currentLevelSize.toString();
      const finalAttemptsForLevel = attempts; // 'attempts' est l'état actuel des essais pour cette partie

      // Mise à jour des statistiques du joueur après victoire
      setPlayerData(prevPlayerData => {
        const updatedData = JSON.parse(JSON.stringify(prevPlayerData));

        // Enregistrer le score de la première tentative pour ce niveau, si ce n'est déjà fait
        if (updatedData.levelStats[currentLevelKey].timesPlayed === 1 && updatedData.levelStats[currentLevelKey].firstAttemptScore === null) {
          updatedData.levelStats[currentLevelKey].firstAttemptScore = finalAttemptsForLevel;
        }

        // Enregistrer le score de la première réussite et marquer comme réussi
        if (!updatedData.levelStats[currentLevelKey].succeededOnce) {
          updatedData.levelStats[currentLevelKey].succeededOnce = true;
          updatedData.levelStats[currentLevelKey].attemptsToSucceed = finalAttemptsForLevel;
        }
        
        // Sauvegarde directe dans localStorage ici aussi
        const allPlayersData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PLAYERS)) || {};
        allPlayersData[currentPlayerName] = updatedData; // currentPlayerName est disponible
        localStorage.setItem(LOCAL_STORAGE_KEY_PLAYERS, JSON.stringify(allPlayersData));

        return updatedData;
      });
    }
  }, [matched.length, cards.length, gameInProgress, attempts, playerData.currentSequenceIndex, isCurrentStageWon, currentPlayerName]); // Dépendances

  // Passer au niveau suivant
  const handleAdvanceToNextLevel = useCallback(() => {
    const currentLevelKey = GAME_SEQUENCE[playerData.currentSequenceIndex].toString();
    if (!playerData.levelStats[currentLevelKey]?.succeededOnce) {
        alert("Vous devez réussir ce niveau avant de pouvoir passer au suivant !");
        return;
    }
    
    const nextIndex = playerData.currentSequenceIndex + 1;
    const updatedPlayerData = JSON.parse(JSON.stringify(playerData));

    if (nextIndex < GAME_SEQUENCE.length) {
      updatedPlayerData.currentSequenceIndex = nextIndex;
      savePlayerDataStateAndStorage(updatedPlayerData);
      startGame(GAME_SEQUENCE[nextIndex]);
    } else {
      updatedPlayerData.allStagesCompleted = true;
      savePlayerDataStateAndStorage(updatedPlayerData);
      // L'UI va changer pour afficher le bilan final car allStagesCompleted est true
    }
  }, [playerData, savePlayerDataStateAndStorage, startGame]); // GAME_SEQUENCE est constant

  // Rejouer le niveau actuel
  const handleReplayCurrentLevel = useCallback(() => {
    startGame(GAME_SEQUENCE[playerData.currentSequenceIndex]);
  }, [playerData.currentSequenceIndex, startGame]); // GAME_SEQUENCE est constant

  // Recommencer toute la séquence (réinitialise les stats du joueur actuel)
  const handleRestartSequence = useCallback(() => {
    const resetData = getDefaultPlayerData();
    savePlayerDataStateAndStorage(resetData);
    startGame(GAME_SEQUENCE[0]);
  }, [savePlayerDataStateAndStorage, startGame]); // Autres constantes

  // Changer de joueur
  const handleChangePlayer = useCallback(() => {
    setCurrentPlayerName(null); // Déclenchera le useEffect de chargement et la demande de nom
    setInputName('');
    // Réinitialiser les états du jeu pour le prochain joueur
    setCards([]);
    setGameInProgress(false);
    setIsCurrentStageWon(false);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setPlayerData(getDefaultPlayerData()); // Prépare l'état pour un nouveau joueur ou le chargement
  }, []); // Setters sont stables

  const itemsPerRow = 4; // Toujours 4 items par ligne pour la grille de cartes
  const gridItemSizeXs = 12 / Math.min(itemsPerRow, 2); // Pour petits écrans, max 2 cartes larges
  const gridItemSizeSm = 12 / Math.min(itemsPerRow, 3); // Pour écrans moyens, max 3 cartes larges
  const gridItemSizeMd = 12 / itemsPerRow;             // Pour écrans larges, 4 cartes


  const gridMaxWidth = (itemsPerRow * (CARD_BASE_WIDTH + (2 * CARD_MARGIN_SPACING_UNIT * MUI_SPACING_UNIT_IN_PX))) + 
                       ((itemsPerRow - 1) * GRID_CONTAINER_SPACING_UNIT * MUI_SPACING_UNIT_IN_PX);
  
  // Logique d'affichage principale
  if (!currentPlayerName) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Entrez votre nom</Typography>
          <Box component="form" onSubmit={handleNameSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="name" label="Votre Nom" name="name" autoComplete="name" autoFocus value={inputName} onChange={handleNameInputChange}/>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!inputName.trim()}>Valider</Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  const currentLevelSize = GAME_SEQUENCE[playerData.currentSequenceIndex];
  const currentLevelKey = currentLevelSize.toString();
  // S'assurer que currentLevelData est toujours défini, même si playerData n'est pas encore à jour après un changement rapide
  const currentLevelData = playerData.levelStats[currentLevelKey] || getDefaultPlayerData().levelStats[currentLevelKey];

  if (playerData.allStagesCompleted) {
    const totalAttemptsForSequenceSuccess = GAME_SEQUENCE.reduce((sum, size) => {
        const stat = playerData.levelStats[size.toString()];
        return sum + (stat?.attemptsToSucceed || 0); // Compte 0 si non réussi ou non joué
    }, 0);
    return (
      <Box textAlign="center" p={{ xs: 1, sm: 2 }} sx={{ maxWidth: 900, margin: 'auto' }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 2 }}>
          🎉 Félicitations, {currentPlayerName} ! 🎉
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Vous avez brillamment terminé toute la séquence de jeu !
        </Typography>
        <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
            Bilan Final Détaillé
          </Typography>
          <TableContainer component={Paper} elevation={1} sx={{ mb: 2, overflowX: 'auto' }}>
            <Table aria-label="bilan détaillé des niveaux">
              <TableHead sx={{ backgroundColor: 'primary.light' }}>
                <TableRow>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Niveau (Cartes)</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Essais (1ère partie)</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Essais (1ère réussite)</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Joué X fois</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {GAME_SEQUENCE.map((size) => {
                  const levelStat = playerData.levelStats[size.toString()] || getDefaultPlayerData().levelStats[size.toString()];
                  return (
                    <TableRow key={size} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                      <TableCell component="th" scope="row">Jeu de {size} cartes</TableCell>
                      <TableCell align="center">{levelStat.firstAttemptScore ?? 'N/J'}</TableCell> {/* N/J = Non Joué */}
                      <TableCell align="center">{levelStat.attemptsToSucceed ?? (levelStat.succeededOnce ? 'Erreur' : 'N/R')}</TableCell> {/* N/R = Non Réussi */}
                      <TableCell align="center">{levelStat.timesPlayed}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow sx={{ backgroundColor: 'grey.200' }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }} colSpan={3}>
                    Total essais cumulés (1ères réussites)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {totalAttemptsForSequenceSuccess}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Box mt={4} display="flex" flexDirection={{xs: 'column', sm: 'row'}} justifyContent="center" gap={2}>
          <Button variant="contained" onClick={handleRestartSequence} sx={{ width: { xs: '100%', sm: 'auto'} }}>
            Recommencer la Séquence
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleChangePlayer} sx={{ width: { xs: '100%', sm: 'auto'} }}>
            Changer de Joueur
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box textAlign="center" p={{ xs: 1, sm: 2 }}>
      <Typography variant="h4" gutterBottom>Jeu de Mémoire pour {currentPlayerName}</Typography>
      <Typography variant="h6" gutterBottom>
        Niveau {playerData.currentSequenceIndex + 1} / {GAME_SEQUENCE.length} : Jeu de {currentLevelSize} cartes
        {currentLevelData.succeededOnce && !gameInProgress && !isCurrentStageWon && " (Déjà réussi)"}
      </Typography>
      <Typography variant="body2" display="block" sx={{mb:1, color: 'text.secondary'}}>
        Parties jouées pour ce niveau : {currentLevelData.timesPlayed}.
        {currentLevelData.firstAttemptScore !== null && ` Score 1ère partie: ${currentLevelData.firstAttemptScore} essais.`}
        {currentLevelData.succeededOnce && currentLevelData.attemptsToSucceed !== null && ` Meilleur score (1ère réussite): ${currentLevelData.attemptsToSucceed} essais.`}
      </Typography>

      <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center" my={2}>
        {!gameInProgress && !isCurrentStageWon && (
          <Button variant="contained" onClick={() => startGame(currentLevelSize)} size="large">
            {currentLevelData.timesPlayed === 0 ? `Commencer Niveau (${currentLevelSize} cartes)` : `Rejouer Niveau (${currentLevelSize} cartes)`}
          </Button>
        )}
        {isCurrentStageWon && (
          <>
            <Button variant="outlined" onClick={handleReplayCurrentLevel}>Rejouer ce niveau ({currentLevelSize} cartes)</Button>
            {playerData.currentSequenceIndex < GAME_SEQUENCE.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleAdvanceToNextLevel}>
                Niveau Suivant ({GAME_SEQUENCE[playerData.currentSequenceIndex + 1]} cartes)
              </Button>
            ) : (
                 <Button variant="contained" color="success" onClick={handleAdvanceToNextLevel}>
                    Terminer et Voir le Bilan Final
                 </Button>
            )}
          </>
        )}
      </Stack>

      {gameInProgress && (
        <Typography variant="h6" sx={{my: 2}}> Paires trouvées : {matched.length / 2} / {cards.length / 2} | Essais : {attempts} </Typography>
      )}

      { (gameInProgress || isCurrentStageWon) && cards.length > 0 && (
        <Grid 
            container 
            justifyContent="center" 
            spacing={GRID_CONTAINER_SPACING_UNIT}
            mt={2} 
            sx={{ 
                maxWidth: `${gridMaxWidth}px`,
                margin: 'auto' 
            }}
        >
          {cards.map((card, index) => (
            <Grid 
                item 
                key={card.id} 
                xs={gridItemSizeXs} 
                sm={gridItemSizeSm}
                md={gridItemSizeMd}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <MemoryCard
                card={card}
                isFlipped={flipped.includes(index) || matched.some(matchIndex => cards[matchIndex]?.id === card.id) || isCurrentStageWon}
                onClick={() => handleCardClick(index)}
                // disabled={!gameInProgress || isCurrentStageWon} // Pourrait être une prop de MemoryCard
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {gameInProgress && showQuestion && !isCurrentStageWon && combinedGameData.questions && combinedGameData.questions.length > 0 && (
         <QuestionBox
          question={combinedGameData.questions?.[questionIndex % combinedGameData.questions.length]?.text || "Plus de questions disponibles."}
          onNext={() => setQuestionIndex(prev => prev + 1)}
          onContinue={() => setShowQuestion(false)}
        />
      )}

      {isCurrentStageWon && (
        <Box mt={3} p={2} component={Paper} elevation={2} sx={{display: 'inline-block', backgroundColor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
            <Typography variant="h6">
                Niveau ({currentLevelSize} cartes) réussi en {attempts} essais !
            </Typography>
            {currentLevelData.succeededOnce && currentLevelData.attemptsToSucceed !== null && currentLevelData.attemptsToSucceed < attempts && (
                <Typography variant="caption">(Votre première réussite pour ce niveau était en {currentLevelData.attemptsToSucceed} essais)</Typography>
            )}
        </Box>
      )}
       <Box mt={4} mb={2}>
        <Button variant="text" color="inherit" onClick={handleChangePlayer} size="small">Quitter / Changer de Joueur</Button>
      </Box>
    </Box>
  );
};

export default MemoryGame;