import React, { useState, useEffect } from 'react';
import PhraseList from './PhraseList';
import Buttons from './Buttons';
import Message from './Message';
import Stats from './Stats';
import '../styles/styles.css';
import storiesData from '../data/phrases.json';

const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const Jeuhistoire = () => {
  const [selectedStory, setSelectedStory] = useState(storiesData.stories[0].phrases);
  const [phrases, setPhrases] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showReadStoryButton, setShowReadStoryButton] = useState(false); // Ajouter un état pour afficher le bouton
  const [isStoryRead, setIsStoryRead] = useState(false); // Pour gérer l'affichage de l'histoire

  // Fonction de réinitialisation complète lorsque l'utilisateur choisit une nouvelle histoire
  const handleStoryChange = (event) => {
    const storyIndex = event.target.value;
    
    // Réinitialiser l'état
    setSelectedStory(storiesData.stories[storyIndex].phrases);
    setAttempts(0);  // Réinitialiser les tentatives
    setSuccesses(0); // Réinitialiser les réussites
    setMessage('');  // Vider les messages
    setMessageType(''); // Réinitialiser le type de message
    setShowReadStoryButton(false);  // Masquer le bouton de lecture de l'histoire
    setIsStoryRead(false); // Masquer l'histoire lue
    setShowInstructions(true); // Réafficher les instructions

    // Mélanger les phrases de la nouvelle histoire sélectionnée
    const shuffledPhrases = shuffleArray(storiesData.stories[storyIndex].phrases);
    setPhrases(shuffledPhrases);
  };

  useEffect(() => {
    // Lors de l'initialisation de l'application, mélanger les phrases de la première histoire
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
      setShowReadStoryButton(true); // Afficher le bouton pour lire l'histoire
    } else {
      setMessage(`Tu as ${correctCount} phrase${correctCount > 1 ? 's' : ''} bien placée${correctCount > 1 ? 's' : ''}. Corrige les autres phrases.`);
      setMessageType('error');
    }
  };

  const restartGame = () => {
    setAttempts(0);
    setSuccesses(0);
    setMessage('');
    setMessageType('');
    const shuffledPhrases = shuffleArray(selectedStory);
    setPhrases(shuffledPhrases);
    setShowReadStoryButton(false);
    setIsStoryRead(false);
  };

  const startGame = () => {
    setShowInstructions(false); // Masquer les consignes lorsque le jeu commence
  };

  const readStory = () => {
    setIsStoryRead(true); // Afficher l'histoire dans l'ordre correct
  };

  const speakStory = () => {
    const storyText = selectedStory.join('. '); // Convertir les phrases en texte complet
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.lang = 'fr-FR'; // Spécifier la langue (français)
    window.speechSynthesis.speak(utterance); // Lancer la synthèse vocale
  };

  return (
    <div className="container">
      <h1>Choisis ton histoire</h1>
      <select onChange={handleStoryChange}>
        <option value="0">La journée de Marie</option>
        <option value="1">Une journée à la plage</option>
        <option value="2">La fête d'anniversaire</option>
        <option value="3">Une sortie au zoo</option>
      </select>

      {showInstructions ? (
        <div className="instructions">
          <h2>Consigne :</h2>
          <p>Range les phrases dans l'ordre pour raconter l'histoire.</p>
          <ol>
            <li>Clique sur une phrase et fais-la glisser pour la déplacer.</li>
            <li>Mets les phrases dans l'ordre du matin au soir.</li>
            <li>Quand tu as fini, clique sur le bouton vert "Vérifier".</li>
            <li>Les phrases bien placées deviendront vertes !</li>
          </ol>
          <button onClick={startGame}>Commencer</button>
        </div>
      ) : (
        <>
          <PhraseList phrases={phrases} />
          <Buttons checkOrder={checkOrder} restartGame={restartGame} />
          <Message message={message} messageType={messageType} />
          <Stats attempts={attempts} successes={successes} />

          {showReadStoryButton && (
            <>
              <button className="read-story-btn" onClick={readStory}>
                Lire l'histoire
              </button>
              <button className="listen-story-btn" onClick={speakStory}>
                Écouter l'histoire
              </button>
            </>
          )}

          {isStoryRead && (
            <div className="story">
              <h2>L'histoire complète :</h2>
              {selectedStory.map((phrase, index) => (
                <p key={index}>{phrase}</p>
              ))}
            </div>
          )}
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default Jeuhistoire;
