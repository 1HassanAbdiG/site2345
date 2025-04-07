// src/components/Question.js
import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ConstructedResponseQuestion from './ConstructedResponseQuestion';
// import './Question.css'; // REMOVE THIS LINE
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'; // Stack for layout

function Question({ questionData, response, onAnswerChange }) {
  const renderQuestionType = () => {
    switch (questionData.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            questionData={questionData}
            response={response}
            onAnswerChange={onAnswerChange}
          />
        );
      case 'constructed-response':
        return (
          <ConstructedResponseQuestion
            questionData={questionData}
            response={response}
            onAnswerChange={onAnswerChange}
          />
        );
      default:
        return <Typography color="error">Type de question non supporté: {questionData.type}</Typography>;
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }} id={`q-${questionData.id}`}>
        {/* Stack makes vertical layout easy, row layout for number+content */}
      <Stack direction="row" spacing={2}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', minWidth: '30px'}}>
           {questionData.number}.
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
            {/* Use Typography for text, allows variants */}
            <Typography
                paragraph // Adds bottom margin
                variant="body1"
                dangerouslySetInnerHTML={{ __html: questionData.text }}
                sx={{ mt: 0 }} // Reset top margin if needed
            />
            {/* Use Box component="img" to apply sx styles */}
            {questionData.image && (
                <Box
                    component="img"
                    src={questionData.image}
                    alt={`Question ${questionData.number}`}
                    sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        display: 'block' // To handle margins correctly
                    }}
                />
            )}
             {questionData.image_question && (
                <Box
                    component="img"
                    src={questionData.image_question}
                    alt={`Données Question ${questionData.number}`}
                    sx={{ maxWidth: '100%', height: 'auto', mb: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, display: 'block' }}
                />
            )}
            {renderQuestionType()}
        </Box>
      </Stack>
    </Paper>
  );
}

export default Question;