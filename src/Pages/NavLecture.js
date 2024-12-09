
// Nav.js
import React from "react";
import { Link } from "react-router-dom";
import styles from './Accueil.module.css';

const NavLecture = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to="/lecture/niveau2">Facile</Link>
        </li>
        <li>
          <Link to="/lecture/niveau3">Moyen</Link>
        </li>
        <li>
          <Link to="/lecture/niveau3">Difficile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavLecture;
