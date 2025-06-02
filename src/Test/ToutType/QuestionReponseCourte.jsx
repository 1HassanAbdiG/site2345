// ReponseCourteQuestion.js
import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    TextField
} from '@mui/material';

function ReponseCourteQuestion({ question, onAnswer }) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false); // Add state

  const handleValidation = () => {
    if (submitted || response.trim() === '') return; // Prevent multiple submissions or empty submission

    setSubmitted(true); // Disable submission

    const userAnswerTrimmedLower = response.trim().toLowerCase();
    const correctAnswerTrimmedLower = question.answer.toLowerCase();

    const isCorrect = userAnswerTrimmedLower === correctAnswerTrimmedLower;

    onAnswer({
      correct: isCorrect,
      userAnswer: response
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Only validate if there's some text entered AND not already submitted
      if (response.trim().length > 0 && !submitted) {
         handleValidation();
      }
    }
  };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 4, fontWeight: 'medium' }}>
        {question.question}
      </Typography>

      <TextField
        label="Votre réponse"
        variant="outlined"
        fullWidth
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ mb: 3 }}
        disabled={submitted} // Disable input field after submission
      />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleValidation}
        disabled={submitted || response.trim() === ''} // Disable button after submission OR if empty
        sx={{ px: 4 }}
      >
        Valider
      </Button>

    </Box>
  );
}

export default ReponseCourteQuestion;