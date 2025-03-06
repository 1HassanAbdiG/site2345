import React, { useState } from 'react';

const conjugations = {
  'er': {
    je: 'e',
    tu: 'es',
    il: 'e',
    nous: 'ons',
    vous: 'ez',
    ils: 'ent',
  },
  'ir': {
    je: 'is',
    tu: 'is',
    il: 'it',
    nous: 'issons',
    vous: 'issez',
    ils: 'issent',
  },
  're': {
    je: 's',
    tu: 's',
    il: '',
    nous: 'ons',
    vous: 'ez',
    ils: 'ent',
  },
};

function Conj() {
  const [verb, setVerb] = useState('');
  const [verbType, setVerbType] = useState('');
  const [conjugatedForms, setConjugatedForms] = useState({});

  const handleChange = (e) => {
    setVerb(e.target.value);
  };

  const handleConjugate = () => {
    const verbEnding = verb.slice(-2);
    const verbRoot = verb.slice(0, -2);

    if (conjugations[verbEnding]) {
      const forms = {};
      for (const pronoun in conjugations[verbEnding]) {
        forms[pronoun] = verbRoot + conjugations[verbEnding][pronoun];
      }
      setConjugatedForms(forms);
    } else {
      alert('Veuillez entrer un verbe régulier se terminant par -er, -ir ou -re');
      setConjugatedForms({});
    }
  };

  return (
    <div>
      <h1>Conjugaison des Verb</h1>
      <input type="text" value={verb} onChange={handleChange} placeholder="Entrez un verbe (ex: jouer, finir, vendre)" />
      <button onClick={handleConjugate}>Conjuguer</button>

      {Object.keys(conjugatedForms).length > 0 && (
        <div>
          <h2>Conjugaison</h2>
          <ul>
            {Object.entries(conjugatedForms).map(([pronoun, form]) => (
              <li key={pronoun}>{pronoun} {form}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Conj;