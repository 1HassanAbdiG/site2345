import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  
} from '@mui/material';
import { blue, green, red, grey } from '@mui/material/colors';
import data from './orth.json'; // Import the JSON data
//import sentencesData from './phrasepositive.json'; // Import your JSON data
//import NegativeSentenceBuilder from './phrasep';
////import { DndProvider } from 'react-dnd';
//import { HTML5Backend } from 'react-dnd-html5-backend';
////import Orthographeaa from './Orthographeaa';

const PhraseTable = () => {

   

  // Ensure data structure is valid
  const phrases = data?.data?.phrases || [];
  const questions = data?.data?.questions || [];

  const [scores, setScores] = useState(Array(phrases.length).fill(null)); // Scores for phrases
  const [quizScores, setQuizScores] = useState(Array(questions.length).fill(null)); // Scores for the quiz
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null)); // Track selected answers
  const [selectedTypes, setSelectedTypes] = useState(Array(phrases.length).fill([])); // Track selected types for phrases
  const [showScore, setShowScore] = useState(false); // Show total score

  // Handle checkbox selection for phrase classification
  const handleCheck = (phraseIndex, type) => {
    setSelectedTypes((prevSelectedTypes) => {
      const updatedTypes = [...prevSelectedTypes[phraseIndex]];

      // Toggle the type selection
      if (updatedTypes.includes(type)) {
        updatedTypes.splice(updatedTypes.indexOf(type), 1); // Remove the type if it's already selected
      } else {
        updatedTypes.push(type); // Add the type if it's not selected
      }

      const correctTypes = phrases[phraseIndex]?.types || [];
      const isCorrect = updatedTypes.every((type) => correctTypes.includes(type)) &&
        updatedTypes.length === correctTypes.length; // Check if all selected types are correct

      setScores((prevScores) =>
        prevScores.map((score, index) =>
          index === phraseIndex ? (isCorrect ? 1 : 0) : score
        )
      );

      return prevSelectedTypes.map((types, index) => index === phraseIndex ? updatedTypes : types);
    });
  };

  // Handle quiz answers
  const handleQuizAnswer = (questionIndex, selectedOption) => {
    const correctAnswer = questions[questionIndex]?.correctAnswer;
    const isCorrect = selectedOption === correctAnswer;

    // Update quiz score and selected answers
    setQuizScores((prevScores) =>
      prevScores.map((score, index) =>
        index === questionIndex ? (isCorrect ? 1 : 0) : score
      )
    );
    setSelectedAnswers((prevAnswers) =>
      prevAnswers.map((answer, index) => (index === questionIndex ? selectedOption : answer))
    );
  };

  // Calculate total score
  const calculateTotalScore = () => {
    const phraseScore = scores.reduce((total, score) => total + (score || 0), 0);
    const quizScore = quizScores.reduce((total, score) => total + (score || 0), 0);
    return phraseScore + quizScore;
  };

  // Reset all scores and inputs
  const resetState = () => {
    setScores(Array(phrases.length).fill(null)); // Reset phrase scores
    setQuizScores(Array(questions.length).fill(null)); // Reset quiz scores
    setSelectedAnswers(Array(questions.length).fill(null)); // Reset quiz answers
    setSelectedTypes(Array(phrases.length).fill([])); // Reset selected types for phrases
    setShowScore(false); // Hide the score
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'url("/imag/pagescahier.jpg")', // Simulate a paper texture background
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Title */}
      <Typography variant="h3" align="center" color={blue[800]} gutterBottom>
        Feuille de Devoir : Classification des Phrases et Quiz
      </Typography>

      {/* Phrase Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4, borderRadius: 3, boxShadow: 2, backgroundColor: grey[50] }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: blue[700] }}><strong>Phrase</strong></TableCell>
              {['déclarative', 'exclamative', 'interrogative', 'impérative'].map((type) => (
                <TableCell key={type} align="center" sx={{ fontWeight: 'bold', color: blue[700] }}>
                  {type}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {phrases.map((phrase, index) => (
              <TableRow
                key={phrase.id}
                sx={{
                  '&:hover': {
                    backgroundColor: blue[50],
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{phrase.phrase}</TableCell>
                {['déclarative', 'exclamative', 'interrogative', 'impérative'].map((type) => (
                  <TableCell align="center" key={type}>
                    <Checkbox
                      checked={selectedTypes[index]?.includes(type)} // Show as checked if the type is selected
                      onChange={() => handleCheck(index, type)}
                      disabled={scores[index] !== null} // Disable after selection
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Quiz */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" color={green[800]} gutterBottom>
          Quiz : Choisissez la bonne réponse
        </Typography>
        {questions.map((question, index) => (
          <Box key={question.id} sx={{ marginBottom: 3, border: `1px solid ${grey[300]}`, padding: 2, borderRadius: 2 }}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ color: blue[900], fontWeight: 'bold' }}>
                {question.question}
              </FormLabel>
              <RadioGroup
                value={selectedAnswers[index] ?? ''}
                onChange={(e) => handleQuizAnswer(index, e.target.value)}
              >
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={optionIndex.toString()}
                    control={
                      <Radio
                        sx={{
                          color: blue[600],
                          '&.Mui-checked': {
                            color: green[600],
                          },
                        }}
                      />
                    }
                    label={option}
                    disabled={quizScores[index] !== null} // Disable after selection
                    sx={{
                      '&:hover': {
                        backgroundColor: blue[50],
                        cursor: 'pointer',
                      },
                      marginBottom: 1,
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowScore(true)}
          sx={{
            '&:hover': {
              backgroundColor: green[700],
            },
            padding: '12px 24px',
            fontSize: '1.2rem',
          }}
        >
          Afficher le score
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetState}
          sx={{
            '&:hover': {
              backgroundColor: red[200],
            },
            padding: '12px 24px',
            fontSize: '1.2rem',
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Final Score */}
      {showScore && (
        <Box
          sx={{
            backgroundColor: '#e3f2fd',
            padding: 3,
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: 5,
            marginTop: 4,
          }}
        >
          <Typography variant="h5" color={blue[900]} gutterBottom>
            Bilan des Résultats
          </Typography>

          {/* Phrase Classification Score */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" color={blue[700]}>
              Score des Phrases : {scores.filter((score) => score === 1).length} / {phrases.length}
            </Typography>
            <Typography variant="body1" color={grey[700]}>
              Vous avez correctement classé {scores.filter((score) => score === 1).length} phrase(s).
            </Typography>
          </Box>

          {/* Quiz Score */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" color={blue[700]}>
              Score du Quiz : {quizScores.filter((score) => score === 1).length} / {questions.length}
            </Typography>
            <Typography variant="body1" color={grey[700]}>
              Vous avez répondu correctement à {quizScores.filter((score) => score === 1).length} question(s).
            </Typography>
          </Box>

          {/* Total Score */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" color={blue[700]}>
              Score Total : {calculateTotalScore()} / {phrases.length + questions.length}
            </Typography>
            <Typography variant="body1" color={grey[700]}>
              {calculateTotalScore() >= (phrases.length + questions.length) / 2
                ? 'Bien joué ! Continuez comme ça !'
                : 'Essayez à nouveau pour améliorer votre score !'}
            </Typography>
          </Box>
         
          
        </Box>

      )}
       

   
    </Box>
  );
};

export default PhraseTable;
