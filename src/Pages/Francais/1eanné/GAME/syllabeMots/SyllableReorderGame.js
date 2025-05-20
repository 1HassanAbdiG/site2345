// components/SyllableReorderGameInteractive.js
import React, { useState, useEffect, useCallback } from 'react';
import fullProblemsData from './syllableProblems.json';
import './SyllableReorderGame.css';


const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const importImage = (imageFilename) => {
  try {
    return require(`./images/${imageFilename}`);
  } catch (err) {
    console.error(`Image not found: ${imageFilename}`, err);
    return null;
  }
};

const assignSyllableIds = (syllables) => {
  return syllables.map((syllable, index) => ({
    value: syllable,
    id: `${syllable}-${index}-${Math.random().toString(36).substr(2, 9)}`
  }));
};

const SyllableReorderGameInteractive = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [availableSyllables, setAvailableSyllables] = useState([]);
  const [placedSyllables, setPlacedSyllables] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [stats, setStats] = useState({});
  const [gameAttemptCount, setGameAttemptCount] = useState(0);

  const resetGameState = useCallback(() => {
    setProblems([]);
    setIsGameFinished(false);
    setGameAttemptCount(0);
    setCurrentProblemIndex(0);
    setAvailableSyllables([]);
    setPlacedSyllables([]);
    setFeedback('');
    setShowFeedback(false);
    setIsAnswerCorrect(false);
    setStats({});
  }, []);

  const resetFeedback = useCallback(() => {
    setFeedback('');
    setShowFeedback(false);
    setIsAnswerCorrect(false);
  }, []);

  const finishGame = useCallback(() => {
    setIsGameFinished(true);
    setAvailableSyllables([]);
    setPlacedSyllables([]);
    resetFeedback();
  }, [resetFeedback]);

  useEffect(() => {
    if (selectedCategory && fullProblemsData[selectedCategory]) {
      const categoryProblems = fullProblemsData[selectedCategory];
      
      if (categoryProblems?.length > 0) {
        const processedProblems = categoryProblems.map(p => ({
          ...p,
          initialShuffledSyllables: assignSyllableIds(shuffleArray(p.syllables))
        }));
        
        setProblems(processedProblems);
        setIsGameFinished(false);
        setStats({});
        setGameAttemptCount(prev => prev + 1);
        setCurrentProblemIndex(0);
      }
    } else {
      resetGameState();
    }

    return () => {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedCategory, resetGameState]);

  useEffect(() => {
    if (problems.length === 0) return;

    const problem = problems[currentProblemIndex];
    
    if (problem) {
      setAvailableSyllables(problem.initialShuffledSyllables);
      setPlacedSyllables([]);
      resetFeedback();
    } else if (currentProblemIndex >= problems.length) {
      finishGame();
    }
  }, [currentProblemIndex, problems, resetFeedback, finishGame]);

  const handleSyllableClick = (syllableToMove, location) => {
    if (showFeedback) resetFeedback();
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (location === 'available') {
      setAvailableSyllables(prev => prev.filter(s => s.id !== syllableToMove.id));
      setPlacedSyllables(prev => [...prev, syllableToMove]);
    } else {
      setPlacedSyllables(prev => prev.filter(s => s.id !== syllableToMove.id));
      setAvailableSyllables(prev => [...prev, syllableToMove]);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentProblem || placedSyllables.length === 0) {
      setFeedback("Veuillez placer les syllabes pour former le mot.");
      setIsAnswerCorrect(false);
      setShowFeedback(true);
      return;
    }

    const userWord = placedSyllables.map(s => s.value).join('').toLowerCase();
    const correctAnswer = currentProblem.correctWord.toLowerCase();
    const isCorrect = userWord === correctAnswer;
    const problemId = currentProblem.id;

    setStats(prev => {
      const currentStats = prev[problemId] || {
        attempts: 0,
        firstValidationCorrect: false,
        solved: false,
        problemWord: currentProblem.correctWord,
        problemSyllables: currentProblem.syllables.join('-')
      };

      return {
        ...prev,
        [problemId]: {
          ...currentStats,
          attempts: currentStats.attempts + 1,
          firstValidationCorrect: currentStats.attempts === 0 ? isCorrect : currentStats.firstValidationCorrect,
          solved: currentStats.solved || isCorrect
        }
      };
    });

    if (isCorrect) {
      setFeedback('✅ Bravo ! Correct !');
      setIsAnswerCorrect(true);
      setShowFeedback(true);
      // Supprimé l'appel automatique à handleReadWord
      setTimeout(() => setCurrentProblemIndex(prev => prev + 1), 2000);
    } else {
      setFeedback('❌ Incorrect. Essaie encore !');
      setIsAnswerCorrect(false);
      setShowFeedback(true);
      setTimeout(() => setCurrentProblemIndex(prev => prev + 1), 1500);
    }
  };

  const handleReadWord = useCallback((textToSpeakOverride = null) => {
    const textToSpeak = textToSpeakOverride ?? placedSyllables.map(s => s.value).join('');
    
    if (!textToSpeak) {
      setFeedback("Placez des syllabes pour que je puisse lire le mot !");
      setIsAnswerCorrect(false);
      setShowFeedback(true);
      return;
    }

    if (!('speechSynthesis' in window)) {
      setFeedback("La lecture audio n'est pas prise en charge par votre navigateur.");
      setIsAnswerCorrect(false);
      setShowFeedback(true);
      return;
    }

    const synthesis = window.speechSynthesis;
    if (synthesis.speaking) synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = utterance.onerror = () => setIsSpeaking(false);
    
    synthesis.speak(utterance);
  }, [placedSyllables]);

  const calculateReport = useCallback(() => {
    const totalProblems = problems.length;
    let totalAttempts = 0;

    const problemsReportData = problems.map(problem => {
      const problemStats = stats[problem.id] || {
        attempts: 0,
        firstValidationCorrect: false,
        solved: false,
        problemWord: problem.correctWord,
        problemSyllables: problem.syllables.join('-')
      };

      totalAttempts += problemStats.attempts;

      return {
        id: problem.id,
        word: problem.correctWord,
        syllables: problemStats.problemSyllables,
        attempts: problemStats.attempts,
        firstAttemptCorrect: problemStats.firstValidationCorrect,
        eventuallySolved: problemStats.solved
      };
    });

    const totalSolved = problemsReportData.filter(p => p.eventuallySolved).length;
    const totalFirstCorrect = problemsReportData.filter(p => p.firstAttemptCorrect).length;

    return {
      category: selectedCategory,
      totalProblems,
      totalAttempts,
      problemsReportData,
      totalSolved,
      totalFirstCorrect
    };
  }, [problems, stats, selectedCategory]);

  const report = isGameFinished ? calculateReport() : null;
  const currentProblem = problems[currentProblemIndex];
  const categoryOptions = Object.keys(fullProblemsData);

  return (
    <div className="game-container">
      <h1>Jeu des Syllabes</h1>

      {!selectedCategory || gameAttemptCount === 0 ? (
        <div className="category-selection">
          <h2>Choisis une catégorie pour commencer :</h2>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Choisir une catégorie"
          >
            <option value="">-- Sélectionne une catégorie --</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setGameAttemptCount(1)}
            className="start-button"
            disabled={!selectedCategory || !fullProblemsData[selectedCategory]?.length}
          >
            Commencer
          </button>
          {showFeedback && (
            <div className={`feedback-message ${isAnswerCorrect ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>
      ) : isGameFinished && report ? (
        <div className="game-finished-report">
          <h2>Fin de l'exercice pour la catégorie "{report.category.charAt(0).toUpperCase() + report.category.slice(1)}" !</h2>
          
          <div className="report-summary">
            <h3>Ton Bilan :</h3>
            <p>Mots résolus : <strong>{report.totalSolved}</strong> / {report.totalProblems}</p>
            <p>Réussis du premier coup : <strong>{report.totalFirstCorrect}</strong></p>
            
            <h4>Détail par mot :</h4>
            {report.problemsReportData.length > 0 ? (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Mot</th>
                    <th>Syllabes</th>
                    <th>Tentatives</th>
                    <th>1er essai</th>
                  </tr>
                </thead>
                <tbody>
                  {report.problemsReportData.map(item => (
                    <tr key={item.id}>
                      <td>{item.word}</td>
                      <td>{item.syllables}</td>
                      <td>{item.attempts}</td>
                      <td className={item.firstAttemptCorrect ? 'correct' : 'incorrect'}>
                        {item.firstAttemptCorrect ? 'Oui' : 'Non'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>

          <button onClick={() => setGameAttemptCount(1)} className="restart-button">
            Recommencer
          </button>
          <button onClick={() => setSelectedCategory('')} className="change-category-button">
            Changer de catégorie
          </button>
        </div>
      ) : currentProblem ? (
        <div className="problem-area">
          <p className="problem-number">Problème {currentProblemIndex + 1} / {problems.length}</p>
          
          {currentProblem.imageUrl && (
            <div className="problem-image-container">
              <img
                src={importImage(currentProblem.imageUrl)}
                alt={currentProblem.correctWord}
                className="problem-image"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/placeholder-image.png';
                }}
              />
            </div>
          )}

          <div className="syllables-source">
            <h4>Syllabes disponibles:</h4>
            <div className="syllable-list available">
              {availableSyllables.length > 0 ? (
                availableSyllables.map(syllable => (
                  <button
                    key={syllable.id}
                    className="syllable-item available"
                    onClick={() => handleSyllableClick(syllable, 'available')}
                    disabled={isSpeaking}
                  >
                    {syllable.value}
                  </button>
                ))
              ) : (
                <div className="placeholder">Toutes les syllabes sont utilisées.</div>
              )}
            </div>
          </div>

          <div className="syllables-placement">
            <h4>Ton mot:</h4>
            <div className="syllable-list placed">
              {placedSyllables.length > 0 ? (
                placedSyllables.map(syllable => (
                  <button
                    key={syllable.id}
                    className="syllable-item placed"
                    onClick={() => handleSyllableClick(syllable, 'placed')}
                    disabled={isSpeaking}
                  >
                    {syllable.value}
                  </button>
                ))
              ) : (
                <div className="placeholder">Clique sur les syllabes disponibles</div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={() => handleReadWord()}
              className="audio-button"
              disabled={placedSyllables.length === 0 || isSpeaking}
            >
              <span role="img" aria-label="Lire le mot">🔊</span> Lire le mot
            </button>
            <button
              onClick={handleCheckAnswer}
              className="check-button"
              disabled={placedSyllables.length === 0 || isSpeaking}
            >
              Valider
            </button>
          </div>

          {showFeedback && (
            <div className={`feedback-message ${isAnswerCorrect ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>
      ) : (
        <div className="loading-message">
          Chargement en cours...
        </div>
      )}
 
    </div>
  );
};

export default SyllableReorderGameInteractive;