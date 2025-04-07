import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

// --- Importer la liste de mots depuis le fichier JSON ---
import wordsFromJson from './dictationWords.json'; // Ajustez le chemin si nécessaire
// --------------------------------------------------------

const DictationComponent = () => {
  // Utiliser la liste importée comme état initial
  const [wordList, setWordList] = useState(wordsFromJson); // Les mots du JSON
  const [phase, setPhase] = useState('preparation'); // 'preparation' | 'dictation' | 'finished'
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [dictatedWords, setDictatedWords] = useState([]); // Mots tapés par l'utilisateur
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');

  // Vérifie la prise en charge de la synthèse vocale
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechError("Désolé, la synthèse vocale n'est pas prise en charge par votre navigateur.");
    }
    // Réinitialiser la liste de mots si le JSON change (utile si vous chargez dynamiquement)
    // setWordList(wordsFromJson); // Déjà fait dans useState, mais peut être utile si le JSON est chargé plus tard
  }, []); // Le JSON est importé statiquement, donc pas besoin de le mettre en dépendance ici

  // Fonction pour prononcer un mot
  const speakWord = useCallback((text) => {
    if (!('speechSynthesis' in window) || isSpeaking) {
      return; // Ne rien faire si non supporté ou déjà en train de parler
    }
    setSpeechError(''); // Réinitialiser l'erreur
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; // Définir la langue en français
    utterance.rate = 0.9; // Ajuster la vitesse si nécessaire
    utterance.pitch = 1; // Ajuster la hauteur si nécessaire

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      setSpeechError(`Erreur lors de la prononciation : ${event.error}`);
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel(); // Annule toute parole précédente
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking]); // Dépendance à isSpeaking pour éviter les appels multiples

  // --- Gestionnaires d'événements ---

  const handleStartDictation = () => {
    setPhase('dictation');
    setCurrentWordIndex(0);
    setUserInput('');
    setDictatedWords([]);
    // Optionnel: prononcer une instruction ou le premier mot
    // speakWord("Commencez la dictée. Mot numéro 1.");
  };

  const handleListenCurrentWord = () => {
    if (phase === 'dictation' && currentWordIndex < wordList.length) {
      speakWord(wordList[currentWordIndex]);
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleNextWord = () => {
    // Sauvegarde l'entrée actuelle
    const currentInput = userInput;
    setDictatedWords(prev => [...prev, currentInput]);
    setUserInput(''); // Réinitialise le champ

    // Passe au mot suivant ou termine
    if (currentWordIndex < wordList.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      // Optionnel: prononcer le numéro du mot suivant automatiquement
      // speakWord(`Mot numéro ${currentWordIndex + 2}`);
    } else {
      setPhase('finished');
      // Optionnel: prononcer un message de fin
      // speakWord("Dictée terminée.");
    }
  };

  const handleRestart = () => {
      // Recharger la liste depuis le JSON (au cas où vous la modifieriez plus tard)
      setWordList(wordsFromJson);
      setPhase('preparation');
      setCurrentWordIndex(0);
      setUserInput('');
      setDictatedWords([]);
      setSpeechError('');
      setIsSpeaking(false);
      window.speechSynthesis.cancel(); // Arrêter toute parole en cours
  };

  // --- Rendu conditionnel ---

  const renderPreparationPhase = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Phase de Préparation
      </Typography>
      <Typography paragraph color="text.secondary">
        Écoutez la prononciation de chaque mot. Cliquez sur l'icône <VolumeUpIcon fontSize="small" sx={{ verticalAlign: 'bottom'}} />.
      </Typography>
      <List dense>
        {/* S'assurer que wordList est bien un tableau avant de mapper */}
        {Array.isArray(wordList) && wordList.map((word, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="Écouter" onClick={() => speakWord(word)} disabled={isSpeaking}>
                {isSpeaking ? <CircularProgress size={20} /> : <VolumeUpIcon />}
              </IconButton>
            }
          >
            <ListItemText primary={`${index + 1}. ${word}`} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleStartDictation}
          startIcon={<PlayArrowIcon />}
          size="large"
          disabled={isSpeaking}
        >
          Commencer la Dictée
        </Button>
      </Box>
    </Box>
  );

  const renderDictationPhase = () => (
    // S'assurer que wordList existe avant d'accéder à sa longueur
    wordList && <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Phase de Dictée
      </Typography>
       <Chip
            label={`Mot ${currentWordIndex + 1} sur ${wordList.length}`}
            color="primary"
            sx={{ mb: 2 }}
        />
       <Box sx={{ my: 2 }}>
           <Button
            variant="outlined"
            onClick={handleListenCurrentWord}
            disabled={isSpeaking}
            startIcon={isSpeaking ? <CircularProgress size={20} /> : <VolumeUpIcon />}
          >
            Écouter le mot
          </Button>
       </Box>

      <TextField
        fullWidth
        label={`Entrez le mot n° ${currentWordIndex + 1}`}
        variant="outlined"
        value={userInput}
        onChange={handleInputChange}
        margin="normal"
        autoFocus // Met le focus sur le champ
        disabled={isSpeaking} // Désactive pendant la parole pour éviter confusion
        onKeyPress={(ev) => { // Permet de passer au mot suivant avec Entrée
            if (ev.key === 'Enter') {
              ev.preventDefault(); // Empêche le comportement par défaut (submit form etc)
              if(!isSpeaking) handleNextWord(); // N'avance que si on ne parle pas
            }
        }}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleNextWord}
          endIcon={<SkipNextIcon />}
          disabled={isSpeaking} // Désactivé pendant la parole
        >
          Mot Suivant
        </Button>
      </Box>
    </Box>
  );

    const renderFinishedPhase = () => (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Dictée Terminée!</Typography>
            <Typography paragraph>Voici les mots que vous avez écrits :</Typography>
             {/* Optionnel: Afficher les résultats/comparaison ici */}
             <List dense>
                 {/* S'assurer que dictatedWords est un tableau avant de mapper */}
                {Array.isArray(dictatedWords) && dictatedWords.map((word, index) => (
                     <ListItem key={index}>
                         {/* Vérifier que wordList existe avant d'accéder à wordList[index] */}
                         {/* Ajoutez ici la logique de correction si vous voulez comparer */}
                         <ListItemText
                            primary={`${index + 1}. ${word || '(Non répondu)' }`}
                            secondary={wordList && wordList[index] !== word ? `Correct: ${wordList[index]}` : null} // Exemple de correction simple
                            secondaryTypographyProps={{ color: wordList && wordList[index] !== word ? 'error' : 'success' }} // Couleur pour la correction
                         />

                     </ListItem>
                ))}
             </List>
            <Button variant="contained" onClick={handleRestart} sx={{ mt: 3 }}>
                Recommencer
            </Button>
        </Box>
    );

  // --- Rendu principal ---

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {/* S'assurer que wordList existe avant d'accéder à sa longueur */}
        Dictée Interactive ({wordList ? wordList.length : 0} mots)
      </Typography>
      <Divider sx={{ my: 2 }} />

      {speechError && <Alert severity="error" sx={{ mb: 2 }}>{speechError}</Alert>}

      {phase === 'preparation' && renderPreparationPhase()}
      {phase === 'dictation' && renderDictationPhase()}
      {phase === 'finished' && renderFinishedPhase()}

      {/* Indicateur global de parole (optionnel) */}
      {isSpeaking && phase !== 'preparation' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, color: 'text.secondary' }}>
               <CircularProgress size={16} sx={{ mr: 1 }}/>
               <Typography variant="caption">Lecture...</Typography>
           </Box>
      )}
    </Paper>
  );
};

export default DictationComponent;