import React, { useState, useEffect, useCallback } from 'react'; // useCallback is imported
import {
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    List,
    ListItem,
} from '@mui/material';

// Custom Button component
function CustomButton({ onClick, label, color = "primary", variant = "contained" }) {
    return (
        <Button onClick={onClick} color={color} variant={variant} style={{ margin: "0 10px" }}>
            {label}
        </Button>
    );
}

function Suite() {
    const [visibleComponent, setVisibleComponent] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [currentSequences, setCurrentSequences] = useState([]);
    const [stats, setStats] = useState({ completed: 0, correct: 0, solutionsViewed: 0 });
    const [history, setHistory] = useState([]);

    // Function to load JSON dynamically
    const loadJson = async (jsonFileName) => {
        try {
            const json = await import(`./${jsonFileName}`);
            setJsonData(json.default || json); // Handle default export and named export
            setCurrentSequences(json.default || json); // Handle the loaded JSON data
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    };

    // useCallback to memoize the function to avoid re-creating it on every render
    const generateNewSequences = useCallback(() => {
        const shuffled = [...jsonData].sort(() => Math.random() - 0.5).slice(0, 5);
        setCurrentSequences(shuffled.map(seq => ({ ...seq, input1: '', input2: '', showSolution: false })));
        setStats({ completed: 0, correct: 0, solutionsViewed: 0 });
    }, [jsonData]); // Now generateNewSequences is memoized and depends on jsonData

    // Effect to generate new sequences when JSON is loaded
    useEffect(() => {
        if (jsonData) {
            generateNewSequences();
        }
    }, [jsonData, generateNewSequences]); // Added generateNewSequences to the dependency array

    const updateStats = () => {
        const completed = currentSequences.filter(seq => seq.input1 && seq.input2).length;
        setStats(prevStats => ({ ...prevStats, completed }));
    };

    const checkAnswer = (index) => {
        const { next, input1, input2 } = currentSequences[index];
        return input1 === next[0] && input2 === next[1];
    };

    const handleInputChange = (index, value, pos) => {
        const updatedSequences = [...currentSequences];
        updatedSequences[index][pos] = !isNaN(value) && value !== '' ? parseInt(value, 10) : '';
        setCurrentSequences(updatedSequences);
        updateStats();
    };

    const validateAll = () => {
        const allCompleted = currentSequences.every(seq => seq.input1 && seq.input2);

        if (!allCompleted) {
            alert("Veuillez compléter toutes les questions avant de valider !");
            return;
        }

        const correctCount = currentSequences.reduce(
            (count, seq, index) => count + (checkAnswer(index) ? 1 : 0),
            0
        );

        // Déterminer le niveau (facile, intermédiaire, avancé)
        const level = visibleComponent === "facile" ? "Facile" : visibleComponent === "intermediaire" ? "Intermédiaire" : "Avancé";

        setStats(prevStats => ({
            ...prevStats,
            correct: correctCount,
        }));

        setHistory([
            ...history,
            {
                attempt: history.length + 1,
                correct: correctCount,
                solutionsViewed: stats.solutionsViewed,
                level: level, // Ajout du niveau à l'historique
            },
        ]);

        alert("Validation effectuée !");
    };

    const toggleSolution = (index) => {
        const updatedSequences = [...currentSequences];
        const sequence = updatedSequences[index];

        if (!sequence.showSolution) {
            setStats(prevStats => ({ ...prevStats, solutionsViewed: prevStats.solutionsViewed + 1 }));
        }

        sequence.showSolution = !sequence.showSolution;
        setCurrentSequences(updatedSequences);
    };

    const resetAll = () => {
        setCurrentSequences(currentSequences.map(seq => ({ ...seq, input1: '', input2: '', showSolution: false })));
        setStats({ completed: 0, correct: 0, solutionsViewed: 0 });
        setHistory([]);  // Reset history as well
    };

    const handleButtonClick = (component, jsonFile) => {
        if (visibleComponent === component) {
            setVisibleComponent(null);
            setJsonData(null);
            resetAll()
        } else {
            setVisibleComponent(component);
            loadJson(jsonFile);
        }
    };

 

    return (
        <Box sx={{ padding: 4 }}>
            <CustomButton
                onClick={() => handleButtonClick("facile", "facile.json")}
                label={visibleComponent === "facile" ? "Masquer facile" : "Afficher facile"}
                color="primary"
            />
            <CustomButton
                onClick={() => handleButtonClick("intermediaire", "intermediaire.json")}
                label={visibleComponent === "intermediaire" ? "Masquer intermediaire" : "Afficher intermediaire"}
                color="success"
            />
            <CustomButton
                onClick={() => handleButtonClick("avancer", "avancer.json")}
                label={visibleComponent === "avancer" ? "Masquer avancer" : "Afficher avancer"}
                color="warning"
            />
            <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                Complète les suites de nombres
            </Typography>
            <Typography variant="h6" gutterBottom>Instructions:</Typography>
            <List>
                <ListItem>Trouve les deux nombres manquants dans chaque suite.</ListItem>
                <ListItem>Observe bien la règle qui relie les nombres entre eux.</ListItem>
                <ListItem>Tu peux voir la solution si tu es bloqué(e).</ListItem>
            </List>

            {currentSequences.map((seq, index) => (
                <Box key={index} sx={{ marginBottom: 3, padding: 2, border: '2px solid #FFC107', borderRadius: '8px', backgroundColor: '#FFF9C4' }}>
                    <Typography variant="body1">{index + 1}) {seq.seq.join(', ')}, ___, ___</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 1 }}>
                        <TextField
                            label="Premier nombre"
                            type="number"
                            value={seq.input1 || ''}
                            onChange={(e) => handleInputChange(index, e.target.value, 'input1')}
                            size="small"
                        />
                        <TextField
                            label="Deuxième nombre"
                            type="number"
                            value={seq.input2 || ''}
                            onChange={(e) => handleInputChange(index, e.target.value, 'input2')}
                            size="small"
                        />
                    </Box>
                    {seq.showSolution && (
                        <Typography variant="body2" sx={{ marginTop: 1, color: '#F44336' }}>
                            Règle : {seq.rule} <br />Réponse : {seq.next.join(', ')}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        onClick={() => toggleSolution(index)}
                        sx={{ marginTop: 1, backgroundColor: seq.showSolution ? '#F44336' : '#4CAF50' }}
                    >
                        {seq.showSolution ? 'Cacher la solution' : 'Voir la solution'}
                    </Button>
                </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                <Button variant="contained" color="success" onClick={validateAll}>Valider tout</Button>
                <Button variant="outlined" color="secondary" onClick={resetAll}>Réinitialiser</Button>
                <Button variant="outlined" onClick={generateNewSequences}>Nouvelles questions</Button>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6">Tableau récapitulatif</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Questions complétées</TableCell>
                                <TableCell>{stats.completed}/5</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Réponses correctes</TableCell>
                                <TableCell>{stats.correct}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Solutions consultées</TableCell>
                                <TableCell>{stats.solutionsViewed}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6">Historique des essais</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Essai #</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Solutions consultées</TableCell>
                                <TableCell>Niveau</TableCell> {/* Nouvelle colonne pour le niveau */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{entry.attempt}</TableCell>
                                    <TableCell>{entry.correct}</TableCell>
                                    <TableCell>{entry.solutionsViewed}</TableCell>
                                    <TableCell>{entry.level}</TableCell> {/* Affichage du niveau */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Box>
    );
}

export default Suite;
