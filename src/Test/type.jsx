// data/questions.json
[
    {
      "type": "vrai_faux",
      "question": "Le soleil se lève à l'est.",
      "answer": "vrai"
    },
    {
      "type": "choix_unique",
      "question": "Quelle est la capitale de la France ?",
      "options": ["Paris", "Lyon", "Marseille"],
      "answer": "Paris"
    },
    {
      "type": "choix_multiple",
      "question": "Quels sont des pays européens ?",
      "options": ["Canada", "France", "Allemagne", "Brésil"],
      "answer": ["France", "Allemagne"]
    },
    {
      "type": "reponse_courte",
      "question": "Quel animal miaule ?",
      "answer": "chat"
    },
    {
      "type": "ordre",
      "question": "Mets ces actions dans l'ordre du matin.",
      "fragments": [
        "Se brosser les dents",
        "Se lever",
        "Prendre le petit-déjeuner"
      ],
      "answer": [
        "Se lever",
        "Se brosser les dents",
        "Prendre le petit-déjeuner"
      ]
    },
    {
      "type": "association",
      "question": "Associe chaque fruit à sa couleur.",
      "pairs": [
        { "left": "Banane", "right": "Jaune" },
        { "left": "Fraise", "right": "Rouge" },
        { "left": "Raisin", "right": "Violet" }
      ]
    },
    {
      "type": "texte_a_trou",
      "question": "Le ___ est roi des animaux.",
      "answer": "lion"
    },
    {
      "type": "dictee",
      "audio": "dictée1.mp3",
      "answer": "Le kangourou saute haut."
    }
  ]
  
  // components/QuestionRenderer.js
  import React from 'react';
  import VraiFaux from './types/VraiFaux';
  import ChoixUnique from './types/ChoixUnique';
  import ChoixMultiple from './types/ChoixMultiple';
  import ReponseCourte from './types/ReponseCourte';
  import Ordre from './types/Ordre';
  import Association from './types/Association';
  import TexteATrou from './types/TexteATrou';
  import Dictee from './types/Dictee';
  
  const QuestionRenderer = ({ question, index, onAnswer }) => {
    const props = { question, index, onAnswer };
    switch (question.type) {
      case 'vrai_faux': return <VraiFaux {...props} />;
      case 'choix_unique': return <ChoixUnique {...props} />;
      case 'choix_multiple': return <ChoixMultiple {...props} />;
      case 'reponse_courte': return <ReponseCourte {...props} />;
      case 'ordre': return <Ordre {...props} />;
      case 'association': return <Association {...props} />;
      case 'texte_a_trou': return <TexteATrou {...props} />;
      case 'dictee': return <Dictee {...props} />;
      default: return <p>Type inconnu</p>;
    }
  };
  
  export default QuestionRenderer;
  
  
  