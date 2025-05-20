import React, { useState } from "react";
import data from "./componentsList.json";
import  SubtractionProblem  from "../calcule/SubtractionProblem";
import StoryOrderGame from "../Jeu deplacement/StoryOrderGame";
import  SyllableReorderGame from "../syllabeMots/SyllableReorderGame";
import  Syllable1 from "../syllabeMots/Syllable1";
import  MemoryGame from "../../Memoire/MemoryGame";
import  AssociationGame from "../associe/AssociationGame";

import "./styles.css"; // pour les animations et styles attractifs

const componentsMap = {
  SubtractionProblem,
  StoryOrderGame,
  SyllableReorderGame,
  Syllable1,
  MemoryGame,
  AssociationGame

};

export default function ComponentLoader() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const SelectedComponent = selectedComponent ? componentsMap[selectedComponent] : null;

  return (
    <div className="container">
      {!selectedComponent ? (
        <div className="card-grid">
          {data.map((item) => (
            <div key={item.id} className="card" onClick={() => handleClick(item.component)}>
             <div className="emoji">{item.emoji}</div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="component-container">
          <button onClick={() => setSelectedComponent(null)}>⬅ Retour</button>
          <SelectedComponent />
        </div>
      )}
    </div>
  );
}
