import React from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper // Optional: Can wrap sections or questions in Paper for a card-like look
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { green } from '@mui/material/colors';

// Helper function to get the option letter (a, b, c...)
const getOptionLetter = (index) => String.fromCharCode(97 + index);

function TestViewer({ testData }) {
  // Handle cases where testData is null, undefined, or empty
  if (!testData || !testData.sections || testData.sections.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Aucune donnée de test à afficher.
        </Typography>
      </Container>
    );
  }

  const { testTitle, sections } = testData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Main Title */}
      {testTitle && (
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
          {testTitle}
        </Typography>
      )}


      {/* Iterate through Sections */}
      {sections.map((section) => (
        <Box key={section.id} sx={{ mb: 6 }}>
          {/* Section Title */}
          {section.title && (
            <Typography variant="h4" component="h2" gutterBottom sx={{ borderBottom: 2, pb: 1, borderColor: 'primary.main' }}>
              {section.title}
            </Typography>
          )}


          {/* Iterate through Questions in the Section */}
          {section.questions && section.questions.map((question) => (
            // Wrap question in Paper for better visual separation (optional)
            // <Paper key={question.id} elevation={1} sx={{ mb: 2 }}>
            <Accordion key={question.id} sx={{ mb: 2, '&.Mui-expanded': { margin: '16px 0' } }}>
              {/* Accordion Summary (Question Info and Text) */}
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`question-${question.id}-content`}
                id={`question-${question.id}-header`}
              >
                 <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                   {/* Question Metadata */}
                   <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                     Question {question.id} {question.pageReference && `(Page ${question.pageReference})`} - {question.type === 'multipleChoice' ? 'Choix Multiple' : 'Réponse Ouverte'}
                   </Typography>
                   {/* Question Text */}
                   <Typography variant="body1" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' /* Preserve line breaks in text */ }}>
                     {question.questionText}
                   </Typography>
                 </Box>
              </AccordionSummary>

              {/* Accordion Details (Answer and Verification) */}
              <AccordionDetails>
                {/* Display based on Question Type */}
                {question.type === 'multipleChoice' && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Options :
                    </Typography>
                    <List dense disablePadding> {/* disablePadding makes list tighter */}
                      {question.options && question.options.map((option, index) => {
                        const optionLetter = getOptionLetter(index);
                        const isCorrect = question.correctAnswer === optionLetter;
                        return (
                          <ListItem
                            key={index}
                            disableGutters // Remove default horizontal padding
                            sx={{
                              border: 1,
                              borderColor: isCorrect ? green[500] : 'transparent',
                              backgroundColor: isCorrect ? green[50] : 'transparent',
                              borderRadius: 1,
                              mb: 0.5, // Margin bottom for spacing between options
                              py: 0.8, // Vertical padding
                              px: 1.5, // Horizontal padding inside item
                              display: 'flex', // Use flexbox for alignment
                              alignItems: 'center' // Align items vertically
                            }}
                          >
                             {/* Option Letter */}
                             <Typography variant="body2" sx={{ mr: 1.5, fontWeight: 'bold' }}>
                                {optionLetter.toUpperCase()}.
                             </Typography>
                            {/* Option Text */}
                            <ListItemText
                              primary={option}
                              primaryTypographyProps={{
                                color: isCorrect ? green[800] : 'text.primary',
                                fontWeight: isCorrect ? 'bold' : 'normal',
                              }}
                            />
                            {/* Correct Answer Icon */}
                            {isCorrect && (
                              <CheckCircleOutlineIcon sx={{ color: green[600], ml: 1, fontSize: '1.1rem' }} />
                            )}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                )}

                {question.type === 'openEnded' && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Réponse attendue / Critères d'évaluation :
                    </Typography>
                    {question.correctAnswer ? (
                       <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' /* Preserve line breaks */ }}>
                         {question.correctAnswer}
                       </Typography>
                    ) : (
                       <Typography variant="body2" color="text.secondary" fontStyle="italic">
                         Aucune réponse attendue spécifiée dans les données.
                       </Typography>
                    )}
                  </Box>
                )}

                {/* Display Verification if available */}
                {question.verification && (
                   <Box sx={{ mt: question.type === 'multipleChoice' || question.correctAnswer ? 2 : 0 }}> {/* Add margin top only if there's content above */}
                       <Typography variant="subtitle1" gutterBottom>
                          Vérification :
                       </Typography>
                       <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' /* Preserve line breaks */ }}>
                         {question.verification}
                       </Typography>
                   </Box>
                )}
                 {!question.options && question.type === 'multipleChoice' && (
                     <Typography variant="body2" color="error" fontStyle="italic">
                         Attention : Question de type Choix Multiple sans options spécifiées dans les données.
                     </Typography>
                 )}

              </AccordionDetails>
            </Accordion>
            // </Paper> // End Paper wrap
          ))}
        </Box>
      ))}
    </Container>
  );
}

export default TestViewer;