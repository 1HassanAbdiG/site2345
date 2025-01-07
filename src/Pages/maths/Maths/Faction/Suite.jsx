// Exercise.js
import React, { useState, useEffect } from 'react';
import styles from './Suite.module.css';

const allSequences = [
    { seq: [12, 16, 20], rule: '+4', next: [24, 28] },
    { seq: [80, 75, 70], rule: '-5', next: [65, 60] },
    { seq: [3, 7, 11], rule: '+4', next: [15, 19] },
    { seq: [100, 90, 80], rule: '-10', next: [70, 60] },
    { seq: [2, 4, 6], rule: '+2', next: [8, 10] },
    { seq: [50, 45, 40], rule: '-5', next: [35, 30] },
    { seq: [1, 3, 5], rule: '+2', next: [7, 9] },
    { seq: [30, 60, 90], rule: 'x3', next: [120, 150] },
    { seq: [1000, 900, 800], rule: '-100', next: [700, 600] },
    { seq: [5, 15, 25], rule: '+10', next: [35, 45] },
    { seq: [40, 35, 30], rule: '-5', next: [25, 20] },
    { seq: [6, 12, 18], rule: '+6', next: [24, 30] },
    { seq: [7, 14, 21], rule: '+7', next: [28, 35] },
  ];
  

function Suite() {
  const [currentSequences, setCurrentSequences] = useState([]);
  const [stats, setStats] = useState({ completed: 0, correct: 0, solutionsViewed: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    generateNewSequences();
  }, []);

  
  const generateNewSequences = () => {
    const shuffled = [...allSequences].sort(() => 0.5 - Math.random()).slice(0, 5);
    setCurrentSequences(shuffled);
    setStats({ completed: 0, correct: 0, solutionsViewed: 0 });
  };
  

  const updateStats = () => {
    const completed = currentSequences.filter(seq => seq.input1 && seq.input2).length;
    setStats(prevStats => ({ ...prevStats, completed }));
  };

  const checkAnswer = (index) => {
    const { next, input1, input2 } = currentSequences[index];
    return input1 === next[0] && input2 === next[1];
  };

  const handleInputChange = (index, value, pos) => {
    const updatedSequences = [...currentSequences];
    updatedSequences[index][pos] = parseInt(value, 10);
    setCurrentSequences(updatedSequences);
    updateStats();
  };

  const validateAll = () => {
    const correctCount = currentSequences.reduce((count, seq, index) => count + (checkAnswer(index) ? 1 : 0), 0);
    setStats(prevStats => ({ ...prevStats, correct: correctCount }));
    setHistory([...history, { attempt: history.length + 1, correct: correctCount, solutionsViewed: stats.solutionsViewed }]);
  };

  const toggleSolution = (index) => {
    const updatedSequences = [...currentSequences];
    updatedSequences[index].showSolution = !updatedSequences[index].showSolution;
    setCurrentSequences(updatedSequences);
    setStats(prevStats => ({ ...prevStats, solutionsViewed: prevStats.solutionsViewed + 1 }));
  };

  const resetAll = () => {
    setCurrentSequences(currentSequences.map(seq => ({ ...seq, input1: '', input2: '', showSolution: false })));
    setStats({ completed: 0, correct: 0, solutionsViewed: 0 });
    setHistory([]);  // Clear the history to reset the entire exercise
  };
  
const shuffled = [...allSequences].sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <div className={styles.exerciseContainer}>
      <h2>Complète les suites de nombres</h2>
      <div className={styles.instructions}>
        <h3>Instructions :</h3>
        <ul>
          <li>Trouve les deux nombres manquants dans chaque suite</li>
          <li>Observe bien la règle qui relie les nombres entre eux</li>
          <li>Tu peux voir la solution si tu es bloqué(e)</li>
          <li>Tu as droit à 5 essais maximum</li>
          <li>Le taux de réussite est calculé sur les réponses que tu as complétées</li>
        </ul>
      </div>
      
      {currentSequences.map((seq, index) => (
        <div key={index} className={styles.sequence}>
          <div>{index + 1}) {seq.seq.join(', ')}, ___, ___</div>
          <div className={styles.inputNumbers}>
            Premier nombre : <input type="number" value={seq.input1 || ''} onChange={(e) => handleInputChange(index, e.target.value, 'input1')} />
            Deuxième nombre : <input type="number" value={seq.input2 || ''} onChange={(e) => handleInputChange(index, e.target.value, 'input2')} />
          </div>
          {seq.showSolution && (
            <div className={styles.solution}>
              Règle : {seq.rule} <br />
              Réponse : {seq.next.join(', ')}
            </div>
          )}
          <button onClick={() => toggleSolution(index)} className={styles.showSolution}>
            {seq.showSolution ? 'Cacher la solution' : 'Voir la solution'}
          </button>
        </div>
      ))}

      <div className={styles.buttonContainer}>
        <button onClick={validateAll} className={styles.validate}>Valider tout</button>
        <button onClick={resetAll} className={styles.reset}>Réinitialiser</button>
        <button onClick={generateNewSequences} className={styles.showSolution}>Nouvelles questions</button>
      </div>

      <div className={styles.summaryContainer}>
        <h3>Tableau récapitulatif</h3>
        <table className={styles.summaryTable}>
          <tbody>
            <tr>
              <td>Questions complétées</td>
              <td>{stats.completed}/5</td>
            </tr>
            <tr>
              <td>Réponses correctes</td>
              <td>{stats.correct}</td>
            </tr>
            <tr>
              <td>Solutions consultées</td>
              <td>{stats.solutionsViewed}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className={styles.historyContainer}>
        <h3>Historique des essais</h3>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th>Essai #</th>
              <th>Score</th>
              <th>Solutions consultées</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => (
              <tr key={i}>
                <td>{entry.attempt}</td>
                <td>{entry.correct}</td>
                <td>{entry.solutionsViewed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suite;
