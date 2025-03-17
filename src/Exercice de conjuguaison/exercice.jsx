import React, { useEffect, useState } from 'react';
import Exercise1 from './ex1';
import Exercise2 from './ex2';
import Exercise3 from './ex3';
import { Container } from '@mui/material';
import exercisesData from './data.json';

const Exercicegram = () => {
  const [exercise1, setExercise1] = useState([]);
  const [exercise2, setExercise2] = useState([]);

  useEffect(() => {
    setExercise1(exercisesData.exercise1);
    setExercise2(exercisesData.exercise2);
  }, []);

  return (
    <Container>
      <h1>Exercices de Français</h1>
      <Exercise1 exercises={exercise1} setExercises={setExercise1} />
      <Exercise2 exercises={exercise2} setExercises={setExercise2} />
      <Exercise3 />
    </Container>
  );
};

export default Exercicegram;