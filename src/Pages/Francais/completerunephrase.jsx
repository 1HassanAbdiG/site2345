import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from '../Francais/lectrure/PhraseReconstruction.module.css';

const PhraseDeplacer = () => {
    const [phrases, setPhrases] = useState([]);
    const [selectedTextIndex, setSelectedTextIndex] = useState(null);
    const [constructionAreaRefs, setConstructionAreaRefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState('');

    const requireJsonFiles = require.context('./jsonphrase', false, /\.json$/);

    useEffect(() => {
        const loadPhrases = () => {
            try {
                const jsonFiles = requireJsonFiles.keys().map(requireJsonFiles);
                const allPhrases = jsonFiles.map(json => ({
                    title: json.text.title,
                    sentences: json.text.sentences,
                }));
                setPhrases(allPhrases);
            } catch (error) {
                console.error("Error loading JSON files:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPhrases();
    }, [requireJsonFiles]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const handleSelectText = (index) => {
        const parsedIndex = parseInt(index, 10);

        if (!phrases[parsedIndex]) {
            console.error("Invalid text index selected");
            return;
        }

        setSelectedTextIndex(parsedIndex);
        const refs = phrases[parsedIndex]?.sentences?.map(() => React.createRef()) || [];
        setConstructionAreaRefs(refs);
        setStartTime(Date.now());
        setTotalTime('');
    };

    const moveWord = (wordElement, targetArea) => {
        if (!targetArea) return;

        const parentClass = wordElement.parentElement.classList;

        if (parentClass.contains(styles.wordBank)) {
            targetArea.appendChild(wordElement);
        } else {
            wordElement.parentElement.previousElementSibling.appendChild(wordElement);
        }
    };

    const checkPhrase = (correctOrder, constructionArea) => {
        const constructedPhrase = Array.from(constructionArea.children)
            .map(word => word.textContent)
            .join(' ');

        const messageElement = constructionArea.nextElementSibling;
        if (constructedPhrase === correctOrder.join(' ')) {
            messageElement.textContent = "Correct !";
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = "Essaie encore.";
            messageElement.style.color = 'red';
        }
    };

    const checkAllPhrases = () => {
        if (selectedTextIndex === null || !phrases[selectedTextIndex]) return;

        constructionAreaRefs.forEach((ref, idx) => {
            const sentence = phrases[selectedTextIndex].sentences[idx];
            checkPhrase(sentence.correctOrder, ref.current);
        });

        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        const minutes = Math.floor(timeTaken / 60000);
        const seconds = Math.floor((timeTaken % 60000) / 1000);
        setTotalTime(`${minutes} minute(s) et ${seconds} seconde(s)`);
    };

    const createPhraseArea = (sentence, index) => {
        const shuffledWords = [...sentence.words];
        shuffleArray(shuffledWords);

        return (
            <div className={styles.phraseArea} key={index}>
                <Typography variant="h6">Type de phrase: {sentence.type}</Typography>
                <div className={styles.wordBank}>
                    {shuffledWords.map((word, idx) => (
                        <button
                            key={idx}
                            className={styles.word}
                            onClick={(e) => moveWord(e.target, constructionAreaRefs[index]?.current)}
                        >
                            {word}
                        </button>
                    ))}
                </div>
                <div
                    className={styles.constructionArea}
                    ref={constructionAreaRefs[index]}
                ></div>
                <button
                    className={styles.checkButton}
                    onClick={() => checkPhrase(sentence.correctOrder, constructionAreaRefs[index]?.current)}
                >
                    Vérifier
                </button>
                <div className={styles.message}></div>
            </div>
        );
    };

    if (loading) return <div>Chargement en cours...</div>;

    return (
        <Box className={styles.gameContainer}>
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

            <div>
                <select
                    defaultValue=""
                    onChange={(e) => handleSelectText(e.target.value)}
                >
                    <option value="" disabled>
                        Sélectionner un texte
                    </option>
                    {phrases.map((text, index) => (
                        <option key={index} value={index}>
                            {text.title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTextIndex !== null &&
                phrases[selectedTextIndex]?.sentences?.map((sentence, index) =>
                    createPhraseArea(sentence, index)
                )}

            <Box className={styles.buttonArea}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={checkAllPhrases}
                >
                    Vérifier Tout
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleSelectText(selectedTextIndex)}
                >
                    Recommencer
                </Button>
            </Box>

            {totalTime && (
                <Box className={styles.resultBox}>
                    <Typography variant="h6">
                        Temps écoulé : {totalTime}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default PhraseDeplacer;
