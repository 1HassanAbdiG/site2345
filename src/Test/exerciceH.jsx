import React, { useState, useEffect, useCallback } from 'react';
import quizData from './donnee.json'; // Import the JSON data
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  LinearProgress,
  Toolbar,
  AppBar,
  IconButton,
  Snackbar,
  Divider,
  Icon,
  Grid, // Import Grid for layout
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// DataTable Component (Material UI) - No changes needed
const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No data to display.</Typography>;
  }

  const headers = Object.keys(data[0]);

  return (
    <Paper elevation={2} sx={{ mb: 3, overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.light' }}>
            <TableCell sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>Olympic medals</TableCell>
            {headers.slice(1).map((header, index) => (
              <TableCell key={index} sx={{ fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>{header.replace('year', '')}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((countryData, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ borderRight: 1, borderColor: 'divider' }}>{countryData.country}</TableCell>
              {headers.slice(1).map((header, index) => (
                <TableCell key={index} sx={{ borderRight: 1, borderColor: 'divider' }}>{countryData[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

// Question Component (Material UI) - No changes needed
const Question = ({ questionText }) => (
  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
    {questionText}
  </Typography>
);

// AnswerInput Component (Material UI) - with Error Handling
const AnswerInput = ({ onSubmit, questionType }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (event) => {
    setUserAnswer(event.target.value);
    setInputError(''); // Clear error on input change
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userAnswer.trim()) {
      setInputError('Please enter an answer.');
      return;
    }

    let processedAnswer = userAnswer;
    if (questionType !== "string") {
      const numAnswer = parseInt(userAnswer, 10);
      if (isNaN(numAnswer)) {
        setInputError('Please enter a valid number.');
        return;
      }
      processedAnswer = numAnswer;
    }
    onSubmit(processedAnswer);
    setInputError(''); // Clear error after successful submit
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, mb: 3 }}>
      <TextField
        error={!!inputError}
        helperText={inputError}
        label="Your Answer"
        variant="outlined"
        value={userAnswer}
        onChange={handleInputChange}
        sx={{ mr: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Answer
      </Button>
    </Box>
  );
};

// FeedbackDisplay Component (Material UI Alert) - No changes needed
const FeedbackDisplay = ({ feedbackText, isCorrect }) => (
  feedbackText && (
    <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2, mb: 2 }}>
      {feedbackText}
    </Alert>
  )
);

// Bilan Component (Results Summary - Enhanced Material UI) - No changes needed
const Bilan = ({ results, onRestartQuiz }) => {
  const totalQuestions = results.length;
  const correctAnswers = results.filter(result => result.isCorrect).length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom color="primary">
        Quiz Results!
      </Typography>
      <Typography paragraph variant="subtitle1">
        Congratulations on completing the quiz! Here's your performance summary:
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', my: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6">Total Questions</Typography>
          <Typography variant="h5" fontWeight="bold">{totalQuestions}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box textAlign="center">
          <Typography variant="h6">Correct Answers</Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">{correctAnswers}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box textAlign="center">
          <Typography variant="h6">Your Score</Typography>
          <Typography variant="h4" fontWeight="bold" color={scorePercentage >= 70 ? 'success.dark' : (scorePercentage >= 50 ? 'warning.dark' : 'error.dark')}>
            {scorePercentage.toFixed(0)}%
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" component="h4" align="left" gutterBottom sx={{ mt: 3 }}>
        Detailed Results:
      </Typography>
      <List dense>
        {results.map((result, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`Question ${index + 1}: ${result.isCorrect ? 'Correct' : 'Incorrect'}`}
              secondary={`Your Answer: "${result.userAnswer}" - Correct Answer: "${result.correctAnswer}"`}
              secondaryTypographyProps={{ color: result.isCorrect ? 'success.main' : 'error.main' }}
            />
            <Icon sx={{ color: result.isCorrect ? 'success.main' : 'error.main', ml: 2 }}>
              {result.isCorrect ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
            </Icon>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={onRestartQuiz} sx={{ mt: 4 }}>
        Restart Quiz
      </Button>
    </Paper>
  );
};


// Fisher-Yates Shuffle Function (outside component) - No changes needed
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


// Main MedalQuiz Component (Material UI - Re-designed Layout)
function MedalQuiz() {
  const [questionData, setQuestionData] = useState(() => shuffleArray(quizData));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [showBilan, setShowBilan] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isAnswerValidated, setIsAnswerValidated] = useState(false);

  const currentQuestion = questionData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionData.length) * 100;
  const hasAnsweredCurrentQuestion = quizResults.some(result => result.questionIndex === currentQuestionIndex);
  const currentQuestionResult = quizResults.find(result => result.questionIndex === currentQuestionIndex);
  const questionsAnswered = quizResults.length;
  const scorePercentage = (questionsAnswered / quizData.length) * 100;


  const handleAnswerSubmit = (userAnswer) => {
    const isCorrect = checkAnswer(userAnswer, currentQuestion.correctAnswer);

    const newResult = {
      questionIndex: currentQuestionIndex,
      userAnswer: userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
    };
    setQuizResults(prevResults => {
      const existingResultIndex = prevResults.findIndex(res => res.questionIndex === currentQuestionIndex);
      if (existingResultIndex > -1) {
        const updatedResults = [...prevResults];
        updatedResults[existingResultIndex] = newResult;
        return updatedResults;
      } else {
        return [...prevResults, newResult];
      }
    });
    setFeedbackOpen(true);
    setIsAnswerValidated(true);
  };

  const handleNextQuestion = () => {
    if (isAnswerValidated) { // Proceed only if answer is validated
      if (currentQuestionIndex < questionData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowBilan(true);
      }
      setFeedbackOpen(false);
      setIsAnswerValidated(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    setFeedbackOpen(false);
    setIsAnswerValidated(false);
  };


  const checkAnswer = (userAnswer, correctAnswer) => {
    if (typeof correctAnswer === 'number') {
      return userAnswer === correctAnswer;
    } else if (typeof correctAnswer === 'string') {
      return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    }
    return false;
  };

  const restartQuiz = useCallback(() => {
    setQuestionData(shuffleArray(quizData));
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setShowBilan(false);
    setFeedbackOpen(false);
    setIsAnswerValidated(false);
  }, []);


  const handleCloseFeedback = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFeedbackOpen(false);
  };


  useEffect(() => {
    setQuestionData(shuffleArray(quizData));
  }, []);


  if (showBilan) {
    return <Bilan results={quizResults} onRestartQuiz={restartQuiz} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <AppBar position="static" elevation={1} sx={{ mb: 2, backgroundColor: '#f8f9fa', color: '#212529' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Olympic Medals Quiz
          </Typography>
          <IconButton color="inherit" aria-label="restart quiz" onClick={restartQuiz} title="Restart Quiz">
            <RestartAltIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: '#fff' }}>
            <Question questionText={currentQuestion.questionText} />
            <DataTable data={currentQuestion.tableData} />
            <AnswerInput
              onSubmit={handleAnswerSubmit}
              questionType={typeof currentQuestion.correctAnswer}
            />
            {currentQuestionResult && (
              <FeedbackDisplay
                feedbackText={currentQuestionResult.isCorrect ? "Correct answer!" : `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`}
                isCorrect={currentQuestionResult.isCorrect}
              />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                startIcon={<ArrowBackIcon />}
                size="small"
              >
                Previous
              </Button>
              <Typography variant="subtitle2" align="center" color="textSecondary">
                Question {currentQuestionIndex + 1} of {questionData.length}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questionData.length - 1 || !isAnswerValidated}
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                Next
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Quiz Progress
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 'bold' }}>Questions Answered:</Typography>
              <Typography variant="body2">{questionsAnswered} / {quizData.length}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={scorePercentage} sx={{ mb: 2, borderRadius: '5px', height: 10 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 'bold' }}>SmartScore:</Typography>
              <Typography variant="body2">{scorePercentage.toFixed(0)}%</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={feedbackOpen}
        autoHideDuration={3000}
        onClose={handleCloseFeedback}
        message={currentQuestionResult?.isCorrect ? "Correct answer!" : `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`}
        severity={currentQuestionResult?.isCorrect ? "success" : "error"}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

    </Container>
  );
}

export default MedalQuiz;