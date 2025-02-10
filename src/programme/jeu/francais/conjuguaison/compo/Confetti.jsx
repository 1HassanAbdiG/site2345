import React from 'react';
import styles from '../styless/V1.module.css';

const createConfetti = () => {
  for (let i = 0; i < 50; i++) {
    let confetti = document.createElement('div');
    confetti.className = styles.confetti;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
};

export default createConfetti;
