// src/components/Part.js
import React from 'react';
import Section from './section';
// import './Part.css'; // REMOVE THIS LINE
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


function Part({ partData, responses, onAnswerChange }) {
  // Handle parts that might just be descriptions (like Part 2 example)
  if (partData.description) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 3, mt: 2, borderColor: 'grey.400', borderStyle: 'dashed' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {partData.title}
            </Typography>
            <Typography paragraph>{partData.description}</Typography>
            {partData.items_description && (
                <Box>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Description des items non diffusés:</Typography>
                    <List dense>
                        {partData.items_description.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemText primary={item} primaryTypographyProps={{fontSize: '0.9em', color: 'text.secondary'}} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
       </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}> {/* Spacing between parts */}
      <Typography
        variant="h5"
        component="h2"
        sx={{ bgcolor: 'grey.200', p: 1.5, borderRadius: 1, mb: 2 }}
      >
        {partData.title}
      </Typography>
      {partData.sections?.map((section, index) => (
        <React.Fragment key={section.id}>
          <Section
            sectionData={section}
            responses={responses}
            onAnswerChange={onAnswerChange}
          />
          {/* Add divider between sections if desired */}
          {index < partData.sections.length - 1 && <Divider sx={{ my: 2 }} />}
        </React.Fragment>
      ))}
    </Box>
  );
}

export default Part;