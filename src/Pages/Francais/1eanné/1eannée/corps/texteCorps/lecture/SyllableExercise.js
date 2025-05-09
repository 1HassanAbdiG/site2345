// src/SyllableExercise.js
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Stack, Button, Grid, Alert } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // For next word button

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Create a copy
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

const SyllableExercise = ({ wordsData }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState([]); // { id: string, content: string }[]
  const [droppedSyllables, setDroppedSyllables] = useState([]);   // { id: string, content: string }[]
  const [isCorrect, setIsCorrect] = useState(null); // null | true | false
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // Track if all words are done

  const currentWordData = wordsData[currentWordIndex];

  // Function to setup state for a given word index
  const setupWord = (index) => {
    const wordInfo = wordsData[index];
    if (wordInfo) {
        // Create unique draggable IDs based on syllable content and index
        const syllablesWithId = wordInfo.syllables.map((syl, idx) => ({
          id: `${wordInfo.id}-syl-${idx}-${syl}`, // Make ID more robust
          content: syl,
        }));
        setShuffledSyllables(shuffleArray([...syllablesWithId]));
        setDroppedSyllables([]);
        setIsCorrect(null);
        setShowFeedback(false);
        setIsCompleted(false);
    }
  };

  // Initialize or update when currentWordIndex changes
  useEffect(() => {
      if (wordsData && wordsData.length > 0) {
        setupWord(currentWordIndex);
      }
  }, [currentWordIndex, wordsData]); // Rerun if data changes


  const onDragEnd = (result) => {
     const { source, destination } = result;

    // Dropped outside the list or no change
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Reset feedback on new drag
    setShowFeedback(false);
    setIsCorrect(null);

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    // Logic for moving items
    if (sourceId === destinationId) {
       // Reordering within the same list
       const items = sourceId === 'syllableSource' ? Array.from(shuffledSyllables) : Array.from(droppedSyllables);
       const [reorderedItem] = items.splice(source.index, 1);
       items.splice(destination.index, 0, reorderedItem);

       if(sourceId === 'syllableSource') {
           setShuffledSyllables(items);
       } else {
           setDroppedSyllables(items);
       }
    } else {
        // Moving between lists
        const sourceItems = sourceId === 'syllableSource' ? Array.from(shuffledSyllables) : Array.from(droppedSyllables);
        const destItems = destinationId === 'syllableSource' ? Array.from(shuffledSyllables) : Array.from(droppedSyllables);

        const [movedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedItem);

        setShuffledSyllables(sourceId === 'syllableSource' ? sourceItems : destItems);
        setDroppedSyllables(sourceId === 'syllableDropZone' ? sourceItems : destItems);
    }
  };

  const checkAnswer = () => {
    if (!currentWordData) return;
    // Ensure comparison accounts for potential case differences if needed, though syllables usually match case.
    const assembledWord = droppedSyllables.map(s => s.content).join('');
    const correct = assembledWord === currentWordData.word;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const nextWord = () => {
    if (currentWordIndex < wordsData.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Handle completion of all words
      setIsCompleted(true);
      setShowFeedback(false); // Hide previous feedback
    }
  };

   const resetCurrentWord = () => {
     // Reset state for the current word by calling setupWord
     setupWord(currentWordIndex);
     setIsCompleted(false); // Ensure completion state is reset if needed
  };

  const startOver = () => {
      setCurrentWordIndex(0); // This will trigger the useEffect to setup the first word
  }


  if (!currentWordData && !isCompleted) {
    return <Typography>Chargement de l'exercice...</Typography>;
  }

  if (isCompleted) {
       return (
            <Paper elevation={3} sx={{ p: 3, mt: 3, backgroundColor: '#e8f5e9', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom component="div">
                    🎉 Félicitations ! 🎉
                </Typography>
                <Typography sx={{mb: 2}}>Vous avez terminé tous les mots de cet exercice.</Typography>
                 <Button variant="contained" onClick={startOver}>
                     Recommencer l'exercice
                 </Button>
            </Paper>
       );
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2, textAlign: 'center' }}>
          Mot à former ({currentWordIndex + 1} / {wordsData.length})
        </Typography>

        {/* Image and Instructions */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
             {currentWordData.imageUrl && (
               <Box
                 component="img"
                 sx={{
                   maxHeight: 120,
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
              <Typography variant="body1" sx={{mb: 1}}>
                  Assemblez les syllabes ci-dessous pour former le mot qui correspond à l'image.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                  Ce mot contient <strong>{currentWordData.syllableCount}</strong> syllabe(s).
              </Typography>
          </Grid>
        </Grid>

        {/* --- Drag and Drop Areas --- */}

        {/* Drop Zone */}
        <Typography variant="overline" display="block" sx={{ color: 'text.secondary', mb: 0.5 }}>Zone d'assemblage :</Typography>
        <Droppable droppableId="syllableDropZone" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: '60px', // Ensure consistent height
                border: `2px dashed ${snapshot.isDraggingOver ? 'primary.main' : 'grey.400'}`,
                borderRadius: '4px',
                p: 1,
                mb: 3,
                backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'grey.100',
                flexWrap: 'wrap' // Allow wrapping if many syllables
              }}
            >
              {droppedSyllables.length === 0 && !snapshot.isDraggingOver && (
                  <Typography sx={{ color: 'grey.600', fontStyle: 'italic', pl:1, width: '100%' }}>
                      Déposez les syllabes ici
                  </Typography>
              )}
              {droppedSyllables.map((syllable, index) => (
                <Draggable key={syllable.id} draggableId={syllable.id} index={index}>
                  {(providedDraggable, snapshotDraggable) => (
                    <Paper
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      elevation={snapshotDraggable.isDragging ? 4 : 1}
                      sx={{
                        p: '8px 12px',
                        m: 0.5,
                        backgroundColor: 'secondary.light',
                        color: 'secondary.contrastText',
                        textAlign: 'center',
                        userSelect: 'none',
                        fontSize: '1rem',
                         ...providedDraggable.draggableProps.style,
                      }}
                    >
                      {syllable.content}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder} {/* Placeholder for spacing during drag */}
            </Box>
          )}
        </Droppable>

        {/* Source Syllables */}
        <Typography variant="overline" display="block" sx={{ color: 'text.secondary', mb: 0.5 }}>Syllabes disponibles :</Typography>
         <Droppable droppableId="syllableSource" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap', // Allow wrapping
                alignItems: 'center',
                minHeight: '60px', // Consistent height
                border: '1px solid #eee',
                borderRadius: '4px',
                p: 1,
                mb: 3,
                backgroundColor: 'white'
              }}
            >
              {shuffledSyllables.length === 0 && !snapshot.isDraggingOver && (
                  <Typography sx={{ color: 'grey.500', fontStyle: 'italic', pl:1, width: '100%' }}>
                      (Toutes les syllabes ont été déplacées)
                  </Typography>
              )}
              {shuffledSyllables.map((syllable, index) => (
                <Draggable key={syllable.id} draggableId={syllable.id} index={index}>
                  {(providedDraggable, snapshotDraggable) => (
                    <Paper
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      elevation={snapshotDraggable.isDragging ? 4 : 2}
                      sx={{
                        p: '8px 12px',
                        m: 0.5,
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        textAlign: 'center',
                        cursor: 'grab',
                        userSelect: 'none',
                        fontSize: '1rem',
                        ...providedDraggable.draggableProps.style,
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

        {/* --- Action Buttons --- */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={checkAnswer}
                // Disable check unless the correct number of syllables are in the drop zone
                disabled={droppedSyllables.length !== currentWordData.syllables.length || showFeedback}
            >
                Vérifier ma réponse
            </Button>
            <Button
                variant="outlined"
                startIcon={<ShuffleIcon />}
                onClick={resetCurrentWord}
                disabled={showFeedback && isCorrect} // Don't reset if correct answer shown
            >
                Réessayer ce mot
            </Button>
             {/* Show "Next Word" only when the answer is correct */}
             {isCorrect && showFeedback && (
                <Button
                    variant="contained"
                    color="success"
                    onClick={nextWord}
                    endIcon={<ArrowForwardIcon />}
                 >
                    Mot Suivant
                </Button>
            )}
        </Stack>

         {/* --- Feedback Alert --- */}
         {showFeedback && isCorrect !== null && !isCompleted && (
          <Alert
             severity={isCorrect ? "success" : "error"}
             sx={{ mt: 3 }}
             iconMapping={{
                success: <CheckCircleOutlineIcon fontSize="inherit" />,
                error: <CancelIcon fontSize="inherit" />,
             }}
            >
            {isCorrect ? "Bravo, c'est exact !" : "Ce n'est pas tout à fait ça. Vérifiez l'ordre ou réessayez."}
          </Alert>
        )}

      </Paper>
    </DragDropContext>
  );
};

export default SyllableExercise;