// QuestionChoixUnique.js
import React from 'react';
// Import Material UI components
import { Typography, Box, Button } from '@mui/material';
// Note: We remove the Paper import assuming it's rendered inside the parent Quiz's Paper

// This component expects 'question' object and 'onAnswer' callback as props
function QuestionChoixUnique({ question, onAnswer }) {

  // Handle the answer selection
  const handleSelect = (selectedOption) => {
    // Call the onAnswer prop with the result object
    // We need to check if the selected option matches the correct answer string
    onAnswer({
      correct: selectedOption === question.answer, // Simple string comparison
      userAnswer: selectedOption // Pass the selected option string as the user's answer
    });
  };

  return (
    // Removed outer Paper, letting the parent Quiz component provide the card structure
    <Box sx={{ textAlign: 'center' }}> {/* Use Box for alignment and spacing */}
      {/* Use Typography for the question text */}
      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 4, fontWeight: 'medium' }}> {/* Larger and slightly bolder question text */}
        {question.question}
      </Typography>

      {/* Use Box for the container holding the buttons */}
      {/* Display options as stacked buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}> {/* Stack vertically, center items, add gap */}
        {/* Map over the options to create buttons */}
        {question.options.map((option) => (
          // Use Button component for each option
          <Button
            key={option}
            variant="outlined" // Outlined buttons are common for choices
            // You could use color="primary" or secondary, or leave default
            fullWidth // Make buttons take the full width of their container
            size="large" // Make buttons larger
            sx={{ maxWidth: 400 }} // Optional: Limit the maximum width of buttons
            onClick={() => handleSelect(option)}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default QuestionChoixUnique;