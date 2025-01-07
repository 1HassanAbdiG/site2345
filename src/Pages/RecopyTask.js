import React from 'react';
import styles from './Francais/francais/styles/PhraseBuilder.module.css';

const RecopyTask = ({ phrases, onNext ,incorrecPhase}) => {
 // const [recopyText, setRecopyText] = useState("");
 // const [score, setScore] = useState(0);
  //const [incorrectCount, setIncorrectCount] = useState(0);

  // Function to handle text input change
 /* const handleInputChange = (e) => {
    setRecopyText(e.target.value);
  };*/

  // Function to handle text-to-speech for each phrase
  const speakPhrase = (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'fr-FR'; // Set language to French
    window.speechSynthesis.speak(utterance); // Start speaking the phrase
  };

  // Function to verify the copied phrases
  /*const handleRecopy = () => {
    const userLines = recopyText.trim().split('\n').map(line => line.trim());

    // Check if the number of lines matches the number of correct phrases
    if (userLines.length !== phrases.length) {
      alert("Tu n'as pas recopié toutes les phrases. Vérifie ton travail.");
      return;
    }

    // Check how many phrases were copied correctly
    let correctCount = 0;
    let wrongCount = 0;
    phrases.forEach((phrase, index) => {
      if (userLines[index] === phrase) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    //setScore(correctCount);
   // setIncorrectCount(wrongCount);

    if (correctCount === phrases.length) {
      alert("Bien joué ! Tu as recopié toutes les phrases correctement.");
      onNext(); // Move to dictation task
    } else {
      alert(`Tu as ${wrongCount} erreurs. Demande à l'enseignant de vérifier.`);
    }
  };*/

  return (
    <div className="recopy-task">

        
      <h2>Lire et recopier, et si tu veux écouter clique le bouton audio. Il faut retenir pour faire la dictée.</h2>

       {/* Display correct and incorrect phrases */}
       <div className={styles.tableContainer}>
            <table className={styles.phraseTable}>
              <thead>
                <tr>
                  <th>Phrases Correctes</th>
                  <th>Phrases Incorrectes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul>
                      {phrases.map((p, index) => (
                        <li key={index}>{p}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {incorrecPhase.map((p, index) => (
                        <li key={index}>{p}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

      {/* Display correct phrases with audio buttons */}
      <div className="correct-phrases">
        <h3>Phrases correctes</h3>
        <ul>
          {phrases.map((phrase, index) => (
            <li key={index}>
              {phrase} 
              <button onClick={() => speakPhrase(phrase)}>🎧 Écouter</button>
            </li>
          ))}
        </ul>
      </div>

      

      {/* Button to start dictation */}
      <button onClick={onNext}>Commencer la dictée</button>
    </div>
  );
};

export default RecopyTask;
