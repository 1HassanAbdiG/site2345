// src/components/Section.js
import React from 'react';
import Question from './Question';
// import './Section.css'; // REMOVE THIS LINE
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; // Using Alert for instructions

function Section({ sectionData, responses, onAnswerChange }) {
  return (
    <Box sx={{ mb: 3, pl: { xs: 0, sm: 2 } }}> {/* Indent sections slightly on larger screens */}
      {sectionData.instructions && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {sectionData.instructions}
        </Alert>
      )}
      {sectionData.questions?.map(question => (
        <Question
          key={question.id}
          questionData={question}
          response={responses[question.id]}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </Box>
  );
}

export default Section;