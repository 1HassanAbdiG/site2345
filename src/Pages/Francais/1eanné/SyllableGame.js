import React, { useState, useEffect } from "react";
import styles from "./SyllableGame.module.css"; // CSS Module pour les styles
import wordsData from "./mots.json"; // JSON contenant les mots et syllabes

const SyllableGame = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [selectedSyllables, setSelectedSyllables] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [playedWords, setPlayedWords] = useState([]); // Liste des mots déjà joués

  useEffect(() => {
    nextWord();
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const nextWord = () => {
    if (wordsData.length === 0) {
      setMessage("Aucun mot disponible dans le JSON.");
      return;
    }
    const randomWord = wordsData[Math.floor(Math.random() * wordsData.length)];
    setCurrentWord(randomWord);
    setSelectedSyllables([]);
    setMessage(""); // Réinitialiser le message
  };

  const addSyllable = (syllable) => {
    setSelectedSyllables((prev) => [...prev, syllable]);
  };

  const verifyWord = () => {
    if (!currentWord) return;

    const assembledWord = selectedSyllables.join("");
    if (assembledWord === currentWord.word) {
      setScore(score + 10);
      setMessage("✅ Bravo ! Mot correct !");
      setPlayedWords((prevWords) => [...prevWords, currentWord.word]); // Ajouter le mot joué
      nextWord();
    } else {
      setMessage("❌ Mot incorrect, réessayez !");
    }
  };

  const resetWord = () => {
    setSelectedSyllables([]);
    setMessage("Les syllabes ont été réinitialisées.");
  };

  const readSyllable = (syllable) => {
    const utterance = new SpeechSynthesisUtterance(syllable);
    utterance.lang = "fr-FR";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const readWord = (word) => {
    if (playedWords.includes(word)) {
      setMessage("Ce mot a déjà été joué.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "fr-FR";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
    setMessage("Lecture du mot : " + word);
    setPlayedWords((prevWords) => [...prevWords, word]); // Ajouter le mot à la liste des mots lus
  };

  return (
    <div className={styles.container}>
      <h1>🌟 L'Aventure des Syllabes 🌟</h1>
      <p className={styles.instructions}>
        Assemblez les syllabes pour former le mot correct.
      </p>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.wordContainer}>
        {selectedSyllables.join("") || "Construisez le mot ici !"}
      </div>

      <div className={styles.syllables}>
        {currentWord &&
          shuffleArray(currentWord.syllables).map((syllable, index) => (
            <button
              key={index}
              className={styles.syllable}
              onClick={() => {
                addSyllable(syllable);
                readSyllable(syllable);
              }}
            >
              {syllable}
            </button>
          ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.resetBtn} onClick={resetWord}>
          Réinitialiser
        </button>
        <button className={styles.verifyBtn} onClick={verifyWord}>
          Vérifier
        </button>
        <button className={styles.nextBtn} onClick={nextWord}>
          Mot Suivant
        </button>
      </div>

      <div className={styles.score}>Score : {score}</div>

      <div className={styles.playedWords}>
        <h3>Mots joués :</h3>
        <table className={styles.wordsTable}>
          <thead>
            <tr>
              <th>Mot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {playedWords.map((word, index) => (
              <tr key={index}>
                <td>{word}</td>
                <td>
                  <button
                    className={styles.readBtn}
                    onClick={() => readWord(word)}
                  >
                    Lire
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SyllableGame;
