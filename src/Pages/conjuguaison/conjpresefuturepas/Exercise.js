import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import data from "./phrases.json";

const Exercise = () => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [feedback, setFeedback] = useState({});
    const [score, setScore] = useState(null);

    const handleAnswer = (index, userAnswer) => {
        const correctAnswer = data.phrases[index].time;
        setSelectedAnswers({ ...selectedAnswers, [index]: userAnswer });
        setFeedback({
            ...feedback,
            [index]: userAnswer === correctAnswer ? "correct" : "wrong",
        });
    };

    const handleFinish = () => {
        const total = data.phrases.length;
        const correctCount = Object.keys(feedback).reduce(
            (acc, key) => (feedback[key] === "correct" ? acc + 1 : acc),
            0
        );
        setScore(`${correctCount} / ${total}`);
    };

    const allAnswered = Object.keys(selectedAnswers).length === data.phrases.length;

    return (
        <Box
            sx={{
               margin:5,
                padding: 5,
                mx: "auto",
                maxWidth: "1200px",
                backgroundColor: "#040404", // Bleu pastel
                borderRadius: "8px", // Ajoute des coins arrondis
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Ajoute une ombre subtile
            }}
        >


            <Typography variant="h5" component="p" sx={{ mb: 3, fontWeight: "bold",color:"red",textAlign:"center" }}>
                {data.question}
            </Typography>

            <Grid container spacing={3}>
                {data.phrases.map((phrase, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ backgroundColor: "#f9f9f9" }}>
                            <CardContent>
                                <Typography variant="body1" gutterBottom sx={{  fontWeight: "bold",color:"green",textAlign:"center" }}>
                                    {phrase.text}
                                </Typography>

                                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color={
                                            feedback[index] === "correct" && selectedAnswers[index] === "passé"
                                                ? "success"
                                                : feedback[index] === "wrong" && selectedAnswers[index] === "passé"
                                                    ? "success"
                                                    : "primary"
                                        }
                                        onClick={() => handleAnswer(index, "passé")}
                                    >
                                        Passé
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={
                                            feedback[index] === "correct" && selectedAnswers[index] === "présent"
                                                ? "success"
                                                : feedback[index] === "wrong" && selectedAnswers[index] === "présent"
                                                    ? "success"
                                                    : "primary"
                                        }
                                        onClick={() => handleAnswer(index, "présent")}
                                    >
                                        Présent
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={
                                            feedback[index] === "correct" && selectedAnswers[index] === "futur"
                                                ? "success"
                                                : feedback[index] === "wrong" && selectedAnswers[index] === "futur"
                                                    ? "success"
                                                    : "primary"
                                        }
                                        onClick={() => handleAnswer(index, "futur")}
                                    >
                                        Futur
                                    </Button>
                                </Box>

                                {score !== null && feedback[index] && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 2,
                                            fontWeight: "bold",
                                            color: feedback[index] === "correct" ? "green" : "red",
                                        }}
                                    >
                                        {feedback[index] === "correct"
                                            ? "Bonne réponse !"
                                            : `Mauvaise réponse. La bonne réponse est : "${data.phrases[index].time}".`}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Section Vérification finale */}
            {score === null && (
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!allAnswered}
                        onClick={handleFinish}
                    >
                        Vérifier mes réponses
                    </Button>
                    {!allAnswered && (
                        <Typography variant="body2" sx={{ color: "red", mt: 2 }}>
                            Veuillez répondre à toutes les phrases avant de valider.
                        </Typography>
                    )}
                </Box>
            )}

            {/* Section Résultat */}
            <Card variant="outlined" sx={{ backgroundColor: "#f1f1f1", p: 2, borderRadius: 2, boxShadow: 3 }}>
                {score !== null && (
                    <Box sx={{ mt: 4, textAlign: "left" }}>
                        <Alert severity="info" sx={{ fontSize: "1.2rem", mb: 3, backgroundColor: "#e0f7fa", color: "#004d40" }}>
                            <strong>Votre score :</strong> {score}
                        </Alert>

                        <Typography variant="h6" sx={{ mb: 3, textAlign: "center", color: "#1976d2" }}>
                            Résultats détaillés
                        </Typography>

                        <Grid container spacing={2}>
                            {data.phrases.map((phrase, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            backgroundColor: feedback[index] === "correct" ? "#e8f5e9" : "#ffebee",
                                            borderLeft: `5px solid ${feedback[index] === "correct" ? "#4caf50" : "#f44336"}`,
                                            p: 2,
                                            height: "100%",
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                                            {phrase.text}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: feedback[index] === "correct" ? "#388e3c" : "#d32f2f",
                                                mb: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            {feedback[index] === "correct" ? (
                                                <span role="img" aria-label="correct">
                                                    ✅
                                                </span>
                                            ) : (
                                                <span role="img" aria-label="incorrect">
                                                    ❌
                                                </span>
                                            )}
                                            Votre réponse : "{selectedAnswers[index]}"
                                        </Typography>
                                        {feedback[index] === "wrong" && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#d32f2f",
                                                    fontStyle: "italic",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <span role="img" aria-label="correct-answer">
                                                    💡
                                                </span>
                                                Bonne réponse : "{phrase.time}"
                                            </Typography>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Card>



        </Box>


    );
};

export default Exercise;
