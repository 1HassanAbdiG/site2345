import React, { useEffect } from 'react';
import styles from './mathematiques.module.css';
import { Link } from 'react-router-dom';

const Mathematiques = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles['topic-card']}`);
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });

    const progressBars = document.querySelectorAll(`.${styles['progress']}`);
    progressBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      setTimeout(() => {
        bar.style.width = progress + '%';
      }, 500);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1>Mathématiques</h1>

      <div className={styles['topic-grid']}>
        {/* Carte 1 */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#4CAF50" strokeWidth="5" />
          </svg>
          <h3>Addition et Soustraction</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Nombres jusqu'à 1000, calcul mental et problèmes</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="75"></div>
          </div>
          <Link to="/addSoustraction" className={styles.button}>
            Pratiquer2
          </Link>

        </div>

        {/* Carte 2 */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#2196F3" opacity="0.2" />
            <path d="M30 50 L70 50 M40 40 L60 60 M40 60 L60 40" stroke="#2196F3" strokeWidth="5" />
          </svg>
          <h3>Multiplication</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
          </div>
          <p>Tables de multiplication et problèmes pratiques</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="45"></div>
          </div>
          <Link to="/multiplication" className={styles.button}>
            Pratiquer
          </Link>
        </div>

        {/* Carte 3 */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#FF9800" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70 M35 35 L65 65" stroke="#FF9800" strokeWidth="5" />
          </svg>
          <h3>Fractions</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Introduction aux fractions simples</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="30"></div>
          </div>
          <Link to="/faction" className={styles.button}> Découvrir</Link>


        </div>
        {/* Carte Monnaie */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#4CAF50" strokeWidth="5" />
            <text x="50" y="55" textAnchor="middle" fill="#4CAF50" fontSize="20" fontWeight="bold">$</text>
          </svg>
          <h3>Monnaie</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Exercices sur les pièces et billets canadiens</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="50"></div>
          </div>
          <Link to="/exerciseMonnaie" className={styles.button}>Découvrir</Link>
        </div>


        {/* Carte 4 */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#9C27B0" opacity="0.2" />
            <rect x="30" y="30" width="40" height="40" stroke="#9C27B0" strokeWidth="5" fill="none" />
          </svg>
          <h3>Géométrie</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Formes géométriques et mesures</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="60"></div>
          </div>
          <Link to="/exerciseDecimaux" className={styles.button}> Explorer</Link>

        </div>
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#FFC107" opacity="0.2" />
            <path d="M30 50 L70 50 M40 40 L60 60 M40 60 L60 40" stroke="#FFC107" strokeWidth="5" />
          </svg>
          <h3>Ajouter et soustraire des nombres décimaux</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Travail sur les nombres décimaux jusqu'aux centièmes.</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="50"></div>
          </div>
          <Link to="/exerciseDecimaux" className={styles.button}>Commencer</Link>
        </div>
      
    <div className={styles['topic-card']}>
      <svg viewBox="0 0 100 100" width="60" height="60">
        <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
        <path d="M30 50 L70 50 M50 30 L50 70" stroke="#4CAF50" strokeWidth="5" />
      </svg>
      <h3>Multiplier et diviser des nombres décimaux</h3>
      <div className={styles['difficulty-indicator']}>
        <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
        <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
        <span className={styles['difficulty-dot']}></span>
      </div>
      <p>Travail sur la multiplication et la division des nombres décimaux.</p>
      <div className={styles['progress-bar']}>
        <div className={styles['progress']} data-progress="50"></div>
      </div>
      <Link to="/exerciseMultiplicationDivision" className={styles.button}>Commencer</Link>
    </div>







        {/* Nouvelle Carte - Statistiques et probabilités */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#FF5722" opacity="0.2" />
            <line x1="30" y1="70" x2="50" y2="50" stroke="#FF5722" strokeWidth="5" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="#FF5722" strokeWidth="5" />
          </svg>
          <h3>Statistiques et Probabilités</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Introduction aux concepts de données et probabilités</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="20"></div>
          </div>
          <Link to="/exerciseDecimaux" className={styles.button}> Explorer</Link>


        </div>
        {/* Nouvelle Carte - Suites Numériques */}
        <div className={styles['topic-card']}>
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#2196F3" opacity="0.2" />
            <line x1="30" y1="70" x2="50" y2="50" stroke="#2196F3" strokeWidth="5" />
            <line x1="50" y1="50" x2="70" y2="30" stroke="#2196F3" strokeWidth="5" />
          </svg>
          <h3>Suites Numériques</h3>
          <div className={styles['difficulty-indicator']}>
            <span className={`${styles['difficulty-dot']} ${styles.active}`}></span>
            <span className={styles['difficulty-dot']}></span>
            <span className={styles['difficulty-dot']}></span>
          </div>
          <p>Exercez-vous à compléter des suites logiques de nombres selon des règles simples.</p>
          <div className={styles['progress-bar']}>
            <div className={styles['progress']} data-progress="40"></div>
          </div>
          <Link to="/exerciseSuite" className={styles.button}> Explorer</Link>
        </div>

      </div>
    </div>
  );
};

export default Mathematiques;
