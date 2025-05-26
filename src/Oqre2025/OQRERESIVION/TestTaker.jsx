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
  // Ensure both are arrays, handle null/undefined gracefully
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  // Compare sorted arrays to ignore order
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

// Helper to check if a classification item has been answered
const isClassificationItemAnswered = (itemAnswer) => {
    return itemAnswer !== undefined && itemAnswer !== ''; // Check if a category has been selected
};

// Helper to check if a classification question is fully answered
const isClassificationQuestionAnswered = (question, studentAnswerForQuestion) => {
    // If no items to classify, consider it answered (or N/A for answering progress)
    if (!question.itemsToClassify || question.itemsToClassify.length === 0) return true;
    // Not answered if no entry for the question yet, or if the entry is not an object/map
    if (!studentAnswerForQuestion || typeof studentAnswerForQuestion !== 'object') return false;
    // Check if every item within the classification question has received an answer
    return question.itemsToClassify.every((_, itemIndex) =>
        isClassificationItemAnswered(studentAnswerForQuestion[itemIndex])
    );
};

// Helper to determine if ANY answer attempt has been made for a question
const isQuestionAnswered = (question, studentAnswersMap) => {
    // Safely access the answer for the specific question ID
    const answer = studentAnswersMap ? studentAnswersMap[question.id] : undefined;

    if (question.type === 'multipleChoice') {
        // For standard MC (radio), check if an option value exists (is not empty string or undefined)
        // For multiple-correct MC (checkboxes), check if the answer is an array and has elements
        return Array.isArray(question.correctAnswer) // Check based on the correct answer format
            ? (Array.isArray(answer) && answer.length > 0)
            : (answer !== undefined && answer !== ''); // Check if a non-empty value exists
    } else if (question.type === 'openEnded') {
        // For open-ended, check if the text field has content (trim() checks for non-whitespace)
        return answer !== undefined && answer !== null && typeof answer === 'string' && answer.trim() !== '';
    } else if (question.type === 'classification') {
        // For classification, check if ALL items have been classified using the specific helper
        return isClassificationQuestionAnswered(question, answer);
    }
    // For any other type not explicitly handled, assume answered if there's any entry that isn't undefined or null
    return answer !== undefined && answer !== null;
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

    // Ensure testData and sections exist before processing
    if (testData && testData.sections) {
      testData.sections.forEach(section => {
        // Ensure questions exist in the section and is an array
        if (section.questions && Array.isArray(section.questions)) {
          qCount += section.questions.length;
          section.questions.forEach(question => {
            // Auto-scorable points calculation
            if (question.type === 'multipleChoice') {
                // Standard MC counts as 1 point
                // Multiple-correct MC also counts as 1 point (if perfectly correct)
                autoScorablePoints += 1;
            } else if (question.type === 'classification' && question.itemsToClassify && Array.isArray(question.itemsToClassify)) {
                 // Classification scores 1 point per item to classify
                 autoScorablePoints += question.itemsToClassify.length;
            }
            // Open-ended questions do not add to autoScorablePoints
          });
        }
      });
    }
    setTotalQuestions(qCount);
    setTotalAutoScorablePoints(autoScorablePoints);
    // Scroll to top on test load/reset
    window.scrollTo(0, 0);
  }, [testData]); // Depend on testData prop

  // Handle student answer change
  const handleAnswerChange = (questionId, answer, type) => {
     if (testState === 'submitted') return; // Prevent changes after submission

     if (type === 'multipleChoice' && Array.isArray(testData.sections.flatMap(s => s.questions).find(q => q.id === questionId)?.correctAnswer)) {
         // Handle multiple-correct MC (checkboxes)
         setStudentAnswers(prev => {
             const currentAnswers = Array.isArray(prev[questionId]) ? prev[questionId] : [];
             if (currentAnswers.includes(answer)) {
                 // Remove answer if already selected
                 return {
                     ...prev,
                     [questionId]: currentAnswers.filter(item => item !== answer)
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
                ...answer // Add/update the specific item answer { index: category }
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

  // Use optional chaining in case testData is null/undefined
  const { testTitle, sections } = testData || {};


  // Handle test submission
  const handleSubmit = () => {
      // Client-side validation: Prevent submission if not all questions are answered
      // The button is disabled, but this is an extra layer.
      // Recalculate answered count just before submission to be sure
      const currentAnsweredCount = sections && Array.isArray(sections) ? sections.reduce((count, section) => {
          if (!section.questions || !Array.isArray(section.questions)) return count;
          return count + section.questions.filter(q => isQuestionAnswered(q, studentAnswers)).length;
      }, 0) : 0;


      if (currentAnsweredCount !== totalQuestions) {
          console.warn("Cannot submit: Not all questions are answered.");
          // Optionally show a user-friendly message
          return;
      }

    let currentScore = 0;

    // Ensure testData and sections exist before processing
    if (sections) {
      sections.forEach(section => {
        // Ensure questions exist in the section and is an array
        if (section.questions && Array.isArray(section.questions)) {
          section.questions.forEach(question => {
            const studentAnswer = studentAnswers[question.id];
            const correctAnswer = question.correctAnswer; // Use correct answer for scoring verification

            if (question.type === 'multipleChoice') {
              // Score MC questions (1 point for correct answer/selection)
              if (Array.isArray(correctAnswer)) {
                 // Scoring for multiple-correct MC (Q16 type) - 1 point if PERFECTLY correct
                 // Check if studentAnswer is defined and is an array before comparing
                 if (Array.isArray(studentAnswer) && arraysAreEqual(studentAnswer, correctAnswer)) {
                    currentScore += 1;
                 }
              } else {
                 // Scoring for standard single-correct MC - 1 point if correct
                 // Check if studentAnswer is defined before comparing
                 if (studentAnswer !== undefined && studentAnswer === correctAnswer) {
                   currentScore += 1;
                 }
              }
            } else if (question.type === 'classification' && question.itemsToClassify && Array.isArray(question.itemsToClassify)) {
                // Scoring for classification - 1 point per correct item
                if (studentAnswer && typeof studentAnswer === 'object') { // Only score if the classification question has some valid answer entry
                    question.itemsToClassify.forEach((item, itemIndex) => {
                        // Check if the student classified this specific item and if it's correct
                        if (studentAnswer[itemIndex] !== undefined && studentAnswer[itemIndex] === item.correctCategory) {
                             currentScore += 1;
                        }
                    });
                }
            }
            // Open-ended questions are not scored automatically, they don't add to currentScore here
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
    // Scroll to top after submission
    window.scrollTo(0, 0);
  };

  // Calculate the number of answered questions for the summary display
  const answeredQuestionCount = sections && Array.isArray(sections) ? sections.reduce((count, section) => {
      if (!section.questions || !Array.isArray(section.questions)) return count;
      return count + section.questions.filter(q => isQuestionAnswered(q, studentAnswers)).length;
  }, 0) : 0; // Default to 0 if sections is not available or not an array

  // Determine if the test is complete (all questions answered)
  const isTestComplete = totalQuestions > 0 && answeredQuestionCount === totalQuestions;


  const isSubmitted = testState === 'submitted';

  // Handle cases where testData is null, undefined, or empty/invalid
  if (!testData || !sections || !Array.isArray(sections) || totalQuestions === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Aucune donnée de test à afficher ou test vide.
        </Typography>
      </Container>
    );
  }


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
            {/* Only show chip if there are questions to answer */}
            {totalQuestions > 0 && (
                 isTestComplete ? (
                      isSubmitted ? <Chip label="Completé et Soumis" color="success" size="small" /> : <Chip label="Toutes répondues" color="success" size="small" />
                 ) : (
                      <Chip label="Incomplet" color="warning" size="small" />
                 )
            )}
         </Typography>

         {/* Attempts */}
         <Typography variant="body1" sx={{ mb: 1 }}>
            Nombre de tentatives : <strong>{attempts}</strong>
         </Typography>

         {/* Score - Only shown after first submission if there are auto-scorable points */}
         {isSubmitted && totalAutoScorablePoints > 0 && (
            <Typography variant="body1" sx={{ mb: 1 }}>
               Score automatique (Questions auto-évaluées) : <strong>{currentAutoScore} / {totalAutoScorablePoints}</strong>
            </Typography>
         )}

         {/* First Attempt Score - Only shown after submission if applicable and there are auto-scorable points */}
         {isSubmitted && attempts > 0 && firstAttemptAutoScore !== null && totalAutoScorablePoints > 0 && (
             <Typography variant="body1">
                Score 1ère tentative : <strong>{firstAttemptAutoScore} / {totalAutoScorablePoints}</strong>
             </Typography>
         )}
          {/* Message if no auto-scorable questions exist */}
         {isSubmitted && totalAutoScorablePoints === 0 && (
              <Typography variant="body1" fontStyle="italic">
                  Aucune question à score automatique dans ce test.
              </Typography>
         )}

      </Box>
      {/* --- End Bilan Section --- */}


      {/* Iterate through Sections */}
      {sections.map((section) => (
        // Ensure section.id exists or provide a fallback key
        <Box key={section.id || `section-${section.title}`} sx={{ mb: 6 }}>
          {/* Section Title */}
          {section.title && (
            <Typography variant="h4" component="h2" gutterBottom sx={{ borderBottom: 2, pb: 1, borderColor: 'primary.main' }}>
              {section.title}
            </Typography>
          )}

          {/* Iterate through Questions in the Section */}
          {/* Corrected: Added 'index' parameter to the map callback */}
          {section.questions && Array.isArray(section.questions) && section.questions.map((question, index) => {
             // Get the student's answer for this question
             const studentAnswer = studentAnswers[question.id];

             // Determine if the question has received ANY answer entry
             const hasAnswered = isQuestionAnswered(question, studentAnswers); // Pass studentAnswers map

             // Determine correctness status for coloring AccordionSummary (only for auto-scored types)
             let summaryBgColor = 'inherit';
             let summaryExpandedBgColor = 'inherit';
             let summaryIcon = null;

             const isAutoScoredQuestion = question.type === 'multipleChoice' || question.type === 'classification';

             if (isSubmitted) {
                 if (isAutoScoredQuestion) {
                     let isPerfectlyCorrect = false; // Perfect score for the whole question

                     if (question.type === 'multipleChoice') {
                          // Perfect if student selection(s) exactly match correct answer(s)
                           // Ensure studentAnswer is defined and correct answer exists for comparison
                          isPerfectlyCorrect = Array.isArray(question.correctAnswer)
                               ? (Array.isArray(studentAnswer) && arraysAreEqual(studentAnswer, question.correctAnswer))
                               : (studentAnswer !== undefined && studentAnswer === question.correctAnswer);
                     } else if (question.type === 'classification' && question.itemsToClassify) {
                         // Perfect if ALL classification items are correct AND answered
                          isPerfectlyCorrect = hasAnswered && question.itemsToClassify.every((item, itemIndex) => studentAnswer?.[itemIndex] === item.correctCategory);
                     }

                     if (isPerfectlyCorrect) {
                         summaryBgColor = green[50];
                         summaryExpandedBgColor = green[100];
                         summaryIcon = <CheckCircleOutlineIcon sx={{ color: green[600] }} />;
                     } else if (hasAnswered) { // Answered but not perfectly correct
                         summaryBgColor = red[50];
                         summaryExpandedBgColor = red[100];
                          summaryIcon = <CancelOutlinedIcon sx={{ color: red[600] }} />;
                     } else { // Not answered in submitted state (or classification not fully answered)
                         summaryBgColor = orange[50];
                         summaryExpandedBgColor = orange[100];
                         summaryIcon = <HelpOutlineIcon sx={{ color: orange[600] }} />;
                     }
                 } else if (question.type === 'openEnded') {
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
                 }
             }
             // In 'answering' state, no background color change based on answer status


             // Determine if the accordion should default expanded in submitted state
             // Auto-expand if submitted AND (it's an auto-scored question || it's answered || it's open-ended)
             // This ensures results are visible for relevant questions upon submission
             const defaultExpanded = isSubmitted && (isAutoScoredQuestion || hasAnswered || question.type === 'openEnded');


            return (
              // Ensure question.id exists or provide a fallback key using the index
              <Accordion
                  key={question.id || `question-${section.id}-${index}`} // Using section.id and index as a fallback
                  defaultExpanded={defaultExpanded}
                  // Ensure Accordion doesn't collapse margins on expand, use specific classes/styles
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
                    // Padding to prevent icon overlap if needed
                    pr: summaryIcon ? 6 : 2, // Give more padding on the right if an icon is present
                  }}
                >
                   <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                     {/* Question Metadata */}
                     <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                       Question {question.id} {question.pageReference && `(Page ${question.pageReference})`}
                       {' '}
                       -
                       {' '}
                       {question.type === 'multipleChoice' ? 'Choix Multiple'
                        : question.type === 'openEnded' ? 'Réponse Ouverte'
                        : question.type === 'classification' ? 'Classification'
                        : question.type || 'Question'}
                     </Typography>
                     {/* Question Text */}
                     {/* Use whiteSpace: 'pre-wrap' to respect newlines in JSON text */}
                     <Typography variant="body1" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', mb: question.imageSrc ? 1.5 : 0 }}>
                       {question.questionText}
                     </Typography>
                     {/* --- Image Display --- */}
                     {question.imageSrc && (
                         <Box
                             component="img"
                             src={question.imageSrc}
                             alt={question.imageAlt || `Image pour la question ${question.id}`}
                             sx={{
                                 maxWidth: 'min(100%, 400px)', // Limit image size but allow shrinking
                                 height: 'auto',
                                 display: 'block',
                                 margin: '0 auto', // Center the image
                                 border: '1px solid #ddd',
                                 borderRadius: '4px',
                                 mt: 1, // Add margin top if text is present
                             }}
                         />
                     )}
                     {/* --- End Image Display --- */}
                   </Box>
                   {/* Status Icon in Submitted State */}
                   {isSubmitted && summaryIcon && (
                       <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                           {summaryIcon}
                       </Box>
                   )}
                </AccordionSummary>

                {/* Accordion Details (Answer Input or Results) */}
                <AccordionDetails sx={{ pt: 2 }}> {/* Add padding top */}
                  {/* --- Answering State --- */}
                  {!isSubmitted && (
                    <Box>
                       {/* Answering State - Multiple Choice (Standard and Multiple-Correct) */}
                       {question.type === 'multipleChoice' && question.options && Array.isArray(question.options) && (
                          <FormControl component="fieldset" fullWidth>
                              <FormLabel component="legend">Votre réponse :</FormLabel>
                              {Array.isArray(question.correctAnswer) ? ( // Multiple-correct MC (Checkboxes)
                                 <FormGroup>
                                    {question.options.map((option, optionIndex) => { // Use optionIndex for key
                                      const optionLetter = getOptionLetter(optionIndex);
                                      // Ensure studentAnswer is an array for checkbox state
                                      const currentStudentAnswers = Array.isArray(studentAnswer) ? studentAnswer : [];
                                      return (
                                        <FormControlLabel
                                          key={optionIndex}
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
                                   value={studentAnswer || ''} // Use '' for unselected state
                                   onChange={(event) => handleAnswerChange(question.id, event.target.value, question.type)}
                                   name={`question-${question.id}-options`}
                                 >
                                   {question.options.map((option, optionIndex) => { // Use optionIndex for key
                                     const optionLetter = getOptionLetter(optionIndex);
                                     return (
                                       <FormControlLabel
                                         key={optionIndex}
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
                        {question.type === 'openEnded' && (
                          <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend">Votre réponse :</FormLabel>
                            <TextField
                              multiline
                              rows={4}
                              fullWidth
                              value={studentAnswer || ''} // Use '' for empty state
                              onChange={(event) => handleAnswerChange(question.id, event.target.value, question.type)}
                              variant="outlined"
                              placeholder="Entrez votre réponse ici..."
                            />
                          </FormControl>
                        )}

                        {/* Answering State - Classification (Q10) */}
                        {question.type === 'classification' && question.itemsToClassify && Array.isArray(question.itemsToClassify) && question.categories && Array.isArray(question.categories) && (
                             <Box>
                                 <Typography variant="subtitle1" gutterBottom>
                                     Votre classification :
                                 </Typography>
                                 {question.itemsToClassify.map((item, itemIndex) => ( // Use itemIndex for key
                                     <Box key={itemIndex} sx={{ mb: 2, p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
                                         <Typography variant="body1" sx={{ mb: 1 }}>
                                             {item.expressions.join(' et ')} :
                                         </Typography>
                                         <FormControl component="fieldset">
                                             <FormLabel component="legend" sx={{ fontSize: '0.8rem', mb: 0.5 }}>Choisir la catégorie :</FormLabel>
                                             <RadioGroup
                                                 row
                                                 // Access the specific item's answer from the studentAnswers object for this question
                                                 value={studentAnswers[question.id]?.[itemIndex] || ''}
                                                 // The onChange handler needs to update the state for this specific item index
                                                 onChange={(event) => handleAnswerChange(question.id, { [itemIndex]: event.target.value }, question.type)}
                                                 name={`question-${question.id}-item-${itemIndex}`}
                                             >
                                                 {question.categories.map((category, catIndex) => ( // Use catIndex for key
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
                                 {!hasAnswered && question.itemsToClassify.length > 0 && (
                                      <Typography variant="body2" color="error" fontStyle="italic" sx={{mt: 1}}>
                                         Veuillez classer tous les éléments pour répondre à cette question.
                                      </Typography>
                                  )}
                             </Box>
                        )}
                    </Box>
                  )}


                  {/* --- Submitted State - Show Results --- */}
                  {isSubmitted && (
                      <Box>
                          {/* Submitted State - Multiple Choice Results */}
                          {question.type === 'multipleChoice' && question.options && Array.isArray(question.options) && (
                             <Box>
                               <Typography variant="subtitle1" gutterBottom>
                                 Options et Résultats :
                               </Typography>
                               <List dense disablePadding>
                                 {question.options.map((option, optionIndex) => { // Use optionIndex for key
                                   const optionLetter = getOptionLetter(optionIndex);
                                   // Handle both single and multiple-correct answer types consistently
                                   const isStudentSelected = Array.isArray(studentAnswer) ? studentAnswer.includes(optionLetter) : studentAnswer === optionLetter;
                                   const isCorrectOption = Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(optionLetter) : question.correctAnswer === optionLetter;

                                   let itemBgColor = 'transparent';
                                   let itemBorderColor = grey[400];
                                   let itemTextColor = grey[800];
                                   let itemIcon = null;

                                   if (isCorrectOption) {
                                        itemBgColor = green[50];
                                        itemBorderColor = green[500];
                                        itemTextColor = green[800];
                                        itemIcon = <CheckCircleOutlineIcon sx={{ color: green[600], ml: 1, fontSize: '1.1rem' }} />;
                                   } else if (isStudentSelected) { // Incorrectly selected
                                        itemBgColor = red[50];
                                        itemBorderColor = red[500];
                                        itemTextColor = red[800];
                                        itemIcon = <CancelOutlinedIcon sx={{ color: red[600], ml: 1, fontSize: '1.1rem' }} />;
                                   } else { // Not selected at all
                                        itemBgColor = grey[100];
                                        itemBorderColor = grey[300];
                                        itemTextColor = grey[700];
                                   }


                                   return (
                                     <ListItem
                                       key={optionIndex} // Use optionIndex for key
                                       disableGutters
                                       sx={{
                                         border: 1,
                                         borderColor: itemBorderColor,
                                         backgroundColor: itemBgColor,
                                         borderRadius: 1,
                                         mb: 0.5,
                                         py: 0.8,
                                         px: 1.5,
                                         display: 'flex',
                                         alignItems: 'center'
                                       }}
                                     >
                                        {/* Option Letter */}
                                        <Typography variant="body2" sx={{ mr: 1.5, fontWeight: 'bold', color: itemTextColor }}>
                                           {optionLetter.toUpperCase()}.
                                        </Typography>
                                       {/* Option Text */}
                                       <ListItemText
                                         primary={option}
                                         primaryTypographyProps={{
                                           color: itemTextColor,
                                           fontWeight: (isCorrectOption || isStudentSelected) ? 'bold' : 'normal',
                                         }}
                                       />
                                       {/* Icons */}
                                       {itemIcon}
                                     </ListItem>
                                   );
                                 })}
                               </List>
                                {/* Indicate if no answer was selected in submitted state */}
                                {isSubmitted && (!hasAnswered) ? (
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{mt: 1}}>
                                       Aucune réponse sélectionnée.
                                    </Typography>
                                ) : null}
                             </Box>
                           )}

                           {/* Submitted State - Open Ended Results */}
                           {isSubmitted && question.type === 'openEnded' && (
                             <Box>
                               <Typography variant="subtitle1" gutterBottom>
                                 Votre réponse :
                               </Typography>
                               {studentAnswer && typeof studentAnswer === 'string' && studentAnswer.trim() !== '' ? ( // Ensure studentAnswer is a non-empty string
                                  <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {studentAnswer}
                                  </Typography>
                               ) : (
                                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    Aucune réponse saisie.
                                  </Typography>
                               )}
                             </Box>
                           )}

                           {/* Submitted State - Classification Results */}
                           {isSubmitted && question.type === 'classification' && question.itemsToClassify && Array.isArray(question.itemsToClassify) && question.categories && Array.isArray(question.categories) && (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Résultats de classification :
                                    </Typography>
                                     {question.itemsToClassify.map((item, itemIndex) => { // Use itemIndex for key
                                         const studentClassification = studentAnswers[question.id]?.[itemIndex];
                                         const correctClassification = item.correctCategory;
                                         const isCorrectClassification = studentClassification === correctClassification;
                                         const hasAnsweredItem = isClassificationItemAnswered(studentClassification); // Check if THIS item is answered

                                         let itemBgColor = 'inherit';
                                         let itemBorderColor = grey[300];
                                         let resultTextColor = grey[800];
                                         let resultIcon = null;

                                         if (isSubmitted && hasAnsweredItem) {
                                              if (isCorrectClassification) {
                                                 itemBgColor = green[50];
                                                 itemBorderColor = green[500];
                                                 resultTextColor = green[800];
                                                 resultIcon = <CheckCircleOutlineIcon sx={{ color: green[600], ml: 1, fontSize: '1rem' }} />;
                                              } else {
                                                 itemBgColor = red[50];
                                                 itemBorderColor = red[500];
                                                 resultTextColor = red[800];
                                                 resultIcon = <CancelOutlinedIcon sx={{ color: red[600], ml: 1, fontSize: '1.1rem' }} />;
                                              }
                                         } else if (isSubmitted && !hasAnsweredItem) {
                                              itemBgColor = orange[50];
                                              itemBorderColor = orange[500];
                                         }


                                         return (
                                             <Box
                                                 key={itemIndex} // Use itemIndex for key
                                                 sx={{
                                                     mb: 2, p: 1.5, border: '1px solid', borderRadius: 1,
                                                     borderColor: itemBorderColor,
                                                     bgcolor: itemBgColor
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
                                                        color={resultTextColor}
                                                        sx={{ fontWeight: hasAnsweredItem ? 'bold' : 'normal', fontStyle: !hasAnsweredItem && isSubmitted ? 'italic' : 'normal' }}
                                                     >
                                                         {hasAnsweredItem ? studentClassification : (isSubmitted ? 'Pas de réponse' : '...')}
                                                     </Typography>
                                                     {isSubmitted && resultIcon}
                                                 </Box>
                                                 {/* Show correct answer if not answered or incorrect */}
                                                 {isSubmitted && (!hasAnsweredItem || !isCorrectClassification) && correctClassification && (
                                                     <Typography variant="body2" color={green[800]} sx={{ mt: 0.5, fontWeight: 'bold' }}>
                                                        Bonne réponse : {correctClassification}
                                                     </Typography>
                                                 )}
                                             </Box>
                                         );
                                     })}
                                      {/* Message only displayed if not fully answered in submitted state */}
                                      {isSubmitted && question.itemsToClassify.length > 0 && !hasAnswered && (
                                           <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{mt: 1}}>
                                              Question non entièrement répondue.
                                           </Typography>
                                       )}
                                </Box>
                           )}


                         {/* Display Verification (common for all types in submitted state) */}
                         {question.verification && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                   Vérification :
                                </Typography>
                                {/* Use whiteSpace: 'pre-wrap' to respect newlines in verification text */}
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {question.verification}
                                </Typography>
                            </Box>
                         )}
                       </Box>
                  )}

                </AccordionDetails>
              </Accordion>
            );
          })}
           {/* Message if a section has no questions */}
            {section.questions && Array.isArray(section.questions) && section.questions.length === 0 && (
                 <Typography variant="body1" color="text.secondary" fontStyle="italic" sx={{textAlign: 'center', mt: 2}}>
                     Cette section ne contient aucune question.
                 </Typography>
            )}
             {/* Message if section.questions is not an array or is null/undefined */}
             {!section.questions && (
                 <Typography variant="body1" color="text.secondary" fontStyle="italic" sx={{textAlign: 'center', mt: 2}}>
                     Aucune question trouvée pour cette section.
                 </Typography>
            )}
        </Box>
      ))}

      {/* Submit Button */}
      {/* Only show submit button if not submitted and there are questions to answer */}
      {!isSubmitted && totalQuestions > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            // Disable if not all questions are answered
            disabled={!isTestComplete}
            size="large"
          >
            Soumettre le test et voir les résultats
          </Button>
          {/* Message indicating how many questions are left to answer */}
           {!isTestComplete && (
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