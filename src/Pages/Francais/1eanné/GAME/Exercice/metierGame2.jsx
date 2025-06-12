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
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners, useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import exercisesData from './data.json';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

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

const SortableChip = ({ id, label, color, data, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id, data: data });
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

const Droppable = ({ children, id, style, ...props }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ minHeight: '50px', flexGrow: 1, ...style }} {...props}>
      {children({ isOver })}
    </div>
  );
};

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

function MetierGame1() {
  const [userAnswers, setUserAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
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
  }, []);

  const handleInputChange = (questionId, value, blankIndex = null) => {
    setUserAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      const exercise = exercisesData.find(ex => ex.questions.some(q => q.id === questionId));
      if ((exercise?.type === 'fill_in_blanks_qcm' || exercise?.type === 'image_question') && blankIndex !== null) {
        const blanks = [...(newAnswers[questionId] || [])];
        blanks[blankIndex] = value;
        newAnswers[questionId] = blanks;
      } else if (blankIndex === null) {
        newAnswers[questionId] = value;
      }
      return newAnswers;
    });
  };

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
      if (isDraggingFromSource && isOverTargetArea) {
        const wordToAdd = activeData?.label;
        if (!wordToAdd) return prevAnswers;
        if (currentTargetWords.includes(wordToAdd)) {
          return prevAnswers;
        }
        const newTargetWords = [...currentTargetWords, wordToAdd];
        return { ...prevAnswers, [questionId]: newTargetWords };
      }
      if (isDraggingFromTarget && isOverTargetArea) {
        const wordToRemoveLabel = activeData?.label;
        if (!wordToRemoveLabel) {
          console.error("Dragged item missing label when moving from target to source:", activeData);
          return prevAnswers;
        }
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
      if (isDraggingFromTarget && isOverTargetArea) {
        const currentTargetItemIds = currentTargetWords.map((word, i) => `target-item-${word}-${i}`);
        const oldIndex = currentTargetItemIds.indexOf(active.id);
        let overIndex = -1;
        if (overData?.type === 'sortable-item') {
          overIndex = currentTargetItemIds.indexOf(over.id);
        } else if (overContainerId === activeContainerId) {
          overIndex = currentTargetWords.length;
        }
        if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) {
          return prevAnswers;
        }
        const newTargetWords = arrayMove(currentTargetWords, oldIndex, overIndex);
        return { ...prevAnswers, [questionId]: newTargetWords };
      }
      if (isDraggingFromSource && isOverSourceArea) {
        return prevAnswers;
      }
      console.log("Unhandled drop scenario:", { active, over, activeData, overData });
      return prevAnswers;
    });
  };

  const areAnswersEqual = (userAnswer, correctAnswer, type, question) => {
    if (type === 'fill_in_blanks_qcm' || type === 'image_question') {
      const correctBlankAnswers = question.blanks.map(b => b.correctAnswer);
      if (!Array.isArray(userAnswer) || !Array.isArray(correctBlankAnswers) || userAnswer.length !== correctBlankAnswers.length) {
        return false;
      }
      return userAnswer.every((ans, index) =>
        ans?.trim().toLowerCase() === correctBlankAnswers[index]?.trim().toLowerCase()
      );
    } else if (type === 'sentence_construction') {
      if (!Array.isArray(userAnswer)) return false;
      const userSentence = userAnswer.join(' ').trim().toLowerCase();
      const correctSentence = correctAnswer.trim().toLowerCase();
      return userSentence === correctSentence;
    } else if (type === 'qcm') {
      if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') return false;
      return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }
    return false;
  };

  const getCorrectAnswerString = (question, type) => {
    if (type === 'fill_in_blanks_qcm' || type === 'image_question') {
      return question.blanks.map(b => b.correctAnswer).join(', ');
    } else if (type === 'sentence_construction') {
      return question.correctSentence;
    } else if (type === 'qcm') {
      return question.correctAnswer;
    }
    return 'N/A';
  };

  const getUserAnswerString = (questionId, type) => {
    const answer = userAnswers[questionId];
    if ((type === 'fill_in_blanks_qcm' || type === 'image_question') && Array.isArray(answer)) {
      return answer.filter(a => a !== '').join(', ');
    } else if (type === 'sentence_construction' && Array.isArray(answer)) {
      return answer.join(' ');
    } else if (typeof answer === 'string') {
      return answer;
    }
    return '';
  };

  const reconstructSentence = (templateParts, answers) => {
    let sentenceParts = [];
    let blankIndex = 0;
    for (const part of templateParts) {
      if (part === "") {
        const answer = Array.isArray(answers) ? answers[blankIndex] : undefined;
        sentenceParts.push(answer || "____");
        blankIndex++;
      } else {
        sentenceParts.push(part);
      }
    }
    return sentenceParts.join('');
  };

  const speakSentence = (sentence) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Désolé, la synthèse vocale n'est pas supportée par votre navigateur.");
    }
  };

  const renderFillInBlanksQCM = (exercise) => (
    <Box key={exercise.id}>
      <Typography variant="h5" gutterBottom>{exercise.title}</Typography>
      <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>{exercise.description}</Typography>
      {exercise.questions.map((question, qIndex) => (
        <Card key={question.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: theme => theme.shape.borderRadius }}>
          <Grid container spacing={3}>
            {question.image && (
              <Grid item xs={12} md={5}>
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
              </Grid>
            )}
            <Grid item xs={12} md={question.image ? 7 : 12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                  {reconstructSentence(question.templateParts, userAnswers[question.id])}
                </Typography>
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
            const availableWords = question.words || [];
            const targetWords = userAnswers[question.id] || [];
            const targetItemIds = targetWords.map((wordInTarget, indexInTarget) =>
              `target-item-${wordInTarget}-${indexInTarget}`
            );
            return (
              <Box key={question.id} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Phrase à construire:
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Mots disponibles:</Typography>
                <Droppable id={`source-${question.id}`}>
                  {({ isOver }) => (
                    <DndArea
                      isOver={isOver}
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
                        if (targetWords.includes(word)) {
                          return null;
                        }
                        return (
                          <Draggable
                            key={`source-item-${word}-${index}`}
                            id={`source-item-${word}-${index}`}
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
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 1 }}>Votre phrase:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SortableContext items={targetItemIds}>
                    <Droppable id={`target-${question.id}`}>
                      {({ isOver }) => (
                        <DndArea
                          isOver={isOver}
                          isEmpty={targetWords.length === 0}
                          sx={{ flexGrow: 1, minHeight: '60px' }}
                        >
                          {targetWords.length === 0 && !isOver && (
                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                              Glisse les mots ici pour construire la phrase...
                            </Typography>
                          )}
                          {targetWords.map((word, index) => (
                            <SortableChip
                              key={`target-item-${word}-${index}`}
                              id={`target-item-${word}-${index}`}
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
                  <IconButton
                    color="primary"
                    aria-label="écouter la phrase"
                    onClick={() => speakSentence(targetWords.join(' '))}
                    disabled={targetWords.length === 0 || !('speechSynthesis' in window)}
                  >
                    <VolumeUpIcon />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          <DragOverlay>
            {activeItem ? (
              <Chip
                label={activeItem.label}
                color={activeItem.color || 'primary'}
                variant={activeItem.variant || 'outlined'}
                sx={{ backgroundColor: 'white', boxShadow: 3, cursor: 'grabbing' }}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    );
  };

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
            row
            aria-label={`question-${qIndex + 1}`}
            name={`qcm-${question.id}`}
            value={userAnswers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          >
            {(question.options || []).map((option, oIndex) => (
              <FormControlLabel
                key={oIndex}
                value={option}
                control={<Radio size="small" />}
                label={option}
                sx={{ mr: 3 }}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
    </Box>
  );

  const renderImageQuestion = (exercise) => (
    <Box key={exercise.id}>
      <Typography variant="h5" gutterBottom>{exercise.title}</Typography>
      <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>{exercise.description}</Typography>
      {exercise.questions.map((question, qIndex) => (
        <Card key={question.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: theme => theme.shape.borderRadius }}>
          <Grid container spacing={3} alignItems="center">
            {question.image && (
              <Grid item xs={12} md={5}>
                <CardMedia
                  component="img"
                  sx={{
                    aspectRatio: '4 / 3',
                    objectFit: 'contain',
                    width: '100%',
                    borderRadius: theme => theme.shape.borderRadius,
                  }}
                  image={question.image}
                  alt={`Image for question ${qIndex + 1}`}
                />
              </Grid>
            )}
            <Grid item xs={12} md={question.image ? 7 : 12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                  {reconstructSentence(question.templateParts, userAnswers[question.id])}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  {(question.blanks || []).map((blank, blankIndex) => (
                    <Box key={`blank-${blankIndex}`} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Mot pour trou {blankIndex + 1}:
                      </Typography>
                      <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel id={`select-label-ex4-${question.id}-blank-${blankIndex}`}>Choisir...</InputLabel>
                        <Select
                          labelId={`select-label-ex4-${question.id}-blank-${blankIndex}`}
                          id={`select-ex4-${question.id}-blank-${blankIndex}`}
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

  const renderExercise = (exercise) => {
    switch (exercise.type) {
      case 'fill_in_blanks_qcm':
        return renderFillInBlanksQCM(exercise);
      case 'sentence_construction':
        return renderSentenceConstruction(exercise);
      case 'qcm':
        return renderQCM(exercise);
      case 'image_question':
        return renderImageQuestion(exercise);
      default:
        return <Typography color="error">Unknown exercise type: {exercise.type}</Typography>;
    }
  };

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

  const calculateScore = () => {
    let newScore = 0;
    exercisesData.forEach(exercise => {
      exercise.questions.forEach(question => {
        const correctComparisonValue =
          exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question' ? question :
          exercise.type === 'sentence_construction' ? question.correctSentence :
          exercise.type === 'qcm' ? question.correctAnswer :
          null;
        if (areAnswersEqual(userAnswers[question.id], correctComparisonValue, exercise.type, question)) {
          newScore++;
        }
      });
    });
    return newScore;
  };

  const handleSubmit = () => {
    if (!areAllQuestionsAnswered()) {
      alert('Please answer all questions before submitting.');
      return;
    }
    const newScore = calculateScore();
    setScore(newScore);
    setAttempts(prevAttempts => prevAttempts + 1);
    if (newScore > bestScore) {
      setBestScore(newScore);
    }
    setShowSummary(true);
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
      {(exercisesData || []).map(exercise => (
        <StyledPaper key={exercise.id} elevation={3}>
          {renderExercise(exercise)}
        </StyledPaper>
      ))}
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
      {showSummary && (
        <TableContainer component={Paper} elevation={3} id="summary-table" sx={{ borderRadius: theme => theme.shape.borderRadius, overflow: 'hidden', mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ p: 2, pb: 0 }}>
            Récapitulatif des réponses
          </Typography>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">
              Score: {score} / {exercisesData.reduce((acc, exercise) => acc + exercise.questions.length, 0)}
            </Typography>
            <Typography variant="body1">
              Nombre d'essais: {attempts}
            </Typography>
            <Typography variant="body1">
              Meilleur score: {bestScore} / {exercisesData.reduce((acc, exercise) => acc + exercise.questions.length, 0)}
            </Typography>
          </Box>
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
              {(exercisesData || []).flatMap(exercise =>
                (exercise.questions || []).map(question => {
                  const userAnsString = getUserAnswerString(question.id, exercise.type);
                  const correctAnsString = getCorrectAnswerString(question, exercise.type);
                  const correctComparisonValue =
                    exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question' ? question :
                    exercise.type === 'sentence_construction' ? question.correctSentence :
                    exercise.type === 'qcm' ? question.correctAnswer :
                    null;
                  const isCorrect = areAnswersEqual(userAnswers[question.id], correctComparisonValue, exercise.type, question);
                  let questionSummaryText;
                  if (exercise.type === 'fill_in_blanks_qcm' || exercise.type === 'image_question') {
                    questionSummaryText = (question.templateParts || []).map((part) =>
                      part === "" ? "[...]" : part
                    ).join('');
                  } else if (exercise.type === 'sentence_construction') {
                    questionSummaryText = `Mots: "${(question.words || []).join(' / ')}"`;
                  } else if (exercise.type === 'qcm') {
                    questionSummaryText = question.questionText;
                  } else {
                    questionSummaryText = "Question non reconnue";
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

export default MetierGame1;
