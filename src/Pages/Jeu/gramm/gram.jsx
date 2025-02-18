import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import grammarQuestions from './gram.json';
import VideoPlayer from './video';
import DictationPage from '../../VIDEO/video_dictée';

const GrammarGame = () => {
  const [selectedExercise, setSelectedExercise] = useState(Object.keys(grammarQuestions.exercises)[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);

  const questions = grammarQuestions.exercises[selectedExercise];
  const totalQuestions = questions.length;

  const shuffleArray = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    };
    


  const handleAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    
    setScore(score + (isCorrect ? 1 : 0));
    setAnswerHistory(prevHistory => [
      ...prevHistory,
      {
        verb: currentQuestion.verb || 'N/A',
        pronoun: currentQuestion.pronoun || 'N/A',
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.answer,
        isCorrect
      }
    ]);

    
    
    setSelectedAnswer('');
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswerHistory([]);
    setSelectedAnswer('');
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Jeu de Grammaire</Typography>
      
      <Select value={selectedExercise} onChange={handleExerciseChange} sx={{ marginBottom: 2, width: '50%' }}>
        {Object.keys(grammarQuestions.exercises).map((exercise) => (
          <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
        ))}
      </Select>
      
      <Typography variant="h6" sx={{ marginBottom: 2, color: 'blue' }}>Score : {score} / {totalQuestions}</Typography>
      
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>{questions[currentQuestionIndex].question}</Typography>
        <RadioGroup value={selectedAnswer} onChange={(e) => setSelectedAnswer(e.target.value)}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>
        < DictationPage></DictationPage>
      </Paper>

      
      <Button variant="contained" color="primary" onClick={handleAnswer} disabled={!selectedAnswer}>Valider</Button>
      
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>Historique des réponses</Typography>
        <Paper elevation={3} sx={{ width: "100%", overflowX: "auto", padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "blue" }}>
            Score : {score} / {answerHistory.length}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>NUMERO</strong></TableCell>
                <TableCell><strong>THEME</strong></TableCell>
                <TableCell><strong>Réponse Utilisateur</strong></TableCell>
                <TableCell><strong>Réponse Correcte</strong></TableCell>
                <TableCell><strong>Résultat</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {answerHistory.map((answer, index) => (
                <TableRow key={index}>
                 <TableCell>{index + 1}</TableCell> {/* Displaying the question number */}
                  <TableCell>{selectedExercise}</TableCell> {/* Displaying the selected exercise name */}
                  <TableCell>{answer.userAnswer}</TableCell>
                  <TableCell>{answer.correctAnswer}</TableCell>
                  <TableCell>{answer.isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default GrammarGame;
