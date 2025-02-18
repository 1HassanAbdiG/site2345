import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import data from "./data.json";
import ConjugationGame from "../../Jeu/conjuguaison/ver";

const ExerciseComponent = ({ title, questions, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setAnswers({ ...answers, [event.target.name]: event.target.value.trim() });
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((item) => {
      if (answers[item.id]?.toLowerCase() === item.answer.toLowerCase()) {
        score++;
      }
    });
    setResult(`Score: ${score} / ${questions.length}`);
    onComplete(title, score);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {questions.map((item) => (
          <TextField
            key={item.id}
            label={item.sentence}
            name={item.id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
          Vérifier
        </Button>
        {result && <Typography variant="h6" sx={{ marginTop: 1 }}>{result}</Typography>}
      </AccordionDetails>
    </Accordion>
  );
};

const ExConjuguaison = () => {
  const [scores, setScores] = useState({ JeOuJ: null, Conjugation: null, InfinitiveConjugation: null });
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);

  const handleComplete = (section, score) => {
    setScores((prevScores) => ({ ...prevScores, [section]: score }));
    if (Object.values({ ...scores, [section]: score }).every((s) => s !== null)) {
      setIsExerciseComplete(true);
    }
  };

  const handleRestart = () => {
    setScores({ JeOuJ: null, Conjugation: null, InfinitiveConjugation: null });
    setIsExerciseComplete(false);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ margin: 2 }}>Conjugaison Française</Typography>
      <Divider sx={{ marginBottom: 2 }} />

      <Box sx={{ marginBottom: 2 }}>
        <ExerciseComponent title="Je / J'" questions={data.jeOuJ} onComplete={handleComplete} />
        <ExerciseComponent title="Conjugaison" questions={data.conjugation} onComplete={handleComplete} />
        <ExerciseComponent title="Infinitif" questions={data.infinitiveConjugation} onComplete={handleComplete} />
        <ConjugationGame></ConjugationGame>
      </Box>

      {isExerciseComplete && (
        <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2, marginTop: 2 }}>
          <Typography variant="h5">Bilan de l'exercice</Typography>
          <Typography variant="body1">Je / J': {scores["Je / J'"]} / {data.jeOuJ.length}</Typography>
          <Typography variant="body1">Conjugaison: {scores["Conjugaison"]} / {data.conjugation.length}</Typography>
          <Typography variant="body1">Infinitif: {scores["Infinitif"]} / {data.infinitiveConjugation.length}</Typography>
          <Button variant="contained" color="primary" onClick={handleRestart} sx={{ marginTop: 2 }}>
            Recommencer
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ExConjuguaison;
