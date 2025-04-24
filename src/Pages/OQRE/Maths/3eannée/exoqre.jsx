// MathExerciseContainer.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    CircularProgress, // Import CircularProgress
} from '@mui/material';
import ExerciseRenderer from './mathsexrcon';
import ExerciseFeedback from './exercicefeelback';
import mathData from "./exercice.json"; // Keep import for JSON data

const MathExerciseContainer = () => {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [feedbackSnackbar, setFeedbackSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [topicCompleted, setTopicCompleted] = useState(false);
    const [partCompleted, setPartCompleted] = useState(false);
    const [sectionCompleted, setSectionCompleted] = useState(false);
    const [curriculumCompleted, setCurriculumCompleted] = useState(false);
    const [loadingData, setLoadingData] = useState(true); // Add loading state

    useEffect(() => {
        // Simulate data loading delay (if you were fetching from API, this delay would be inherent)
        const timer = setTimeout(() => {
            setLoadingData(false); // Set loading to false after a short delay (or after data is fetched)
        }, 500); // 500ms delay - adjust as needed for your actual data loading

        return () => clearTimeout(timer); // Clear timeout if component unmounts
    }, []); // Run this effect only once on component mount


    if (loadingData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
                <Typography style={{ marginLeft: 10 }}>Loading Exercises...</Typography>
            </Box>
        );
    }


    if (!mathData) {
        return <Typography color="error">Error: mathData is not loaded. Please ensure exercice.json is correctly placed and loaded.</Typography>;
    }
    if (!mathData.sections || !Array.isArray(mathData.sections) || mathData.sections.length === 0) {
        return <Typography color="error">Error: No sections found in mathData.sections. Please check your exercice.json file to ensure sections are defined as an array.</Typography>;
    }

    const currentSection = mathData.sections[currentSectionIndex];
    if (!currentSection) {
        return <Typography color="error">Error: Section at index {currentSectionIndex} not found. Check if section index is within bounds in exercice.json.</Typography>;
    }
    if (!currentSection.parts || !Array.isArray(currentSection.parts) || currentSection.parts.length === 0) {
        return <Typography color="error">Error: No parts found in section '{currentSection.sectionName}'. Please check parts array in exercice.json for this section.</Typography>;
    }

    const currentPart = currentSection.parts[currentPartIndex];
    if (!currentPart) {
        return <Typography color="error">Error: Part at index {currentPartIndex} not found in section '{currentSection.sectionName}'. Check part index in exercice.json.</Typography>;
    }
    if (!currentPart.topics || !Array.isArray(currentPart.topics) || currentPart.topics.length === 0) {
        return <Typography color="error">Error: No topics found in part '{currentPart.partName}'. Please check topics array in exercice.json for this part.</Typography>;
    }

    const currentTopic = currentPart.topics[currentTopicIndex];
    if (!currentTopic) {
        return <Typography color="error">Error: Topic at index {currentTopicIndex} not found in part '{currentPart.partName}'. Check topic index in exercice.json.</Typography>;
    }
    if (!currentTopic.lessons || !Array.isArray(currentTopic.lessons) || currentTopic.lessons.length === 0) {
        return <Typography color="error">Error: No lessons found in topic '{currentTopic.topicName}'. Please check lessons array in exercice.json for this topic.</Typography>;
    }

    const currentLesson = currentTopic.lessons[currentLessonIndex];
    if (!currentLesson) {
        return <Typography color="error">Error: Lesson at index {currentLessonIndex} not found in topic '{currentTopic.topicName}'. Check lesson index in exercice.json.</Typography>;
    }
    if (!currentLesson.exercises || !Array.isArray(currentLesson.exercises) || currentLesson.exercises.length === 0) {
        return <Typography color="error">Error: No exercises found in lesson '{currentLesson.lessonName}'. Please check exercises array in exercice.json for this lesson.</Typography>;
    }

    const currentExercise = currentLesson.exercises[currentExerciseIndex];
    if (!currentExercise) {
        return <Typography color="error">Error: Exercise at index {currentExerciseIndex} not found in lesson '{currentLesson.lessonName}'. Check exercise index in exercice.json.</Typography>;
    }


    const handleAnswerChange = (event) => {
        setUserAnswers({ ...userAnswers, [currentExerciseIndex]: event.target.value });
    };

    const handleRadioChange = (event) => {
        setUserAnswers({ ...userAnswers, [currentExerciseIndex]: event.target.value });
    };

    const handleImageSelect = (index) => {
        setUserAnswers({ ...userAnswers, [currentExerciseIndex]: index.toString() });
    };

    const handleDragAndDropAnswerChange = (event, index) => {
        const updatedAnswers = { ...userAnswers[currentExerciseIndex] };
        if (!updatedAnswers) {
            setUserAnswers({ ...userAnswers, [currentExerciseIndex]: { [index]: event.target.value } });
        } else {
            updatedAnswers[index] = event.target.value;
            setUserAnswers({ ...userAnswers, [currentExerciseIndex]: updatedAnswers });
        }
    };


    const checkAnswer = () => {
        let isCorrect = false;
        let currentPoints = 0;
        let feedbackMessage = "";
        let feedbackSeverity = "error";


        if (currentExercise.exerciseType === 'fill-in-the-blank') {
            const userAnswerArray = userAnswers[currentExerciseIndex] ? userAnswers[currentExerciseIndex].split(',').map(ans => ans.trim().toLowerCase()) : [];
            const correctAnswersArray = Array.isArray(currentExercise.answers) ? currentExercise.answers.map(ans => ans.toLowerCase()) : [currentExercise.answers.toLowerCase()];

            isCorrect = correctAnswersArray.every(correctAnswer => userAnswerArray.includes(correctAnswer));
            if (isCorrect) {
                currentPoints = currentExercise.points;
                feedbackMessage = currentExercise.feedback?.correct || "Correct!";
                feedbackSeverity = "success";
            } else {
                feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
            }

        } else if (currentExercise.exerciseType === 'multiple-choice') {
            if (userAnswers[currentExerciseIndex] === currentExercise.correctAnswer) {
                isCorrect = true;
                currentPoints = currentExercise.points;
                feedbackMessage = currentExercise.feedback?.correct || "Correct!";
                feedbackSeverity = "success";
            } else {
                feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
            }
        } else if (currentExercise.exerciseType === 'text-input') {
            if (userAnswers[currentExerciseIndex] === currentExercise.answer) {
                isCorrect = true;
                currentPoints = currentExercise.points;
                feedbackMessage = currentExercise.feedback?.correct || "Correct!";
                feedbackSeverity = "success";
            } else {
                feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
            }
        }
        else if (currentExercise.exerciseType === 'true-false') {
            if (String(userAnswers[currentExerciseIndex]).toLowerCase() === currentExercise.answer) {
                isCorrect = true;
                currentPoints = currentExercise.points;
                feedbackMessage = currentExercise.feedback?.correct || "Correct!";
                feedbackSeverity = "success";
            } else {
                feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
            }
        } else if (currentExercise.exerciseType === 'image-select') {
            if (userAnswers[currentExerciseIndex] === currentExercise.correctImageIndex.toString()) {
                isCorrect = true;
                currentPoints = currentExercise.points;
                feedbackMessage = currentExercise.feedback?.correct || "Correct!";
                feedbackSeverity = "success";
            } else {
                feedbackMessage = currentExercise.feedback?.incorrect || "Incorrect. Try again.";
            }
        } else if (currentExercise.exerciseType === 'drag-and-drop') {
            let allPairsCorrect = true;
            if (currentExercise.numberPairs) { // Check if numberPairs exists before iterating
                currentExercise.numberPairs.forEach((pair, index) => {
                    if (userAnswers[currentExerciseIndex] && userAnswers[currentExerciseIndex][index] !== pair.correctSymbol) {
                        allPairsCorrect = false;
                    }
                });
            } else {
                allPairsCorrect = false; // If numberPairs is missing, consider it incorrect
            }


            if (allPairsCorrect) {
                isCorrect = true;
                currentPoints = currentExercise.points;
                feedbackMessage = currentExercise.feedback?.correct || "Well done! You correctly compared all the number pairs.";
                feedbackSeverity = "success";
            } else {
                feedbackMessage = currentExercise.feedback?.incorrect || "Remember to compare the numbers correctly.";
            }
        }


        if (isCorrect) {
            setScore(prevScore => prevScore + currentPoints);
        }
        setFeedbackSnackbar({ open: true, message: feedbackMessage, severity: feedbackSeverity });
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < currentLesson.exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setLessonCompleted(false);
        } else {
            setLessonCompleted(true);
            if (currentLessonIndex < currentTopic.lessons.length - 1) {
                setCurrentLessonIndex(currentLessonIndex + 1);
                setCurrentExerciseIndex(0);
                setLessonCompleted(false);
                setTopicCompleted(false);
            } else {
                setTopicCompleted(true);
                if (currentTopicIndex < currentPart.topics.length - 1) {
                    setCurrentTopicIndex(currentTopicIndex + 1);
                    setCurrentLessonIndex(0);
                    setCurrentExerciseIndex(0);
                    setLessonCompleted(false);
                    setTopicCompleted(false);
                    setPartCompleted(false);
                } else {
                    setPartCompleted(true);
                    if (currentPartIndex < currentSection.parts.length - 1) {
                        setCurrentPartIndex(currentPartIndex + 1);
                        setCurrentTopicIndex(0);
                        setCurrentLessonIndex(0);
                        setCurrentExerciseIndex(0);
                        setLessonCompleted(false);
                        setTopicCompleted(false);
                        setPartCompleted(false);
                        setSectionCompleted(false);
                    }
                    else {
                        setSectionCompleted(true);
                        if (currentSectionIndex < mathData.sections.length - 1) {
                            setCurrentSectionIndex(currentSectionIndex + 1);
                            setCurrentPartIndex(0);
                            setCurrentTopicIndex(0);
                            setCurrentLessonIndex(0);
                            setCurrentExerciseIndex(0);
                            setLessonCompleted(false);
                            setTopicCompleted(false);
                            setPartCompleted(false);
                            setSectionCompleted(false);
                            setCurriculumCompleted(false);
                        } else {
                            setCurriculumCompleted(true);
                            alert("Congratulations! You have completed the entire curriculum!");
                        }
                    }
                }
            }
        }
        setUserAnswers({});
    };


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setFeedbackSnackbar({ ...feedbackSnackbar, open: false });
    };


    const renderExercise = () => {
        return <ExerciseRenderer
            exercise={currentExercise}
            userAnswer={userAnswers[currentExerciseIndex]}
            onAnswerChange={handleAnswerChange}
            onRadioChange={handleRadioChange}
            onImageSelect={handleImageSelect}
            onDragAndDropAnswerChange={handleDragAndDropAnswerChange}
        />;
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                3rd Grade Math Exercises - {mathData.grade} - {mathData.curriculum}
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Section: {currentSection.sectionName} - Part: {currentPart.partName} - Topic: {currentTopic.topicName} - Lesson: {currentLesson.lessonName}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Exercise {currentExerciseIndex + 1} of {currentLesson.exercises.length}
                    </Typography>
                    {renderExercise()}
                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={checkAnswer} sx={{ mr: 2 }}>
                            Check Answer
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleNextExercise} disabled={curriculumCompleted}>
                            Next Exercise
                        </Button>
                    </Box>
                    <Typography variant="subtitle1" mt={2}>Score: {score} points</Typography>
                    {lessonCompleted && <Typography color="success">Lesson Completed!</Typography>}
                    {topicCompleted && <Typography color="success">Topic Completed!</Typography>}
                    {partCompleted && <Typography color="success">Part Completed!</Typography>}
                    {sectionCompleted && <Typography color="success">Section Completed!</Typography>}
                    {curriculumCompleted && <Typography color="primary">Curriculum Completed!</Typography>}
                </CardContent>
            </Card>

            <ExerciseFeedback
                open={feedbackSnackbar.open}
                message={feedbackSnackbar.message}
                severity={feedbackSnackbar.severity}
                onClose={handleSnackbarClose}
            />
        </Container>
    );
};

export default MathExerciseContainer;