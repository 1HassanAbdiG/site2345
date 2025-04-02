import React from 'react';

const Stats = ({ attempts, successes }) => {
  return (
    <div id="stats">
      Essais : <span id="attempts">{attempts}</span> | Réussites : <span id="successes">{successes}</span>
    </div>
  );
};

export default Stats;
