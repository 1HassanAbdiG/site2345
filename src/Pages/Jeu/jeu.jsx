import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importer Link de react-router-dom
import styles from '../Accueil.module.css';

const JeuEdu = () => {
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    // Déclencher l'animation quand le composant est monté
    setCardsVisible(true);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Bienvenue dans votre espace d'apprentissage en Français </h1>
      <div className={styles.subjectCards}>
        {/* Section Histoire */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#FF9800" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#FF9800" strokeWidth="5" />
            <text x="50" y="85" textAnchor="middle" fill="#FF9800" fontSize="12">Histoire</text>
          </svg>
          <h2>Histoire</h2>
          <p>Explorez des récits fascinants et plongez dans l'univers des contes et légendes.</p>
          <Link to="/francais/histoire" className={styles.button}>Explorer</Link>
        </div>

        {/* Section Compréhension */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#4CAF50" strokeWidth="5" />
            <text x="50" y="85" textAnchor="middle" fill="#4CAF50" fontSize="12">Compréhension</text>
          </svg>
          <h2>Compréhension</h2>
          <p>Renforcez vos compétences en lecture avec des exercices variés basés sur des textes captivants.</p>
          <Link to="/jeu/comprehension" className={styles.button}>Explorer</Link>
        </div>

        {/* Jeu de Conjugaison */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#2196F3" opacity="0.2" />
            <path d="M30 40 Q50 20 70 40" fill="none" stroke="#2196F3" strokeWidth="3" />
            <path d="M30 50 L70 50 M30 60 L70 60" stroke="#2196F3" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#2196F3" fontSize="12">Jeu de Conjugaison</text>
          </svg>
          <h2>Jeu de Conjugaison</h2>
          <p>Amusez-vous tout en apprenant les conjugaisons des verbes français.</p>
          <Link to="/jeu/jeu-conjugaison" className={styles.button}>Jouer</Link>
        </div>

        {/* Jeu de Grammaire */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#FF9800" opacity="0.2" />
            <path d="M35 35 L65 35 L50 65 Z" fill="#FF9800" opacity="0.5" />
            <circle cx="50" cy="45" r="15" fill="none" stroke="#FF9800" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#FF9800" fontSize="12">Jeu de Grammaire</text>
          </svg>
          <h2>Jeu de Grammaire</h2>
          <p>Testez vos connaissances grammaticales à travers des jeux ludiques.</p>
          <Link to="/jeu/jeu-grammaire" className={styles.button}>Jouer</Link>
        </div>
      </div>
    </div>
  );
};

export default JeuEdu ;
