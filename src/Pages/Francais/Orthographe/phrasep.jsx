import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, Box, Paper, Typography } from '@mui/material';

const NegativeSentenceBuilder = ({ sentences }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [arrangedWords, setArrangedWords] = useState(sentences[0].words);

  const moveWord = (draggedIndex, droppedIndex) => {
    const updatedWords = [...arrangedWords];
    const [movedWord] = updatedWords.splice(draggedIndex, 1);
    updatedWords.splice(droppedIndex, 0, movedWord);
    setArrangedWords(updatedWords);
  };

  const renderWord = (word, index) => {
    return (
      <DraggableWord
        key={index}
        index={index}
        word={word}
        moveWord={moveWord}
      />
    );
  };

  const checkAnswer = () => {
    const correctOrder = sentences[currentSentence].negativePhrase.split(' ');
    const studentAnswer = arrangedWords.join(' ');
    if (studentAnswer === correctOrder.join(' ')) {
      alert('Correct! Well done.');
    } else {
      alert('Incorrect. Try again.');
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Rearrange the words to form a negative sentence:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
        {arrangedWords.map((word, index) => renderWord(word, index))}
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={checkAnswer}>
          Check Answer
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setCurrentSentence((prev) => (prev + 1) % sentences.length)}
          sx={{ marginLeft: 2 }}
        >
          Next Sentence
        </Button>
      </Box>
    </div>
  );
};

const DraggableWord = ({ word, index, moveWord }) => {
  const [, drag] = useDrag({
    type: 'WORD',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'WORD',
    hover: (item) => {
      if (item.index !== index) {
        moveWord(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <Box
      ref={(node) => drag(drop(node))}
      sx={{
        padding: '10px 20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      component={Paper}
      variant="outlined"
    >
      <Typography variant="body1">{word}</Typography>
    </Box>
  );
};

export default NegativeSentenceBuilder;
