import React, { useState } from 'react';

const comprehensionData = {
  subject_id: 1,
  titre: "Lecture",
  categories: [
    {
      titre: "Après l’école, autrefois…",
      exercises: [
        {
          id: 1,
          text: "Après l’école, autrefois…\nAu printemps, au retour des beaux _",
          inputs: [
            {
              id: "q1",
              options: ["chemins", "signes", "jours", "tronc", "écureuil"],
              answer: "jours",
              points: 1
            }
          ]
        },
        {
          id: 2,
          text: "nous allions plus volontiers à l'école. Le soir, en rentrant à la maison, nous prenions notre temps, nous empruntions d'autres _",
          inputs: [
            {
              id: "q2",
              options: ["poussière", "train", "chemins", "signes", "ballon"],
              answer: "chemins",
              points: 1
            }
          ]
        },
        {
          id: 3,
          text: "Parfois, nous suivions le chemin qui borde la voie de chemin de fer. Il m'arrivait de coller mon oreille sur le rail, comme dans les films d'indiens, pour écouter s'il venait un _",
          inputs: [
            {
              id: "q3",
              options: ["poussière", "train", "chemins", "signes", "ballon", "mécanicien"],
              answer: "train",
              points: 1
            }
          ]
        },
        {
          id: 4,
          text: "Quand un train arrivait, il roulait lentement... Vite, nous mettions des cailloux alignés sur les rails pour le faire dérailler. Le _ nous voyait de loin, il tirait des grands coups de sifflet pour nous obliger à dégager la voie.",
          inputs: [
            {
              id: "q4",
              options: ["biberon", "signes", "ballon", "chemins", "mécanicien", "acrobate"],
              answer: "mécanicien",
              points: 1
            }
          ]
        },
        {
          id: 5,
          text: "En passant près de nous, il nous faisait de grands _ de la main comme pour nous donner une correction.",
          inputs: [
            {
              id: "q5",
              options: ["signes", "ballon", "chemins", "signes", "ballon", "chemins"],
              answer: "signes",
              points: 1
            }
          ]
        },
        {
          id: 6,
          text: "A l'arrière du convoi, le chef de train nous faisait aussi de grands signes... Les cailloux se transformaient en _ et le train, à notre grand regret, ne dérailla jamais.",
          inputs: [
            {
              id: "q6",
              options: ["signes", "ballon", "chemins", "poussière", "écureuil", "acrobate"],
              answer: "poussière",
              points: 1
            }
          ]
        },
        {
          id: 7,
          text: "Quand les arbres étaient en fleurs, nous cherchions les _ d'oiseaux ou d'écureuils qui nichaient dans les pins.",
          inputs: [
            {
              id: "q7",
              options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc"],
              answer: "nids",
              points: 1
            }
          ]
        },
        {
          id: 8,
          text: "Nous connaissions un vieux nid d'écureuil en forme de _ de rugby.",
          inputs: [
            {
              id: "q8",
              options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc"],
              answer: "ballon",
              points: 1
            }
          ]
        },
        {
          id: 9,
          text: "Avec une pierre, nous tapions contre le _ de l'arbre qui abritait ce nid.",
          inputs: [
            {
              id: "q9",
              options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc"],
              answer: "tronc",
              points: 1
            }
          ]
        },
        {
          id: 10,
          text: "Si la mère sortait, il était possible qu'il y ait des petits à l'intérieur. Alors l'un de nous deux, tel un _, grimpait jusqu'au nid.",
          inputs: [
            {
              id: "q10",
              options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc", "acrobate", "biberon", "écureuil"],
              answer: "acrobate",
              points: 1
            }
          ]
        },
        {
          id: 11,
          text: "Lorsqu'on y trouvait des petits, qu'ils étaient assez gros et qu'ils avaient les yeux ouverts, nous en prenions un ou deux que nous élevions au _ avec du lait coupé d'eau.",
          inputs: [
            {
              id: "q11",
              options: ["écureuil", "jours", "biberon", "signes", "ballon", "chemins", "biberon", "nids", "tronc"],
              answer: "biberon",
              points: 1
            }
          ]
        },
        {
          id: 12,
          text: "(Avec nos vingt centimes du dimanche, nous achetions un petit biberon rempli de bonbons multicolores.) A l'époque, il n'était pas rare de voir un enfant se promener avec un _ sur l'épaule.",
          inputs: [
            {
              id: "q12",
              options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc", "écureuil", "tronc", "ballon"],
              answer: "écureuil",
              points: 1
            }
          ]
        }
      ]
    },
    {
      titre: "Après l’école, autrefois…",
      exercises: [
        {
          id: 1,
          question: "Au printemps, après l'école, qu'est-ce qui revenait ?",
          options: ["chemins", "signes", "jours", "tronc", "écureuil"],
          answer: "jours",
          points: 1
        },
        {
          id: 2,
          question: "Le soir, en rentrant à la maison, quel chemin prenaient-ils parfois ?",
          options: ["poussière", "train", "chemins", "signes", "ballon"],
          answer: "chemins",
          points: 1
        },
        {
          id: 3,
          question: "Qu'est-ce qu'ils écoutaient sur le rail, comme dans les films d'indiens ?",
          options: ["poussière", "train", "chemins", "signes", "ballon", "mécanicien"],
          answer: "train",
          points: 1
        },
        {
          id: 4,
          question: "Qui tirait des grands coups de sifflet pour les obliger à dégager la voie ?",
          options: ["biberon", "signes", "ballon", "chemins", "mécanicien", "acrobate"],
          answer: "mécanicien",
          points: 1
        },
        {
          id: 5,
          question: "Que faisait le mécanicien de la main en passant près d'eux ?",
          options: ["signes", "ballon", "chemins", "signes", "ballon", "chemins"],
          answer: "signes",
          points: 1
        },
        {
          id: 6,
          question: "Que devenaient les cailloux après le passage du train ?",
          options: ["signes", "ballon", "chemins", "poussière", "écureuil", "acrobate"],
          answer: "poussière",
          points: 1
        },
        {
          id: 7,
          question: "Qu'est-ce qu'ils cherchaient dans les pins au printemps ?",
          options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc"],
          answer: "nids",
          points: 1
        },
        {
          id: 8,
          question: "Quelle forme avait le nid d'écureuil qu'ils connaissaient ?",
          options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc"],
          answer: "ballon",
          points: 1
        },
        {
          id: 9,
          question: "Où tapaient-ils avec une pierre pour essayer de faire sortir la mère écureuil ?",
          options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc"],
          answer: "tronc",
          points: 1
        },
        {
          id: 10,
          question: "Que faisait l'un d'entre eux pour atteindre le nid d'écureuil, tel un _ ?",
          options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc", "acrobate", "biberon", "écureuil"],
          answer: "acrobate",
          points: 1
        },
        {
          id: 11,
          question: "Avec quoi élevaient-ils les petits écureuils qu'ils trouvaient ?",
          options: ["écureuil", "jours", "biberon", "signes", "ballon", "chemins", "biberon", "nids", "tronc"],
          answer: "biberon",
          points: 1
        },
        {
          id: 12,
          question: "Qu'est-ce qu'un enfant pouvait avoir sur l'épaule en se promenant à cette époque ?",
          options: ["signes", "ballon", "chemins", "biberon", "nids", "tronc", "écureuil", "tronc", "ballon"],
          answer: "écureuil",
          points: 1
        }
      ]
    }
  ]
};

const ComprehensionExercise = () => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleChange = (event, questionId) => {
    const { value } = event.target;
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let newScore = 0;

    comprehensionData.categories[0].exercises.forEach(exercise => {
      exercise.inputs.forEach(input => {
        if (answers[input.id] === input.answer) {
          newScore += input.points;
        }
      });
    });

    setScore(newScore);
  };

  return (
    <div>
      <h1>{comprehensionData.titre}</h1>
      <h2>{comprehensionData.categories[0].titre}</h2>
      <form onSubmit={handleSubmit}>
        {comprehensionData.categories[0].exercises.map(exercise => (
          <div key={exercise.id}>
            <p>{exercise.text}</p>
            {exercise.inputs.map(input => (
              <div key={input.id}>
                <label htmlFor={input.id}>{input.id}</label>
                <select
                  id={input.id}
                  value={answers[input.id] || ''}
                  onChange={(e) => handleChange(e, input.id)}
                >
                  <option value="">Select an answer</option>
                  {input.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {score !== null && <h2>Your score: {score}</h2>}
    </div>
  );
};

export default ComprehensionExercise;
