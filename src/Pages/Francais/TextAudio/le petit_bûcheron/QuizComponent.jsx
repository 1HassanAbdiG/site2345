import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { blue, pink, yellow, lightGreen, orange } from "@mui/material/colors";
import quizData from "./Quest.json"; // Assurez-vous que le chemin est correct

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QuizComponentBucheron = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(null);
  const [shuffledQuizData, setShuffledQuizData] = useState(null);

  useEffect(() => {
    console.log("quizData:", quizData); // Debug log

    if (quizData && quizData.sections) {
      const shuffledSections = quizData.sections.map(section => ({
        ...section,
        questions: shuffleArray(section.questions.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        })))
      }));
      
      setShuffledQuizData({ sections: shuffledSections });
    } else {
      console.error("quizData ou quizData.sections est undefined");
    }
  }, []);

  const handleChange = (id, value) => {
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  const handleValidation = (sectionId) => {
    const section = shuffledQuizData.sections.find(sec => sec.title === sectionId);
    let correctAnswers = 0;

    section.questions.forEach((question) => {
      if (userAnswers[question.question] === question.correctAnswer) {
        correctAnswers += 1;
      }
    });

    setScores({ ...scores, [sectionId]: correctAnswers });
  };

  const handleTotalScore = () => {
    let total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  };

  const handleReset = () => {
    setUserAnswers({});
    setScores({});
    setTotalScore(null);
  };

  if (!shuffledQuizData || !shuffledQuizData.sections) {
    return <Typography>Chargement du quiz...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, backgroundColor: "#fff5ee", borderRadius: "10px", paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: orange[600], fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}>
        🌟 Quiz Amusant: Le Tigre et les Deux Petits Chacals 🌟
      </Typography>
      {shuffledQuizData.sections.map((section) => (
        <Accordion key={section.title} sx={{ marginBottom: 2, backgroundColor: lightGreen[50] }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: orange[600] }} />} sx={{ backgroundColor: yellow[100], borderRadius: "10px" }}>
            <Typography variant="h6" sx={{ color: blue[800], fontWeight: "bold" }}>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#f0f4f8", borderRadius: "10px", padding: 2 }}>
            {section.questions.map((question) => (
              <Box key={question.question} sx={{ marginTop: 2 }}>
                <Typography variant="body1" sx={{ fontSize: "1.5rem", color: "#555" }}>
                  {question.question}
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ marginTop: 1 }}>
                  <InputLabel id={`select-${question.question}`}>Choisir une réponse</InputLabel>
                  <Select
                    labelId={`select-${question.question}`}
                    value={userAnswers[question.question] || ""}
                    onChange={(e) => handleChange(question.question, e.target.value)}
                    label="Choisir une réponse"
                  >
                    {question.options.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
            <Button variant="contained" sx={{ marginTop: 2, fontSize: "1.2rem", backgroundColor: pink[400] }} onClick={() => handleValidation(section.title)}>
              ✅ Valider cette partie
            </Button>
            {scores[section.title] !== undefined && (
              <Typography variant="body1" sx={{ marginTop: 1, fontSize: "1rem" }}>
                🎉 Score pour cette partie : {scores[section.title]} / {section.questions.length}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      <Divider sx={{ marginY: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" sx={{ backgroundColor: orange[600], padding: "12px", fontSize: "1.2rem", flex: 1, marginRight: 1 }} onClick={handleTotalScore}>
          🎯 Calculer le score total
        </Button>
        <Button variant="contained" sx={{ backgroundColor: pink[300], padding: "12px", fontSize: "1.2rem", flex: 1, marginLeft: 1 }} onClick={handleReset}>
          🔄 Réinitialiser
        </Button>
      </Box>
      {totalScore !== null && (
        <Typography variant="h5" sx={{ marginTop: 3, color: blue[800], fontWeight: "bold", textAlign: "center" }}>
          Score total : {totalScore} / {shuffledQuizData.sections.reduce((sum, sec) => sum + sec.questions.length, 0)}
        </Typography>
      )}
    </Container>
  );
};

export default QuizComponentBucheron;