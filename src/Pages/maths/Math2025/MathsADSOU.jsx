import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import exercisesData from './exercisesData.json';

const levels = [
  { id: '3E', color: '#1976d2' },
  { id: '4E', color: '#9c27b0' },
  { id: '5E', color: '#2e7d32' },
  { id: '6E', color: '#ed6c02' },
];

function MathExercisesPage() {
  const [visibleLevels, setVisibleLevels] = useState(new Set(levels.map(level => level.id)));
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({});

  const toggleLevelVisibility = (levelId) => {
    setVisibleLevels(prev => {
      const newSet = new Set(prev);
      newSet.has(levelId) ? newSet.delete(levelId) : newSet.add(levelId);
      return newSet;
    });
  };

  const filteredExercises = Array.isArray(exercisesData)
    ? exercisesData.filter(ex => ex && visibleLevels.has(ex.level))
    : [];

  const handleChange = (exerciseId, questionIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [questionIndex]: value,
      },
    }));
  };

  const handleValidate = (exercise) => {
    const answers = userAnswers[exercise.id] || {};
    const correct = exercise.questions.filter((q, i) => answers[i] === q.correctAnswer);
    setScores(prev => ({ ...prev, [exercise.id]: correct.length }));
  };

  const handleReset = (exerciseId) => {
    setUserAnswers(prev => ({ ...prev, [exerciseId]: {} }));
    setScores(prev => ({ ...prev, [exerciseId]: undefined }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {levels.map((level) => {
          const isVisible = visibleLevels.has(level.id);
          return (
            <Button
              key={level.id}
              variant="contained"
              sx={{
                bgcolor: level.color,
                '&:hover': {
                  bgcolor: level.color,
                  opacity: 0.9,
                },
              }}
              onClick={() => toggleLevelVisibility(level.id)}
            >
              {isVisible ? `MASQUER NIVEAU ${level.id}` : `AFFICHER NIVEAU ${level.id}`}
            </Button>
          );
        })}
      </Stack>

      <Typography variant="h4" gutterBottom>
        Exercices de Mathématiques - Addition et Soustraction
      </Typography>

      <Box sx={{ width: '100%' }}>
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <Accordion key={exercise.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{exercise.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ mb: 2 }}>{exercise.content}</Typography>
                {exercise.questions.map((q, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ mr: 2 }}>{q.question}</Typography>
                    <TextField
                      size="small"
                      value={userAnswers[exercise.id]?.[index] || ''}
                      onChange={(e) => handleChange(exercise.id, index, e.target.value)}
                    />
                  </Box>
                ))}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleValidate(exercise)}
                  >
                    Valider
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleReset(exercise.id)}
                  >
                    Réinitialiser
                  </Button>
                </Stack>
                {scores[exercise.id] !== undefined && (
                  <Typography sx={{ mt: 2 }} color="primary">
                    Score : {scores[exercise.id]} / {exercise.questions.length}
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography>Aucun exercice à afficher pour les niveaux sélectionnés.</Typography>
        )}
      </Box>
    </Container>
  );
}

export default MathExercisesPage;
