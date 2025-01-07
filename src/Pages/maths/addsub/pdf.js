import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Import the PDF file correctly
//const docpdf = require("../../Francais/pdf/Devoir de Mathématiques.pdf");

const exercisesData = {
  title: "Exercices de Mathématiques - Niveau 6",
  exercises: [
    {
      title: "Exercice 1 - Addition complexe",
      type: "addition",
      questions: [
        { question: "12345 + 67890 = ?", correctAnswer: "80235", type: "simple" },
        { question: "54321 + 12345 = ?", correctAnswer: "66666", type: "simple" },
        { question: "9876 + 5432 + 1234 = ?", correctAnswer: "16542", type: "multiple" },
        { question: "11111 + 22222 + 33333 = ?", correctAnswer: "66666", type: "multiple" },
        { question: "99999 + 1 = ?", correctAnswer: "100000", type: "simple" },
      ],
    },
    {
      title: "Exercice 2 - Soustraction complexe",
      type: "soustraction",
      questions: [
        { question: "100000 - 54321 = ?", correctAnswer: "45679", type: "simple" },
        { question: "87654 - 43210 = ?", correctAnswer: "44444", type: "simple" },
        { question: "54321 - 12345 - 2345 = ?", correctAnswer: "39631", type: "multiple" },
        { question: "99999 - 11111 = ?", correctAnswer: "88888", type: "simple" },
        { question: "65432 - 12345 - 5432 = ?", correctAnswer: "47655", type: "multiple" },
      ],
    },
    {
      title: "Exercice 3 - Problèmes avancés",
      type: "probleme",
      questions: [
        { question: "Un train transporte 12345 passagers. À une station, 6789 descendent et 4321 montent. Combien y a-t-il de passagers dans le train après cette station ?", correctAnswer: "9897", type: "simple" },
        { question: "Une entreprise a un budget de 50000 euros. Elle dépense 12345 euros pour les salaires et 23456 euros pour les équipements. Quel est le budget restant ?", correctAnswer: "14299", type: "simple" },
        { question: "Un agriculteur plante 20000 graines. 12345 poussent correctement, mais 5432 ne survivent pas. Combien de plantes restent en bonne santé ?", correctAnswer: "6908", type: "multiple" },
        { question: "Une école reçoit un don de 150000 euros. Elle dépense 75000 pour la rénovation et 25000 pour le matériel. Combien reste-t-il pour d'autres projets ?", correctAnswer: "50000", type: "simple" },
        { question: "Un magasin avait 10000 articles en stock. Il en vend 4567 et reçoit une nouvelle livraison de 2345 articles. Combien d'articles sont maintenant en stock ?", correctAnswer: "7778", type: "simple" },
      ],
    },
    {
      title: "Exercice 4 - Problèmes multi-étapes",
      type: "probleme_multi",
      questions: [
        { question: "Un bus part avec 50 passagers. Il s’arrête à 3 stations : 20 passagers descendent à la première, 10 montent à la deuxième, et 15 descendent à la troisième. Combien reste-t-il de passagers dans le bus ?", correctAnswer: "25", type: "multiple" },
        { question: "Un entrepôt contient 75000 produits. Chaque mois, il en vend 12345. Après 3 mois, combien de produits restent-ils dans l'entrepôt ?", correctAnswer: "37965", type: "multiple" },
        { question: "Une école organise une collecte de 1000 livres. Chaque classe collecte 123 livres, et il y a 8 classes. Combien de livres manquent-ils pour atteindre l'objectif ?", correctAnswer: "16", type: "multiple" },
        { question: "Un train parcourt 500 km. Il s’arrête toutes les 100 km pour 15 minutes. Si le train roule à 50 km/h, combien de temps mettra-t-il au total pour atteindre sa destination ?", correctAnswer: "11 heures", type: "simple" },
        { question: "Un fermier a un champ de 10000 m². Il plante 200 m² chaque jour. Combien de jours lui faudra-t-il pour planter tout le champ ?", correctAnswer: "50", type: "simple" },
      ],
    },
  ],
};

const ExerciseTable = () => {
  // Function to download PDF
  const handleDownloadPDF = (exercise) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(exercise.title, 10, 10);
    doc.setFontSize(14);
    doc.text("Voici le contenu du devoir :", 10, 20);

    // Add the questions and answers for the selected exercise
    const questionsAndAnswers = exercise.questions.map(q => [q.question, q.correctAnswer]);

    // Generate the table with questions and answers
    doc.autoTable({
      startY: 30,
      head: [["Question", "Réponse"]],
      body: questionsAndAnswers,
    });

    doc.save(`${exercise.title}.pdf`);
  };

  // Function to open PDF in a new window
  const handleOpenPDF = (exercise) => {
    const doc = new jsPDF();
    doc.text(exercise.title, 10, 10);
    doc.setFontSize(14);
    doc.text("Voici le contenu du devoir :", 10, 20);

    // Add the questions and answers for the selected exercise
    const questionsAndAnswers = exercise.questions.map(q => [q.question, q.correctAnswer]);

    // Generate the table with questions and answers
    doc.autoTable({
      startY: 30,
      head: [["Question", "Réponse"]],
      body: questionsAndAnswers,
    });

    // Open the PDF in a new window
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Tableau des Exercices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ fontWeight: "bold" }}>Titre de l'exercice</TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercisesData.exercises.map((exercise) => (
              <TableRow key={exercise.title}>
                <TableCell>{exercise.title}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenPDF(exercise)}
                    style={{ marginRight: "10px" }}
                  >
                    Ouvrir PDF
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDownloadPDF(exercise)}
                  >
                    Télécharger PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ExerciseTable;
