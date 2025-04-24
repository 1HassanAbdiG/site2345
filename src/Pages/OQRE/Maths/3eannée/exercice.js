// MathExerciseComponent.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  ImageList,
  ImageListItem,
  Box,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import matData from"./exercice.json"

const MathExerciseComponent = ({ mathData }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [feedbackSnackbar, setFeedbackSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Add a check to ensure mathData is loaded and has sections
  if (!mathData || !mathData.sections || mathData.sections.length === 0 || !mathData.sections[0].parts || mathData.sections[0].parts.length === 0 || !mathData.sections[0].parts[0].topics || mathData.sections[0].parts[0].topics.length === 0 || !mathData.sections[0].parts[0].topics[0].lessons || mathData.sections[0].parts[0].topics[0].lessons.length === 0 || !mathData.sections[0].parts[0].topics[0].lessons[0].exercises) {
    return <Typography>Loading exercises...</Typography>; // Or display an error message
  }

  const currentExercise = mathData.sections[0].parts[0].topics[0].lessons[0].exercises[currentExerciseIndex];

  const handleAnswerChange = (event) => {
    setUserAnswers({ ...userAnswers, [currentExerciseIndex]: event.target.value });
  };

  const handleRadioChange = (event) => {
    setUserAnswers({ ...userAnswers, [currentExerciseIndex]: event.target.value });
  };

  const handleImageSelect = (index) => {
    setUserAnswers({ ...userAnswers, [currentExerciseIndex]: index.toString() });
  };

  const checkAnswer = () => {
    let isCorrect = false;
    let currentPoints = 0;
    let feedbackMessage = "";
    let feedbackSeverity = "error";

    if (currentExercise.exerciseType === 'fill-in-the-blank') {
      const userAnswerArray = userAnswers[currentExerciseIndex] ? userAnswers[currentExerciseIndex].split(',').map(ans => ans.trim().toLowerCase()) : [];
      const correctAnswersArray = Array.isArray(currentExercise.answers) ? currentExercise.answers.map(ans => ans.toLowerCase()) : [currentExercise.answers.toLowerCase()];

      isCorrect = correctAnswersArray.every(correctAnswer => userAnswerArray.includes(correctAnswer));
      if (isCorrect) {
        currentPoints = currentExercise.points;
        feedbackMessage = currentExercise.feedback?.correct || "Correct!";
        feedbackSeverity = "success";
      } else {
        feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
      }

    } else if (currentExercise.exerciseType === 'multiple-choice') {
      if (userAnswers[currentExerciseIndex] === currentExercise.correctAnswer) {
        isCorrect = true;
        currentPoints = currentExercise.points;
        feedbackMessage = currentExercise.feedback?.correct || "Correct!";
        feedbackSeverity = "success";
      } else {
        feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
      }
    }
    // ... Handle other exercise types (text-input, true-false, image-select, drag-and-drop) ...

    if (isCorrect) {
      setScore(prevScore => prevScore + currentPoints);
    }
    setFeedbackSnackbar({ open: true, message: feedbackMessage, severity: feedbackSeverity });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < mathData.sections[0].parts[0].topics[0].lessons[0].exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      alert("End of lesson!");
    }
    setUserAnswers({});
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFeedbackSnackbar({ ...feedbackSnackbar, open: false });
  };


  const renderExercise = () => {
    if (!currentExercise) return <Typography>No exercise loaded.</Typography>;

    switch (currentExercise.exerciseType) {
      case 'fill-in-the-blank':
        return (
          <div>
            <Typography variant="h6">{currentExercise.question}</Typography>
            <TextField
              label="Your Answer"
              value={userAnswers[currentExerciseIndex] || ''}
              onChange={handleAnswerChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
        );
      case 'multiple-choice':
        return (
          <div>
            <Typography variant="h6">{currentExercise.question}</Typography>
            <RadioGroup
              aria-label="answer-choices"
              name={`radio-group-${currentExerciseIndex}`}
              value={userAnswers[currentExerciseIndex] || ''}
              onChange={handleRadioChange}
            >
              {currentExercise.options.map((option, index) => (
                <FormControlLabel key={index} value={String.fromCharCode(97 + index)} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
          </div>
        );
      case 'text-input':
        return (
          <div>
            <Typography variant="h6">{currentExercise.question}</Typography>
            <TextField
              label="Your Answer"
              value={userAnswers[currentExerciseIndex] || ''}
              onChange={handleAnswerChange}
              variant="outlined"
              fullWidth
              margin="normal"
              type={currentExercise.inputType || 'text'}
            />
          </div>
        );
      case 'image-select':
        return (
          <div>
            <Typography variant="h6">{currentExercise.question}</Typography>
            <ImageList sx={{ width: 500, height: 'auto' }} cols={4} rowHeight={100}>
              {currentExercise.imageOptions.map((image, index) => (
                <ImageListItem key={index}>
                  <IconButton
                    onClick={() => handleImageSelect(index)}
                    sx={{ border: userAnswers[currentExerciseIndex] === index.toString() ? '2px solid blue' : 'none' }}
                  >
                    <img
                      src={image} // Replace with actual image path/URL if needed, or assume they are relative paths
                      alt={`Option ${index + 1}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        );
      // ... Implement render logic for other exercise types (true-false, drag-and-drop) ...
      default:
        return <Typography>Exercise type not supported: {currentExercise.exerciseType}</Typography>;
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        3rd Grade Math Exercises
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Lesson: {mathData.sections[0].parts[0].topics[0].lessons[0].lessonName} - Exercise {currentExerciseIndex + 1}
          </Typography>
          {renderExercise()}
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={checkAnswer} sx={{ mr: 2 }}>
              Check Answer
            </Button>
            <Button variant="contained" color="secondary" onClick={handleNextExercise} disabled={currentExerciseIndex >= mathData.sections[0].parts[0].topics[0].lessons[0].exercises.length - 1}>
              Next Exercise
            </Button>
          </Box>
          <Typography variant="subtitle1" mt={2}>Score: {score} points</Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={feedbackSnackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={feedbackSnackbar.severity} sx={{ width: '100%' }}>
          {feedbackSnackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MathExerciseComponent;