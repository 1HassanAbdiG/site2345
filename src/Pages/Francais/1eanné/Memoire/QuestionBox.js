// src/components/QuestionBox.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const QuestionBox = ({ question, onNext, onContinue }) => (
  <Box sx={{ backgroundColor: '#673ab7', color: 'white', p: 2, borderRadius: 2, mt: 2 }}>
    <Typography variant="h6" gutterBottom>
      Question de réflexion :
    </Typography>
    <Typography variant="body1" gutterBottom>
      {question}
    </Typography>
    <Box mt={2}>
      <Button variant="contained" onClick={onNext} sx={{ mr: 2 }}>
        Question suivante
      </Button>
      <Button variant="outlined" onClick={onContinue} sx={{ color: 'white', borderColor: 'white' }}>
        Continuer le jeu
      </Button>
    </Box>
  </Box>
);

export default QuestionBox;