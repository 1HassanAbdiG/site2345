// OrdreQuestion.js
import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    List,
    ListItem,
    Paper
} from '@mui/material';
import { styled } from '@mui/system';


const DraggablePaper = styled(Paper)(({ theme, isDragging, isTarget, isSubmitted }) => ({ // Add isSubmitted prop
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    cursor: isSubmitted ? 'default' : 'grab', // Change cursor if submitted
    userSelect: 'none',
    textAlign: 'center',
    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    border: '1px solid',
    borderColor: isTarget ? theme.palette.primary.main : theme.palette.divider,
    backgroundColor: isDragging ? theme.palette.primary.light : theme.palette.background.paper,
    color: isDragging ? theme.palette.primary.contrastText : theme.palette.text.primary,
    boxShadow: isDragging ? theme.shadows[4] : theme.shadows[1],
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    // Optional: Dim or style items after submission
     ...(isSubmitted && {
         opacity: 0.8,
         pointerEvents: 'none', // Prevent dragging/dropping after submission
         borderColor: theme.palette.divider, // Reset border color
         backgroundColor: theme.palette.grey[100], // Subtle grey background
         boxShadow: 'none', // Remove shadow
     })
}));


function OrdreQuestion({ question, onAnswer }) {
  const [order, setOrder] = useState(question.fragments);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Add state

  const handleDragStart = (e, index) => {
    if (submitted) return; // Prevent dragging after submission
    setDraggingIndex(index);
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    if (submitted) return; // Prevent drag over effects after submission
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (submitted || draggingIndex === null) return; // Prevent drop after submission or if no drag active

    const newOrder = [...order];
    const [removed] = newOrder.splice(draggingIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    setOrder(newOrder);
    setDraggingIndex(null);
  };

   const handleDragEnd = () => {
       setDraggingIndex(null);
   };

  const handleValidation = () => {
    if (submitted) return; // Prevent multiple submissions

    setSubmitted(true); // Disable submission

    const isCorrect = JSON.stringify(order) === JSON.stringify(question.answer);

    setFeedback(isCorrect);

    onAnswer({
      correct: isCorrect,
      userAnswer: order
    });
  };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 4, fontWeight: 'medium' }}>
        {question.question}
      </Typography>

      <List sx={{ listStyle: 'none', padding: 0, mb: 4 }}>
        {order.map((item, index) => (
          <DraggablePaper
            key={item}
            draggable={!submitted} // Make items non-draggable after submission
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            isDragging={draggingIndex === index}
            isSubmitted={submitted} // Pass state for styling
          >
            <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'left' }}>
                <Box component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                    {index + 1}.
                </Box>
                 {item}
            </Typography>
          </DraggablePaper>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleValidation}
        disabled={submitted} // Disable button after submission
        sx={{ px: 4, mt: 2 }}
      >
        Valider l'ordre
      </Button>

      {feedback !== null && (
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            fontWeight: 'bold',
            color: feedback ? 'success.main' : 'error.main',
            textAlign: 'center',
            transition: 'color 0.3s ease-in-out'
          }}
        >
          {feedback ? '🎉 Correct !' : '❌ Ce n\'est pas le bon ordre...'}
        </Typography>
      )}
    </Box>
  );
}

export default OrdreQuestion;