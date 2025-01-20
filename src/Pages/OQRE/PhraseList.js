import React, { useEffect, useState } from 'react';
import { IconButton, Box, Typography, Paper } from '@mui/material';
import { VolumeUp } from '@mui/icons-material'; // Icône de haut-parleur
import './PhraseList.css'; // Import du fichier CSS pour des styles spécifiques

const PhraseList = ({ phrases }) => {
  const [currentOrder, setCurrentOrder] = useState(phrases);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState('');

  useEffect(() => {
    setCurrentOrder(phrases); // Met à jour l'ordre actuel lorsque les phrases changent
  }, [phrases]);

  const handleDragStart = (index) => (e) => {
    e.dataTransfer.setData('draggedIndex', index);
  };

  const handleDrop = (index) => (e) => {
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    const newOrder = [...currentOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setCurrentOrder(newOrder);
  };

  const speakPhrase = (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'fr-FR'; // Spécifier la langue française

    setIsPlaying(true);
    setCurrentPhrase(phrase);

    utterance.onend = () => {
      setIsPlaying(false); // Réinitialiser l'état lorsque l'audio se termine
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Box id="game-container" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {currentOrder.map((phrase, index) => (
        <Paper
          key={index}
          className="phrase"
          draggable
          onDragStart={handleDragStart(index)}
          onDrop={handleDrop(index)}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            gap: 2,
            boxShadow: isPlaying && currentPhrase === phrase ? 3 : 1,
            border: isPlaying && currentPhrase === phrase ? '1px solid #4caf50' : '1px solid #ddd',
          }}
        >
          <IconButton
            color={isPlaying && currentPhrase === phrase ? 'success' : 'primary'}
            onClick={() => speakPhrase(phrase)}
          >
            <VolumeUp />
          </IconButton>
          <Typography
            className={`phrase-text ${isPlaying && currentPhrase === phrase ? 'playing' : ''}`}
            sx={{ fontSize: '1rem', fontWeight: isPlaying && currentPhrase === phrase ? 'bold' : 'normal' }}
          >
            {phrase}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default PhraseList;
