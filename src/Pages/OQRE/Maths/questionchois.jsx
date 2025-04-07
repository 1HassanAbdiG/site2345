// src/components/MultipleChoiceQuestion.js
import React from 'react';
// import './MultipleChoiceQuestion.css'; // REMOVE THIS LINE
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel'; // Optional: if you need a legend
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function MultipleChoiceQuestion({ questionData, response, onAnswerChange }) {

  const handleChange = (event) => {
    onAnswerChange(questionData.id, event.target.value);
  };

  return (
    // FormControl groups the radio buttons
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      {/* Optional: Use FormLabel for accessibility, can be visually hidden */}
      {/* <FormLabel component="legend" sx={{ display: 'none' }}>Options for question {questionData.number}</FormLabel> */}
      <RadioGroup
        aria-label={`Options for question ${questionData.number}`}
        name={questionData.id} // HTML name attribute
        value={response || ''} // Controlled component
        onChange={handleChange}
      >
        {questionData.options.map(option => (
          // FormControlLabel wraps Radio and its text label
          <FormControlLabel
            key={option.id}
            value={option.id} // The value stored when selected
            control={<Radio />} // The Radio button itself
            label={option.text} // The text label
          />
        ))}
      </RadioGroup>
       {/* Special handling for image-based options like Q3 */}
       {questionData.id === 'q3' && questionData.image && (
           <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
             (Voir l'image ci-dessus pour les options du tableau)
           </Typography>
       )}
    </FormControl>
  );
}

export default MultipleChoiceQuestion;