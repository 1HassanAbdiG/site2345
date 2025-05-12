// src/Pages/Francais/1eanné/MathExercises/ExerciseRenderer.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, Paper, Alert } from '@mui/material';

// Composant pour les QCM
const MultipleChoiceComponent = ({ exercise, userAnswer, setUserAnswer, isSubmitted }) => (
  <RadioGroup
    aria-labelledby={`question-${exercise.id}`}
    name={`radio-buttons-group-${exercise.id}`}
    value={userAnswer || ''}
    onChange={(e) => !isSubmitted && setUserAnswer(e.target.value)}
  >
    {exercise.options.map((option, index) => (
      <FormControlLabel 
        key={index} 
        value={typeof option === 'object' ? option.value : option} 
        control={<Radio />} 
        label={typeof option === 'object' ? option.label : option} 
        disabled={isSubmitted}
      />
    ))}
  </RadioGroup>
);

// Composant pour remplir les blancs
const FillInTheBlanksComponent = ({ exercise, userAnswer, setUserAnswer, isSubmitted }) => {
  const handleBlankChange = (blankId, value) => {
    if (isSubmitted) return;
    setUserAnswer(prev => ({ ...prev, [blankId]: value }));
  };

  let questionTextParts = exercise.question.split(/(__)/); // Sépare par __

  return (
    <Box>
        {questionTextParts.map((part, index) => {
            if (part === "__") {
                const blankIndex = Math.floor(index / 2); // Détermine quel blanc c'est
                const blankMeta = exercise.blanks[blankIndex];
                if (!blankMeta) return <Typography component="span" key={index}>[Erreur de config blanc]</Typography>;
                return (
                    <TextField
                        key={`${exercise.id}-blank-${blankMeta.id}`}
                        variant="outlined"
                        size="small"
                        sx={{ width: '80px', mx: 0.5, display: 'inline-block' }}
                        value={userAnswer[blankMeta.id] || ''}
                        onChange={(e) => handleBlankChange(blankMeta.id, e.target.value)}
                        disabled={isSubmitted}
                        inputProps={{ style: { textAlign: 'center' } }}
                    />
                );
            }
            return <Typography component="span" key={index} sx={{ verticalAlign: 'middle' }}>{part}</Typography>;
        })}
    </Box>
  );
};

// Composant pour entrée numérique simple
const NumberInputComponent = ({ exercise, userAnswer, setUserAnswer, isSubmitted }) => (
  <TextField
    type="number"
    label="Votre réponse"
    variant="outlined"
    value={userAnswer || ''}
    onChange={(e) => !isSubmitted && setUserAnswer(e.target.value)}
    disabled={isSubmitted}
    fullWidth
    sx={{maxWidth: '200px'}}
  />
);

// Composant pour QCM avec image
const ImageMultipleChoiceComponent = ({ exercise, userAnswer, setUserAnswer, isSubmitted }) => (
  <Box>
    {exercise.imageUrl && (
      <Box mb={2} textAlign="center">
        <img 
            src={process.env.PUBLIC_URL + exercise.imageUrl} 
            alt="Illustration pour l'exercice" 
            style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #ccc' }} 
        />
      </Box>
    )}
    <MultipleChoiceComponent exercise={exercise} userAnswer={userAnswer} setUserAnswer={setUserAnswer} isSubmitted={isSubmitted} />
  </Box>
);


const ExerciseRenderer = ({ exercise, onSubmitAnswer, isCompleted }) => {
  const [userAnswer, setUserAnswer] = useState(
    exercise.type === 'fill-in-the-blanks' || exercise.type === 'fill-in-the-blanks-math' ? {} : ''
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    // Reset state if exercise changes
    setUserAnswer(exercise.type === 'fill-in-the-blanks' || exercise.type === 'fill-in-the-blanks-math' ? {} : '');
    setIsSubmitted(false);
    setIsCorrect(null);
    if (isCompleted !== undefined) { // Si l'état complété est passé en prop
        setIsSubmitted(true); 
        // Pourrait aussi déterminer isCorrect basé sur une réponse stockée si on veut réafficher le feedback
    }

  }, [exercise, isCompleted]);


  const checkAnswer = () => {
    let correct = false;
    switch (exercise.type) {
      case 'multiple-choice':
      case 'multiple-choice-custom':
      case 'image-multiple-choice':
        correct = userAnswer === String(exercise.correctAnswer);
        break;
      case 'number-input':
        correct = parseFloat(userAnswer) === parseFloat(exercise.correctAnswer);
        break;
      case 'fill-in-the-blanks':
      case 'fill-in-the-blanks-math':
        correct = exercise.blanks.every(blank => 
            String(userAnswer[blank.id]).trim() === String(blank.correctAnswer).trim()
        );
        break;
      default:
        console.warn("Type d'exercice inconnu pour la vérification:", exercise.type);
    }
    setIsCorrect(correct);
    setIsSubmitted(true);
    onSubmitAnswer(exercise.id, correct, userAnswer);
  };

  const renderInput = () => {
    switch (exercise.type) {
      case 'multiple-choice':
      case 'multiple-choice-custom':
        return <MultipleChoiceComponent exercise={exercise} userAnswer={userAnswer} setUserAnswer={setUserAnswer} isSubmitted={isSubmitted || isCompleted}/>;
      case 'image-multiple-choice':
        return <ImageMultipleChoiceComponent exercise={exercise} userAnswer={userAnswer} setUserAnswer={setUserAnswer} isSubmitted={isSubmitted || isCompleted}/>;
      case 'number-input':
        return <NumberInputComponent exercise={exercise} userAnswer={userAnswer} setUserAnswer={setUserAnswer} isSubmitted={isSubmitted || isCompleted}/>;
      case 'fill-in-the-blanks':
      case 'fill-in-the-blanks-math':
        return <FillInTheBlanksComponent exercise={exercise} userAnswer={userAnswer} setUserAnswer={setUserAnswer} isSubmitted={isSubmitted || isCompleted}/>;
      default:
        return <Typography color="error">Type d'exercice non supporté: {exercise.type}</Typography>;
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: isSubmitted ? (isCorrect ? 'success.light' : 'error.light') : 'transparent' }}>
      <Typography variant="h6" gutterBottom component="div" dangerouslySetInnerHTML={{ __html: exercise.question }} />
      {exercise.instructions && <Typography variant="body2" color="text.secondary" gutterBottom>{exercise.instructions}</Typography>}
      
      <Box my={2}>
        {renderInput()}
      </Box>

      {isSubmitted && (
        <Alert severity={isCorrect ? "success" : "error"} sx={{mb:2}}>
          {isCorrect ? "Bravo, c'est correct !" : `Dommage, la bonne réponse était : ${ typeof exercise.correctAnswer === 'object' ? JSON.stringify(exercise.correctAnswer) : exercise.correctAnswer }`}
          { (exercise.type === "fill-in-the-blanks" || exercise.type === "fill-in-the-blanks-math") && !isCorrect && (
            <Box>
                Bonnes réponses:
                {exercise.blanks.map(b => <Typography key={b.id}>Blanc '{b.id}': {b.correctAnswer}</Typography>)}
            </Box>
          )}
        </Alert>
      )}

      {!isSubmitted && !isCompleted && (
        <Button variant="contained" onClick={checkAnswer} sx={{mt:1}}>
          Valider ma réponse
        </Button>
      )}
       {isSubmitted && isCorrect && (
        <Typography variant="body2" sx={{mt:1}}>Vous pouvez passer à l'exercice suivant.</Typography>
      )}
    </Paper>
  );
};

export default ExerciseRenderer;