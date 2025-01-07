// App.js
import React, { useState, useEffect } from 'react';
import FractionQuestion from './FractionQuestion';
import QuestionNavigator from './QuestionNavigator';
import questionsData from './fact.json';
import styles from './FractionExercise.module.css';

function Fraction() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsData.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  useEffect(() => {
    setScore(0); // Reset score on question change
  }, [currentQuestion]);

  return (
    <div className={styles.container}>
      <h1>Apprendre les Fractions</h1>
      <FractionQuestion
        question={questionsData[currentQuestion - 1]}
        onAnswer={handleAnswer}
      />
      <QuestionNavigator
        currentQuestion={currentQuestion}
        totalQuestions={questionsData.length}
        onNext={nextQuestion}
        onPrevious={previousQuestion}
      />
      <div className={styles.progress}>Score: {score}</div>
    </div>
  );
}

export default Fraction;
