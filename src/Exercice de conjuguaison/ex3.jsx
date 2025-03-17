import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const Exercise3 = () => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    alert('Texte soumis avec succès!');
    // Ici, vous pourriez ajouter une logique pour sauvegarder le texte ou le traiter.
  };

  return (
    <div>
      <h2>Exercice 3: Production écrite</h2>
      <TextField
        label="Racontez un souvenir d’enfance"
        multiline
        fullWidth
        rows={5}
        variant="outlined"
        value={text}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Soumettre</Button>
    </div>
  );
};

export default Exercise3;