// QuestionVraiFaux.js
import React from 'react';
// Import Material UI components
import { Paper, Typography, Box, Button } from '@mui/material';

// This component expects 'question' object and 'onAnswer' callback as props
function VraiFauxQuestion({ question, onAnswer }) {
  // Handle the answer selection
  const handleSelect = (choice) => {
    // Call the onAnswer prop with the result object
    onAnswer({
      correct: choice.toLowerCase() === question.answer.toLowerCase(), // Compare lowercased answers
      userAnswer: choice.toLowerCase() // Store the user's answer (lowercased for consistency)
    });
  };

  return (
    // Use Paper for a card-like container
    <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center', maxWidth: 500, margin: 'auto' }}>
      {/* Use Typography for the question text */}
      <Typography variant="h6" component="div" gutterBottom>
        {question.question}
      </Typography>

      {/* Use Box for the container holding the buttons, with flex display */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, mt: 3 }}>
        {/* Map over the possible answers (Vrai/Faux) */}
        {['Vrai', 'Faux'].map((choice) => (
          // Use Button component
          <Button
            key={choice}
            variant="contained" // Filled button style
            color={choice.toLowerCase() === 'vrai' ? 'success' : 'error'} // Green for Vrai, Red for Faux (optional visual hint)
            size="large" // Make buttons larger
            sx={{ flexGrow: 1 }} // Make buttons take equal space
            onClick={() => handleSelect(choice)}
          >
            {choice}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}

// Export the component (make sure the name matches the import in Quiz.js)
// The original file name was 'QuestionVraiFaux', but the import in Quiz.js is 'VraiFauxQuestion'.
// Let's export with the name used in Quiz.js for consistency.
export default VraiFauxQuestion;