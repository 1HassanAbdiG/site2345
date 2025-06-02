// QuestionChoixMultiple.js
import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';

function QuestionChoixMultiple({ question, onAnswer }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false); // Add state

  const handleToggleOption = (option) => {
    if (submitted) return; // Prevent changing selection after submitting
     // ... existing toggle logic ...
    setSelected(prevSelected => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleValidation = () => {
    if (submitted || selected.length === 0) return; // Prevent multiple submissions or submitting empty

    setSubmitted(true); // Disable submission after first click

    const correctAnswersSorted = question.answer.slice().sort();
    const userAnswersSorted = selected.slice().sort();

    const isCorrect =
      correctAnswersSorted.length === userAnswersSorted.length &&
      correctAnswersSorted.every((val, index) => val === userAnswersSorted[index]);

    onAnswer({
      correct: isCorrect,
      userAnswer: selected
    });
  };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 4, fontWeight: 'medium' }}>
        {question.question}
      </Typography>

      <FormGroup sx={{ alignItems: 'flex-start', mb: 4 }}>
        {question.options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={selected.includes(option)}
                onChange={() => handleToggleOption(option)}
                disabled={submitted} // Disable checkboxes after submission
              />
            }
            label={<Typography variant="body1">{option}</Typography>}
            sx={{ mb: 1 }}
          />
        ))}
      </FormGroup>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleValidation}
        disabled={submitted || selected.length === 0} // Disable button after submission OR if nothing selected
        sx={{ px: 4 }}
      >
        Valider la réponse
      </Button>

    </Box>
  );
}

export default QuestionChoixMultiple;