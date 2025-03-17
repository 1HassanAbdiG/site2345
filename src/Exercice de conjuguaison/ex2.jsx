import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Exercise2 = ({ exercises }) => {
  const [answers, setAnswers] = useState(Array(exercises.length).fill(''));
  const [results, setResults] = useState([]);

  const handleChange = (index) => (event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newResults = answers.map((answer, index) => ({
      question: exercises[index].current,
      userAnswer: answer,
      isCorrect: answer.trim() === exercises[index].past,
    }));
    setResults(newResults);
  };

  return (
    <div>
      <h2>Exercice 2: Transformation au passé</h2>
      {exercises.map((ex, index) => (
        <div key={index}>
          <p>{ex.current}</p>
          <TextField label="Réponse" variant="outlined" value={answers[index]} onChange={handleChange(index)} />
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit}>Valider</Button>

      <h3>Récapitulatif des réponses</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Votre réponse</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.question}</TableCell>
                <TableCell>{result.userAnswer}</TableCell>
                <TableCell>{result.isCorrect ? 'Correct' : 'Incorrect'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Exercise2;