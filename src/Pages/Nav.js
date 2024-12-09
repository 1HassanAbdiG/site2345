
// Nav.js
import React from "react";
import { Link } from "react-router-dom";
import styles from './Accueil.module.css';

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to="/mathematiques">Mathématiques</Link>
        </li>
        <li>
          <Link to="/francais">Français</Link>
        </li>
        <li>
          <Link to="/jeux">Jeux Éducatifs</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
