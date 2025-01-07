// components/FractionQuestion.js
import React, { useState, useEffect } from 'react';
import styles from './FractionExercise.module.css';

const FractionQuestion = ({ question, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Réinitialise la réponse de l'utilisateur et le feedback lorsqu'une nouvelle question est chargée
    setUserAnswer('');
    setFeedback(null);
  }, [question]);

  const handleCheckAnswer = () => {
    const isCorrect = parseInt(userAnswer, 10) === parseInt(question.answer, 10);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    onAnswer(isCorrect);
  };

  return (
    <div className={`${styles.fractionExercise} ${feedback && styles[feedback]}`}>
      <h2>Question {question.id}: Complétez la fraction équivalente</h2>
      <div className={styles.fraction}>
        {question.numerator === '?' ? (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="?"
            className={styles.input}
          />
        ) : (
          <div>{question.numerator}</div>
        )}
        <div className={styles.fractionLine}></div>
        {question.denominator === '?' ? (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="?"
            className={styles.input}
          />
        ) : (
          <div>{question.denominator}</div>
        )}
      </div>
      <span>=</span>
      <div className={styles.fraction}>
        {question.equalsNumerator === '?' ? (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="?"
            className={styles.input}
          />
        ) : (
          <div>{question.equalsNumerator}</div>
        )}
        <div className={styles.fractionLine}></div>
        {question.equalsDenominator === '?' ? (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="?"
            className={styles.input}
          />
        ) : (
          <div>{question.equalsDenominator}</div>
        )}
      </div>
      <button onClick={handleCheckAnswer} className={styles.button}>
        Vérifier
      </button>
      {feedback && (
        <div className={styles.message}>
          {feedback === 'correct' ? 'Correct!' : 'Essayez encore!'}
        </div>
      )}
    </div>
  );
};

export default FractionQuestion;
