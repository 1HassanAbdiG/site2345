import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// Correct imports for @dnd-kit
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners, useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import the JSON data
import exercisesData from './Data.json';

// Custom styled components for better appearance
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

// Styled Box for drag and drop areas - Uses dnd-kit state for styling
const DndArea = styled(Box)(({ theme, isOver, isEmpty }) => ({
  minHeight: '50px',
  padding: theme.spacing(1),
  border: `2px dashed ${isOver ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isOver ? theme.palette.action.hover : (isEmpty ? theme.palette.background.default : theme.palette.background.paper),
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

// Draggable/Sortable Item Component for dnd-kit (used IN SortableContext)
const SortableChip = ({ id, label, color, data, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto',
        opacity: isDragging ? 0.7 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
       <Chip
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            label={label}
            color={color}
            {...props}
        />
    );
};

// Helper component for Droppable in dnd-kit
const Droppable = ({ children, id, style, ...props }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div ref={setNodeRef} style={{ minHeight: '50px', flexGrow: 1, ...style }} {...props}>
            {children({ isOver })}
        </div>
    );
};

// Helper component for Draggable in dnd-kit (used in Source area - NOT Sortable)
const Draggable = ({ children, id, data, style, ...props }) => {
     const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({ id, data });
     const itemStyle = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto',
        opacity: isDragging ? 0.7 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        ...style,
     };
     return (
        <div ref={setNodeRef} style={itemStyle} {...attributes} {...listeners} {...props}>
           {children({ isDragging })}
        </div>
     );
};

function FrenchExercises22() {
  const [userAnswers, setUserAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // For DragOverlay

  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Initialize userAnswers state structure on component mount - UPDATED for image_question
  useEffect(() => {
    const initialAnswers = {};
    exercisesData.forEach(exercise => {
      exercise.questions.forEach(question => {
        if (exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question') { // ADDED image_question
           // Initialize as array of empty strings, one for each blank
          initialAnswers[question.id] = Array(question.blanks.length).fill('');
        } else if (exercise.type === 'sentence_construction') {
           initialAnswers[question.id] = [];
        } else { // qcm
          initialAnswers[question.id] = '';
        }
      });
    });
    setUserAnswers(initialAnswers);
  }, []);

  // Handler for input changes (Select, Radio) - UPDATED for image_question
  const handleInputChange = (questionId, value, blankIndex = null) => {
    setUserAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      const exercise = exercisesData.find(ex => ex.questions.some(q => q.id === questionId));

      // Now both fill_in_blanks_qcm AND image_question types use the array structure
      if ((exercise?.type === 'fill_in_blanks_qcm' || exercise?.type === 'image_question') && blankIndex !== null) {
         const blanks = [...(newAnswers[questionId] || [])];
         blanks[blankIndex] = value;
         newAnswers[questionId] = blanks;
      } else if (blankIndex === null){ // Handles standard qcm
        newAnswers[questionId] = value;
      }
      return newAnswers;
    });
  };

  // --- Drag and Drop Handlers (@dnd-kit) ---
   const handleDragStart = (event) => {
     const activeData = event.active.data.current;
     if (activeData?.label) {
        setActiveItem({ label: activeData.label, id: event.active.id, color: activeData?.color, variant: activeData?.variant });
     } else {
         setActiveItem(null);
     }
  };

  const handleDragEnd = (event) => {
    setActiveItem(null);
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const activeContainerId = activeData?.containerId;
    const overContainerId = overData?.containerId || over.id;

    const questionId = activeContainerId?.split('-')[1] || overContainerId?.split('-')[1];
    if (!questionId) return;

    setUserAnswers(prevAnswers => {
        const currentTargetWords = [...(prevAnswers[questionId] || [])];

        const isDraggingFromSource = activeContainerId?.startsWith('source-');
        const isDraggingFromTarget = activeContainerId?.startsWith('target-');
        const isOverSourceArea = overContainerId?.startsWith('source-');
        const isOverTargetArea = overContainerId?.startsWith('target-');

        // Scenario 1: Dragging FROM source TO target container
        if (isDraggingFromSource && isOverTargetArea) {
            const wordToAdd = activeData?.label;
            if (!wordToAdd) return prevAnswers;

             // Only add if not already present (basic check)
             if (currentTargetWords.includes(wordToAdd)) {
                 return prevAnswers; // Prevent duplicates
             }

            const newTargetWords = [...currentTargetWords, wordToAdd];
            return { ...prevAnswers, [questionId]: newTargetWords };
        }

        // Scenario 2: Dragging WITHIN target container (reordering)
        if (isDraggingFromTarget && isOverTargetArea) {
            // Reconstruct item IDs based on current state to find correct indexes
            const currentTargetItemIds = currentTargetWords.map((word, i) => `target-item-${word}-${i}`);

            const oldIndex = currentTargetItemIds.indexOf(active.id);
             // Find the index of the item we are dropping over
            let overIndex = -1;
             if (overData?.type === 'sortable-item') {
                overIndex = currentTargetItemIds.indexOf(over.id);
             } else if (overContainerId === activeContainerId) {
                 // Dropped over the container itself (at the end)
                 overIndex = currentTargetWords.length;
             }

            if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) {
                // Item not found or dropped back on itself or invalid drop target within target
                return prevAnswers;
            }

            const newTargetWords = arrayMove(currentTargetWords, oldIndex, overIndex);
            return { ...prevAnswers, [questionId]: newTargetWords };
        }

        // Scenario 3: Dragging FROM target TO source container (or outside target area)
        if (isDraggingFromTarget && isOverSourceArea) {
            const wordToRemoveLabel = activeData?.label;
             if (!wordToRemoveLabel) {
                console.error("Dragged item missing label when moving from target to source:", activeData);
                return prevAnswers;
             }

            // Find the index of the item in the current state array based on its unique drag ID
            const indexToRemove = currentTargetWords.findIndex((word, i) => `target-item-${word}-${i}` === active.id);

            if (indexToRemove > -1) {
               const newTargetWords = [...currentTargetWords];
               newTargetWords.splice(indexToRemove, 1);
               return { ...prevAnswers, [questionId]: newTargetWords };
            } else {
               console.error("Item to remove not found in target list when moving to source:", active.id, currentTargetWords);
               return prevAnswers;
            }
        }

        // Scenario 4: Within Source (do nothing to state) or other unhandled drops
         if (isDraggingFromSource && isOverSourceArea) {
             return prevAnswers;
         }

        console.log("Unhandled drop scenario:", { active, over, activeData, overData });
        return prevAnswers;
    });
  };
  // --- End Drag and Drop Handlers ---

  // Function to compare answers (case-insensitive, trim whitespace) - UPDATED for image_question
  const areAnswersEqual = (userAnswer, correctAnswer, type, question) => {
    // Check both fill_in_blanks_qcm AND image_question using the blanks structure
    if (type === 'fill_in_blanks_qcm' || type === 'image_question') { // ADDED image_question
      const correctBlankAnswers = question.blanks.map(b => b.correctAnswer);
      if (!Array.isArray(userAnswer) || !Array.isArray(correctBlankAnswers) || userAnswer.length !== correctBlankAnswers.length) {
        return false;
      }
      return userAnswer.every((ans, index) =>
        ans?.trim().toLowerCase() === correctBlankAnswers[index]?.trim().toLowerCase()
      );
    } else if (type === 'sentence_construction') {
       if (!Array.isArray(userAnswer)) return false;
       // Join user's words and compare to the correct sentence (case/trim insensitive)
       const userSentence = userAnswer.join(' ').trim().toLowerCase();
       const correctSentence = correctAnswer.trim().toLowerCase();
       return userSentence === correctSentence;
    } else if (type === 'qcm') {
        if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') return false;
        return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }
    return false; // Unknown type
  };

  // Function to get the correct answer string representation for the table - UPDATED for image_question
  const getCorrectAnswerString = (question, type) => {
     if (type === 'fill_in_blanks_qcm' || type === 'image_question') { // ADDED image_question
        return question.blanks.map(b => b.correctAnswer).join(', ');
     } else if (type === 'sentence_construction') {
        return question.correctSentence;
     } else if (type === 'qcm') {
        return question.correctAnswer;
     }
     return 'N/A';
  };

  // Function to get the user's answer string representation for the table - UPDATED for image_question
  const getUserAnswerString = (questionId, type) => {
    const answer = userAnswers[questionId];
    // Now both fill_in_blanks_qcm AND image_question use the array format
    if ((type === 'fill_in_blanks_qcm' || type === 'image_question') && Array.isArray(answer)) { // ADDED image_question
       return answer.filter(a => a !== '').join(', '); // Join non-empty blanks
    } else if (type === 'sentence_construction' && Array.isArray(answer)) {
        return answer.join(' ');
    } else if (typeof answer === 'string') {
       return answer;
    }
    return ''; // No answer given or invalid format
 };

  // Function to reconstruct the sentence for display (e.g., in summary or during fill-in-blanks)
  const reconstructSentence = (templateParts, answers) => {
     let sentenceParts = [];
     let blankIndex = 0;
     for(const part of templateParts) {
        if(part === "") {
           // Use the answer if available, otherwise use placeholder
           const answer = Array.isArray(answers) ? answers[blankIndex] : undefined;
           sentenceParts.push(answer || "____");
           blankIndex++;
        } else {
           sentenceParts.push(part);
        }
     }
     return sentenceParts.join('');
  };

  // --- Text-to-Speech Function ---
  const speakSentence = (sentence) => {
     if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'fr-FR'; // Set language to French
        utterance.rate = 0.9; // Slightly slower speed
        utterance.pitch = 1; // Normal pitch
        window.speechSynthesis.speak(utterance);
     } else {
        // Fallback if browser doesn't support Web Speech API
        alert("Désolé, la synthèse vocale n'est pas supportée par votre navigateur.");
     }
  };

  // Render function for Exercise 1 (Fill in the Blanks with QCM options)
  const renderFillInBlanksQCM = (exercise) => (
    <Box key={exercise.id}>
      <Typography variant="h5" gutterBottom>{exercise.title}</Typography>
      <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>{exercise.description}</Typography>

      {exercise.questions.map((question, qIndex) => (
        <Card key={question.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: theme => theme.shape.borderRadius }}>
          <Grid container spacing={3}>
            {/* Image Column */}
            <Grid item xs={12} md={5}>
              {question.image && ( // Conditionally render image
                <CardMedia
                  component="img"
                  sx={{
                     aspectRatio: '4 / 3',
                     objectFit: 'contain',
                     width: '100%',
                     borderRadius: theme => theme.shape.borderRadius,
                  }}
                  image={question.image}
                  alt={`Image for Question ${qIndex + 1}`}
                />
              )}
            </Grid>
            {/* Sentence & Selects Column */}
            <Grid item xs={12} md={question.image ? 7 : 12}> {/* Adjust grid size if no image */}
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                 {/* Display the sentence parts with blanks showing selected answer or placeholder */}
                 <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                     {/* Reconstruct sentence for display with selected words */}
                     {reconstructSentence(question.templateParts, userAnswers[question.id])}
                 </Typography>

                 {/* Display Select options for each blank */}
                 <Box sx={{ flexGrow: 1 }}>
                    {question.blanks.map((blank, blankIndex) => (
                        <Box key={`blank-${blankIndex}`} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Mot pour trou {blankIndex + 1}:
                            </Typography>
                            <FormControl sx={{ minWidth: 150 }} size="small">
                                <InputLabel id={`select-label-ex1-${question.id}-blank-${blankIndex}`}>Choisir...</InputLabel>
                                <Select
                                    labelId={`select-label-ex1-${question.id}-blank-${blankIndex}`}
                                    id={`select-ex1-${question.id}-blank-${blankIndex}`}
                                    value={userAnswers[question.id]?.[blankIndex] || ''}
                                    label="Choisir..."
                                    onChange={(e) => handleInputChange(question.id, e.target.value, blankIndex)}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected === '') {
                                            return <em>Choisir...</em>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                       <em>Choisir...</em>
                                    </MenuItem>
                                    {/* Ensure options are always an array */}
                                    {(blank.options || []).map((option, oIndex) => (
                                        <MenuItem key={oIndex} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    ))}
                 </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Box>
  );

  // Render function for Exercise 2 (Sentence Construction with Drag & Drop)
   const renderSentenceConstruction = (exercise) => {
       return (
          <Box key={exercise.id}>
             <Typography variant="h5" gutterBottom>{exercise.title}</Typography>
             <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>{exercise.description}</Typography>

             <DndContext
                 sensors={sensors}
                 collisionDetection={closestCorners}
                 onDragEnd={handleDragEnd}
                 onDragStart={handleDragStart}
              >
                {exercise.questions.map((question) => {
                   // Ensure words and targetWords are treated as arrays
                   const availableWords = question.words || [];
                   const targetWords = userAnswers[question.id] || [];

                   // Generate stable IDs for sortable items based on word and current index
                   const targetItemIds = targetWords.map((wordInTarget, indexInTarget) =>
                       `target-item-${wordInTarget}-${indexInTarget}`
                   );

                   return (
                     <Box key={question.id} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Phrase à construire:
                        </Typography>

                         {/* Source Words Area */}
                         <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Mots disponibles:</Typography>
                         <Droppable id={`source-${question.id}`}>
                            {({ isOver }) => (
                                <DndArea
                                    isOver={isOver}
                                    // Check if all words from the source list *could* be in the target list
                                    // Note: This doesn't strictly check if the *correct* words are used, just if the count matches
                                    isEmpty={availableWords.length <= targetWords.length}
                                >
                                   {availableWords.length > 0 && availableWords.length <= targetWords.length && !isOver && (
                                       <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                           Tous les mots semblent utilisés.
                                       </Typography>
                                   )}
                                   {availableWords.length === 0 && !isOver && (
                                        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                            Aucun mot disponible pour cette question.
                                        </Typography>
                                   )}
                                   {availableWords.map((word, index) => {
                                        // Render chip only if the word (by its original value) is NOT in the target list
                                        // Note: This assumes unique words or handles duplicates by value
                                        if (targetWords.includes(word)) {
                                           return null; // Don't render if it's already in the target
                                        }
                                       return (
                                           <Draggable
                                               key={`source-item-${word}-${index}`} // Use word+index for a reasonably unique key
                                               id={`source-item-${word}-${index}`} // Use word+index for a reasonably unique ID
                                               data={{ label: word, containerId: `source-${question.id}`, type: 'draggable-item', originalIndex: index }}
                                           >
                                              {(providedDraggable) => (
                                                <Chip
                                                    label={word}
                                                    color="primary"
                                                    variant="outlined"
                                                    ref={providedDraggable.setNodeRef}
                                                    style={{
                                                         ...providedDraggable.style,
                                                         cursor: providedDraggable.isDragging ? 'grabbing' : 'grab',
                                                    }}
                                                    {...providedDraggable.attributes}
                                                    {...providedDraggable.listeners}
                                                 />
                                              )}
                                           </Draggable>
                                       );
                                   })}
                                </DndArea>
                            )}
                         </Droppable>

                        {/* Target Sentence Area */}
                         <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 1 }}>Votre phrase:</Typography>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             {/* SortableContext needs the list of IDs currently in the target */}
                             <SortableContext items={targetItemIds}>
                                 <Droppable id={`target-${question.id}`}>
                                     {({ isOver }) => (
                                         <DndArea
                                             isOver={isOver}
                                             isEmpty={targetWords.length === 0}
                                             sx={{ flexGrow: 1, minHeight: '60px' }} // Ensure sufficient height
                                         >
                                            {targetWords.length === 0 && !isOver && (
                                                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                                    Glisse les mots ici pour construire la phrase...
                                                </Typography>
                                            )}
                                            {/* Render words currently in the target area */}
                                            {targetWords.map((word, index) => (
                                                <SortableChip
                                                    key={`target-item-${word}-${index}`} // Use word+index to match the ID in SortableContext
                                                    id={`target-item-${word}-${index}`} // Use word+index to match the ID in SortableContext
                                                    label={word}
                                                    color="secondary"
                                                    variant="filled"
                                                    data={{ label: word, containerId: `target-${question.id}`, type: 'sortable-item', indexInTarget: index }}
                                                 />
                                            ))}
                                         </DndArea>
                                     )}
                                 </Droppable>
                             </SortableContext>
                             {/* Text-to-Speech Button */}
                             <IconButton
                                color="primary"
                                aria-label="écouter la phrase"
                                onClick={() => speakSentence(targetWords.join(' '))}
                                disabled={targetWords.length === 0 || !('speechSynthesis' in window)} // Disable if no words or API not available
                             >
                                 <VolumeUpIcon />
                             </IconButton>
                         </Box>
                     </Box>
                   );
                })}
                 {/* Drag Overlay */}
                 <DragOverlay>
                    {activeItem ? (
                      // Style the chip shown while dragging
                      <Chip
                         label={activeItem.label}
                         color={activeItem.color || 'primary'}
                         variant={activeItem.variant || 'outlined'}
                         sx={{ backgroundColor: 'white', boxShadow: 3, cursor: 'grabbing' }} // Added cursor: grabbing
                      />
                    ) : null}
                 </DragOverlay>
             </DndContext>
          </Box>
       );
   };

  // Render function for Exercise 3 (Standard QCM)
   const renderQCM = (exercise) => (
      <Box key={exercise.id}>
         <Typography variant="h5" gutterBottom>{exercise.title}</Typography>
         <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>{exercise.description}</Typography>
         {exercise.questions.map((question, qIndex) => (
            <Box key={question.id} sx={{ mb: 3 }}>
               <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                 {`${qIndex + 1}. ${question.questionText}`}
               </Typography>
               <RadioGroup
                  row // Arrange options horizontally
                  aria-label={`question-${qIndex + 1}`}
                  name={`qcm-${question.id}`}
                  value={userAnswers[question.id] || ''} // Controlled component value
                  onChange={(e) => handleInputChange(question.id, e.target.value)} // Update state on change
               >
                  {(question.options || []).map((option, oIndex) => ( // Ensure options is array
                     <FormControlLabel
                        key={oIndex}
                        value={option} // Value submitted if this option is selected
                        control={<Radio size="small" />} // Radio button component
                        label={option} // Text label for the radio button
                        sx={{ mr: 3 }} // Right margin for spacing between options
                     />
                  ))}
               </RadioGroup>
            </Box>
         ))}
      </Box>
   );

  // Render function for Exercise 4 (Image Question with Selects) - MODIFIED
  const renderImageQuestion = (exercise) => (
     <Box key={exercise.id}>
        <Typography variant="h5" gutterBottom>{exercise.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>{exercise.description}</Typography>
        {exercise.questions.map((question, qIndex) => (
           <Card key={question.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: theme => theme.shape.borderRadius }}>
            <Grid container spacing={3} alignItems="center">
              {question.image && ( // Conditionally render image
                <Grid item xs={12} md={5}>
                  <CardMedia
                   component="img"
                   sx={{
                      aspectRatio: '4 / 3',
                      objectFit: 'contain',
                      width: '100%',
                      borderRadius: theme => theme.shape.borderRadius,
                   }}
                   image={question.image} // Image is per question
                   alt={`Image for question ${qIndex + 1}`}
                 />
                </Grid>
              )}
              <Grid item xs={12} md={question.image ? 7 : 12}> {/* Adjust grid size if no image */}
                 <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Display the sentence parts with blanks showing selected answer or placeholder */}
                    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                        {/* Reconstruct sentence for display with selected words */}
                        {reconstructSentence(question.templateParts, userAnswers[question.id])}
                    </Typography>

                    {/* Display Select options for each blank */}
                    <Box sx={{ flexGrow: 1 }}>
                       {(question.blanks || []).map((blank, blankIndex) => ( // Ensure blanks is array
                           <Box key={`blank-${blankIndex}`} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                   Mot pour trou {blankIndex + 1}:
                               </Typography>
                               <FormControl sx={{ minWidth: 150 }} size="small">
                                   <InputLabel id={`select-label-ex4-${question.id}-blank-${blankIndex}`}>Choisir...</InputLabel>
                                   <Select
                                       labelId={`select-label-ex4-${question.id}-blank-${blankIndex}`}
                                       id={`select-ex4-${question.id}-blank-${blankIndex}`}
                                       value={userAnswers[question.id]?.[blankIndex] || ''} // Use specific blank index
                                       label="Choisir..."
                                       onChange={(e) => handleInputChange(question.id, e.target.value, blankIndex)} // Pass blankIndex to handler
                                       displayEmpty
                                       renderValue={(selected) => {
                                           if (selected === '') {
                                               return <em>Choisir...</em>;
                                           }
                                           return selected;
                                       }}
                                   >
                                       <MenuItem value="" disabled>
                                          <em>Choisir...</em>
                                       </MenuItem>
                                       {(blank.options || []).map((option, oIndex) => ( // Ensure options is array
                                           <MenuItem key={oIndex} value={option}>{option}</MenuItem>
                                       ))}
                                   </Select>
                               </FormControl>
                           </Box>
                       ))}
                    </Box>
                 </Box>
              </Grid>
            </Grid>
           </Card>
        ))}
     </Box>
  );

  // Render the correct exercise type based on its type property
  const renderExercise = (exercise) => {
    switch (exercise.type) {
      case 'fill_in_blanks_qcm':
        return renderFillInBlanksQCM(exercise);
      case 'sentence_construction':
        return renderSentenceConstruction(exercise);
      case 'qcm':
        return renderQCM(exercise);
      case 'image_question': // This now calls the modified renderImageQuestion
        return renderImageQuestion(exercise);
      default:
        return <Typography color="error">Unknown exercise type: {exercise.type}</Typography>;
    }
  };

  // Function to check if all questions are answered
  const areAllQuestionsAnswered = () => {
    for (const exercise of exercisesData) {
      for (const question of exercise.questions) {
        const answer = userAnswers[question.id];
        if (exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question') {
          if (answer.some(ans => ans === '')) {
            return false;
          }
        } else if (exercise.type === 'sentence_construction') {
          if (answer.length === 0) {
            return false;
          }
        } else if (exercise.type === 'qcm') {
          if (answer === '') {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Function to reset user answers
  const resetAnswers = () => {
    const initialAnswers = {};
    exercisesData.forEach(exercise => {
      exercise.questions.forEach(question => {
        if (exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question') {
          initialAnswers[question.id] = Array(question.blanks.length).fill('');
        } else if (exercise.type === 'sentence_construction') {
          initialAnswers[question.id] = [];
        } else {
          initialAnswers[question.id] = '';
        }
      });
    });
    setUserAnswers(initialAnswers);
    setShowSummary(false);
  };

  // Handle button click to show/hide summary
  const handleSubmit = () => {
    if (!areAllQuestionsAnswered()) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setShowSummary(true);
    // Scroll to the summary table
    const summaryElement = document.getElementById('summary-table');
    if (summaryElement) {
      summaryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Exercices de Français
      </Typography>

      {/* Map over exercise data and render each exercise */}
      {(exercisesData || []).map(exercise => ( // Ensure exercisesData is an array
        <StyledPaper key={exercise.id} elevation={3}>
          {renderExercise(exercise)}
        </StyledPaper>
      ))}

      {/* Submit and Reset Buttons */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{ mr: 2 }}
        >
          Afficher les résultats
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={resetAnswers}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Summary Table */}
      {showSummary && (
        <TableContainer component={Paper} elevation={3} id="summary-table" sx={{ borderRadius: theme => theme.shape.borderRadius, overflow: 'hidden', mt: 4 }}> {/* Added mt:4 */}
          <Typography variant="h5" gutterBottom sx={{ p: 2, pb: 0 }}>
            Récapitulatif des réponses
          </Typography>
          <Table sx={{ minWidth: 650 }} aria-label="summary table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Question</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Votre réponse</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Réponse correcte</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Résultat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(exercisesData || []).flatMap(exercise => // Ensure exercisesData is array, use flatMap for single list
                (exercise.questions || []).map(question => { // Ensure questions is array
                  const userAnsString = getUserAnswerString(question.id, exercise.type);
                  const correctAnsString = getCorrectAnswerString(question, exercise.type);

                  // Pass appropriate value for comparison based on type
                   const correctComparisonValue =
                       exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question' ? question : // Pass question object for blanks
                       exercise.type === 'sentence_construction' ? question.correctSentence : // Pass correct sentence string
                       exercise.type === 'qcm' ? question.correctAnswer : // Pass correct answer string
                       null;

                   const isCorrect = areAnswersEqual(userAnswers[question.id], correctComparisonValue, exercise.type, question); // Pass question object for blanks check

                   let questionSummaryText;
                   // For both fill_in_blanks_qcm and image_question, use templateParts for summary
                   if (exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question') {
                      questionSummaryText = (question.templateParts || []).map((part) => ( // Ensure templateParts is array
                          part === "" ? "[...]" : part
                      )).join('');
                   } else if (exercise.type === 'sentence_construction') {
                       questionSummaryText = `Mots: "${(question.words || []).join(' / ')}"`; // Ensure words is array
                   } else if (exercise.type === 'qcm') {
                       questionSummaryText = question.questionText;
                   } else {
                       questionSummaryText = "Question non reconnue"; // Handle unknown types gracefully
                   }

                  return (
                    <TableRow
                      key={question.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                         <Typography variant="body2">
                            {questionSummaryText}
                         </Typography>
                      </TableCell>
                      <TableCell align="left">
                         <Typography variant="body2">
                            {userAnsString || <em>Pas de réponse</em>}
                         </Typography>
                      </TableCell>
                      <TableCell align="left">
                         <Typography variant="body2">
                             {correctAnsString || <em>N/A</em>}
                         </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color={isCorrect ? 'success.main' : 'error.main'} fontWeight="bold">
                           {isCorrect ? 'Correct' : 'Incorrect'}
                        </Typography>
                     </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default FrenchExercises22;
