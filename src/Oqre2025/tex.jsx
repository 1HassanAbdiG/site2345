import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// Icônes potentielles
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear'; // Icône pour effacer

// Composant avec modification de la sélection et bouton Effacer
const TextEditorWithClear = () => {
  // State pour le texte actuel
  const [text, setText] = useState('');
  // State pour le nombre de mots
  const [wordCount, setWordCount] = useState(0);
  // Ref pour accéder à l'élément input/textarea sous-jacent
  const inputRef = useRef(null);

  const specialChars = [
    'à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü', '«', '»'
  ];

  // Recalculer le nombre de mots quand le texte change
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length);
  }, [text]);

  // Gérer le changement dans la zone de texte
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Mettre la SÉLECTION en majuscule
  const handleCapitalizeSelection = () => {
    const inputElement = inputRef.current;
    if (!inputElement) return;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    if (start === end) return;
    const currentText = inputElement.value;
    const newText = currentText.substring(0, start) + currentText.substring(start, end).toUpperCase() + currentText.substring(end);
    setText(newText);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start, end);
      }
    });
  };

   // Mettre la SÉLECTION en minuscule
   const handleLowercaseSelection = () => {
    const inputElement = inputRef.current;
    if (!inputElement) return;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    if (start === end) return;
    const currentText = inputElement.value;
    const newText = currentText.substring(0, start) + currentText.substring(start, end).toLowerCase() + currentText.substring(end);
    setText(newText);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start, end);
      }
    });
  };

  // Insérer un caractère spécial
  const insertSpecialChar = (char) => {
    const inputElement = inputRef.current;
    if (!inputElement) return;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    const currentText = inputElement.value;
    const newText = currentText.substring(0, start) + char + currentText.substring(end);
    setText(newText);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = start + char.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  };

  // --- Nouvelle fonction : Effacer tout le texte ---
  const handleClearText = () => {
    setText(''); // Réinitialise le state du texte
    // Optionnel: redonner le focus après effacement
    requestAnimationFrame(() => {
        inputRef.current?.focus();
    });
  };
  // -------------------------------------------------

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 1550, // Un peu plus de place pour les boutons
        margin: 'auto',
        mt: 3,
        borderRadius: 2
      }}
    >
      <Stack spacing={2}>

        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          Éditeur de Texte
        </Typography>

        <TextField
          inputRef={inputRef}
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={text}
          onChange={handleTextChange}
          placeholder=" ✏️ Écris ton texte ici.
📋 Ensuite, copie et colle-le dans le formulaire Google si ton clavier n’a pas les accents."
          sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
        />

        {/* Barre d'outils pour les caractères spéciaux */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, borderBottom: '1px solid #eee', pb: 2 }}>
          {specialChars.map((char) => (
            <Button
              key={char}
              variant="outlined"
              size="small"
              onClick={() => insertSpecialChar(char)}
              sx={{
                  minWidth: '35px',
                  padding: '4px 8px',
                  borderColor: 'grey.400'
                }}
            >
              {char}
            </Button>
          ))}
        </Box>

        {/* Conteneur pour les boutons d'action et le compteur */}
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
            }}>

          {/* Groupe de boutons pour la sélection et effacer */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1}}>
             {/* Bouton Majuscule Sélection */}
            <Button
              variant="outlined"
              size="small"
              onClick={handleCapitalizeSelection}
              title="Mettre la sélection en majuscules"
              startIcon={<ArrowUpwardIcon />}
              sx={{ textTransform: 'none' }}
            >
              Maj. Sélection
            </Button>
             {/* Bouton Minuscule Sélection */}
             <Button
              variant="outlined"
              size="small"
              onClick={handleLowercaseSelection}
              title="Mettre la sélection en minuscules"
              startIcon={<ArrowDownwardIcon />}
              sx={{ textTransform: 'none' }}
            >
              Min. Sélection
            </Button>
             {/* --- Bouton Effacer --- */}
             <Button
                variant="outlined"
                size="small"
                color="error" // Couleur rouge pour indiquer une action destructive
                onClick={handleClearText}
                title="Effacer tout le texte"
                startIcon={<ClearIcon />}
                sx={{ textTransform: 'none' }}
                disabled={text.length === 0} // Désactiver si le champ est déjà vide
              >
                Effacer
              </Button>
             {/* --------------------- */}
          </Box>

          {/* Affichage du nombre de mots */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            Nombre de mots : {wordCount}
          </Typography>

        </Box>

      </Stack>
    </Paper>
  );
};

export default TextEditorWithClear; // Renommé