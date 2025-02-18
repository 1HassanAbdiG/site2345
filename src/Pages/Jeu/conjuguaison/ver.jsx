import React, { useState } from 'react';
import { Button, Box, Typography, TextField, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { CheckCircle, Cancel} from '@mui/icons-material';
import { useTransition, animated } from 'react-spring';
import verbData from './verbs.json';

const ConjugationGame = () => {
  const [selectedTense, setSelectedTense] = useState("present");
  const [currentVerb, setCurrentVerb] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answerHistory, setAnswerHistory] = useState([]);
  
  const [score, setScore] = useState(0);
  



  const tenses = ["present", "futur", "imparfait", "passe_Composé"];

  const handleTenseChange = (tense) => {
    setSelectedTense(tense);
    setCurrentVerb(0);
    setFeedback("");
    setUserAnswer("");
   
    setScore(0);  // Cette ligne réinitialise bien le score
    setAnswerHistory([]); // Réinitialise aussi l'historique des réponses
  };
  

  const checkAnswer = () => {
    const currentVerbData = verbData[selectedTense] && verbData[selectedTense][currentVerb];
    if (!currentVerbData) {
      setFeedback("❌ No verb data available.");
      return;
    }

    if (!userAnswer.trim()) {
      setFeedback("❌ Please provide an answer.");
      return;
    }

    const correctAnswer = currentVerbData.correct;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback("✅ Correct!");
      setScore(prevScore => prevScore + 1);
    } else {
      setFeedback(`❌ Incorrect. The correct answer is: ${correctAnswer}`);
    }

    setAnswerHistory((prevHistory) => [
      ...prevHistory,
      {
        verb: currentVerbData.infinitive,
        pronoun: currentVerbData.pronoun,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer.toLowerCase() === correctAnswer.toLowerCase(),
      },
    ]);

   

    setTimeout(() => {
      handleNextVerb();
    }, 1000);
  };

  const transition = useTransition(feedback, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reset: true,
  });

  const handleNextVerb = () => {
    const totalVerbs = verbData[selectedTense]?.length || 0;
    const nextVerb = (currentVerb + 1) % totalVerbs;

    if (nextVerb === 0 && currentVerb === totalVerbs - 1) {
      setFeedback("✅ You've completed all verbs for this tense!");
      return;
    }

    setCurrentVerb(nextVerb);
    setUserAnswer("");
    setFeedback("");
  
  };

  const currentVerbData = verbData[selectedTense] && verbData[selectedTense][currentVerb];
  if (!currentVerbData) {
    return <Typography>Chargement des données...</Typography>;
  }

  return (
    <Box sx={{ textAlign: "center", margin: "auto", padding: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Jeu de Conjugaison
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2, color: "blue" }}>
        Score : {score} / {answerHistory.length}
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        {tenses.map((tense) => (
          <Button
            key={tense}
            variant="contained"
            color={selectedTense === tense ? "primary" : "secondary"}
            sx={{
              margin: 1,
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: "bold",
              transition: "transform 0.3s",
              '&:hover': {
                transform: "scale(1.1)",
              },
            }}
            onClick={() => handleTenseChange(tense)}
          >
            {tense.charAt(0).toUpperCase() + tense.slice(1)}
          </Button>
        ))}
      </Box>

      <Card sx={{ marginBottom: 3, padding: 2, backgroundColor: "#f5f5f5", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Conjuguez : {currentVerbData.infinitive} ({currentVerbData.pronoun})
          </Typography>

          <TextField
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Entrez la conjugaison"
            fullWidth
            variant="outlined"
            sx={{
              marginTop: 2,
              borderRadius: 3,
              backgroundColor: "#e0f7fa",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00796b" },
              },
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="success" sx={{ padding: "10px 20px", borderRadius: "20px" }} onClick={checkAnswer}>
          Vérifier
        </Button>
      </Box>

      <animated.div style={transition[0]?.props}>
        <Typography sx={{ marginTop: 2, color: feedback.includes("✅") ? "green" : "red" }} variant="h6">
          {feedback}
        </Typography>
      </animated.div>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Historique des réponses
        </Typography>
        <Paper elevation={3} sx={{ width: "100%", overflowX: "auto", padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2, color: "blue" }}>
                    Score : {score} / {answerHistory.length}
                  </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Verbe</strong></TableCell>
                <TableCell><strong>Pronoun</strong></TableCell>
                <TableCell><strong>Réponse Utilisateur</strong></TableCell>
                <TableCell><strong>Réponse Correcte</strong></TableCell>
                <TableCell><strong>Résultat</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {answerHistory.map((answer, index) => (
                <TableRow key={index}>
                  
                  <TableCell>{answer.verb}</TableCell>
                  <TableCell>{answer.pronoun}</TableCell>
                  <TableCell>{answer.userAnswer}</TableCell>
                  <TableCell>{answer.correctAnswer}</TableCell>
                  <TableCell>{answer.isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConjugationGame;
