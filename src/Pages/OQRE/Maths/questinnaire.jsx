// src/components/Questionnaire.js
import React, { useState } from 'react';
import Part from './Part';
// import './Questionnaire.css'; // REMOVE THIS LINE
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

function Questionnaire({ data }) {
  const [responses, setResponses] = useState({});

  const handleAnswerChange = (questionId, answer) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: answer
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Final Responses:", responses);
    alert('Questionnaire Submitted! Check the console for responses.');
  };

  return (
    // Use Paper for the main container with background/shadow
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="h6" component="h2" color="text.secondary">
            {data.grade} - {data.cycle}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* General Instructions */}
        {data.instructions_general && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
             <Typography variant="h6" gutterBottom>Instructions Générales</Typography>
             {data.instructions_general.multiple_choice && (
               <>
                 <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Choix Multiple:</Typography>
                 <List dense disablePadding sx={{ pl: 2 }}>
                     {data.instructions_general.multiple_choice.map((instr, index) => (
                       <ListItem key={`mc-${index}`} sx={{ display: 'list-item', listStyleType: 'disc', p: 0 }}>
                         <ListItemText primary={instr} sx={{m:0}}/>
                       </ListItem>
                     ))}
                 </List>
               </>
             )}
              {data.instructions_general.constructed_response && (
                <>
                  <Typography variant="subtitle1" sx={{fontWeight: 'bold', mt: 1}}>Réponse Construite:</Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                      {data.instructions_general.constructed_response.map((instr, index) => (
                        <ListItem key={`cr-${index}`} sx={{ display: 'list-item', listStyleType: 'disc', p: 0}}>
                          <ListItemText primary={instr} sx={{m:0}}/>
                        </ListItem>
                      ))}
                  </List>
                 </>
              )}
           </Paper>
        )}


        {data.parts.map(part => (
          <Part
            key={part.id}
            partData={part}
            responses={responses}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button type="submit" variant="contained" size="large">
            Soumettre le questionnaire
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default Questionnaire;