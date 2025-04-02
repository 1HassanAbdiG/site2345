import React from 'react';

const Buttons = ({ checkOrder, restartGame }) => {
  return (
    <div>
      <button id="check" onClick={checkOrder}>Vérifier l'ordre</button>
      <button id="restart" onClick={restartGame}>Recommencer</button>
    </div>
  );
};

export default Buttons;
