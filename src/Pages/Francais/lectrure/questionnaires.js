import React, { useState, useEffect } from 'react';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

// Function to dynamically require all JSON files in the directory
const requireJsonFiles = require.context('./datalecture', false, /\.json$/);

const Questionnaire1 = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [data, setData] = useState(null);
  const [titles, setTitles] = useState({});
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all JSON files and extract their titles
  useEffect(() => {
    const loadTitles = async () => {
      setLoading(true);
      try {
        let loadedTitles = {};
        requireJsonFiles.keys().forEach((file) => {
          const jsonData = requireJsonFiles(file);
          const fileName = file.replace('./', '').replace('.json', '');
          loadedTitles[fileName] = jsonData.text.title;
        });
        setTitles(loadedTitles);
      } catch (err) {
        setError("Failed to load JSON files.");
      } finally {
        setLoading(false);
      }
    };

    loadTitles();
  }, []);

  // When selected file changes, reset and load the corresponding data
  useEffect(() => {
    if (selectedFile) {
      handleReset(); // Reset all answers and results
      loadJsonData(selectedFile); // Load the new data
    }
  }, [selectedFile]);


  // Load selected JSON file dynamically
  const loadJsonData = async (fileName) => {
    setLoading(true);
    try {
      const module = requireJsonFiles(`./${fileName}.json`);
      setData(module);
    } catch (error) {
      setError('Error loading JSON file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // When selected file changes, load the corresponding data
  useEffect(() => {
    if (selectedFile) {
      loadJsonData(selectedFile);
    }
  }, [selectedFile]);

  const handleChange = (question, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let totalScore = 0;
    let resultDetails = [];

    const allQuestions = [...data.questions, ...data.vocabularyTrueFalse, ...data.vocabularyQCM, ...data.conjugationQCM];

    allQuestions.forEach((question) => {
      const userAnswer = answers[question.question];
      const isCorrect =
        (question.type === 'trueFalse' && String(userAnswer) === String(question.correctAnswer)) ||
        (question.type === 'multipleChoice' && userAnswer === question.correctAnswer) ||
        (question.type === 'shortAnswer' && userAnswer?.trim().toLowerCase() === question.correctAnswer.toLowerCase());

      if (isCorrect) {
        totalScore += 1;
      }

      resultDetails.push({
        question: question.question,
        userAnswer: userAnswer !== undefined ? userAnswer : 'Non répondu',
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    });

    setScore(totalScore);
    setResults(resultDetails);
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
    setResults([]);
  };

  const renderQuestionsByType = (type) => {
    const questionTypes = {
      trueFalse: 'Vrai/Faux',
      multipleChoice: 'Questions à Choix Multiples (QCM)',
      shortAnswer: 'Réponse Courte',
    };

    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom style={{ color: '#ffffff', textAlign: 'center', border: 'solid 2px #000', background: '#4a90e2', padding: '10px', fontSize: '20px', fontWeight: 'bold' }}>
          {questionTypes[type]}
        </Typography>
        {data.questions.filter((q) => q.type === type).map((question, index) => renderQuestion(question, index + 1))}
      </React.Fragment>
    );
  };

  const renderVocabularyQuestions = (type) => {
    const questionTypes = {
      vocabularyTrueFalse: 'Vocabulaire Vrai/Faux',
      vocabularyQCM: 'Vocabulaire QCM',
      conjugationQCM: 'Conjugaison QCM', // Correction ici pour afficher "Conjugaison QCM"
    };
  
    if (!data[type] || data[type].length === 0) {
      return null; // Return null or some fallback UI if no data
    }
  
    return (
      <React.Fragment>
        <Typography
          variant="h6"
          gutterBottom
          style={{ color: '#ffffff', textAlign: 'center', border: 'solid 2px #000', background: '#4a90e2', padding: '10px', fontSize: '20px', fontWeight: 'bold' }}>
          {questionTypes[type]} {/* Displays the title based on the question type */}
        </Typography>
        {data[type].map((question, index) => renderQuestion(question, index + 1))} {/* Renders the questions of the specified type */}
      </React.Fragment>
    );
  };
  

  const renderQuestion = (question, number) => {
    switch (question.type) {
      case 'trueFalse':
        return (
          <Box key={question.question} my={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{number}. {question.question}</FormLabel>
              <RadioGroup
                row
                name={question.question}
                value={String(answers[question.question]) || ''}
                onChange={(e) => handleChange(question.question, e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Vrai" />
                <FormControlLabel value="false" control={<Radio />} label="Faux" />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 'multipleChoice':
        return (
          <Box key={question.question} my={2}>
            <FormControl fullWidth>
              <FormLabel>{number}. {question.question}</FormLabel>
              <Select
                value={answers[question.question] || ''}
                onChange={(e) => handleChange(question.question, e.target.value)}
              >
                <MenuItem value=""><em>Sélectionnez une option</em></MenuItem>
                {question.choices.map((choice) => (
                  <MenuItem key={choice} value={choice}>{choice}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 'shortAnswer':
        return (
          <Box key={question.question} my={2}>
            <FormControl fullWidth>
              <FormLabel>{number}. {question.question}</FormLabel>
              <TextField
                variant="outlined"
                value={answers[question.question] || ''}
                onChange={(e) => handleChange(question.question, e.target.value)}
              />
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!Object.keys(titles).length) {
    return <p>Aucun titre disponible...</p>;
  }

  return (
    <Box p={4} bgcolor="#f4f6f8">
      {/* Dropdown to select JSON file */}
      <h1>Questionnaires</h1>
      <p>
        <strong>Consigne :</strong>
        <ol>
          <li>Sélectionnez un texte dans le menu déroulant.</li>
          <li>Répondez aux questions qui s'affichent sous le texte sélectionné.</li>
          <li>Pour chaque question, choisissez la réponse qui vous semble correcte.</li>
          <li>Après avoir répondu à toutes les questions, cliquez sur "Vérifier" pour soumettre vos réponses.</li>
          <li>Vous pouvez revoir vos réponses et tenter de les corriger si nécessaire.</li>
        </ol>
      </p>


      <Box mb={3}>
        <FormControl fullWidth>
          <Select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <MenuItem value="" disabled>Sélectionner un texte</MenuItem>
            {Object.keys(titles).map((file) => (
              <MenuItem key={file} value={file}>
                {titles[file] || 'Chargement...'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Display text content */}
      {data && (
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#ffffff', marginBottom: '30px' }}>
          <Typography variant="h4" gutterBottom>{data.text.title}</Typography>
          {data.text.content.map((sentence, index) => (
            <Typography key={index} paragraph>{sentence}</Typography>
          ))}
        </Paper>
      )}

      {/* Questionnaire */}
      {data && (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>Questionnaire</Typography>

          <form onSubmit={handleSubmit}>
            {renderQuestionsByType('trueFalse')}
            {renderQuestionsByType('multipleChoice')}
            {renderQuestionsByType('shortAnswer')}

            {renderVocabularyQuestions('vocabularyTrueFalse')}
            {renderVocabularyQuestions('vocabularyQCM')}
            {renderVocabularyQuestions('conjugationQCM')}
            

            <Box mt={4}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Valider
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset} fullWidth>
                Réinitialiser
              </Button>
            </Box>
          </form>

          {/* Display results */}
          {score !== null && (
            <Box mt={4}>
              <Typography variant="h6">Votre score : {score} sur {results.length}

              </Typography>
              <Typography variant="subtitle1" color="red">
                La partie que tu as rédigée, l'enseignant doit vérifier si c'est correct.
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Votre Réponse</TableCell>
                      <TableCell>Réponse Correcte</TableCell>
                      <TableCell>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.question}</TableCell>
                        <TableCell>{result.userAnswer}</TableCell>
                        <TableCell>{String(result.correctAnswer)}</TableCell>
                        <TableCell>{result.isCorrect ? '✔️' : '❌'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Questionnaire1;
