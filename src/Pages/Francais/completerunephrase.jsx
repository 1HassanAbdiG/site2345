import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Card, Stack, Chip } from '@mui/material';
import { blue, green, red } from '@mui/material/colors';

const PhraseDeplacer = () => {
    const [phrases, setPhrases] = useState([]);
    const [selectedTextIndex, setSelectedTextIndex] = useState(null);
    const [wordsBank, setWordsBank] = useState([]);
    const [constructedSentences, setConstructedSentences] = useState([]);
    const [scores, setScores] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState('');

    const requireJsonFiles = require.context('./jsonphrase', false, /\.json$/);

    useEffect(() => {
        const loadPhrases = () => {
            try {
                const jsonFiles = requireJsonFiles.keys().map(requireJsonFiles);
                setPhrases(jsonFiles.map(json => ({ title: json.text.title, sentences: json.text.sentences })));
            } catch (error) {
                console.error("Error loading JSON files:", error);
            }
        };
        loadPhrases();
    }, [requireJsonFiles]);

        

    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

    const handleSelectText = (index) => {
        if (!phrases[index]) return;
        setSelectedTextIndex(index);
        setStartTime(Date.now());
        setTotalTime('');
        setScores(new Array(phrases[index].sentences.length).fill(0));
        setTotalScore(0);
        setWordsBank(phrases[index].sentences.map(sentence => shuffleArray([...sentence.words])));
        setConstructedSentences(new Array(phrases[index].sentences.length).fill([]));
    };

    const moveWord = (word, sentenceIndex) => {
        setWordsBank(prev => prev.map((words, idx) => idx === sentenceIndex ? words.filter(w => w !== word) : words));
        setConstructedSentences(prev => prev.map((sent, idx) => idx === sentenceIndex ? [...sent, word] : sent));
    };

    const removeWord = (word, sentenceIndex) => {
        setConstructedSentences(prev => prev.map((sent, idx) => idx === sentenceIndex ? sent.filter(w => w !== word) : sent));
        setWordsBank(prev => prev.map((words, idx) => idx === sentenceIndex ? [...words, word] : words));
    };

    const checkPhrase = (correctOrder, sentenceIndex) => {
        const isCorrect = constructedSentences[sentenceIndex].join(' ') === correctOrder.join(' ');
        setScores(prev => prev.map((score, idx) => idx === sentenceIndex ? (isCorrect ? 1 : 0) : score));
        setTotalScore(scores.reduce((acc, curr) => acc + curr, 0));
    };

    const checkAllPhrases = () => {
        if (selectedTextIndex === null) return;
        const newScores = phrases[selectedTextIndex].sentences.map((sentence, idx) =>
            constructedSentences[idx].join(' ') === sentence.correctOrder.join(' ') ? 1 : 0
        );
        setScores(newScores);
        setTotalScore(newScores.reduce((acc, curr) => acc + curr, 0));
        setTotalTime(`${Math.floor((Date.now() - startTime) / 60000)} min ${(Date.now() - startTime) % 60000 / 1000} sec`);
    };

    return (
        <Box sx={{ p: 3, maxWidth: "lg", mx: 'auto', bgcolor: blue[50], borderRadius: 2 }}>
            <Typography variant="h4" sx={{
                fontSize: "3rem", // Change la taille de la police
                textAlign: "center",
                color: "#000000", // Très noir
                fontWeight: "bold",
                fontFamily: "'Roboto', sans-serif",

            }}>Apprendre à former des phrases</Typography>
            <Typography variant="body1" component="div">
                <strong>Consigne :</strong>
                <ol>
                    <li>Sélectionnez un texte dans le menu déroulant.</li>
                    <li>Cliquez sur les mots dans la zone de mot pour les déplacer dans la zone de construction.</li>
                    <li>Si vous vous êtes trompé, cliquez à nouveau sur le mot pour le remettre à sa place.</li>
                    <li>Cliquez sur "Vérifier" pour vérifier votre réponse.</li>
                </ol>
            </Typography>
            <Typography variant="body1" mt={2}>Sélectionnez un texte :</Typography>
            <Select fullWidth value={selectedTextIndex || ''} onChange={(e) => handleSelectText(e.target.value)}>
                {phrases.map((text, index) => (
                    <MenuItem key={index} value={index}>{text.title}</MenuItem>
                ))}
            </Select>

            {selectedTextIndex !== null && phrases[selectedTextIndex]?.sentences?.map((sentence, index) => (
                <Card key={index} sx={{ mt: 3, p: 3, bgcolor: blue[100], width: "93%" }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Type: {sentence.type}
                    </Typography>

                    {/* Zone de construction */}
                    <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                        sx={{ p: 3, bgcolor: green[50], borderRadius: 2, width: "95%" }}
                    >
                        {constructedSentences[index].map((word, i) => (
                            <Chip
                                key={i}
                                label={word}
                                color="primary"
                                sx={{ fontSize: "1.1rem", padding: "10px", minWidth: "50px", '&:hover': { bgcolor: blue[200] } }}
                                onClick={() => removeWord(word, index)}
                            />
                        ))}
                    </Stack>

                    {/* Zone des mots à déplacer */}
                    <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                        sx={{ mt: 3, p: 3, bgcolor: red[50], borderRadius: 2, width: "95%" }}
                    >
                        {wordsBank[index].map((word, i) => (
                            <Chip
                                key={i}
                                label={word}
                                color="secondary"
                                sx={{ fontSize: "1.1rem", padding: "10px", minWidth: "50px", '&:hover': { bgcolor: red[200] } }}
                                onClick={() => moveWord(word, index)}
                            />
                        ))}
                    </Stack>

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 3, fontSize: "1.2rem", padding: "12px 20px" }}
                        onClick={() => checkPhrase(sentence.correctOrder, index)}
                    >
                        Vérifier
                    </Button>
                </Card>
            ))}


            <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={checkAllPhrases}>Vérifier Tout</Button>
            {totalTime && <Typography variant="h6" textAlign="center" mt={2}>Temps écoulé: {totalTime}</Typography>}

            {scores.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Phrase</TableCell>
                                <TableCell>Résultat</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores.map((score, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>Phrase {idx + 1}</TableCell>
                                    <TableCell>{score === 1 ? '✅ Correct' : '❌ Incorrect'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Typography variant="h5" textAlign="center" mt={3} color={blue[900]}>Score Total: {totalScore} / {scores.length}</Typography>
        </Box>
    );
};

export default PhraseDeplacer;
