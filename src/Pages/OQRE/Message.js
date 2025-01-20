import React from 'react';
import { Alert, Box } from '@mui/material';

const Message = ({ message, messageType }) => {
  // Détermine la couleur et le style de l'alerte en fonction du type de message
  const severity = messageType === 'success' 
    ? 'success' 
    : messageType === 'error' 
    ? 'error' 
    : messageType === 'info' 
    ? 'info' 
    : 'warning';

  return (
    <Box
      id="message"
      sx={{
        margin: '16px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Box>
  );
};

export default Message;
