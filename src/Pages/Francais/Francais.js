import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importer Link de react-router-dom
import styles from '../Accueil.module.css';


const Francais = () => {
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
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#FF9800" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#FF9800" strokeWidth="5" />
            <text x="50" y="85" textAnchor="middle" fill="#FF9800" fontSize="12">
              Histoire
            </text>
          </svg>
          <h2>Histoire</h2>
          <p>
            Explorez des récits fascinants et plongez dans l'univers des contes et légendes.
          </p>
          <Link to="/francais/histoire" className={styles.button}>
            Explorer
          </Link>
        </div>

        {/* Section Compréhension */}
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#4CAF50" strokeWidth="5" />
            <text x="50" y="85" textAnchor="middle" fill="#4CAF50" fontSize="12">
              Compréhension
            </text>
          </svg>
          <h2>Compréhension</h2>
          <p>
            Renforcez vos compétences en lecture avec des exercices variés basés sur des textes
            captivants.
          </p>
          <Link to="/francais/comprehension" className={styles.button}>
            Explorer
          </Link>
        </div>

        {/* Section Conjugaison */}
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#2196F3" opacity="0.2" />
            <path d="M30 40 Q50 20 70 40" fill="none" stroke="#2196F3" strokeWidth="3" />
            <path d="M30 50 L70 50 M30 60 L70 60" stroke="#2196F3" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#2196F3" fontSize="12">
              Conjugaison
            </text>
          </svg>
          <h2>Conjugaison</h2>
          <p>
            Maîtrisez la conjugaison française avec des activités interactives et des défis.
          </p>
          <Link to="/francais/conjugaison" className={styles.button}>
            Pratiquer
          </Link>
        </div>

        {/* Section Grammaire */}
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#FF9800" opacity="0.2" />
            <path d="M35 35 L65 35 L50 65 Z" fill="#FF9800" opacity="0.5" />
            <circle cx="50" cy="45" r="15" fill="none" stroke="#FF9800" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#FF9800" fontSize="12">
              Grammaire
            </text>
          </svg>
          <h2>Grammaire</h2>
          <p>
            Explorez les règles de grammaire avec des explications claires et des exercices ciblés.
          </p>
          <Link to="/francais/grammaire" className={styles.button}>
            Découvrir
          </Link>
        </div>

        {/* Section Dictée */}
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#E91E63" opacity="0.2" />
            <rect x="35" y="35" width="30" height="30" fill="#E91E63" opacity="0.5" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="#E91E63" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#E91E63" fontSize="12">
              Dictée
            </text>
          </svg>
          <h2>Dictée</h2>
          <p>
            Entraînez votre orthographe en écrivant à partir de nos dictées audio interactives.
          </p>
          <Link to="/francais/dictee" className={styles.button}>
            S'entraîner
          </Link>
        </div>
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#9C27B0" opacity="0.2" />
            <path d="M30 40 Q50 20 70 40" fill="none" stroke="#9C27B0" strokeWidth="3" />
            <path d="M30 50 L70 50 M30 60 L70 60" stroke="#9C27B0" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#9C27B0" fontSize="12">
              Associer
            </text>
          </svg>
          <h2>Associer</h2>
          <p>
            Reliez les mots ou expressions pour découvrir leurs significations et utilisations.
          </p>
          <Link to="/francais/associer" className={styles.button}>
            Associer
          </Link>
        </div>
        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#FF5722" opacity="0.2" />
            <path d="M30 40 Q50 20 70 40" fill="none" stroke="#FF5722" strokeWidth="3" />
            <path d="M30 50 L70 50 M30 60 L70 60" stroke="#FF5722" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#FF5722" fontSize="12">
              Intrus
            </text>
          </svg>
          <h2>Intrus</h2>
          <p>
            Repérez l'intrus parmi différentes listes et améliorez vos compétences d'observation.
          </p>
          <Link to="/francais/intrus" className={styles.button}>
            Découvrir
          </Link>
        </div>

        <div
          className={`${styles.card} ${cardsVisible ? styles.cardVisible : ''}`}
        >
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M30 40 Q50 20 70 40" fill="none" stroke="#4CAF50" strokeWidth="3" />
            <path d="M30 50 L70 50 M30 60 L70 60" stroke="#4CAF50" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#4CAF50" fontSize="12">
              Construction
            </text>
          </svg>
          <h2>Construction de phrases</h2>
          <p>
            Apprenez à construire des phrases correctes et développez vos compétences linguistiques.
          </p>
          <Link to="/francais/construction" className={styles.button}>
            Construire
          </Link>
        </div>


      </div>
    </div>

  );
};

export default Francais;

