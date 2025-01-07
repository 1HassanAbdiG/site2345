import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Francais/francais/styles/DictationTask.module.css'; // Import the CSS Module

const DictationTask = ({ phrases, onNext }) => {
  const [dictationTexts, setDictationTexts] = useState(Array(phrases.length).fill(""));
  const [phraseScores, setPhraseScores] = useState(Array(phrases.length).fill(null)); // Allow null to track unverified phrases
  const [verificationResults, setVerificationResults] = useState(Array(phrases.length).fill([]));
  const [totalWords, setTotalWords] = useState(0); // Total number of words across all phrases
  const [advice, setAdvice] = useState(null); // Advice is initially null, shown after button press

  const speakPhrase = (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const handleVerify = (index) => {
    const userInput = dictationTexts[index].trim().split(' '); // Split user input by space
    const correctPhrase = phrases[index].trim().split(' '); // Split correct phrase by space

    // Verify only if at least 2 words are entered
    if (userInput.length < 2) {
      alert('Vous devez entrer au moins 2 mots pour vérifier.');
      return;
    }

    // Prevent re-verifying if score for this phrase is already set
    if (phraseScores[index] !== null) {
      alert('Cette phrase a déjà été vérifiée.');
      return;
    }

    const verificationData = correctPhrase.map((correctWord, wordIndex) => ({
      correct: correctWord,
      user: userInput[wordIndex] || '', // Get user input or empty string if none
      isCorrect: userInput[wordIndex] === correctWord
    }));

    const correctWordCount = verificationData.filter(result => result.isCorrect).length;

    // Store verification results and score for this phrase
    const newResults = [...verificationResults];
    newResults[index] = verificationData;
    setVerificationResults(newResults);

    const newPhraseScores = [...phraseScores];
    newPhraseScores[index] = correctWordCount; // Set score for this phrase (only once)
    setPhraseScores(newPhraseScores);

    // Update total words count for this phrase (once)
    setTotalWords(prev => prev + correctPhrase.length);
  };

  const handleSubmit = () => {
    const totalCorrectWords = phraseScores.reduce((total, score) => total + (score || 0), 0); // Sum only non-null scores
    const finalScore = totalCorrectWords / totalWords; // Calculate final score as a percentage
    onNext(finalScore);

    // Do not provide advice automatically
    setAdvice(null);
  };

  const handleAdvice = () => {
    // Calculate the final score
    const totalCorrectWords = phraseScores.reduce((total, score) => total + (score || 0), 0);
    const finalScore = totalCorrectWords / totalWords;

    // Provide advice based on the final score
    if (finalScore < 0.5) {
      setAdvice("Bon effort, mais tu peux encore t'améliorer. Fais attention aux détails.");
    } else if (finalScore >= 0.5 && finalScore < 0.7) {
      setAdvice("C'est un bon début ! Essaie de te concentrer davantage pour améliorer encore.");
    } else if (finalScore >= 0.7 && finalScore < 0.9) {
      setAdvice("Très bon travail ! Avec un peu plus de pratique, tu seras excellent.");
    } else if (finalScore >= 0.9) {
      setAdvice("Excellent travail ! Continue à bien réviser tes phrases.");
    }
  };

  // Reset all the states to allow retrying the dictation
  const handleRetry = () => {
    setDictationTexts(Array(phrases.length).fill(""));
    setPhraseScores(Array(phrases.length).fill(null));
    setVerificationResults(Array(phrases.length).fill([]));
    setTotalWords(0);
    setAdvice(null);
  };

  return (
    <div className={styles.dictationTask}>
      <h2>Dictée des phrases</h2>
      <p>Nombre de phrases : {phrases.length}</p>

      <div className={styles.phrasesList}>
        {phrases.map((phrase, index) => (
          <div key={index} className={styles.phraseContainer}>
            <div className={styles.phraseItem}>
              <button onClick={() => speakPhrase(phrase)}>🎧</button>
            </div>
            <textarea 
              value={dictationTexts[index]} 
              onChange={(e) => {
                const newTexts = [...dictationTexts];
                newTexts[index] = e.target.value;
                setDictationTexts(newTexts);
              }} 
              placeholder="Écris la phrase ici..."
            />
            <button onClick={() => handleVerify(index)}>Vérifier</button>

            {verificationResults[index]?.length > 0 && (
              <table className={styles.verificationTable}>
                <thead>
                  <tr>
                    <th>Phrase Correcte</th>
                    <th>Votre Phrase</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationResults[index].map((result, wordIndex) => (
                    <tr key={wordIndex}>
                      <td style={{ color: result.isCorrect ? 'green' : 'black' }}>
                        {result.correct}
                      </td>
                      <td style={{ color: result.isCorrect ? 'green' : 'red' }}>
                        {result.user}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {result.isCorrect ? '1' : '0'}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Score pour cette phrase :</td>
                    <td style={{ fontWeight: 'bold', color: 'blue' }}>{phraseScores[index]}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      <button className={styles.submitButton} onClick={handleSubmit}>Soumettre la dictée</button>
      <h3>Score Total: {phraseScores.reduce((total, score) => total + (score || 0), 0)} / {totalWords}</h3>

      {/* Advice button */}
      {phraseScores.every(score => score !== null) && ( // Ensure all phrases are verified
        <>
          <button className={styles.adviceButton} onClick={handleAdvice}>Conseil</button>
          <button className={styles.retryButton} onClick={handleRetry}>Refaire la dictée</button>
        </>
      )}

      {/* Display advice only after button click */}
      {advice && (
        <div className={styles.adviceMessage}>
          <h4>{advice}</h4>
        </div>
      )}
    </div>
  );
};

DictationTask.propTypes = {
  phrases: PropTypes.array.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default DictationTask;
