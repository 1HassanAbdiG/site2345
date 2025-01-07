import React, { useState } from 'react';
import textes from './sentences.json'; // Ensure you have the correct path to your JSON file
import styles from './lecture.module.css'; // Import the CSS module
//import Questions from './questions.json'; // Ensure the path to your questions JSON file is correct
import Questionnaire from './questionnaires'; // Import the Questionnaire component
import { Button, ButtonGroup } from '@mui/material'; // Material-UI components for buttons
import PhraseReconstruction from './PhraseReconstruction';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Icon for play button
import QuizIcon from '@mui/icons-material/Quiz'; // Icon for quiz button
import LanguageIcon from '@mui/icons-material/Language'; // Icon for language toggle button


const Lecture = () => {
  const [selectedStoryKey, setSelectedStoryKey] = useState('LaLecture'); // Default story
  const [language, setLanguage] = useState('fr'); // State to track the selected language
  const [visibleSection, setVisibleSection] = useState('story'); // Track the currently visible section

  const selectedStory = textes.textes[selectedStoryKey];

  // Function to change the story
  const handleStoryChange = (event) => {
    const selectedKey = event.target.value;
    setSelectedStoryKey(selectedKey);
    setVisibleSection('story'); // Reset to story section when changing stories
  };

  // Function to read a sentence with speech synthesis
  const speakSentence = (sentence) => {
    const utterance = new SpeechSynthesisUtterance(language === 'fr' ? sentence.fr : sentence.en);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    window.speechSynthesis.speak(utterance); // Start speech synthesis
  };

  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'fr' ? 'en' : 'fr'));
  };

  // Function to toggle visibility of components
  const toggleComponent = (component) => {
    setVisibleSection(component);
  };

  return (
    <div className={styles.container}>
      {/* Button group for toggling sections */}
      <ButtonGroup variant="contained" color="primary" aria-label="primary button group" style={{ marginBottom: '20px' }}>
  <Button 
    onClick={() => toggleComponent('story')} 
    startIcon={<PlayArrowIcon />} 
    sx={{
      backgroundColor: '#1976d2',
      '&:hover': {
        backgroundColor: '#1565c0',
      },
      padding: '10px 20px',
      fontWeight: 'bold',
    }}
  >
    Lecture avec audio
  </Button>
  <Button 
    onClick={() => toggleComponent('questionnaire')} 
    startIcon={<QuizIcon />} 
    sx={{
      backgroundColor: '#388e3c',
      '&:hover': {
        backgroundColor: '#2c6b2f',
      },
      padding: '10px 20px',
      fontWeight: 'bold',
    }}
  >
    Compréhension
  </Button>
  <Button 
    onClick={() => toggleComponent('phraseReconstruction')} 
    startIcon={<LanguageIcon />} 
    sx={{
      backgroundColor: '#fbc02d',
      '&:hover': {
        backgroundColor: '#f9a825',
      },
      padding: '10px 20px',
      fontWeight: 'bold',
    }}
  >
    Reconstruction des phrases
  </Button>
</ButtonGroup>

      {/* Render selected component based on visibleSection state */}
      {visibleSection === 'story' && (
        <div className={styles.storyContainer}>
          <h1 className={styles.title}>Lecture</h1>
          <p>
            <strong>Consigne :</strong>
            <ol>
              <li>Sélectionnez un texte dans le menu déroulant.</li>
              <li>Lisez le texte plusieurs fois pour bien le comprendre.</li>
              <li>Si vous souhaitez écouter le texte, cliquez sur la flèche audio à droite de la phrase.</li>
              <li>Essayez de répéter ce que vous entendez pour améliorer votre prononciation.</li>
              <li>Vous pouvez passer en anglais pour mieux comprendre le texte.</li>
            </ol>
          </p>
          <select onChange={handleStoryChange} value={selectedStoryKey} className={styles.select}>
          {Object.keys(textes.textes).map((key, index) => (
            <option key={index} value={key}>
              {key.replace(/([A-Z])/g, ' $1').trim()} {/* Format key for display */}
            </option>
          ))}
        </select>

          {/* Language Toggle Button */}
          <Button onClick={toggleLanguage} color="default" style={{ marginBottom: '20px' }}>
            {language === 'fr' ? "Passer à l'Anglais (EN)" : "Passer au Français (FR)"}
          </Button>

          {/* Story sentences */}
          {selectedStory.map((sentence, index) => (
            <div key={index} className={styles.sentenceCard}>
              <p className={styles.sentence}>
                {language === 'fr' ? sentence.fr : sentence.en}
                <span
                  className={styles.playButton}
                  onClick={() => speakSentence(sentence)}
                  role="button"
                  aria-label="Lire la phrase"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && speakSentence(sentence)}
                >
                  {' ▶'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Render Questionnaire Component */}
      {visibleSection === 'questionnaire' && <Questionnaire />}

      {/* Render Phrase Reconstruction Component */}
      {visibleSection === 'phraseReconstruction' && <PhraseReconstruction />}
    </div>
  );
};

export default Lecture;
