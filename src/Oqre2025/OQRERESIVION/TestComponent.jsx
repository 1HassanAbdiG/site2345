import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    Divider,
    Chip,
    Avatar,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Collapse,
} from '@mui/material';
import { styled } from '@mui/system';
import {
    School,
    
    CheckCircle,
    Description,
    Check,
    Replay,
    Close,
    PictureAsPdf,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



async function detectAvailableTests(grade, subject) {
    try {
        const context = require.context('./', false, /\.json$/);
        return context.keys()
            .filter(key => key.startsWith(`./${subject}${grade}`))
            .map(key => ({
                name: key.replace('./', '').replace('.json', ''),
                file: key
            }));
    } catch (error) {
        console.error("Erreur de détection des tests:", error);
        return [];
    }
}

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[3],
}));

const TestComponent = () => {
    const [availableTests, setAvailableTests] = useState({ '3e année': [], '6e année': [] });
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedTest, setSelectedTest] = useState(null);
    const [currentSection, setCurrentSection] = useState(null);
    const [answers, setAnswers] = useState({});
    const [scores, setScores] = useState({});
    const [completedSections, setCompletedSections] = useState({});
    const [pdfOpen, setPdfOpen] = useState(false);
    const [sectionsExpanded, setSectionsExpanded] = useState(true);

    useEffect(() => {
        const loadTests = async () => {
            const tests3 = await detectAvailableTests('3', 'francais');
            const tests6 = await detectAvailableTests('6', 'francais');
            setAvailableTests({
                '3e année': tests3,
                '6e année': tests6,
            });
        };

        loadTests();
    }, []);

    useEffect(() => {
        if (selectedTest) {
            setCurrentSection(null);
            setAnswers({});
            setScores({});
            setCompletedSections({});
            setSectionsExpanded(true);
        }
    }, [selectedTest]);

    const handleYearSelect = (event) => {
        setSelectedYear(event.target.value);
        setSelectedTest(null);
    };

    const handleTestSelect = (file) => {
        const testData = require(`./${file}.json`);
        setSelectedTest(testData);
    };

    const handleSectionSelect = (section) => {
        setCurrentSection(section);
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer,
        });
    };

    const calculateScore = (sectionId) => {
        const section = selectedTest.sections.find(sec => sec.id === sectionId);
        let score = 0;
        section.questions.forEach(question => {
            if (question.type === 'multipleChoice' && answers[question.id] === question.correctAnswer) {
                score += 1;
            }
        });
        return score;
    };

    const handleSubmit = () => {
        const newScores = {};
        selectedTest.sections.forEach(section => {
            newScores[section.id] = calculateScore(section.id);
        });
        setScores(newScores);
        setCompletedSections(prev => ({
            ...prev,
            [currentSection.id]: true,
        }));
        setCurrentSection(null);
    };

    const handleRestart = () => {
        setSelectedTest(null);
        setCurrentSection(null);
        setAnswers({});
        setScores({});
        setCompletedSections({});
    };

    const handleOpenPdf = () => {
        setPdfOpen(true);
    };

    const handleClosePdf = () => {
        setPdfOpen(false);
    };

    const toggleSections = () => {
        setSectionsExpanded(!sectionsExpanded);
    };

    const renderQuestion = (question) => {
        switch (question.type) {
            case 'multipleChoice':
                return (
                    <FormControl component="fieldset">
                        <RadioGroup
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        >
                            {question.options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={String.fromCharCode(97 + index)}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                );
            case 'openEnded':
                return (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    const allSectionsCompleted = selectedTest && selectedTest.sections.every(section => completedSections[section.id]);

    return (
        <Container>
            <Box my={4} textAlign="center">
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <School />
                </Avatar>
                <Typography variant="h3" component="h1" gutterBottom>
                    Banque de tests OQRE
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="year-select-label">Sélectionnez une année</InputLabel>
                    <Select
                        labelId="year-select-label"
                        value={selectedYear}
                        onChange={handleYearSelect}
                        sx={{
                            cursor: 'pointer', // 👈 curseur main
                            minWidth: 120,
                            borderRadius: 2,
                            backgroundColor: '#f0f4ff',
                            boxShadow: 1,
                            '&:hover': {
                                backgroundColor: '#e0ecff',
                            },
                        }}
                    >
                        {Object.keys(availableTests).map((year) => (
                            <MenuItem
                                key={year}
                                value={year}
                                sx={{
                                    cursor: 'pointer', // 👈 curseur aussi sur les options
                                }}
                            >
                                {year}
                            </MenuItem>
                        ))}
                    </Select>

                </FormControl>

                {selectedYear && (



                    <FormControl
                        fullWidth
                        sx={{
                            minWidth: 200,
                            borderRadius: 2,
                            backgroundColor: '#f0f4ff',
                            boxShadow: 2,
                            '& .MuiSelect-select': {
                                cursor: 'pointer',
                            },
                        }}
                    >
                        <InputLabel id="test-select-label">Choisir un test</InputLabel>
                        <Select
                            labelId="test-select-label"
                            value={selectedTest ? selectedTest.name : ''}
                            onChange={(e) => handleTestSelect(e.target.value)}
                            IconComponent={ExpandMoreIcon} // flèche personnalisée
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#e0ecff',
                                },
                            }}
                        >
                            {availableTests[selectedYear]?.map((test) => (
                                <MenuItem
                                    key={test.name}
                                    value={test.name}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#d0e3ff',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                >
                                    {test.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>




                )}
            </Paper>

            {selectedTest && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PictureAsPdf />}
                            onClick={handleOpenPdf}
                            sx={{ mb: 2 }}
                        >
                            Voir le PDF
                        </Button>
                    </Box>

                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            onClick={toggleSections}
                            sx={{ cursor: 'pointer' }}
                        >
                            <Typography variant="h5" component="h2">
                                Sections
                            </Typography>
                            {sectionsExpanded ? <ExpandLess /> : <ExpandMore />}
                        </Box>

                        <Collapse in={sectionsExpanded}>
                            <List>
                                {selectedTest.sections.map((section) => (
                                    <ListItem
                                        key={section.id}
                                        button
                                        onClick={() => handleSectionSelect(section)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s, border-left 0.3s',
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                            backgroundColor: currentSection?.id === section.id ? '#e0f7fa' : 'inherit',
                                            borderLeft: currentSection?.id === section.id ? '4px solid #00acc1' : '4px solid transparent',
                                            pl: 1.5,
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: completedSections[section.id] ? 'green' : 'red' }}>
                                            {completedSections[section.id] && <Check color="success" />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={section.title}
                                            primaryTypographyProps={{
                                                fontWeight: currentSection?.id === section.id ? 'bold' : 'normal',
                                                color: currentSection?.id === section.id ? 'primary.main' : 'text.primary',
                                            }}
                                        />
                                    </ListItem>

                                ))}
                            </List>
                        </Collapse>
                    </Paper>
                </>
            )}

            {currentSection && (
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {currentSection.title}
                    </Typography>
                    {currentSection.questions.map((question) => (
                        <StyledCard key={question.id}>
                            <CardContent>
                                <Typography variant="h6" component="h3">
                                    {question.questionText}
                                </Typography>
                                {renderQuestion(question)}
                            </CardContent>
                        </StyledCard>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                        Soumettre
                    </Button>
                </Paper>
            )}

            {allSectionsCompleted && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Replay />}
                        onClick={handleRestart}
                    >
                        Recommencer le test
                    </Button>
                </Box>
            )}

            {Object.keys(scores).length > 0 && (
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Bilan
                    </Typography>
                    {selectedTest.sections.map((section) => (
                        <Box key={section.id} sx={{ mb: 2 }}>
                            <Typography variant="h6" component="h3">
                                {section.title}
                            </Typography>
                            <Typography variant="body1">
                                Score: {scores[section.id]} / {section.questions.filter(q => q.type === 'multipleChoice').length}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                        </Box>
                    ))}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h3">
                            Note totale: {Object.values(scores).reduce((a, b) => a + b, 0)} / {selectedTest.sections.reduce((a, b) => a + b.questions.filter(q => q.type === 'multipleChoice').length, 0)}
                        </Typography>
                    </Box>
                    <Chip
                        icon={<Description />}
                        label="Les parties de rédaction seront notées par l'enseignant."
                        color="primary"
                        sx={{ mt: 2 }}
                    />
                </Paper>
            )}

            <Dialog
                open={pdfOpen}
                onClose={handleClosePdf}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">PDF du test</Typography>
                        <IconButton onClick={handleClosePdf}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ height: '80vh' }}>
                        {selectedTest && (
                            <iframe
                                src={selectedTest.pdfPath}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                                title="PDF du test"
                            />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default TestComponent;