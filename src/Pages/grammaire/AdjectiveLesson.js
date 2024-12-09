import React, { useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    TextField,
    Button,
    Alert
} from "@mui/material";
import data from "./grammaireAdjectif.json";

const AdjectiveLesson = () => {
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    const handleInputChange = (index, value) => {
        setAnswers({ ...answers, [index]: value });
    };

    const verifyAnswers = () => {
        let correctCount = 0;
        data.exercises.forEach((exercise, index) => {
            if (
                answers[index]?.trim().toLowerCase() ===
                exercise.answer.toLowerCase()
            ) {
                correctCount++;
            }
        });
        setScore(correctCount);
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
            <Typography variant="h4" gutterBottom>
                {data.title}
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
                    {data.rules.description}
                </Typography>
                <List>
                    {Object.entries(data.rules.examples).map(([key, example], index) => (
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
                            <ul style={{ paddingLeft: 20 }}>
                                <li>
                                    <Typography
                                        sx={{ color: "#1e88e5", fontWeight: "bold" }}
                                    >
                                        Masculin singulier:
                                    </Typography>{" "}
                                    {example.masculin_singulier}
                                </li>
                                <li>
                                    <Typography
                                        sx={{ color: "#43a047", fontWeight: "bold" }}
                                    >
                                        Masculin pluriel:
                                    </Typography>{" "}
                                    {example.masculin_pluriel}
                                </li>
                                <li>
                                    <Typography
                                        sx={{ color: "#d32f2f", fontWeight: "bold" }}
                                    >
                                        Féminin singulier:
                                    </Typography>{" "}
                                    {example.féminin_singulier}
                                </li>
                                <li>
                                    <Typography
                                        sx={{ color: "#fb8c00", fontWeight: "bold" }}
                                    >
                                        Féminin pluriel:
                                    </Typography>{" "}
                                    {example.féminin_pluriel}
                                </li>
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
                    {data.examples.map((example, index) => (
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
                <Typography>
                    Complétez avec la forme correcte de l'adjectif:
                </Typography>
                {data.exercises.map((exercise, index) => (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                        <Typography>{exercise.question}</Typography>
                        <TextField
                            variant="outlined"
                            size="small"
                            onChange={(e) =>
                                handleInputChange(index, e.target.value)
                            }
                        />
                    </Box>
                ))}
                <Button variant="contained" onClick={verifyAnswers}>
                    Vérifier
                </Button>
                {score !== null && (
                    <Alert
                        severity={score === data.exercises.length ? "success" : "info"}
                        sx={{ marginTop: 2 }}
                    >
                        Score: {score}/{data.exercises.length}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default AdjectiveLesson;
