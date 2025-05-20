import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Bilan({ stats }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Bilan de l'activité
      </Typography>
      {Object.entries(stats).map(([storyId, result]) => (
        <Paper key={storyId} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{result.title}</Typography>
          <Typography>Nombre de tentatives : {result.attempts}</Typography>
          <Typography>Premier essai : {result.firstTry}</Typography>
          <Typography>Meilleure note : {result.best}</Typography>
          <Typography>Pire note : {result.worst}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default Bilan;
