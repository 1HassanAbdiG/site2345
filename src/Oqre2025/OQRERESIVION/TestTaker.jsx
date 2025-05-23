import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { green, red, grey, orange } from '@mui/material/colors';

// Helper function to get the option letter (a, b, c...)
const getOptionLetter = (index) => String.fromCharCode(97 + index);

// Helper function to compare arrays (for multiple correct answers)
const arraysAreEqual = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

// Helper to check if a classification item has been answered
const isClassificationItemAnswered = (itemAnswer) => {
    return itemAnswer !== undefined && itemAnswer !== '';
};

// Helper to check if a classification question is fully answered
const isClassificationQuestionAnswered = (question, studentAnswerForQuestion) => {
    if (!question.itemsToClassify || question.itemsToClassify.length === 0) return true; // Consider as answered if no items to classify
    if (!studentAnswerForQuestion) return false; // Not answered if no entry for the question yet
    // Check if every item within the classification question has received an answer
    return question.itemsToClassify.every((_, itemIndex) =>
        isClassificationItemAnswered(studentAnswerForQuestion[itemIndex])
    );
};


function TestTaker({ testData }) {
  const [studentAnswers, setStudentAnswers] = useState({});
  const [testState, setTestState] = useState('answering'); // States: 'answering', 'submitted'
  const [currentAutoScore, setCurrentAutoScore] = useState(0); // Score for auto-graded questions/items
  const [totalQuestions, setTotalQuestions] = useState(0); // Total count of all questions
  const [totalAutoScorablePoints, setTotalAutoScorablePoints] = useState(0); // Total possible points from auto-graded items
  const [attempts, setAttempts] = useState(0); // Number of submission attempts
  const [firstAttemptAutoScore, setFirstAttemptAutoScore] = useState(null); // Score of the first attempt

  // Reset state and calculate totals when testData changes
  useEffect(() => {
    setStudentAnswers({});
    setTestState('answering');
    setCurrentAutoScore(0);
    setAttempts(0);
    setFirstAttemptAutoScore(null);

    let qCount = 0;
    let autoScorablePoints = 0;

    if (testData && testData.sections) {
      testData.sections.forEach(section => {
        if (section.questions) {
          qCount += section.questions.length;
          section.questions.forEach(question => {
            // Auto-scorable points calculation remains the same
            if (question.type === 'multipleChoice') {
                autoScorablePoints += 1;
            } else if (question.type === 'classification' && question.itemsToClassify) {
                 autoScorablePoints += question.itemsToClassify.length;
            }
          });
        }
      });
    }
    setTotalQuestions(qCount);
    setTotalAutoScorablePoints(autoScorablePoints);
    window.scrollTo(0, 0);
  }, [testData]);

  // Determine if the question has received ANY answer entry in studentAnswers (doesn't check correctness)
  const isQuestionAnswered = (question) => {
      const answer = studentAnswers[question.id];
       if (question.type === 'multipleChoice') {
           // For standard MC, check if an option is selected
           // For multiple-correct MC (checkboxes), check if the answer array is not empty
           return Array.isArray(question.correctAnswer) ? (Array.isArray(answer) && answer.length > 0) : (answer !== undefined && answer !== '');
       } else if (question.type === 'openEnded') {
           // For open-ended, check if the text field has content (trim() is good for non-empty check)
           return answer !== undefined && answer !== null && answer.trim() !== '';
       } else if (question.type === 'classification') {
           // For classification, check if ALL items have been classified
           return isClassificationQuestionAnswered(question, answer);
       }
       // For any other type not explicitly handled, assume answered if there's any entry
       return answer !== undefined;
  };


  // Handle student answer change
  const handleAnswerChange = (questionId, answer, type) => {
     if (type === 'multipleChoice' && Array.isArray(testData.sections.flatMap(s => s.questions).find(q => q.id === questionId)?.correctAnswer)) {
         // Handle multiple-correct MC (checkboxes)
         setStudentAnswers(prev => {
             const currentAnswers = Array.isArray(prev[questionId]) ? prev[questionId] : [];
             if (currentAnswers.includes(answer)) {
                 // Remove answer if already selected
                 const newAnswers = currentAnswers.filter(item => item !== answer);
                 // If the answer array becomes empty, ensure the entry still exists but is empty
                 // This helps the `isQuestionAnswered` logic for checkboxes
                 return {
                     ...prev,
                     [questionId]: newAnswers
                 };
             } else {
                 // Add answer if not selected
                 return {
                     ...prev,
                     [questionId]: [...currentAnswers, answer]
                 };
             }
         });
     } else if (type === 'classification') {
         // Handle classification (RadioGroup per item)
         // answer structure here is { itemIndex: selectedCategory }
          setStudentAnswers(prev => ({
             ...prev,
             [questionId]: {
                ...(prev[questionId] || {}), // Keep previous item answers for this question
                ...answer // Add/update the specific item answer
             }
         }));

     } else {
         // Handle standard MC (radio) and Open Ended (text)
         setStudentAnswers({
           ...studentAnswers,
           [questionId]: answer,
         });
     }
  };
  const { testTitle, sections } = testData;

  // Handle test submission
  const handleSubmit = () => {
      // Prevent submission if not all questions are answered (client-side validation)
      // The button is also disabled, but this is an extra layer
      if (answeredQuestionCount !== totalQuestions) {
          console.warn("Cannot submit: Not all questions are answered.");
          return;
      }

    let currentScore = 0;

    if (testData && testData.sections) {
      testData.sections.forEach(section => {
        if (section.questions) {
          section.questions.forEach(question => {
            const studentAnswer = studentAnswers[question.id];
            const correctAnswer = question.correctAnswer;

            if (question.type === 'multipleChoice') {
              if (Array.isArray(correctAnswer)) {
                 // Scoring for multiple-correct MC (Q16 type) - 1 point if PERFECTLY correct
                 if (arraysAreEqual(studentAnswer, correctAnswer)) {
                    currentScore += 1;
                 }
              } else {
                 // Scoring for standard single-correct MC - 1 point if correct
                 if (studentAnswer !== undefined && studentAnswer === correctAnswer) {
                   currentScore += 1;
                 }
              }
            } else if (question.type === 'classification' && question.itemsToClassify) {
                // Scoring for classification - 1 point per correct item
                if (studentAnswer) { // Only score if the question has an entry (should be true if answered)
                    question.itemsToClassify.forEach((item, itemIndex) => {
                        if (studentAnswer[itemIndex] === item.correctCategory) {
                            currentScore += 1;
                        }
                    });
                }
            }
            // Open-ended questions are not scored automatically
          });
        }
      });
    }

    setCurrentAutoScore(currentScore);
    setAttempts(prev => prev + 1);
    if (firstAttemptAutoScore === null) {
        setFirstAttemptAutoScore(currentScore);
    }
    setTestState('submitted');
    window.scrollTo(0, 0);
  };

  // Calculate the number of answered questions for the summary
  const answeredQuestionCount = sections.reduce((count, section) => {
      if (!section.questions) return count;
      return count + section.questions.filter(q => isQuestionAnswered(q)).length;
  }, 0);


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


  const isSubmitted = testState === 'submitted';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Main Title */}
      {testTitle && (
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
          {testTitle}
        </Typography>
      )}

      {/* --- Bilan Section --- */}
      <Box sx={{ mb: 6, p: 3, bgcolor: grey[200], borderRadius: 2 }}>
         <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, pb: 1, borderColor: grey[400] }}>
            Bilan du Test
         </Typography>

         {/* "All Answered" Status */}
         <Typography variant="body1" sx={{ mb: 1 }}>
            Questions répondues : <strong>{answeredQuestionCount} / {totalQuestions}</strong>
            {' '}
            {answeredQuestionCount === totalQuestions ? (
                 <Chip label="Toutes répondues" color="success" size="small" />
            ) : (
                 <Chip label="Incomplet" color="warning" size="small" />
            )}
         </Typography>

         {/* Attempts */}
         <Typography variant="body1" sx={{ mb: 1 }}>
            Nombre de tentatives : <strong>{attempts}</strong>
         </Typography>

         {/* Score */}
         {totalAutoScorablePoints > 0 && (
            <Typography variant="body1" sx={{ mb: 1 }}>
               Score automatique (Questions auto-évaluées) : <strong>{currentAutoScore} / {totalAutoScorablePoints}</strong>
            </Typography>
         )}

         {/* First Attempt Score */}
         {attempts > 0 && firstAttemptAutoScore !== null && totalAutoScorablePoints > 0 && (
             <Typography variant="body1">
                Score 1ère tentative : <strong>{firstAttemptAutoScore} / {totalAutoScorablePoints}</strong>
             </Typography>
         )}
         {totalAutoScorablePoints === 0 && (
              <Typography variant="body1" fontStyle="italic">
                  Aucune question à score automatique dans ce test.
              </Typography>
         )}

      </Box>
      {/* --- End Bilan Section --- */}


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
          {section.questions && section.questions.map((question) => {
             // Get the student's answer for this question
             const studentAnswer = studentAnswers[question.id];

             // Determine correctness status for coloring AccordionSummary (only for auto-scored types for simplicity)
             let summaryBgColor = 'inherit';
             let summaryExpandedBgColor = 'inherit';
             let summaryIcon = null;

             const isAutoScoredQuestion = question.type === 'multipleChoice' || question.type === 'classification';
             const hasAnswered = isQuestionAnswered(question); // Use the helper to check if answered

             if (isSubmitted && isAutoScoredQuestion) {
                 let isCorrect = false;
                 if (question.type === 'multipleChoice') {
                      isCorrect = Array.isArray(question.correctAnswer) ? arraysAreEqual(studentAnswer, question.correctAnswer) : (studentAnswer !== undefined && studentAnswer === question.correctAnswer);
                 } else if (question.type === 'classification' && question.itemsToClassify) {
                     // For classification, check if *all* items are correct to color the summary green
                      isCorrect = hasAnswered && question.itemsToClassify.every((item, itemIndex) => studentAnswer?.[itemIndex] === item.correctCategory);
                 }


                 if (isCorrect) {
                     summaryBgColor = green[50];
                     summaryExpandedBgColor = green[100];
                     summaryIcon = <CheckCircleOutlineIcon sx={{ color: green[600] }} />;
                 } else if (hasAnswered) { // Incorrect, but answered
                     summaryBgColor = red[50];
                     summaryExpandedBgColor = red[100];
                      summaryIcon = <CancelOutlinedIcon sx={{ color: red[600] }} />;
                 } else { // Not answered in submitted state
                     summaryBgColor = orange[50];
                     summaryExpandedBgColor = orange[100];
                     summaryIcon = <HelpOutlineIcon sx={{ color: orange[600] }} />;
                 }
             } else if (isSubmitted && question.type === 'openEnded') {
                  // For open-ended, just indicate if answered or not in submitted state
                   if (hasAnswered) {
                       summaryBgColor = grey[100]; // Neutral color for answered OE
                       summaryExpandedBgColor = grey[200];
                       // No specific icon for correctness, as it's not auto-scored
                   } else { // Not answered
                       summaryBgColor = orange[50];
                       summaryExpandedBgColor = orange[100];
                       summaryIcon = <HelpOutlineIcon sx={{ color: orange[600] }} />;
                   }
             } else if (!isSubmitted && !hasAnswered) {
                  // Not answered in answering state - optional visual cue
                 // summaryIcon = <HelpOutlineIcon sx={{ color: grey[500] }} />;
             }


             // Determine if the accordion should default expanded in submitted state
             // Auto-expand if submitted AND (it's an auto-scored question || it's answered || it's open-ended)
             const defaultExpanded = isSubmitted && (isAutoScoredQuestion || hasAnswered || question.type === 'openEnded');


            return (
              <Accordion
                  key={question.id}
                  defaultExpanded={defaultExpanded}
                  sx={{ mb: 2, '&.Mui-expanded': { margin: '16px 0' } }}
              >
                {/* Accordion Summary (Question Info, Text, Image, and Status Icon) */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`question-${question.id}-content`}
                  id={`question-${question.id}-header`}
                  sx={{
                    bgcolor: summaryBgColor,
                    '&.Mui-expanded': {
                       bgcolor: summaryExpandedBgColor,
                    },
                    position: 'relative', // Needed for absolute positioning of the icon
                  }}
                >
                   <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', pr: summaryIcon ? 4 : 0 }}>
                     {/* Question Metadata */}
                     <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                       Question {question.id} {question.pageReference && `(Page ${question.pageReference})`} - {question.type === 'multipleChoice' ? 'Choix Multiple' : question.type === 'openEnded' ? 'Réponse Ouverte' : question.type}
                     </Typography>
                     {/* Question Text */}
                     <Typography variant="body1" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', mb: question.imageSrc ? 1.5 : 0 }}>
                       {question.questionText}
                     </Typography>
                     {/* --- Image Display --- */}
                     {question.imageSrc && (
                         <Box
                             component="img"
                             src={question.imageSrc}
                             alt={question.imageAlt || `Image for question ${question.id}`}
                             sx={{
                                 maxWidth: '100%',
                                 height: 'auto',
                                 display: 'block',
                                 margin: '0 auto',
                                 border: '1px solid #ddd',
                                 borderRadius: '4px',
                             }}
                         />
                     )}
                     {/* --- End Image Display --- */}
                   </Box>
                   {/* Status Icon in Submitted State */}
                   {isSubmitted && summaryIcon && (
                       <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
                           {summaryIcon}
                       </Box>
                   )}
                </AccordionSummary>

                {/* Accordion Details (Answer Input or Results) */}
                <AccordionDetails>
                  {/* Answering State - Multiple Choice (Standard and Multiple-Correct) */}
                  {!isSubmitted && question.type === 'multipleChoice' && question.options && (
                     <FormControl component="fieldset" fullWidth>
                         <FormLabel component="legend">Votre réponse :</FormLabel>
                         {Array.isArray(question.correctAnswer) ? ( // Multiple-correct MC (Checkboxes)
                            <FormGroup>
                               {question.options.map((option, index) => {
                                 const optionLetter = getOptionLetter(index);
                                 // Ensure studentAnswer is an array for checkbox state
                                 const currentStudentAnswers = Array.isArray(studentAnswer) ? studentAnswer : [];
                                 return (
                                   <FormControlLabel
                                     key={index}
                                     control={
                                       <Checkbox
                                          checked={currentStudentAnswers.includes(optionLetter)}
                                          onChange={() => handleAnswerChange(question.id, optionLetter, question.type)}
                                       />
                                     }
                                     label={`${optionLetter.toUpperCase()}. ${option}`}
                                   />
                                 );
                               })}
                            </FormGroup>
                         ) : ( // Standard single-correct MC (Radio)
                            <RadioGroup
                              value={studentAnswer || ''}
                              onChange={(event) => handleAnswerChange(question.id, event.target.value, question.type)}
                              name={`question-${question.id}-options`}
                            >
                              {question.options.map((option, index) => {
                                const optionLetter = getOptionLetter(index);
                                return (
                                  <FormControlLabel
                                    key={index}
                                    value={optionLetter}
                                    control={<Radio />}
                                    label={`${optionLetter.toUpperCase()}. ${option}`}
                                  />
                                );
                              })}
                            </RadioGroup>
                         )}
                       </FormControl>
                  )}

                   {/* Answering State - Open Ended */}
                   {!isSubmitted && question.type === 'openEnded' && (
                     <FormControl component="fieldset" fullWidth>
                       <FormLabel component="legend">Votre réponse :</FormLabel>
                       <TextField
                         multiline
                         rows={4}
                         fullWidth
                         value={studentAnswer || ''}
                         onChange={(event) => handleAnswerChange(question.id, event.target.value, question.type)}
                         variant="outlined"
                         placeholder="Entrez votre réponse ici..."
                       />
                     </FormControl>
                   )}

                   {/* Answering State - Classification (Q10) */}
                   {!isSubmitted && question.type === 'classification' && question.itemsToClassify && question.categories && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Votre classification :
                            </Typography>
                            {question.itemsToClassify.map((item, itemIndex) => (
                                <Box key={itemIndex} sx={{ mb: 2, p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {item.expressions.join(' et ')} :
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend" sx={{ fontSize: '0.8rem', mb: 0.5 }}>Choisir la catégorie :</FormLabel>
                                        <RadioGroup
                                            row
                                            value={studentAnswers[question.id]?.[itemIndex] || ''}
                                            onChange={(event) => handleAnswerChange(question.id, { [itemIndex]: event.target.value }, question.type)}
                                            name={`question-${question.id}-item-${itemIndex}`}
                                        >
                                            {question.categories.map((category, catIndex) => (
                                                <FormControlLabel
                                                    key={catIndex}
                                                    value={category}
                                                    control={<Radio size="small" />}
                                                    label={category}
                                                    sx={{ mr: 3 }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            ))}
                            {/* Message only displayed if not fully answered in answering state */}
                            {!isSubmitted && !isClassificationQuestionAnswered(question, studentAnswer) && question.itemsToClassify.length > 0 && (
                                 <Typography variant="body2" color="error" fontStyle="italic" sx={{mt: 1}}>
                                    Veuillez classer tous les éléments pour répondre à cette question.
                                 </Typography>
                             )}
                        </Box>
                   )}


                  {/* Submitted State - Show Results - Multiple Choice */}
                  {isSubmitted && question.type === 'multipleChoice' && question.options && (
                     <Box>
                       <Typography variant="subtitle1" gutterBottom>
                         Options :
                       </Typography>
                       <List dense disablePadding>
                         {question.options.map((option, index) => {
                           const optionLetter = getOptionLetter(index);
                           const isStudentSelected = Array.isArray(studentAnswer) ? studentAnswer.includes(optionLetter) : studentAnswer === optionLetter;
                           const isCorrectOption = Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(optionLetter) : question.correctAnswer === optionLetter;

                           return (
                             <ListItem
                               key={index}
                               disableGutters
                               sx={{
                                 border: 1,
                                 borderColor: isCorrectOption ? green[500] : (isStudentSelected ? red[500] : grey[400]),
                                 backgroundColor: isCorrectOption ? green[50] : (isStudentSelected ? red[50] : 'transparent'),
                                 borderRadius: 1,
                                 mb: 0.5,
                                 py: 0.8,
                                 px: 1.5,
                                 display: 'flex',
                                 alignItems: 'center'
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
                                   color: isCorrectOption ? green[800] : (isStudentSelected ? red[800] : grey[800]),
                                   fontWeight: (isCorrectOption || isStudentSelected) ? 'bold' : 'normal',
                                 }}
                               />
                               {/* Icons */}
                               {isCorrectOption && <CheckCircleOutlineIcon sx={{ color: green[600], ml: 1, fontSize: '1.1rem' }} />}
                               {isStudentSelected && !isCorrectOption && <CancelOutlinedIcon sx={{ color: red[600], ml: 1, fontSize: '1.1rem' }} />}
                             </ListItem>
                           );
                         })}
                       </List>
                        {isSubmitted && (studentAnswer === undefined || (Array.isArray(studentAnswer) && studentAnswer.length === 0)) ? ( // Indicate if no answer was selected in submitted state
                            <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{mt: 1}}>
                               Aucune réponse sélectionnée.
                            </Typography>
                        ) : null}
                     </Box>
                   )}

                  {isSubmitted && question.type === 'openEnded' && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Votre réponse :
                      </Typography>
                      {studentAnswer && studentAnswer.trim() !== '' ? (
                         <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                           {studentAnswer}
                         </Typography>
                      ) : (
                         <Typography variant="body2" color="text.secondary" fontStyle="italic">
                           Aucune réponse saisie.
                         </Typography>
                      )}


                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Réponse attendue / Critères d'évaluation :
                        </Typography>
                         {question.correctAnswer ? (
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                              {question.correctAnswer}
                            </Typography>
                         ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              Aucune réponse attendue spécifiée dans les données.
                            </Typography>
                         )}
                      </Box>
                    </Box>
                  )}

                   {isSubmitted && question.type === 'classification' && question.itemsToClassify && question.categories && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Votre classification :
                            </Typography>
                             {question.itemsToClassify.map((item, itemIndex) => {
                                 const studentClassification = studentAnswers[question.id]?.[itemIndex];
                                 const correctClassification = item.correctCategory;
                                 const isCorrectClassification = studentClassification === correctClassification;
                                 const hasAnsweredItem = isClassificationItemAnswered(studentClassification); // Check if THIS item is answered

                                 return (
                                     <Box
                                         key={itemIndex}
                                         sx={{
                                             mb: 2, p: 1.5, border: '1px solid #eee', borderRadius: 1,
                                             bgcolor: isSubmitted && isCorrectClassification && hasAnsweredItem ? green[50] : (isSubmitted && !isCorrectClassification && hasAnsweredItem ? red[50] : 'inherit')
                                         }}
                                     >
                                         <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                             {item.expressions.join(' et ')} :
                                         </Typography>
                                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                             <Typography variant="body2" sx={{ mr: 1 }}>
                                                 Votre choix :
                                             </Typography>
                                             <Typography
                                                variant="body2"
                                                color={isSubmitted && isCorrectClassification && hasAnsweredItem ? green[800] : (isSubmitted && !isCorrectClassification && hasAnsweredItem ? red[800] : grey[800])}
                                                sx={{ fontWeight: 'bold', fontStyle: !hasAnsweredItem && isSubmitted ? 'italic' : 'normal' }}
                                             >
                                                 {hasAnsweredItem ? studentClassification : (isSubmitted ? 'Pas de réponse' : '...') }
                                             </Typography>
                                             {isSubmitted && hasAnsweredItem && (
                                                 isCorrectClassification ? (
                                                     <CheckCircleOutlineIcon sx={{ color: green[600], ml: 1, fontSize: '1rem' }} />
                                                 ) : (
                                                     <CancelOutlinedIcon sx={{ color: red[600], ml: 1, fontSize: '1rem' }} />
                                                 )
                                             )}
                                         </Box>
                                         {isSubmitted && (!hasAnsweredItem || !isCorrectClassification) && correctClassification && ( // Show correct answer if not answered or incorrect
                                             <Typography variant="body2" color={green[800]} sx={{ mt: 0.5 }}>
                                                Bonne réponse : {correctClassification}
                                             </Typography>
                                         )}
                                     </Box>
                                 );
                             })}
                              {/* Message only displayed if not fully answered in submitted state */}
                              {isSubmitted && question.itemsToClassify.length > 0 && !isClassificationQuestionAnswered(question, studentAnswer) && (
                                   <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{mt: 1}}>
                                      Question non entièrement répondue.
                                   </Typography>
                               )}
                        </Box>
                   )}


                  {/* Display Verification if available (in submitted state) */}
                  {isSubmitted && question.verification && (
                     <Box sx={{ mt: (question.type === 'multipleChoice' || question.type === 'openEnded' || question.type === 'classification') ? 2 : 0 }}>
                         <Typography variant="subtitle1" gutterBottom>
                            Vérification :
                         </Typography>
                         <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                           {question.verification}
                         </Typography>
                     </Box>
                  )}

                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}

      {/* Submit Button */}
      {!isSubmitted && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            // Disable if not all questions are answered
            disabled={answeredQuestionCount !== totalQuestions}
          >
            Soumettre le test et voir les résultats
          </Button>
          {/* Message indicating how many questions are left to answer */}
           {!isSubmitted && answeredQuestionCount !== totalQuestions && (
               <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                  Répondez à toutes les questions ({totalQuestions - answeredQuestionCount} restante{totalQuestions - answeredQuestionCount > 1 ? 's' : ''}) pour soumettre.
               </Typography>
           )}
        </Box>
      )}


       {/* Message if no questions at all */}
       {testData && (!testData.sections || !testData.sections.some(s => s.questions && s.questions.length > 0)) && (
            <Typography variant="body1" color="text.secondary" sx={{textAlign: 'center', mt: 4}}>
                Aucune question n'est disponible dans ce test.
            </Typography>
       )}

    </Container>
  );
}

export default TestTaker;