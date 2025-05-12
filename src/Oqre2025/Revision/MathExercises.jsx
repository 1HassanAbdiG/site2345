// src/Pages/Francais/1eanné/MathExercises/MathExercisesApp.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ExerciseRenderer from './ExerciseRenderer';
import exercisesData from './mathExercisesData.json'; // Importer les données

const MathExercisesApp = () => {
  const [allExercises] = useState(exercisesData);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentSubSection, setCurrentSubSection] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({}); // Pour stocker les réponses par exId
  const [completedExercises, setCompletedExercises] = useState({}); // exId: true/false

  useEffect(() => {
    if (currentCategory && currentCategory.exercises.length > 0) {
      setCurrentExercise(currentCategory.exercises[currentExerciseIndex]);
    } else {
      setCurrentExercise(null);
    }
  }, [currentCategory, currentExerciseIndex]);

  const handleSectionChange = (event) => {
    const sectionId = event.target.value;
    const section = allExercises.find(s => s.id === sectionId);
    setCurrentSection(section);
    setCurrentSubSection(null); // Reset sub-section
    setCurrentCategory(null);   // Reset category
    setCurrentExerciseIndex(0);
  };

  const handleSubSectionChange = (event) => {
    const subSectionId = event.target.value;
    const subSection = currentSection?.subSections.find(ss => ss.id === subSectionId);
    setCurrentSubSection(subSection);
    setCurrentCategory(null); // Reset category
    setCurrentExerciseIndex(0);
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    const category = currentSubSection?.categories.find(c => c.id === categoryId);
    setCurrentCategory(category);
    setCurrentExerciseIndex(0);
  };

  const handleSubmitAnswer = (exerciseId, isCorrect, answerData) => {
    setStudentAnswers(prev => ({ ...prev, [exerciseId]: { answerData, isCorrect, timestamp: new Date() } }));
    setCompletedExercises(prev => ({ ...prev, [exerciseId]: isCorrect }));
    // Logique de feedback ou de passage automatique si souhaité
    if(isCorrect) {
        // Peut-être un petit délai avant de passer au suivant
        setTimeout(() => {
            handleNextExercise();
        }, 1500); // 1.5s de délai pour voir le feedback
    }
  };

  const handleNextExercise = () => {
    if (currentCategory && currentExerciseIndex < currentCategory.exercises.length - 1) {
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
    } else {
      alert("Vous avez terminé tous les exercices de cette catégorie ! Choisissez-en une autre.");
      // Optionnel: passer à la catégorie suivante automatiquement
    }
  };
  
  const getExerciseProgress = () => {
    if (!currentCategory) return "0/0";
    const total = currentCategory.exercises.length;
    const completedCount = currentCategory.exercises.filter(ex => completedExercises[ex.id] === true).length;
    return `${completedCount}/${total}`;
  };

  if (!allExercises) return <Typography>Chargement des exercices...</Typography>;

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Exercices de Mathématiques
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Sélectionnez un domaine :</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                value={currentSection?.id || ''}
                label="Section"
                onChange={handleSectionChange}
              >
                <MenuItem value=""><em>Aucune</em></MenuItem>
                {allExercises.map(section => (
                  <MenuItem key={section.id} value={section.id}>{section.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {currentSection && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth disabled={!currentSection}>
                <InputLabel id="subsection-label">Sous-section</InputLabel>
                <Select
                  labelId="subsection-label"
                  value={currentSubSection?.id || ''}
                  label="Sous-section"
                  onChange={handleSubSectionChange}
                >
                  <MenuItem value=""><em>Aucune</em></MenuItem>
                  {currentSection.subSections.map(subSection => (
                    <MenuItem key={subSection.id} value={subSection.id}>{subSection.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {currentSubSection && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth disabled={!currentSubSection}>
                <InputLabel id="category-label">Catégorie</InputLabel>
                <Select
                  labelId="category-label"
                  value={currentCategory?.id || ''}
                  label="Catégorie"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value=""><em>Aucune</em></MenuItem>
                  {currentSubSection.categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      {currentExercise ? (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1">Exercice {currentExerciseIndex + 1}</Typography>
                <Typography variant="subtitle1">Progrès: {getExerciseProgress()}</Typography>
            </Box>
          <ExerciseRenderer
            exercise={currentExercise}
            onSubmitAnswer={handleSubmitAnswer}
            key={currentExercise.id} // Important pour re-monter le composant si l'exercice change
            isCompleted={completedExercises[currentExercise.id]}
          />
          {!completedExercises[currentExercise.id] && ( // N'afficher le bouton Suivant que si pas encore validé ou pour skipper
             <Button 
                onClick={handleNextExercise} 
                variant="outlined" 
                sx={{ mt: 2, display: 'block', ml: 'auto' }}
                disabled={currentExerciseIndex >= currentCategory.exercises.length - 1 && completedExercises[currentExercise.id]}
             >
                Passer cet exercice
            </Button>
          )}
        </Paper>
      ) : (
        <Typography textAlign="center" sx={{mt: 3}}>
            {currentCategory ? "Aucun exercice dans cette catégorie." : "Veuillez sélectionner une section, sous-section et catégorie pour commencer."}
        </Typography>
      )}
      
      {/* Section pour afficher le bilan des réponses (optionnel) */}
      {Object.keys(studentAnswers).length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6">Bilan des réponses</Typography>
          {/* Vous pouvez lister les réponses ici */}
          {/* Exemple: */}
          {/* {Object.entries(studentAnswers).map(([exId, data]) => (
            <Typography key={exId}>
              Exercice {exId}: {data.isCorrect ? "Correct" : "Incorrect"} (Réponse: {JSON.stringify(data.answerData)})
            </Typography>
          ))} */}
        </Paper>
      )}
    </Box>
  );
};

export default MathExercisesApp;