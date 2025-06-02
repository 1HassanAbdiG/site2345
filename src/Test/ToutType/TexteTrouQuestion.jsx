// TexteTrouQuestion.js
import React, { useState } from 'react';
// Import Material UI components
import {
    Typography,
    Box,
    Button,
    TextField // Component for text input
    // Removed Paper import as parent Quiz provides the card structure
} from '@mui/material';

// This component expects 'question' object and 'onAnswer' callback as props
function TexteTrouQuestion({ question, onAnswer }) {
  // State to store the user's typed response for the gap
  const [response, setResponse] = useState('');
  // State for immediate feedback (optional, can be removed if Bilan is the only feedback)
  // const [feedback, setFeedback] = useState(null); // true/false/null

  // Function to handle validation when the button is clicked or Enter is pressed
  const handleValidation = () => {
    // Compare the trimmed, lowercased user input with the trimmed, lowercased correct answer
    const userAnswerTrimmedLower = response.trim().toLowerCase();
    const correctAnswerTrimmedLower = question.answer.toLowerCase(); // Assuming question.answer is already trimmed or doesn't need it

    const isCorrect = userAnswerTrimmedLower === correctAnswerTrimmedLower;

    // Set local feedback state (optional visual cue, might be very brief if quiz auto-advances)
    // setFeedback(isCorrect);

    // Call the onAnswer prop with the result object
    // Pass the user's actual input (before trimming/casing) as userAnswer for the Bilan
    onAnswer({
      correct: isCorrect,
      userAnswer: response // Send the raw user input string to Bilan
    });

    // If you want to keep the feedback state AND delay the transition,
    // you would manage the timeout here and call onAnswer inside the timeout.
  };

  // Allow submitting by pressing Enter key in the text field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Prevent default form submission behavior
      e.preventDefault();
      // Only validate if there's some text entered
      if (response.trim().length > 0) {
         handleValidation();
      }
    }
  };

  // Split the question string if it contains the placeholder "___"
  // This allows displaying text before and after the input field
  const parts = question.question.split('___');
  const textBefore = parts[0] || '';
  const textAfter = parts[1] || '';


  return (
    // Use Box for internal layout and spacing, assuming parent Paper provides the card structure
    <Box sx={{ textAlign: 'center', maxWidth: 600, margin: 'auto', p: 2 }}> {/* Center content, limit max width, add some padding */}

      {/* Title / Instructions */}
      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Complétez le texte ✍️
      </Typography>

      {/* Question Text with Input Field */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', mb: 4, fontSize: '1.2em' }}>
         {/* Text before the gap */}
         {textBefore && (
             <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                 {textBefore.trim()} {/* Trim spaces around the split */}
             </Typography>
         )}

         {/* Input Field */}
         {/* Use TextField for the input, styled to blend with surrounding text */}
         <TextField
            variant="standard" // Use standard variant to look like inline text
            placeholder="Réponse..." // Placeholder for the blank
            value={response}       // Bind state
            onChange={(e) => setResponse(e.target.value)} // Update state
            onKeyPress={handleKeyPress} // Add Enter key handler
            sx={{
                width: 'auto', // Auto width to fit content loosely
                minWidth: 100, // Minimum width
                maxWidth: 200, // Maximum width
                verticalAlign: 'baseline', // Align baseline with surrounding text
                '& .MuiInput-underline:after': { borderBottomColor: 'primary.main' }, // Underline color when focused
            }}
         />

         {/* Text after the gap */}
          {textAfter && (
              <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                  {textAfter.trim()} {/* Trim spaces around the split */}
              </Typography>
          )}
      </Box>


      {/* Validation Button */}
      <Button
        variant="contained" // Solid button
        color="primary"     // Theme primary color
        size="large"        // Larger button
        onClick={handleValidation} // Assign validation handler
        disabled={response.trim() === ''} // Disable if input is empty
        sx={{ px: 4 }} // Add horizontal padding
      >
        Valider
      </Button>

      {/* Immediate Feedback (Optional - uncomment if needed and if quiz doesn't auto-advance immediately) */}
      {/*
      {feedback !== null && (
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            fontWeight: 'bold',
            color: feedback ? 'success.main' : 'error.main', // Use theme colors
            textAlign: 'center'
          }}
        >
          {feedback ? '🎉 Correct !' : '😕 Pas tout à fait...'}
        </Typography>
      )}
      */}
    </Box>
  );
}

export default TexteTrouQuestion;