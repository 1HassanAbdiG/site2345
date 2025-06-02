// DicteeQuestion.js
import React, { useState, useRef } from 'react';
import {
    Typography,
    Box,
    Button,
    TextField,
} from '@mui/material';


function DicteeQuestion({ question, onAnswer }) {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [response, setResponse] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Add state
  const audioRef = useRef(null);

  const handleAudioEnd = () => {
    setAudioPlayed(true);
  };

  const handleSubmit = () => {
    if (submitted || response.trim() === '') return; // Prevent multiple submissions or empty submission

    setSubmitted(true); // Disable submission

    const userAnswerTrimmedLower = response.trim().toLowerCase();
    const correctAnswerTrimmedLower = question.answer.toLowerCase();

    const correct = userAnswerTrimmedLower === correctAnswerTrimmedLower;

    setIsCorrect(correct);

    setTimeout(() => {
      onAnswer({
        correct: correct,
        userAnswer: response
      });
    }, 1500);
  };

   const handleKeyPress = (e) => {
     if (e.key === 'Enter') {
       e.preventDefault();
        // Only validate if there's some text entered AND not already submitted
       if (response.trim().length > 0 && !submitted) {
          handleSubmit();
       }
     }
   };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 600, margin: 'auto', p: 2 }}>

      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Dictée 🎧✍️
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <audio ref={audioRef} controls onEnded={handleAudioEnd} style={{ width: '100%', maxWidth: '400px' }}>
          <source src={question.audio} type="audio/mpeg" />
          Votre navigateur ne supporte pas la lecture audio.
        </audio>

        {!audioPlayed && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            🎧 Écoutez attentivement. Le champ de réponse apparaîtra après la première écoute complète.
          </Typography>
        )}
         {audioPlayed && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Écrivez ce que vous avez entendu ci-dessous.
              </Typography>
         )}
      </Box>

      {audioPlayed && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Votre transcription"
            variant="outlined"
            fullWidth
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez ici..."
            disabled={submitted} // Disable input field after submission
             color={isCorrect === true ? 'success' : isCorrect === false ? 'error' : 'primary'}
             InputProps={{
                 sx: {
                      '& fieldset': {
                         borderColor: isCorrect === true ? 'success.main' : isCorrect === false ? 'error.main' : undefined,
                      },
                      '&:hover fieldset': {
                          borderColor: isCorrect === true ? 'success.dark' : isCorrect === false ? 'error.dark' : undefined,
                      },
                      '&.Mui-focused fieldset': {
                          borderColor: isCorrect === true ? 'success.main' : isCorrect === false ? 'error.main' : (isCorrect === null ? 'primary.main' : undefined),
                      },
                 }
             }}

          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={submitted || response.trim() === ''} // Disable button after submission OR if empty
            sx={{ px: 4 }}
          >
            Valider
          </Button>
        </Box>
      )}

      {isCorrect !== null && (
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            fontWeight: 'bold',
            color: isCorrect ? 'success.main' : 'error.main',
            textAlign: 'center',
            transition: 'color 0.3s ease-in-out'
          }}
        >
          {isCorrect ? '✅ Bravo, c’est correct !' : '❌ Ce n’est pas la bonne réponse.'}
        </Typography>
      )}
       {isCorrect === false && question.answer && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                La bonne réponse était : <Box component="span" sx={{ fontWeight: 'bold' }}>{question.answer}</Box>
            </Typography>
       )}

    </Box>
  );
}

export default DicteeQuestion;