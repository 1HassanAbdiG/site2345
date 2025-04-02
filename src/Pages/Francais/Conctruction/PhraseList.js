import React, { useEffect, useState } from 'react';

const PhraseList = ({ phrases }) => {
  const [currentOrder, setCurrentOrder] = useState(phrases);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState('');

  useEffect(() => {
    setCurrentOrder(phrases); // Met à jour l'ordre actuel lorsque les phrases changent
  }, [phrases]);

  const handleDragStart = (index) => (e) => {
    e.dataTransfer.setData('draggedIndex', index);
  };

  const handleDrop = (index) => (e) => {
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    const newOrder = [...currentOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setCurrentOrder(newOrder);
  };

  const speakPhrase = (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'fr-FR'; // Spécifier la langue française

    setIsPlaying(true);
    setCurrentPhrase(phrase);

    utterance.onend = () => {
      setIsPlaying(false); // Réinitialiser l'état lorsque l'audio se termine
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="game-container">
      {currentOrder.map((phrase, index) => (
        <div
          key={index}
          className="phrase"
          draggable
          onDragStart={handleDragStart(index)}
          onDrop={handleDrop(index)}
          onDragOver={(e) => e.preventDefault()}
        >
             <button
            className={`listen-phrase-btn ${isPlaying && currentPhrase === phrase ? 'active' : ''}`}
            onClick={() => speakPhrase(phrase)}
          >
            <img src="/audio.png" alt="Speak" style={{ width: '20px', height: '20px' }} />
          </button>
          <span style={{marginLeft:'20px'}} className={isPlaying && currentPhrase === phrase ? 'playing' : ''}>
            {phrase}
          </span>
         
        </div>
      ))}
    </div>
  );
};

export default PhraseList;
