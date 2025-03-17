import React, { useState } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';

const ExerciseImage = () => {
  // Example exercise data
  const exerciseData = {
    titre: "Associez l'image à son mot",
    instructions: "Cliquez sur une image puis sur le mot correspondant pour créer une association.",
    questions: [
      { id: 1, image: "chevre.png", word: "chèvre" },
      { id: 2, image: "chien.png", word: "chien" },
      { id: 3, image: "chat.png", word: "chat" }
    ]
  };

  // List of images (left column)
  const leftItems = exerciseData.questions.map(q => ({
    id: `left-${q.id}`,
    src: q.image,
    alt: q.word
  }));

  // List of words (right column)
  const rightItems = exerciseData.questions.map(q => ({
    id: `right-${q.id}`,
    text: q.word
  }));

  // Shuffle the words for difficulty
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  const [shuffledRightItems] = useState(shuffle([...rightItems]));

  // States for selection and pairings
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [pairings, setPairings] = useState([]); // { leftId, rightId, leftAlt, rightText }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Handle selecting an image
  const handleLeftClick = (item) => {
    setSelectedLeft(item);
  };

  // Handle selecting a word to pair with the selected image
  const handleRightClick = (item) => {
    if (selectedLeft) {
      if (pairings.find(pair => pair.leftId === selectedLeft.id)) {
        alert("Cette image est déjà associée.");
      } else {
        setPairings([...pairings, {
          leftId: selectedLeft.id,
          rightId: item.id,
          leftAlt: selectedLeft.alt,
          rightText: item.text
        }]);
      }
      setSelectedLeft(null);
    } else {
      alert("Veuillez d'abord sélectionner une image.");
    }
  };

  // Submit the associations and calculate score
  const handleSubmit = () => {
    let correctCount = 0;
    pairings.forEach(pair => {
      const question = exerciseData.questions.find(q => `left-${q.id}` === pair.leftId);
      if (question && question.word === pair.rightText) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  // Reset the exercise
  const handleReset = () => {
    setSelectedLeft(null);
    setPairings([]);
    setSubmitted(false);
    setScore(0);
  };

  return (
    <Grid container spacing={4} padding={3}>
      {/* Title and instructions */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            {exerciseData.titre}
          </Typography>
          <Typography variant="body1" align="center">
            {exerciseData.instructions}
          </Typography>
        </Paper>
      </Grid>

      {/* Association area with react-archer */}
      <Grid item xs={12}>
        <ArcherContainer strokeColor="blue" strokeWidth={2}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {/* Left column: Images */}
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, backgroundColor: '#f1f8e9' }}>
                <Typography variant="h6" align="center">Images</Typography>
                <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                  {leftItems.map(item => {
                    const pairing = pairings.find(pair => pair.leftId === item.id);
                    return (
                      <ArcherElement
                        key={item.id}
                        id={item.id}
                        relations={
                          pairing
                            ? [{
                                targetId: pairing.rightId,
                                targetAnchor: 'left',
                                sourceAnchor: 'right',
                                style: { strokeColor: 'green', strokeWidth: 2 }
                              }]
                            : []
                        }
                      >
                        <Paper
                          onClick={() => handleLeftClick(item)}
                          sx={{
                            p: 1,
                            backgroundColor: selectedLeft && selectedLeft.id === item.id ? '#bbdefb' : '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <img
                            src={`/imag/${item.src}`}
                            alt={item.alt}
                            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                          />
                        </Paper>
                      </ArcherElement>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>

            {/* Right column: Words */}
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, backgroundColor: '#f1f8e9' }}>
                <Typography variant="h6" align="center">Mots</Typography>
                <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                  {shuffledRightItems.map(item => (
                    <ArcherElement key={item.id} id={item.id}>
                      <Paper
                        onClick={() => handleRightClick(item)}
                        sx={{
                          p: 1,
                          backgroundColor: '#c8e6c9',
                          cursor: 'pointer',
                          textAlign: 'center',
                          minWidth: '100px'
                        }}
                      >
                        {item.text}
                      </Paper>
                    </ArcherElement>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </ArcherContainer>
      </Grid>

      {/* Submit and reset buttons */}
      <Grid item xs={12} container spacing={2} justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Soumettre
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Réinitialiser
          </Button>
        </Grid>
      </Grid>

      {/* Display result */}
      {submitted && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#c8e6c9' }}>
            <Typography variant="h5" color="primary" gutterBottom align="center">
              Résultat
            </Typography>
            <Typography align="center">
              Vous avez {score} bonne(s) réponse(s) sur {leftItems.length}.
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default ExerciseImage;
