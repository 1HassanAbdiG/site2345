import React, { useState, useEffect, useCallback } from 'react';
import storiesData from './storiesData;.json'; // corrigé
import './StoryOrderGame.css'; // Ajoute ce fichier CSS pour le style


// Fonction d'import d'image
const importImage = (imageName) => {
  try {
    return require(`./image/${imageName}`);
  } catch (err) {
    console.error(`Image not found: ${imageName}`);
    return null;
  }
};

const StoryOrderGame = () => {
    
  const [hasValidated, setHasValidated] = useState(false);
  const [statsByStory, setStatsByStory] = useState({});
  const [selectedStoryId, setSelectedStoryId] = useState(storiesData[0].id);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [feedback, setFeedback] = useState('');

  const selectedStory = storiesData.find((story) => story.id === selectedStoryId);

  
  
  
  const resetGame = useCallback(() => {
    const shuffled = [...selectedStory.images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    setUserOrder([]);
    setFeedback('');
    setHasValidated(false);
  }, [selectedStory]);

  
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  
  


  const handleSubmit = () => {
    if (hasValidated) {
      setFeedback('Vous avez déjà validé. Cliquez sur "Réinitialiser" pour recommencer.');
      return;
    }

    if (userOrder.length !== selectedStory.images.length) {
      setFeedback('Veuillez sélectionner toutes les images.');
      return;
    }

    const correctOrder = [...selectedStory.images].sort((a, b) => a.correctOrder - b.correctOrder);
    const score = userOrder.reduce((acc, img, idx) => (
      acc + (img.id === correctOrder[idx].id ? 1 : 0)
    ), 0);

    setHasValidated(true);
    setFeedback(score === correctOrder.length
      ? 'Bravo ! Vous avez trouvé le bon ordre.'
      : `Vous avez obtenu ${score} sur ${correctOrder.length}.`
    );

    setStatsByStory(prev => {
      const currentStats = prev[selectedStoryId] || {
        attempts: 0,
        firstTryScore: null,
        bestScore: null,
        worstScore: null,
      };

      const newAttempts = currentStats.attempts + 1;

      return {
        ...prev,
        [selectedStoryId]: {
          attempts: newAttempts,
          firstTryScore: currentStats.firstTryScore ?? score,
          bestScore: currentStats.bestScore !== null ? Math.max(currentStats.bestScore, score) : score,
          worstScore: currentStats.worstScore !== null ? Math.min(currentStats.worstScore, score) : score,
        }
      };
    });
  };

  const handleImageClick = (image) => {
    if (userOrder.includes(image)) {
      // Supprimer l'image si elle est déjà sélectionnée
      setUserOrder(userOrder.filter(img => img !== image));
    } else {
      // Ajouter l'image sinon
      setUserOrder([...userOrder, image]);
    }
  };
  

  const handleReset = () => {
    resetGame();
  };

  return (
    <div className="game-container">
      <h2>Jeu d'ordre d'images</h2>

      <label>
        Choisir une histoire :
        <select value={selectedStoryId} onChange={(e) => setSelectedStoryId(e.target.value)}>
          {storiesData.map((story) => (
            <option key={story.id} value={story.id}>
              {story.title}
            </option>
          ))}
        </select>
      </label>

      <h3>Images mélangées :</h3>
      <div className="image-grid">
        {shuffledImages.map((image) => (
          <img
            key={image.id}
            src={importImage(image.src)}
            alt=""
            className={`image-item ${userOrder.includes(image) ? 'selected' : ''}`}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>

      <h3>Votre sélection :</h3>
      <div className="image-grid small">
        {userOrder.map((image, index) => (
          <img
            key={index}
            src={importImage(image.src)}
            alt=""
            className="image-selected"
          />
        ))}
      </div>

      <div className="buttons">
        <button onClick={handleSubmit}>Valider</button>
        {hasValidated && (
          <button onClick={handleReset}>Réinitialiser</button>
        )}
      </div>
     

      {feedback && <p className="feedback">{feedback}</p>}

      {statsByStory[selectedStoryId] && (
        <div className="stats">
          <h4>Bilan pour : {selectedStory.title}</h4>
          <p>Nombre de tentatives : {statsByStory[selectedStoryId].attempts}</p>
          <p>Score du 1er essai : {statsByStory[selectedStoryId].firstTryScore} / {selectedStory.images.length}</p>
          <p>Meilleur score : {statsByStory[selectedStoryId].bestScore} / {selectedStory.images.length}</p>
          <p>Pire score : {statsByStory[selectedStoryId].worstScore} / {selectedStory.images.length}</p>
        </div>
      )}
     
    </div>
  );
};

export default StoryOrderGame;
