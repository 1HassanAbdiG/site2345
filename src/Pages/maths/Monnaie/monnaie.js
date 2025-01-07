import React, { useState } from "react";
import MoneyExercise from "./MoneyExercise";
import Exercices from "./page";
import MoneyChangeExercise from "./Monnaie3";
import { Button } from "@mui/material";  // Importation du Button de MUI

// Composant pour le bouton personnalisé
function CustomButton({ onClick, label, color = "primary", variant = "contained" }) {
  return (
    <Button 
      onClick={onClick} 
      color={color} 
      variant={variant} 
      style={{ margin: "0 10px" }}
    >
      {label}
    </Button>
  );
}

// Composant Principal
const MainComponent = () => {
  const [visibleComponent, setVisibleComponent] = useState(null);

  const handleButtonClick = (component) => {
    setVisibleComponent(visibleComponent === component ? null : component);
  };

  return (
    <div>
      <CustomButton 
        onClick={() => handleButtonClick("MoneyExercise")}
        color="warning" 
        label={visibleComponent === "MoneyExercise" ? "Masquer Exercices1" : "Afficher Exercises1"} 
      />
      <CustomButton 
        onClick={() => handleButtonClick("Exercices")} 
        color="error" 
        label={visibleComponent === "Exercices" ? "Masquer Exercices2" : "Afficher Exercices2"} 
      />
      <CustomButton 
        onClick={() => handleButtonClick("ComponentC")} 
        label={visibleComponent === "ComponentC" ? "Masquer Exercices3" : "Afficher Exercices3"} 
      />

      <div>
        {visibleComponent === "MoneyExercise" && <MoneyExercise />}
        {visibleComponent === "Exercices" && <Exercices />}
        {visibleComponent === "ComponentC" && <MoneyChangeExercise />}
      </div>
    </div>
  );
};

export default MainComponent;
