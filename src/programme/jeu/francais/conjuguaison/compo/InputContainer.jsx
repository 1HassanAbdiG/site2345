import React, { useState } from 'react';
import styles from '../styless/V1.module.css';

const InputContainer = ({ onSubmit, onReset }) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    onSubmit(userInput);
    setUserInput('');
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Infinitif du verbe..."
        className={styles.input}
      />
      <button className={styles.button} onClick={handleSubmit}>Vérifier</button>
      <button className={styles.button} onClick={onReset}>Nouvelle Partie</button>
    </div>
  );
};

export default InputContainer;
