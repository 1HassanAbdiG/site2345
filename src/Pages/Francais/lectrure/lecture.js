import React, { useState } from 'react';
import textes from './sentences.json'; // Ensure you have the correct path to your JSON file
import styles from './lecture.module.css'; // Import the CSS module
import Questions from './questions.json'; // Make sure the path to your questions JSON file is correct
import Questionnaire from './questionnaires'; // Import the Questionnaire component
import { Button } from '@mui/material'; // Ensure MUI is installed
import PhraseReconstruction from './PhraseReconstruction';

const Lecture = () => {
  const [selectedStoryKey, setSelectedStoryKey] = useState('LaLecture'); // Default story
  const [language, setLanguage] = useState('fr'); // State to track the selected language
  const [visibleSection, setVisibleSection] = useState('story'); // Track the currently visible section
  const [submittedAnswers, setSubmittedAnswers] = useState(null); // State to store submitted answers

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
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US'; // Specify the language
    window.speechSynthesis.speak(utterance); // Start speech synthesis
  };

  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'fr' ? 'en' : 'fr'));
  };

  // Function to get questions based on the selected story
  const getQuestionsForStory = () => {
    return Questions[selectedStoryKey] || []; // Adjust this to match your questions structure
  };

  const handleQuestionnaireSubmit = (answers) => {
    console.log('Submitted answers:', answers);
    setSubmittedAnswers(answers); // Store submitted answers
    setVisibleSection('story'); // Reset to story section after submission
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lecture </h1>
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


      {/* Story selection */}
      <select onChange={handleStoryChange} value={selectedStoryKey} className={styles.select}>
        {Object.keys(textes.textes).map((key, index) => (
          <option key={index} value={key}>
            {key.replace(/([A-Z])/g, ' $1').trim()} {/* Format the key for display */}
          </option>
        ))}
      </select>

      {/* Language Toggle Button */}
      <button onClick={toggleLanguage} className={styles.languageButton} style={{ marginRight:"20px"}}>
        {language === 'fr' ? 'Passer à l\'Anglais (EN)' : 'Passer au Français (FR)'}
      </button>

      {/* Render story and sentence cards only when the story section is visible */}
      {visibleSection === 'story' && (
        <div className={styles.storyContainer}>
          {/* Display the story and buttons for each sentence */}
          {selectedStory.map((sentence, index) => (
            <div key={index} className={styles.sentenceCard}>
              <p className={styles.sentence}>
                {language === 'fr' ? sentence.fr : sentence.en}
                <span
                  className={styles.playButton}
                  onClick={() => speakSentence(sentence)}
                  role="button"
                  aria-label="Lire la phrase"
                  tabIndex={0} // Make it focusable for accessibility
                  onKeyPress={(e) => e.key === 'Enter' && speakSentence(sentence)} // Handle Enter key for accessibility
                >
                  {' ▶'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Button to toggle Questionnaire visibility */}
      {visibleSection !== 'questionnaire' && ( // Show the Questionnaire button only if the Questionnaire is not visible
        <Button variant="contained" color="primary" onClick={() => {
          setVisibleSection(prev => (prev === 'questionnaire' ? 'story' : 'questionnaire'));
        }}>
          {visibleSection === 'questionnaire' ? 'Cacher le Questionnaire' : 'Montrer le Questionnaire'}
        </Button>
      )}

      {/* Display the Questionnaire if the flag is true */}
      {visibleSection === 'questionnaire' && (
        <Questionnaire
          questions={getQuestionsForStory()}
          onSubmit={handleQuestionnaireSubmit}
        />
      )}

      {/* Optional: Display submitted answers */}
      {submittedAnswers && (
        <div>
          <h3>Vos Réponses :</h3>
          <pre>{JSON.stringify(submittedAnswers, null, 2)}</pre>
        </div>
      )}

      <br></br>
      <br></br>
      

      {/* Button to toggle Phrase Reconstruction */}
      {visibleSection !== 'phraseReconstruction' && ( // Show the Phrase Reconstruction button only if the Phrase Reconstruction is not visible
        <Button
          variant="contained"
          color="secondary"
          style={{ gap: "20px" }}
          onClick={() => {
            setVisibleSection(prev => (prev === 'phraseReconstruction' ? 'story' : 'phraseReconstruction'));
          }}
        >
          {visibleSection === 'phraseReconstruction' ? 'Cacher la Reconstruction de Phrase' : 'Montrer la Reconstruction de Phrase'}
        </Button>
      )}

      {/* Display Phrase Reconstruction if the flag is true */}
      {visibleSection === 'phraseReconstruction' && (
        <PhraseReconstruction />
      )}

      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default Lecture;
