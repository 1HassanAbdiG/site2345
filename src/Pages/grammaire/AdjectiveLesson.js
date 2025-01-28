import React, { useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    TextField,
    Button,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
   // Card,
   // CardContent,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper
} from "@mui/material";
//import Orthographeaa from "../Francais/Orthographe/Orthographeaa";

const AdjectiveLesson = () => {
    const [selectedData, setSelectedData] = useState(null);  // Initially set to null until loaded
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState({});
    const [score, setScore] = useState(null);
    const [results, setResults] = useState([]);  // To store individual results

    const handleInputChange = (index, value) => {
        setAnswers({ ...answers, [index]: value });
    };

    

    const verifyAnswers = () => {
        const feedback = {};
        const newResults = [];
        let correctCount = 0;
        selectedData.exercises.forEach((exercise, index) => {
            const isCorrect = answers[index]?.trim().toLowerCase() === exercise.answer.toLowerCase();
            feedback[index] = isCorrect ? "correct" : "incorrect";
            if (isCorrect) correctCount++;
            newResults.push({ id: index, phrase: exercise.question, correct: isCorrect });
        });
        setScore(correctCount);
        setFeedback(feedback);
        setResults(newResults);
    };

    const handleSelectJsonChange = async (event) => {
        const selectedJson = event.target.value;
        setAnswers({});
        setScore(null);
        setFeedback({});
        setResults([]);

        try {
            // Dynamically import the selected JSON
            const jsonData = await import(`./${selectedJson}.json`);
            setSelectedData(jsonData.default);  // Assuming you're using default export in JSON
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
               
              
                backgroundColor: "white",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3
            }}
        >
               <Typography
                    variant="h1"
                    
                    gutterBottom       
                    
                    sx={{
                 
                      fontSize: "2.5rem", // Change la taille de la police
                      textAlign: "center",
                      color: "#000000", // Très noir
                      fontWeight: "bold",
                      fontFamily: "'Roboto', sans-serif",
                    
                    }}
                  >
                    
                    Les Adjectifs et les types de phrases
                  </Typography>
            {/* Sélection du fichier JSON */}
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel id="select-json-label">Sélectionnez le sujet</InputLabel>
                <Select
                    labelId="select-json-label"
                    onChange={handleSelectJsonChange}
                    displayEmpty
                >
                    <MenuItem value="Adjectif">Les Adjectifs</MenuItem>
                    <MenuItem value="typesPhrases">Les Types de Phrases</MenuItem>                   
                    {/* Add more options dynamically if needed */}
                </Select>
            </FormControl>

            {/* Titre */}
            {selectedData && (
                <Typography variant="h4" gutterBottom>
                    {selectedData.title}
                </Typography>
            )}

            {/* Section Rules */}
            {selectedData && selectedData.rules && (
                <Box
                    sx={{
                        marginBottom: 4,
                        backgroundColor: "#f3f4f6",
                        padding: 3,
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            color: "#3f51b5",
                            marginBottom: 2
                        }}
                    >
                        📘 La Règle
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                        {selectedData.rules.description}
                    </Typography>
                    <List>
                        {Object.entries(selectedData.rules.examples).map(([key, example], index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    marginBottom: 2,
                                    backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#fce4ec",
                                    borderRadius: 1,
                                    padding: 2,
                                    boxShadow: 1
                                }}
                            >
                                <ul
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: 0,
                                        margin: 0,
                                        width: "100%"
                                    }}
                                >
                                    {Object.entries(example).map(([type, value], idx) => (
                                        <li
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                justifyContent: "normal",
                                                padding: "5px 0",
                                                width: "100%",
                                                borderBottom: "1px solid #ddd",  // Ligne séparatrice
                                                paddingLeft: "10px",
                                                paddingRight: "10px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    textTransform: "capitalize",
                                                    width: "40%",  // Largeur fixe pour les types
                                                    textAlign: "left"
                                                }}
                                            >
                                                {type.replace("_", " ").toUpperCase()}:
                                            </span>
                                            <span
                                                style={{
                                                    width: "60%",  // Largeur fixe pour les valeurs
                                                    textAlign: "felt"
                                                }}
                                            >
                                                {value}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Section Exercises */}
            {selectedData && selectedData.exercises && (
                <Box
                    sx={{
                        marginBottom: 4,
                        bgcolor: "#f5f5f5",
                        p: 2,
                        borderRadius: 1
                    }}
                >
                    <Typography variant="h5">Exercices</Typography>
                    <Typography>Complétez avec la forme correcte :</Typography>
                    {selectedData.exercises.map((exercise, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: 2,
                                border:
                                    feedback?.[index] === "correct"
                                        ? "2px solid green"
                                        : feedback?.[index] === "incorrect"
                                            ? "2px solid red"
                                            : "1px solid #ccc",
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor:
                                    feedback?.[index] === "correct"
                                        ? "#e8f5e9"
                                        : feedback?.[index] === "incorrect"
                                            ? "#ffebee"
                                            : "white",
                                boxShadow: feedback?.[index]
                                    ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
                                    : "none"
                            }}
                        >
                            <Typography>{exercise.question}</Typography>
                            {exercise.options ? (
                                <FormControl fullWidth>
                                    <Select
                                        value={answers[index] || ""}
                                        onChange={(e) =>
                                            handleInputChange(index, e.target.value)
                                        }
                                    >
                                        {exercise.options.map((option, optIndex) => (
                                            <MenuItem key={optIndex} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    value={answers[index] || ""}
                                    onChange={(e) =>
                                        handleInputChange(index, e.target.value)
                                    }
                                />
                            )}
                        </Box>
                    ))}
                    <Button variant="contained" onClick={verifyAnswers}>
                        Vérifier
                    </Button>
                    {score !== null && (
                        <Alert
                            severity={score === selectedData.exercises.length ? "success" : "info"}
                            sx={{ marginTop: 2 }}
                        >
                            Score: {score}/{selectedData.exercises.length}
                        </Alert>
                    )}
                </Box>
            )}
            
            {/* Results Table */}
            {results.length > 0 && (
                <Box>
                    <Typography variant="h5" sx={{ marginTop: 4 }}>
                        Bilan : {score}/{selectedData.exercises.length} points
                    </Typography>
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Phrase</TableCell>
                                    <TableCell align="center">Résultat</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={result.id}>
                                        <TableCell>{result.phrase}</TableCell>
                                        <TableCell align="center">
                                            {result.correct ? "✅ Correct" : "❌ Incorrect"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
            
        </Box>
    );
};

export default AdjectiveLesson;
