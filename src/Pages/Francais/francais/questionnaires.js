import React, { useState, useEffect } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";

// Fonction pour mélanger les choix
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Dynamically require JSON files for different difficulty levels
const requireJsonFiles = {
  easy: require.context("./datalecture1", false, /\.json$/),
  medium: require.context("./datalecture2", false, /\.json$/),
  hard: require.context("./datalecture3", false, /\.json$/),
};

const Questionnaire = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedFile, setSelectedFile] = useState("");
  const [data, setData] = useState(null);
  const [titles, setTitles] = useState({});
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState([]);
  const [validationCount, setValidationCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTitles = () => {
      try {
        let loadedTitles = {};
        requireJsonFiles[difficulty].keys().forEach((file) => {
          const jsonData = requireJsonFiles[difficulty](file);
          const fileName = file.replace("./", "").replace(".json", "");
          loadedTitles[fileName] = jsonData.text.title;
        });
        setTitles(loadedTitles);
      } catch (err) {
        setError("Error loading titles.");
      }
    };
    loadTitles();
  }, [difficulty]);

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem('studentResults') || '[]');
    if (storedResults.length > 0) {
      const latestResult = storedResults[storedResults.length - 1];
      setScore(latestResult.score);
      setResults(latestResult.results);
      setSummary((prev) => [...prev, {
        title: latestResult.title,
        score: latestResult.score,
        validationDate: latestResult.validationDate,
      }]);
    }
  }, []);

  // Chargez les données du fichier et mélangez les choix
  useEffect(() => {
    const loadFileData = async () => {
      if (selectedFile) {
        try {
          const jsonData = requireJsonFiles[difficulty](`./${selectedFile}.json`);

          // Mélanger les choix pour chaque type de question
          jsonData.questions.forEach((question) => {
            if (question.type === 'multipleChoice' || question.type === 'checkbox') {
              question.choices = shuffleArray(question.choices);
            }
          });

          setData(jsonData);
        } catch (err) {
          setError("Could not load the selected file.");
        }
      }
    };
    loadFileData();
  }, [selectedFile, difficulty]);

  const handleChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    setSelectedFile("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleReset();
    }
  };

  const submitForm = () => {
    let totalScore = 0;
    let resultDetails = [];

    const allQuestions = [
      ...(data?.questions || []),
      ...(data?.vocabularyTrueFalse || []),
      ...(data?.vocabularyQCM || []),
      ...(data?.conjugationQCM || []),
    ];

    allQuestions.forEach((question) => {
      const userAnswer = answers[question.question];
      const isCorrect =
        (question.type === 'trueFalse' && String(userAnswer) === String(question.correctAnswer)) ||
        (question.type === 'multipleChoice' && userAnswer === question.correctAnswer) ||
        (question.type === 'shortAnswer' && userAnswer?.trim().toLowerCase() === question.correctAnswer.toLowerCase());

      if (isCorrect) {
        totalScore += 1;
      }

      resultDetails.push({
        question: question.question,
        userAnswer: userAnswer !== undefined ? userAnswer : 'Non répondu',
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    });

    setScore(totalScore);
    setResults(resultDetails);
    setValidationCount((prevCount) => prevCount + 1);

    const validationDate = new Date().toLocaleString();

    const currentSummary = {
      title: data.text.title,
      score: totalScore,
      validationDate: validationDate,
    };
    setSummary((prev) => [...prev, currentSummary]);

    // Stocker les résultats dans le stockage local
    const storedResults = JSON.parse(localStorage.getItem('studentResults') || '[]');
    storedResults.push({
      title: data.text.title,
      score: totalScore,
      validationDate: validationDate,
      results: resultDetails,
    });
    localStorage.setItem('studentResults', JSON.stringify(storedResults));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
    setResults([]);
    setSelectedFile("");
    setData(null);
    localStorage.removeItem('studentResults');
  };

  const handleReset_resutat = () => {
    setAnswers({});
    setScore(null);
    setResults([]);
  };

  const renderQuestionsByType = (type) => {
    const questionTypes = {
      trueFalse: 'Vrai/Faux',
      multipleChoice: 'Questions à Choix Multiples (QCM)',
      shortAnswer: 'Réponse Courte',
    };

    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom style={{ color: '#ffffff', textAlign: 'center', border: 'solid 2px #000', background: '#4a90e2', padding: '10px', fontSize: '20px', fontWeight: 'bold' }}>
          {questionTypes[type]}
        </Typography>
        {data.questions.filter((q) => q.type === type).map((question, index) => renderQuestion(question, index + 1))}
      </React.Fragment>
    );
  };

  const renderVocabularyQuestions = (type) => {
    const questionTypes = {
      vocabularyTrueFalse: 'Vocabulaire Vrai/Faux',
      vocabularyQCM: 'Vocabulaire QCM',
      conjugationQCM: 'Conjugaison QCM',
      shortAnswer: 'Réponse Courte',
    };

    if (!data[type] || data[type].length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <Typography
          variant="h6"
          gutterBottom
          style={{ color: '#ffffff', textAlign: 'center', border: 'solid 2px #000', background: '#4a90e2', padding: '10px', fontSize: '20px', fontWeight: 'bold' }}>
          {questionTypes[type]}
        </Typography>
        {data[type].map((question, index) => renderQuestion(question, index + 1))}
      </React.Fragment>
    );
  };

  const handleCheckboxChange = (question, choice, checked) => {
    const newAnswers = { ...answers };

    if (checked) {
      newAnswers[question] = [...(newAnswers[question] || []), choice];
    } else {
      newAnswers[question] = newAnswers[question].filter(item => item !== choice);
    }

    setAnswers(newAnswers);
  };

  const renderQuestion = (question, number) => {
    switch (question.type) {
      case 'trueFalse':
        return (
          <Box key={question.question} my={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{number}. {question.question}</FormLabel>
              <RadioGroup
                row
                name={question.question}
                value={String(answers[question.question]) || ''}
                onChange={(e) => handleChange(question.question, e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Vrai" />
                <FormControlLabel value="false" control={<Radio />} label="Faux" />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 'multipleChoice':
        return (
          <Box key={question.question} my={2}>
            <FormControl fullWidth>
              <FormLabel>{number}. {question.question}</FormLabel>
              <Select
                value={answers[question.question] || ''}
                onChange={(e) => handleChange(question.question, e.target.value)}
              >
                <MenuItem value=""><em>Sélectionnez une option</em></MenuItem>
                {question.choices.map((choice) => (
                  <MenuItem key={choice} value={choice}>{choice}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 'checkbox':
        return (
          <Box key={question.question} my={2}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">{number}. {question.question}</FormLabel>
              {question.choices.map((choice) => (
                <FormControlLabel
                  key={choice}
                  control={
                    <Checkbox
                      checked={answers[question.question]?.includes(choice) || false}
                      onChange={(e) => handleCheckboxChange(question.question, choice, e.target.checked)}
                      name={choice}
                    />
                  }
                  label={choice}
                />
              ))}
            </FormControl>
          </Box>
        );

      case 'shortAnswer':
        return (
          <Box key={question.question} my={2}>
            <FormControl fullWidth>
              <FormLabel>{number}. {question.question}</FormLabel>
              <TextField
                variant="outlined"
                value={answers[question.question] || ''}
                onChange={(e) => handleChange(question.question, e.target.value)}
              />
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!Object.keys(titles).length) {
    return <p>Aucun titre disponible...</p>;
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "red" }}>
        Compréhension
      </Typography>

      {/* Difficulty Selection Buttons */}
      <Box mb={3}>
        <Typography variant="h6"></Typography>
        <Box display="flex" gap={2} mb={2}>
          <Button
            variant={difficulty === "easy" ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              setDifficulty("easy");
              handleReset();
            }}
          >
            Niveau Facile
          </Button>
          <Button
            variant={difficulty === "medium" ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              setDifficulty("medium");
              handleReset();
            }}
          >
            Niveau Intermédiaire
          </Button>
          <Button
            variant={difficulty === "hard" ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              setDifficulty("hard");
              handleReset();
            }}
          >
            Niveau Avancé
          </Button>
        </Box>
      </Box>

      <Box mb={3}>
        <FormControl fullWidth>
          <Select
            value={selectedFile}
            onChange={(e) => {
              setSelectedFile(e.target.value);
              handleReset_resutat();
            }}
          >
            <MenuItem value="" disabled>
              Sélectionnez un texte
            </MenuItem>
            {Object.keys(titles).map((file) => (
              <MenuItem key={file} value={file} style={{ color: "red" }}>
                {titles[file]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {data && (
        <Box style={{ padding: "20px", border: "solid 10px red", fontSize: "200px" }}>
          <Typography
            variant="h5"
            style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
          >
            {data.text.title}
          </Typography>

          {data.text.url && (
            <img
              src={data.text.url}
              alt="Illustration"
              style={{ display: "block", margin: "20px auto", width: "50%", borderRadius: "8px" }}
              onError={(e) => {
                e.target.style.display = "none";
                console.error("Image non trouvée :", data.text.url);
              }}
            />
          )}

          {data.text.content.map((line, idx) => (
            <Typography
              key={idx}
              dangerouslySetInnerHTML={{ __html: line }}
              style={{ fontSize: "1.2rem" }}
            />
          ))}
        </Box>
      )}

      {data && (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>Questionnaire</Typography>

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            {renderQuestionsByType('trueFalse')}
            {renderQuestionsByType('multipleChoice')}
            {renderQuestionsByType('shortAnswer')}
            {renderVocabularyQuestions('vocabularyTrueFalse')}
            {renderVocabularyQuestions('vocabularyQCM')}
            {renderVocabularyQuestions('conjugationQCM')}
            {renderVocabularyQuestions('shortAnswer')}

            <Box mt={4}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Valider
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset} fullWidth>
                Réinitialiser
              </Button>
            </Box>
          </form>

          {score !== null && (
            <Box mt={4}>
              <Typography variant="h6">Votre score : {score} sur {results.length} (Validé {validationCount} fois)</Typography>
              <Typography variant="subtitle1" color="red">
                La partie que tu as rédigée, l'enseignant doit vérifier si c'est correct.
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Votre Réponse</TableCell>
                      <TableCell>Réponse Correcte</TableCell>
                      <TableCell>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.question}</TableCell>
                        <TableCell>{result.userAnswer}</TableCell>
                        <TableCell>{String(result.correctAnswer)}</TableCell>
                        <TableCell>{result.isCorrect ? '✔️' : '❌'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Récapitulatif des études
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Titre</TableCell>
                      <TableCell>Score Obtenu</TableCell>
                      <TableCell>Date et Heure de Validation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.score}</TableCell>
                        <TableCell>{item.validationDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Questionnaire;
