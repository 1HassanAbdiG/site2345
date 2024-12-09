import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link depuis react-router-dom
import styles from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle menu

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu open/close state
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo et titre */}
        <div className={styles.logoContainer}>
          <img
            src="/imag/logo1.png"
            alt="Logo de l'école"
            className={styles.logo}
          />
          <div className={styles.textContent}>
            <h1>Ibn Batouta</h1>
            <p>Your online educational resource</p>
          </div>
        </div>

        {/* Icône hamburger pour le menu mobile */}
        <div className={styles.hamburger} onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </div>

        {/* Menu de navigation */}
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
