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
    InputLabel
} from "@mui/material";
import grammaireAdjectif from "./grammaireAdjectif.json"; // Exemple de JSON par défaut
import typesPhrases from "./typesPhrases.json"; // Autre JSON (ajoutez-en d'autres si nécessaire)

const AdjectiveLesson = () => {
    const [selectedData, setSelectedData] = useState(grammaireAdjectif); // JSON par défaut
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState({});
    const [score, setScore] = useState(null);

    const handleInputChange = (index, value) => {
        setAnswers({ ...answers, [index]: value });
    };

    const verifyAnswers = () => {
        const feedback = {};
        let correctCount = 0;
        selectedData.exercises.forEach((exercise, index) => {
            const isCorrect =
                answers[index]?.trim().toLowerCase() ===
                exercise.answer.toLowerCase();
            feedback[index] = isCorrect ? "correct" : "incorrect";
            if (isCorrect) correctCount++;
        });
        setScore(correctCount);
        setFeedback(feedback);
    };

    const handleSelectChange = (event) => {
        const selectedJson = event.target.value;
        setAnswers({});
        setScore(null);
        setFeedback({});

        // Mise à jour des données selon le choix
        switch (selectedJson) {
            case "grammaireAdjectif":
                setSelectedData(grammaireAdjectif);
                break;
            case "typesPhrases":
                setSelectedData(typesPhrases);
                break;
            default:
                setSelectedData(grammaireAdjectif);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: "0 auto",
                backgroundColor: "white",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3
            }}
        >
            {/* Sélection du fichier JSON */}
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel id="select-json-label">Sélectionnez le sujet</InputLabel>
                <Select
                    labelId="select-json-label"
                    value={selectedData.title}
                    onChange={handleSelectChange}
                    displayEmpty
                >
                    <MenuItem value="grammaireAdjectif">Les Adjectifs</MenuItem>
                    <MenuItem value="typesPhrases">Les Types de Phrases</MenuItem>
                </Select>
            </FormControl>

            {/* Titre */}
            <Typography variant="h4" gutterBottom>
                {selectedData.title}
            </Typography>

            {/* Section Rules */}
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

            {/* Section Examples */}
            <Box
                sx={{
                    marginBottom: 4,
                    bgcolor: "#e3f2fd",
                    p: 2,
                    borderRadius: 1
                }}
            >
                <Typography variant="h5">Exemples</Typography>
                <List>
                    {selectedData.examples.map((example, index) => (
                        <ListItem key={index}>{example}</ListItem>
                    ))}
                </List>
            </Box>

            {/* Section Exercises */}
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
        </Box>
    );
};

export default AdjectiveLesson;
