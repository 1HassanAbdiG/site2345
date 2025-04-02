import React from 'react';
import { Button, Stack } from '@mui/material'; // Import des composants Material-UI

const Buttons = ({ checkOrder, restartGame }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={checkOrder}
      >
        Vérifier l'ordre
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={restartGame}
      >
        Recommencer
      </Button>
    </Stack>
  );
};

export default Buttons;
