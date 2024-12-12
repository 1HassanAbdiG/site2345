import React, { useState, useEffect } from "react";
import styles from "./Conjugation.module.css";
import conjugationsData from "./conjugaison2.json";

const Conjugation = () => {
  const [selectedGroup, setSelectedGroup] = useState("1er groupe");
  const [selectedVerb, setSelectedVerb] = useState("");
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState("");

  // Initialiser les scores pour tous les verbes
  useEffect(() => {
    const initialScores = {};
    Object.keys(conjugationsData).forEach((group) => {
      Object.keys(conjugationsData[group].verbs).forEach((verb) => {
        initialScores[verb] = { best: 0, last: 0, first: null, group };
      });
    });
    setScores(initialScores);
  }, []);

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setSelectedVerb("");
    setMessage("");
  };

  const handleVerbChange = (e) => {
    setSelectedVerb(e.target.value);
    setMessage("");
  };

  const checkAnswers = () => {
    if (!selectedVerb) {
      setMessage("Veuillez sélectionner un verbe.");
      return;
    }

    const inputs = document.querySelectorAll(`.${styles.verbInput}`);
    let correct = 0;
    let allFilled = true;

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFilled = false;
        input.style.backgroundColor = "#f9e79f"; // Jaune pour les champs vides
      } else {
        const userAnswer = input.value.toLowerCase().trim();
        const correctAnswer =
          conjugationsData[selectedGroup].verbs[selectedVerb][
          parseInt(input.dataset.index)
          ];

        if (userAnswer === correctAnswer) {
          input.style.backgroundColor = "#d5f5e3"; // Vert pour une bonne réponse
          correct++;
        } else {
          input.style.backgroundColor = "#fadbd8"; // Rouge pour une mauvaise réponse
        }
      }
    });

    if (!allFilled) {
      setMessage("Veuillez remplir tous les champs avant de vérifier.");
      return;
    }

    setMessage(`Vous avez ${correct} réponse(s) correcte(s) sur 6.`);
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };

      updatedScores[selectedVerb].last = correct;

      if (updatedScores[selectedVerb].first === null) {
        updatedScores[selectedVerb].first = correct;
      }

      updatedScores[selectedVerb].best = Math.max(
        updatedScores[selectedVerb].best,
        correct
      );

      return updatedScores;
    });
  };

  const resetExercise = () => {
    const inputs = document.querySelectorAll(`.${styles.verbInput}`);
    inputs.forEach((input) => {
      input.value = "";
      input.style.backgroundColor = "";
    });
    setMessage("");
  };

 /* const showAnswers = () => {
    const inputs = document.querySelectorAll(`.${styles.verbInput}`);
    inputs.forEach((input, index) => {
      input.value =
        conjugationsData[selectedGroup].verbs[selectedVerb][index];
      input.style.backgroundColor = "#d5f5e3"; // Vert clair
    });
  };*/

  return (
    <div className={styles.container}>
      <h1>Conjugaison</h1>

      {/* Sélection du groupe */}
      <select
        className={styles.groupSelector}
        value={selectedGroup}
        onChange={handleGroupChange}
      >
        {Object.keys(conjugationsData).map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>


      {/* Affichage de la règle du groupe */}
      <div
        className={styles.ruleBox}
        style={{
          backgroundColor: conjugationsData[selectedGroup]?.rule?.color || '#fff',  // Couleur par défaut
          borderRadius: '10px',  // Coins arrondis
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Ombre douce pour plus de profondeur
          padding: '20px',  // Espacement interne
          transition: 'transform 0.3s ease',  // Transition pour l'animation de survol
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}  // Effet de zoom au survol
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}  // Retour à la taille normale
      >
        {/* Titre de la règle */}
        <h3
          className={styles.title}
          
        >
          {conjugationsData[selectedGroup]?.rule?.title || 'Titre indisponible'}
        </h3>

        {/* Contenu de la règle */}
        <ul className={styles.ruleList}>
          {conjugationsData[selectedGroup]?.rule?.content?.map((item, index) => (
            <li key={index} className={styles.ruleSection}>
              {/* Idée principale */}
              <strong
                style={{
                  fontSize: '1.5rem',  // Taille de la police pour l'idée
                  color: '#2C3E50',  // Couleur d'une idée importante
                  marginBottom: '10px',  // Espacement sous l'idée
                  display: 'block',  // Assurer que c'est sur une nouvelle ligne
                }}
              >
                {item?.idea || 'Idée non disponible'}
              </strong>
              {/* Explication détaillée */}
              <ul>
                <li style={{
                  fontSize: '1.2rem',  // Taille de la police pour le texte
                  lineHeight: '1.6',  // Espacement entre les lignes pour une lecture facile
                  color: '#ffff',  // Couleur du texte
                  border:"solid",
                  padding:"10px",
                  background:"#0c7854"
                }}> {item?.text || 'Explication non disponible'}

                </li>
              </ul>
              
                
              
               
              
            </li>
          ))}
        </ul>
      </div>



      {/* Sélection du verbe */}
      {selectedGroup && (
        <select
          className={styles.verbSelector}
          value={selectedVerb}
          onChange={handleVerbChange}
        >
          <option value="">-- Choisir un verbe --</option>
          {Object.keys(conjugationsData[selectedGroup].verbs).map((verb) => (
            <option key={verb} value={verb}>
              {verb}
            </option>
          ))}
        </select>
      )}

      {/* Exercice de conjugaison */}
      {selectedVerb && (
        <div className={styles.exerciseBox}>
          <h2>
            Conjuguez le verbe "<span>{selectedVerb}</span>" au présent de
            l'indicatif
          </h2>
          {conjugationsData[selectedGroup].verbs[selectedVerb].map(
            (_, index) => (
              <div key={index}>
                <span className={styles.pronoun}>
                  {["je", "tu", "il/elle", "nous", "vous", "ils/elles"][index]}
                </span>
                <input
                  type="text"
                  className={styles.verbInput}
                  data-index={index}
                />
              </div>
            )
          )}
          <button className={styles.checkBtn} onClick={checkAnswers}>
            Vérifier
          </button>
          <button className={styles.resetBtn} onClick={resetExercise}>
            Réinitialiser
          </button>
          
          {message && (
            <p
              className={`${styles.message} ${message.includes("correct") ? styles.success : styles.error
                }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
      {/* Tableau récapitulatif */}
      {selectedGroup && (
        <table className={styles.scoresTable}>
          <thead>
            <tr>
              <th>Verbe</th>
              <th>Score de la première validation</th>
              <th>Dernier score</th>
              <th>Meilleur score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scores)
              .filter(([verb]) => Object.keys(conjugationsData[selectedGroup].verbs).includes(verb))
              .map(([verb, score]) => (
                <tr key={verb}>
                  <td>{verb}</td>
                  <td>
                    {score.first !== null ? `${score.first}/6` : "Pas encore validé"}
                  </td>
                  <td>{score.last}/6</td>
                  <td>{score.best}/6</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}


      {/* {/* Tableau du verbe sélectionné *
      {selectedVerb && (
        <table className={styles.scoresTable}>
          <thead>
            <tr>
              <th>Verbe</th>
              <th>Score de la première validation</th>
              <th>Dernier score</th>
              <th>Meilleur score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedVerb.charAt(0).toUpperCase() + selectedVerb.slice(1)}</td>
              <td>
                {scores[selectedVerb]?.first !== null
                  ? `${scores[selectedVerb].first}/6`
                  : "Pas encore validé"}
              </td>
              <td>{scores[selectedVerb]?.last}/6</td>
              <td>{scores[selectedVerb]?.best}/6</td>
            </tr>
          </tbody>
        </table>
      )}/*}

      {/* Tableau récapitulatif par groupe */}
      <div className={styles.recapBox}>
        <h3>Tableau récapitulatif des scores par groupe :</h3>
        <table className={styles.scoresTable}>
          <thead>
            <tr>
              <th>Groupe</th>
              <th>Nombre de verbes validés</th>
              <th>Score moyen</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(conjugationsData).map((group) => {
              const groupScores = Object.values(scores).filter(
                (score) => score.group === group
              );

              const validated = groupScores.filter(
                (score) => score.first !== null
              ).length;

              const average =
                groupScores.reduce((acc, score) => acc + score.best, 0) /
                groupScores.length || 0;

              return (
                <tr key={group}>
                  <td>{group}</td>
                  <td>{validated} / {groupScores.length}</td>
                  <td>{average.toFixed(2)} / 6</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Conjugation;
