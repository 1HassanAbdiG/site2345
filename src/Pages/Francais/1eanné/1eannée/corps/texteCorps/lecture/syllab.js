// src/SyllableExercise.js
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Stack, Button, Grid, Alert } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const SyllableExercise = ({ wordsData }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState([]);
  const [droppedSyllables, setDroppedSyllables] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null); // null | true | false
  const [showFeedback, setShowFeedback] = useState(false);

  const currentWordData = wordsData[currentWordIndex];

  // Initialize or update when currentWordIndex changes
  useEffect(() => {
    if (currentWordData) {
      // Create unique IDs for draggable syllables if needed, or use content
      const syllablesWithId = currentWordData.syllables.map((syl, index) => ({
        id: `${currentWordData.id}-syl-${index}`, // Unique ID for DnD
        content: syl,
      }));
      setShuffledSyllables(shuffleArray([...syllablesWithId]));
      setDroppedSyllables([]);
      setIsCorrect(null);
      setShowFeedback(false);
    }
  }, [currentWordIndex, currentWordData]);


  const onDragEnd = (result) => {
     const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Reset feedback on new drag
    setShowFeedback(false);
    setIsCorrect(null);

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    if (sourceId === destinationId) {
       // Reordering within the same list (either source or target)
       const items = sourceId === 'syllableSource' ? Array.from(shuffledSyllables) : Array.from(droppedSyllables);
       const [reorderedItem] = items.splice(source.index, 1);
       items.splice(destination.index, 0, reorderedItem);

       if(sourceId === 'syllableSource') {
           setShuffledSyllables(items);
       } else {
           setDroppedSyllables(items);
       }

    } else {
        // Moving from one list to another
        const sourceItems = sourceId === 'syllableSource' ? Array.from(shuffledSyllables) : Array.from(droppedSyllables);
        const destItems = destinationId === 'syllableSource' ? Array.from(shuffledSyllables) : Array.from(droppedSyllables);
        const [movedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedItem);

        setShuffledSyllables(sourceId === 'syllableSource' ? sourceItems : destItems);
        setDroppedSyllables(sourceId === 'syllableDropZone' ? sourceItems : destItems);
    }
  };

  const checkAnswer = () => {
    const assembledWord = droppedSyllables.map(s => s.content).join('');
    const correct = assembledWord === currentWordData.word.replace(/ /g, ''); // Compare ignoring spaces if any in original word def
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const nextWord = () => {
    if (currentWordIndex < wordsData.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Optionally handle completion of all words
      alert("Félicitations ! Vous avez terminé l'exercice de syllabes.");
      setCurrentWordIndex(0); // Restart or disable
    }
  };

   const resetCurrentWord = () => {
     // Reset state for the current word
      const syllablesWithId = currentWordData.syllables.map((syl, index) => ({
        id: `${currentWordData.id}-syl-${index}`,
        content: syl,
      }));
      setShuffledSyllables(shuffleArray([...syllablesWithId]));
      setDroppedSyllables([]);
      setIsCorrect(null);
      setShowFeedback(false);
  };


  if (!currentWordData) {
    return <Typography>Chargement de l'exercice...</Typography>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom component="div">
          Exercice de Syllabes ({currentWordIndex + 1} / {wordsData.length})
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
             {currentWordData.imageUrl && (
               <Box
                 component="img"
                 sx={{
                   height: 100,
                   width: 'auto',
                   maxWidth: '100%',
                   objectFit: 'contain',
                   border: '1px solid #ddd',
                   borderRadius: '4px',
                   p: 1,
                   backgroundColor: 'white'
                 }}
                 alt={currentWordData.word}
                 src={currentWordData.imageUrl}
               />
             )}
          </Grid>
          <Grid item xs={12} sm={8}>
              <Typography>
                  Assemblez les syllabes pour former le mot associé à l'image.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                  Ce mot a <strong>{currentWordData.syllableCount}</strong> syllabe(s).
              </Typography>
          </Grid>
        </Grid>


        {/* Drop Zone */}
        <Droppable droppableId="syllableDropZone" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: '60px',
                border: `2px dashed ${snapshot.isDraggingOver ? 'primary.main' : 'grey.400'}`,
                borderRadius: '4px',
                p: 1,
                mb: 3,
                backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'grey.100',
              }}
            >
              {droppedSyllables.length === 0 && !snapshot.isDraggingOver && (
                  <Typography sx={{ color: 'grey.600', fontStyle: 'italic', pl:1 }}>
                      Déposez les syllabes ici dans le bon ordre
                  </Typography>
              )}
              {droppedSyllables.map((syllable, index) => (
                <Draggable key={syllable.id} draggableId={syllable.id} index={index}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      elevation={snapshot.isDragging ? 4 : 1}
                      sx={{
                        p: 1,
                        m: 0.5,
                        backgroundColor: 'secondary.light',
                        color: 'secondary.contrastText',
                        textAlign: 'center',
                        userSelect: 'none', // Prevent text selection during drag
                         ...provided.draggableProps.style, // Apply position styles from dnd
                      }}
                    >
                      {syllable.content}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        {/* Source Syllables */}
        <Typography variant="body1" sx={{ mb: 1 }}>Glissez les syllabes ci-dessous :</Typography>
         <Droppable droppableId="syllableSource" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap', // Allow wrapping
                minHeight: '60px',
                border: '1px solid #eee',
                borderRadius: '4px',
                p: 1,
                mb: 2,
                backgroundColor: 'white'
              }}
            >
              {shuffledSyllables.map((syllable, index) => (
                <Draggable key={syllable.id} draggableId={syllable.id} index={index}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      elevation={snapshot.isDragging ? 4 : 2}
                      sx={{
                        p: 1,
                        m: 0.5,
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        textAlign: 'center',
                        cursor: 'grab',
                         userSelect: 'none',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {syllable.content}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={checkAnswer}
                disabled={droppedSyllables.length !== currentWordData.syllables.length} // Only allow check when all syllables are dropped
            >
                Vérifier
            </Button>
            <Button
                variant="outlined"
                startIcon={<ShuffleIcon />}
                onClick={resetCurrentWord}
            >
                Réinitialiser
            </Button>
             {isCorrect && (
                <Button
                    variant="contained"
                    color="success"
                    onClick={nextWord}
                 >
                    Mot Suivant
                </Button>
            )}
        </Stack>

         {showFeedback && isCorrect !== null && (
          <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }} iconMapping={{
              success: <CheckCircleOutlineIcon fontSize="inherit" />,
               error: <CancelIcon fontSize="inherit" />,
             }}>
            {isCorrect ? "Correct ! Très bien !" : "Incorrect. Essayez encore ! Vérifiez l'ordre des syllabes."}
          </Alert>
        )}

      </Paper>
    </DragDropContext>
  );
};

export default SyllableExercise;