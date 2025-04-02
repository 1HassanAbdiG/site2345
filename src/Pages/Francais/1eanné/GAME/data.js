// src/data.js
export const ItemTypes = {
    NAME: 'name', // Définit le type d'élément qu'on peut glisser
  };
  
  export const familyMembers = [
    { id: 1, name: 'Papa', image: './pere.png' },
    { id: 2, name: 'Maman', image: './mere.png' },
    { id: 3, name: 'Frère', image: './mere.png' },
    { id: 4, name: 'Sœur', image: './mere.png' },
    { id: 5, name: 'Bébé', image: './mere.png' },
    // Ajoutez d'autres membres si nécessaire
  ];
  
  // Fonction simple pour mélanger un tableau (algorithme Fisher-Yates)
  export function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }