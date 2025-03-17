import React, { useState, useEffect } from "react";
import {
    Button,
    Grid,
    Card,
    CardMedia,
    Typography,
    Paper,
    Box,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import syllableData from "./syllables.json";


const SyllableGame = () => {
    const [selectedSyllables, setSelectedSyllables] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [answerComplete, setAnswerComplete] = useState(false);

    const syllables = syllableData.syllables;
    const words = syllableData.words;

    useEffect(() => {
        setProgress((currentIndex / words.length) * 100);
    }, [currentIndex, words.length]);

    const playAudio = (word) => {
        const audio = new Audio(`/audio/${word}`);
        audio.play().catch((error) =>
            console.error("Erreur de lecture audio:", error)
        );
    };

    const handleSyllableClick = (syllable) => {
        if (showSummary || answerComplete) return;

        const targetLength = words[currentIndex].correct.length;
        const newLength = selectedSyllables.length + syllable.length;

        if (newLength <= targetLength) {
            const newSyllables = selectedSyllables + syllable;
            setSelectedSyllables(newSyllables);
            if (newSyllables.length === targetLength) {
                setAnswerComplete(true);
            }
        } else {
            // Si l'ajout dépasse la longueur attendue, on marque la réponse comme complète et incorrecte.
            const newSyllables = selectedSyllables + syllable;
            setSelectedSyllables(newSyllables);
            setAnswerComplete(true);
        }
    };

    const handleNextWord = () => {
        const isCorrect =
            selectedSyllables.toLowerCase() ===
            words[currentIndex].correct.toLowerCase();

        setResults((prevResults) => [
            ...prevResults,
            {
                word: words[currentIndex].correct.toLowerCase(),
                userAnswer: selectedSyllables.toLowerCase(),
                correct: isCorrect,
            },
        ]);

        if (isCorrect) {
            playAudio(words[currentIndex].correct.toLowerCase());
        }

        if (currentIndex < words.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedSyllables("");
            setAnswerComplete(false);
        } else {
            setShowSummary(true);
            setOpenSnackbar(true);
        }
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setSelectedSyllables("");
        setResults([]);
        setShowSummary(false);
        setAnswerComplete(false);
        setOpenSnackbar(false);
    };

    return (
        <Grid
            container
            spacing={1}
            sx={{
                padding: 2,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            {/* Titre et progression */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        🌟 Choisis les bonnes syllabes ! 🌟
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ marginTop: 2, height: 12, borderRadius: 5 }}
                    />
                </Paper>
            </Grid>

            {/* Jeu en cours */}
            {!showSummary ? (
                <>
                    <Grid item xs={12}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card
                                sx={{
                                    p: 1,
                                    m: 1,
                                    display: "flex",
                                    flexDirection: "ROW",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    backgroundColor: "#e6eaf2",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    src={`/imag/${words[currentIndex]?.image}`}
                                    alt={words[currentIndex]?.correct}
                                    sx={{
                                        height: 200,
                                        maxWidth: "250px",
                                        objectFit: "contain",
                                        borderRadius: 2,
                                        mb: 3,
                                    }}
                                />
                                <div style={{ margin: "20px" }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 2, fontSize: "2.5rem", fontWeight: "medium", textAlign: "center", color: "green" }}
                                    >
                                        {words[currentIndex]?.article.toLowerCase()}{" "}
                                        {selectedSyllables.toLowerCase() || "____"}
                                        {selectedSyllables &&
                                            (selectedSyllables.toLowerCase() === words[currentIndex].correct.toLowerCase() ? " ✅" : " ❌")}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => playAudio(words[currentIndex]?.audio)}
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                px: 3,
                                                py: 1,
                                            }}
                                        >
                                            🔊 Écouter le mot
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={resetGame}
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                px: 3,
                                                py: 1,
                                                "&:hover": {
                                                    transform: "scale(1.05)",
                                                    backgroundColor: "#1565c0",
                                                },
                                            }}
                                        >
                                            Réinitialiser
                                        </Button>
                                    </Box>
                                    {answerComplete && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mt: 2,
                                                cursor: "pointer",
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                px: 3,
                                                py: 1,
                                            }}
                                            onClick={handleNextWord}
                                        >
                                            Continuer
                                        </Button>
                                    )}

                                </div>

                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Syllabes disponibles */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Syllabes disponibles :
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                {syllables.map((syllable, i) => (
                                    <Button
                                        key={i}
                                        variant="contained"
                                        sx={{
                                            m: 1,
                                            p: 2, // Augmente la surface cliquable
                                            fontSize: "1.5rem",
                                            textTransform: "none",
                                            backgroundColor: "#1976d2",
                                            color: "#ffffff",
                                            "&:hover": {
                                                backgroundColor: "#115293",
                                                transform: "scale(1.05)",
                                            },
                                            transition: "all 0.1s ease",
                                            cursor: "pointer",
                                            minWidth: "100px", // Assure une largeur minimale
                                            minHeight: "50px", // Assure une hauteur minimale
                                        }}
                                        onClick={() => handleSyllableClick(syllable)}
                                    >
                                        {syllable.toLowerCase()}
                                    </Button>

                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Bouton de réinitialisation */}
                    <Grid item xs={12}>


                    </Grid>
                </>
            ) : (
                // Bilan des réponses
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={resetGame}
                        sx={{ mt: 2, cursor: "pointer" }}
                    >
                        Recommencer
                    </Button>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Bilan des réponses
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mot correct</TableCell>
                                    <TableCell>Réponse utilisateur</TableCell>
                                    <TableCell>Résultat</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{result.word}</TableCell>
                                        <TableCell>{result.userAnswer || "____"}</TableCell>
                                        <TableCell>
                                            {result.correct ? "✅ Correct" : "❌ Faux"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>

                </Grid>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message="Bravo ! Tu as terminé le jeu !"
            />
           

        </Grid>
    );
};

export default SyllableGame;
