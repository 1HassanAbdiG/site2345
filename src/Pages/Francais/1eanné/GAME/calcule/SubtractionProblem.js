// components/SubtractionProblem.js
import React, { useState, useEffect } from 'react';
import './SubtractionProblem.css';
import problemsData from './probleme.json';
import Bilan from '../Jeu deplacement/Bilan';

const SubtractionProblem = () => {
    const [tempName, setTempName] = useState('');

    const [studentName, setStudentName] = useState('');
    const [problems, setProblems] = useState([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [placedItems, setPlacedItems] = useState([]);
    const [stats, setStats] = useState({});
    const [showBilan, setShowBilan] = useState(false);
    const [evaluation, setEvaluation] = useState({ addition: 0, soustraction: 0, total: 0 });

    useEffect(() => {
        setProblems(problemsData);
    }, []);

    const currentProblem = problems[currentProblemIndex] || {};

    const handleItemClick = (id) => {
        setPlacedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleValidate = () => {
        const expectedCount =
            currentProblem.type === 'soustraction'
                ? currentProblem.total - currentProblem.modification
                : currentProblem.total + currentProblem.modification;

        const isCorrect = placedItems.length === expectedCount;

        const storyId = currentProblem.id;
        const currentStats = stats[storyId] || {
            attempts: 0,
            firstTry: false,
            best: 0,
            worst: 100
        };

        const updatedStats = {
            ...currentStats,
            attempts: currentStats.attempts + 1,
            firstTry: currentStats.attempts === 0 ? isCorrect : currentStats.firstTry,
            best: Math.max(currentStats.best, isCorrect ? 1 : 0),
            worst: Math.min(currentStats.worst, isCorrect ? 1 : 0),
            title: currentProblem.question,
            isCorrect: isCorrect
        };

        setStats(prev => ({ ...prev, [storyId]: updatedStats }));

      

        if (currentProblemIndex < problems.length - 1) {
            setCurrentProblemIndex(prev => prev + 1);
            setPlacedItems([]);
        } else {
            calculateEvaluation();
            setShowBilan(true);
        }
    };

    const calculateEvaluation = () => {
        let additionScore = 0;
        let soustractionScore = 0;

        Object.entries(stats).forEach(([key, stat]) => {
            if (stat.isCorrect) {
                const problem = problems.find(p => p.id === parseInt(key));
                if (problem?.type === 'addition') additionScore++;
                if (problem?.type === 'soustraction') soustractionScore++;
            }
        });

        const totalScore = additionScore + soustractionScore;
        setEvaluation({
            addition: additionScore,
            soustraction: soustractionScore,
            total: totalScore
        });
    };

    if (showBilan) {
        return (
            <div className="container">
                <h2>Bilan pour {studentName}</h2>
                <Bilan stats={stats} />
                <div>
                    <h3>Évaluation</h3>
                    <p>Note d'addition : {evaluation.addition} / {problems.filter(p => p.type === 'addition').length}</p>
                    <p>Note de soustraction : {evaluation.soustraction} / {problems.filter(p => p.type === 'soustraction').length}</p>
                    <p>Note totale : {evaluation.total} / {problems.length}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Problème de maths</h2>

            {!studentName ? (
                <div>
                    <p>Veuillez entrer votre nom :</p>
                    <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Entrez votre nom"
                    />
                    <button
                        onClick={() => {
                            if (tempName.trim() !== '') {
                                setStudentName(tempName.trim());
                            } else {
                                alert("Veuillez entrer un nom valide.");
                            }
                        }}
                    >
                        Commencer
                    </button>
                </div>
            ) : (


                <>
                    <p>{currentProblem.question}</p>

                    <div className="scenes">
                        {/* Scène initiale */}
                        <div className="scene left-scene">
                          
                            <div className="items">
                                {Array.from({ length: currentProblem.total }).map((_, i) => (
                                    <span key={i} className="item">{currentProblem.emoji}</span>
                                ))}
                            </div>
                        </div>

                        {/* Modification (soustraction ou addition) */}
                        <div className={currentProblem.type === 'soustraction' ? 'modified' : 'added'}>
                           
                            <div className="items">
                                {Array.from({ length: currentProblem.modification }).map((_, i) => (
                                    <span key={i} className="item">
                                        {currentProblem.type === 'soustraction'
                                            ? currentProblem.emojiModifie
                                            : currentProblem.emoji}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Scène interactive */}
                        <div className="scene right-scene">
                            <p>Clique pour ajouter ou retirer le nombre de {currentProblem.emoji} .</p>
                            <div className="items">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`item ${placedItems.includes(i) ? 'placed' : ''}`}
                                        onClick={() => handleItemClick(i)}
                                    >
                                        {placedItems.includes(i) ? currentProblem.emoji : '⬜'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Objets disponibles à cliquer */}
                    <div className="available-items">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <span
                                key={i}
                                className="item draggable"
                                onClick={() => handleItemClick(i)}
                            >
                                {placedItems.includes(i) ? '⬜' : currentProblem.emoji}
                            </span>
                        ))}
                    </div>

                    <button onClick={handleValidate}>Valider</button>
                </>

            )}

        </div>
    );
};

export default SubtractionProblem;
