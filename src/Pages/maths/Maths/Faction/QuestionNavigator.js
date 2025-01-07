// components/QuestionNavigator.js
import React from 'react';
import styles from './FractionExercise.module.css';

const QuestionNavigator = ({ currentQuestion, totalQuestions, onNext, onPrevious }) => (
  <div className={styles.navigation}>
    <button onClick={onPrevious} disabled={currentQuestion === 1} className={styles.button}>
      Précédent
    </button>
    <span className={styles.progress}>Question {currentQuestion} / {totalQuestions}</span>
    <button onClick={onNext} disabled={currentQuestion === totalQuestions} className={styles.button}>
      Suivant
    </button>
  </div>
);

export default QuestionNavigator;
