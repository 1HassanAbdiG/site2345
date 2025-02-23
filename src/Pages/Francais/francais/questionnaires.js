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

// Dynamically require JSON files for different difficulty levels
const requireJsonFiles = {
  easy: require.context("./datalecture1", false, /\.json$/),
  medium: require.context("./datalecture2", false, /\.json$/),
  hard: require.context("./datalecture3", false, /\.json$/),
};

const Questionnaire = () => {
  const [difficulty, setDifficulty] = useState("easy");
  //const [lectures, setLectures] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [data, setData] = useState(null);
  const [titles, setTitles] = useState({});
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* useEffect(() => {
     const loadLectures = () => {
       try {
         const files = requireJsonFiles[difficulty].keys().map((key) =>
           requireJsonFiles[difficulty](key)
         );
         setLectures(files);
         
       } catch (err) {
         setError("Error loading lectures.");
       }
     };
     loadLectures();
   
   }, [difficulty]);*/

  useEffect(() => {
    handleReset()
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

  /*useEffect(() => {
  
    if (selectedFile) {
      setLoading(true);
      try {
        const jsonData = requireJsonFiles[difficulty](`./${selectedFile}.json`);
        setData(jsonData);
        
       
        
      
       
      } catch (err) {
        setLoading(true);
      } finally {
        setLoading(false);
    
      }
    }
  }, [selectedFile, difficulty]);*/


  // Dynamically load file content when the user selects one
  useEffect(() => {
    const loadFileData = async () => {
      if (selectedFile) {
        try {
          const jsonData = requireJsonFiles[difficulty](`./${selectedFile}.json`);
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
    setResults([]);
    setSelectedFile("");
    setData(null);
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
      conjugationQCM: 'Conjugaison QCM', // Correction ici pour afficher "Conjugaison QCM"
    };

    if (!data[type] || data[type].length === 0) {
      return null; // Return null or some fallback UI if no data
    }

    return (
      <React.Fragment>
        <Typography
          variant="h6"
          gutterBottom
          style={{ color: '#ffffff', textAlign: 'center', border: 'solid 2px #000', background: '#4a90e2', padding: '10px', fontSize: '20px', fontWeight: 'bold' }}>
          {questionTypes[type]} {/* Displays the title based on the question type */}
        </Typography>
        {data[type].map((question, index) => renderQuestion(question, index + 1))} {/* Renders the questions of the specified type */}
      </React.Fragment>
    );
  };

  const handleCheckboxChange = (question, choice, checked) => {
    const newAnswers = { ...answers };

    if (checked) {
      // Ajouter le choix à la liste des réponses si la case est cochée
      newAnswers[question] = [...(newAnswers[question] || []), choice];
    } else {
      // Retirer le choix de la liste des réponses si la case est décochée
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
            onClick={() => setDifficulty("easy")}
          >
            Niveau Facile
          </Button>
          <Button
            variant={difficulty === "medium" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setDifficulty("medium")}
          >
            Niveau Intermédiaire
          </Button>
          <Button
            variant={difficulty === "hard" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setDifficulty("hard")}
          >
            Niveau Avancé
          </Button>

        </Box>
      </Box>


      <Box mb={3}>
        <FormControl fullWidth>
          <Select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <MenuItem value="" disabled>
              Sélectionnez un texte
            </MenuItem >
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

          {/* Vérification de l'image */}
          {data.text.url && (
            <img
              src={data.text.url}  // Utilisation correcte du chemin
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



      {/* Questionnaire */}
      {data && (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>Questionnaire</Typography>

          <form onSubmit={handleSubmit}>
            {renderQuestionsByType('trueFalse')}
            {renderQuestionsByType('multipleChoice')}
            {renderQuestionsByType('shortAnswer')}

            {renderVocabularyQuestions('vocabularyTrueFalse')}
            {renderVocabularyQuestions('vocabularyQCM')}
            {renderVocabularyQuestions('conjugationQCM')}


            <Box mt={4}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Valider
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset} fullWidth>
                Réinitialiser
              </Button>
            </Box>
          </form>

          {/* Display results */}
          {score !== null && (
            <Box mt={4}>
              <Typography variant="h6">Votre score : {score} sur {results.length}

              </Typography>
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
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Questionnaire;
