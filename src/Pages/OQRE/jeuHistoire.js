import React, { useState, useEffect } from 'react';
import PhraseList from './PhraseList';
import Buttons from './Buttons';
import Message from './Message';
import Stats from './Stats';
import styles from './Jeuhistoire.module.css'; // Assurez-vous que votre fichier CSS comprend les nouvelles classes
import storiesData from './phrases.json';

const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const Jeuhistoire = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(storiesData.stories[0].phrases);
  const [phrases, setPhrases] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showReadStoryButton, setShowReadStoryButton] = useState(false);
  const [isStoryRead, setIsStoryRead] = useState(false);

  const handleStoryChange = (event) => {
    const storyIndex = parseInt(event.target.value);
    setSelectedStoryIndex(storyIndex);
    setSelectedStory(storiesData.stories[storyIndex].phrases);
    
    resetGame();

    const shuffledPhrases = shuffleArray(storiesData.stories[storyIndex].phrases);
    setPhrases(shuffledPhrases);
  };

  const resetGame = () => {
    setAttempts(0);
    setSuccesses(0);
    setMessage('');
    setMessageType('');
    setShowReadStoryButton(false);
    setIsStoryRead(false);
    setShowInstructions(true);
  };

  useEffect(() => {
    const shuffledPhrases = shuffleArray(selectedStory);
    setPhrases(shuffledPhrases);
  }, [selectedStory]);

  const checkOrder = () => {
    setAttempts(attempts + 1);
    const currentOrder = Array.from(document.querySelectorAll('.phrase'));
    let correctCount = 0;

    currentOrder.forEach((phrase, index) => {
      if (phrase.textContent === selectedStory[index]) {
        phrase.classList.add('correct');
        correctCount++;
      } else {
        phrase.classList.remove('correct');
      }
    });

    if (correctCount === selectedStory.length) {
      setSuccesses(successes + 1);
      setMessage(<div className="instructions">
        <h2>Bravo ! Tu as réussi ! Maintenant, tu peux :</h2>
        <ol>
          <li>Recopier l'histoire sur ton cahier.</li>
          <li>Faire un joli dessin pour chaque phrase.</li>
          <li>Colorier tes dessins avec tes crayons préférés.</li>
        </ol>
        <p>Amuse-toi bien !</p>
      </div>);
      setMessageType('success');
      setShowReadStoryButton(true);
    } else {
      setMessage(`Tu as ${correctCount} phrase${correctCount > 1 ? 's' : ''} bien placée${correctCount > 1 ? 's' : ''}. Corrige les autres phrases.`);
      setMessageType('error');
    }
  };

  const restartGame = () => {
    resetGame();
    const shuffledPhrases = shuffleArray(selectedStory);
    setPhrases(shuffledPhrases);
  };

  const startGame = () => {
    setShowInstructions(false);
  };

  const readStory = () => {
    setIsStoryRead(true);
  };

  const speakStory = () => {
    const storyText = selectedStory.join('. ');
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Choisis ton histoire</h1>
      <select onChange={handleStoryChange} className={styles.select} value={selectedStoryIndex}>
        {storiesData.stories.map((story, index) => (
          <option key={index} value={index}>
            {`Histoire ${index + 1} : ${story.title}`}
          </option>
        ))}
      </select>

      {showInstructions ? (
        <div className={styles.instructions}>
          <h2>Consigne :</h2>
          <p>Range les phrases dans l'ordre pour raconter l'histoire.</p>
          <ol>
            <li>Clique sur une phrase et fais-la glisser pour la déplacer.</li>
            <li>Mets les phrases dans l'ordre du matin au soir.</li>
            <li>Quand tu as fini, clique sur le bouton vert "Vérifier".</li>
            <li>Les phrases bien placées deviendront vertes !</li>
          </ol>
          <button onClick={startGame} className={styles.startButton}>Commencer</button>
        </div>
      ) : (
        <>
          <PhraseList phrases={phrases} />
          <Buttons checkOrder={checkOrder} restartGame={restartGame} />
          <Message message={message} messageType={messageType} />
          <Stats attempts={attempts} successes={successes} />

          {showReadStoryButton && (
            <div className={styles.readStoryContainer}>
              <button className={styles.readStoryButton} onClick={readStory}>
                Lire l'histoire
              </button>
              <button className={styles.listenStoryButton} onClick={speakStory}>
                Écouter l'histoire
              </button>
            </div>
          )}

          {isStoryRead && (
            <div className={styles.story}>
              <h2>L'histoire complète :</h2>
              {selectedStory.map((phrase, index) => (
                <p key={index}>{phrase}</p>
              ))}
            </div>
          )}
        </>
      )}
      <br />
    </div>
  );
};

export default Jeuhistoire;