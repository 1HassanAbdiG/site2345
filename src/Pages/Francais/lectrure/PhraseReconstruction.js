import React, { useState, useEffect, useRef } from 'react';
import styles from './PhraseReconstruction.module.css';

const PhraseReconstruction = () => {
    const [phrases, setPhrases] = useState([]);
    const [selectedText, setSelectedText] = useState([]);
    const [loading, setLoading] = useState(true);
    const constructionAreaRefs = useRef([]);
    const [startTime, setStartTime] = useState(null); // To track start time
    const [endTime, setEndTime] = useState(null); // To track end time
    const [totalTime, setTotalTime] = useState(''); // To store calculated time

    const requireJsonFiles = require.context('./datalecture', false, /\.json$/);

    useEffect(() => {
        const loadPhrases = () => {
            const jsonFiles = requireJsonFiles.keys().map(requireJsonFiles);
            const allPhrases = jsonFiles.map(json => ({
                title: json.text.title,
                content: json.text.content,
            }));
            setPhrases(allPhrases);
            setLoading(false);
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
        setSelectedText(phrases[index].content);
        constructionAreaRefs.current = Array(phrases[index].content.length).fill().map(() => React.createRef());
        setStartTime(Date.now()); // Start the timer when text is selected
        setEndTime(null); // Reset end time on new selection
        setTotalTime(''); // Reset displayed time on new selection
    };

    const createPhraseArea = (phrase, index) => {
        const words = phrase.split(' ');
        shuffleArray(words);

        return (
            <div className={styles.phraseArea} key={index}>
                <div className={styles.wordBank}>
                    {words.map((word, idx) => (
                        <button
                            key={idx}
                            className={styles.word}
                            onClick={(e) => moveWord(e.target, constructionAreaRefs.current[index].current)}
                        >
                            {word}
                        </button>
                    ))}
                </div>
                <div className={styles.constructionArea} ref={constructionAreaRefs.current[index]}></div>
                <button
                    className={styles.checkButton}
                    onClick={() => checkPhrase(phrase, constructionAreaRefs.current[index].current)}
                >
                    Vérifier
                </button>
                <div className={styles.message}></div>
            </div>
        );
    };

    const moveWord = (wordElement, targetArea) => {
        if (wordElement.parentElement.classList.contains(styles.wordBank)) {
            targetArea.appendChild(wordElement);
        } else {
            wordElement.parentElement.previousElementSibling.appendChild(wordElement);
        }
    };

    const checkPhrase = (correctPhrase, constructionArea) => {
        const constructedPhrase = Array.from(constructionArea.children)
            .map(word => word.textContent)
            .join(' ');

        const messageElement = constructionArea.nextElementSibling;
        if (constructedPhrase === correctPhrase) {
            messageElement.textContent = "Correct !";
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = "Essaie encore.";
            messageElement.style.color = 'red';
        }
    };

    const checkAllPhrases = () => {
        constructionAreaRefs.current.forEach((ref, index) => {
            if (ref.current && phrases[index] && phrases[index].content) {
                const constructionArea = ref.current;
                const phraseContent = Array.isArray(phrases[index].content)
                    ? phrases[index].content.join(' ')
                    : '';

                checkPhrase(phraseContent, constructionArea);
            }
        });

        setEndTime(Date.now()); // Record the end time when checking all phrases
        calculateTotalTime(); // Calculate the total time after verification
    };

    const calculateTotalTime = () => {
        if (!endTime || !startTime) {
            setTotalTime("Temps indisponible");
        } else {
            const timeTaken = endTime - startTime;
            const minutes = Math.floor(timeTaken / 60000);
            const seconds = Math.floor((timeTaken % 60000) / 1000);
            setTotalTime(`${minutes} minute(s) et ${seconds} seconde(s)`);
        }
    };

    const readAllPhrases = () => {
        const constructedPhrases = constructionAreaRefs.current.map(ref => {
            if (ref.current) {
                return Array.from(ref.current.children)
                    .map(word => word.textContent)
                    .join(' ');
            }
            return '';
        })
            .filter(phrase => phrase.length > 0)
            .join('. ');

        const utterance = new SpeechSynthesisUtterance(constructedPhrases);
        utterance.lang = 'fr-FR';
        speechSynthesis.speak(utterance);
    };

    const initializeGame = () => {
        setSelectedText([]);
        setStartTime(null); // Reset the timer
        setTotalTime(''); // Clear the time display
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.gameContainer}>
            <h1>Remettre les Phrases dans l'ordre</h1>
            <p>
                <strong>Consigne :</strong>
                <ol>
                    <li>Sélectionnez un texte dans le menu déroulant.</li>
                    <li>Cliquez sur les mots dans la zone de mot pour les déplacer dans la zone de construction.</li>
                    <li>Si vous vous êtes trompé, cliquez à nouveau sur le mot pour le remettre à sa place.</li>
                    <li>Cliquez sur "Vérifier" pour vérifier votre réponse.</li>
                </ol>
            </p>

            <div>
                <select onChange={(e) => handleSelectText(e.target.value)}>
                    <option value="" disabled selected>Sélectionner un texte</option>
                    {phrases.map((phraseGroup, index) => (
                        <option key={index} value={index}>
                            {phraseGroup.title}
                        </option>
                    ))}
                </select>
            </div>
            {selectedText.map((phrase, index) => createPhraseArea(phrase, index))}
            <div className={styles.buttonArea}>
                <button className={styles.actionButton} onClick={checkAllPhrases}>Vérifier Tout</button>
                <button className={styles.actionButton} onClick={readAllPhrases}>Lire Tout</button>
                <button className={styles.actionButton} onClick={initializeGame}>Recommencer</button>
            </div>
            {totalTime && <p className={styles.timeDisplay}>Temps écoulé : {totalTime}</p>} {/* Display total time */}
        </div>
    );
};

export default PhraseReconstruction;
