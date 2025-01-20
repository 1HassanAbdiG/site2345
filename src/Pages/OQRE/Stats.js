import React from 'react';
import { Box, Typography } from '@mui/material';

const Stats = ({ attempts, successes }) => {
  return (
    <Box
      id="stats"
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" component="div">
        Essais : <Typography component="span" color="primary">{attempts}</Typography>
      </Typography>
      <Typography variant="h6" component="div">
        Réussites : <Typography component="span" color="success.main">{successes}</Typography>
      </Typography>
    </Box>
  );
};

export default Stats;
