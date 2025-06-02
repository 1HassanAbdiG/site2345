import React, { useMemo } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const Bilan = ({ results, questionsData, onRestart, quizTitle }) => {
  const validResults = Array.isArray(results) ? results : [];
  const validQuestionsDataFlat = Array.isArray(questionsData) ? questionsData : [];

  const { totalPointsPossible, userPointsEarned, sectionScores } = useMemo(() => {
    let totalPointsPossible = 0;
    let userPointsEarned = 0;
    const sectionScores = {};

    validResults.forEach((result, index) => {
      const question = validQuestionsDataFlat.length > index ? validQuestionsDataFlat[index] : null;

      if (!question || typeof question.type !== 'string') {
        console.warn(`Skipping score calculation for result at index ${index} due to missing or invalid question data.`);
        return;
      }

      const sectionTitle = question.sectionTitle || 'Section non spécifiée';

      if (!sectionScores[sectionTitle]) {
        sectionScores[sectionTitle] = { corrects: 0, total: 0 };
      }

      switch (question.type) {
        case 'vrai_faux':
        case 'choix_unique':
        case 'reponse_courte':
        case 'texte_a_trou':
        case 'dictee':
        case 'ordre':
          totalPointsPossible += 1;
          sectionScores[sectionTitle].total += 1;
          if (result.correct) {
            userPointsEarned += 1;
            sectionScores[sectionTitle].corrects += 1;
          }
          break;

        case 'choix_multiple':
          const correctOptions = Array.isArray(question.answer) ? question.answer : [];
          const userSelectedOptions = Array.isArray(result.userAnswer) ? result.userAnswer : [];
          const userCorrectlySelectedCount = userSelectedOptions.filter(userOption => correctOptions.includes(userOption)).length;
          const userSelectedIncorrectCount = userSelectedOptions.filter(userOption => !correctOptions.includes(userOption)).length;

          totalPointsPossible += correctOptions.length;
          sectionScores[sectionTitle].total += correctOptions.length;

          userPointsEarned += userCorrectlySelectedCount - userSelectedIncorrectCount;
          sectionScores[sectionTitle].corrects += userCorrectlySelectedCount - userSelectedIncorrectCount;
          if (userPointsEarned < 0) userPointsEarned = 0;
          if (sectionScores[sectionTitle].corrects < 0) sectionScores[sectionTitle].corrects = 0;

          break;

        case 'association':
          const correctPairs = Array.isArray(question.pairs) ? question.pairs : [];
          const userAttemptedPairs = Array.isArray(result.userAnswer) ? result.userAnswer : [];

          totalPointsPossible += correctPairs.length;
          sectionScores[sectionTitle].total += correctPairs.length;

          userAttemptedPairs.forEach(userPair => {
            const isPairCorrect = correctPairs.some(
              correctPair => correctPair.left === userPair?.left && correctPair.right === userPair?.right
            );
            if (isPairCorrect) {
              userPointsEarned += 1;
              sectionScores[sectionTitle].corrects += 1;
            }
          });

          break;

        default:
          console.warn(`Question type "${question.type}" is not included in overall score calculation.`);
          break;
      }
    });

    if (userPointsEarned < 0) userPointsEarned = 0;
    if (totalPointsPossible === 0 && validResults.length > 0) {
      totalPointsPossible = 1;
    }

    return { totalPointsPossible, userPointsEarned, sectionScores };
  }, [validResults, validQuestionsDataFlat]);

  const groupedResultsForDisplay = useMemo(() => {
    const sections = {};

    validResults.forEach((result, index) => {
      const question = validQuestionsDataFlat.length > index ? validQuestionsDataFlat[index] : null;

      if (!question || typeof question.question !== 'string' || typeof question.type !== 'string') {
        const errorSectionTitle = 'Résultats avec données manquantes';
        const errorExerciseTitle = 'Détails inconnus';
        const errorSectionOrder = 1000;
        const errorExerciseOrder = 1;

        if (!sections[errorSectionTitle]) {
          sections[errorSectionTitle] = { title: errorSectionTitle, order: errorSectionOrder, exercises: {} };
        }
        if (!sections[errorSectionTitle].exercises[errorExerciseTitle]) {
          sections[errorSectionTitle].exercises[errorExerciseTitle] = {
            title: errorExerciseTitle,
            order: errorExerciseOrder,
            questions: [],
            corrects: 0,
            total: 0
          };
        }
        sections[errorSectionTitle].exercises[errorExerciseTitle].questions.push({
          questionData: null,
          result: result,
          originalIndex: index
        });
        return;
      }

      const sectionTitle = question.sectionTitle || 'Section non spécifiée';
      const exerciseTitle = question.exerciseTitle || 'Exercice non spécifié';
      const sectionOrder = question.sectionOrder || 999;
      const exerciseOrder = question.exerciseOrder || 999;

      if (!sections[sectionTitle]) {
        sections[sectionTitle] = { title: sectionTitle, order: sectionOrder, exercises: {} };
      }

      if (!sections[sectionTitle].exercises[exerciseTitle]) {
        sections[sectionTitle].exercises[exerciseTitle] = {
          title: exerciseTitle,
          order: exerciseOrder,
          questions: [],
          corrects: 0,
          total: 0
        };
      }

      sections[sectionTitle].exercises[exerciseTitle].questions.push({
        questionData: question,
        result: result,
        originalIndex: index
      });

      sections[sectionTitle].exercises[exerciseTitle].total++;
      if (result.correct) {
        sections[sectionTitle].exercises[exerciseTitle].corrects++;
      }
    });

    const sortedSections = Object.values(sections).sort((a, b) => a.order - b.order);

    const finalGroupedResults = [];
    sortedSections.forEach(section => {
      finalGroupedResults.push({ type: 'sectionHeader', title: section.title, corrects: sectionScores[section.title]?.corrects || 0, total: sectionScores[section.title]?.total || 0 });
      const sortedExercises = Object.values(section.exercises).sort((a, b) => a.order - b.order);

      sortedExercises.forEach(exercise => {
        if (exercise.questions.length > 0) {
          finalGroupedResults.push({
            type: 'exercise',
            title: exercise.title,
            corrects: exercise.corrects,
            total: exercise.total,
            questions: exercise.questions
          });
        }
      });
      const sectionHasDisplayedExercises = sortedExercises.some(ex => ex.questions.length > 0);
      if (sectionHasDisplayedExercises && sortedSections.indexOf(section) < sortedSections.length - 1) {
        finalGroupedResults.push({ type: 'sectionDivider' });
      }
    });

    return finalGroupedResults;
  }, [validResults, validQuestionsDataFlat, sectionScores]);

  const formatAnswer = (answer, type, questionData) => {
    if (answer === undefined || answer === null) {
      return 'Pas de réponse';
    }
    if (Array.isArray(answer)) {
      if (type === 'ordre') {
        return answer.map((item, index) => `${index + 1}. ${item}`).join('; ');
      }
      return answer.join(', ');
    }
    return String(answer).trim() === '' ? 'Pas de réponse' : String(answer);
  };

  const formatCorrectAnswer = (answer, type, questionData) => {
    if (answer === undefined || answer === null) {
      return 'N/A';
    }
    if (Array.isArray(answer)) {
      if (type === 'association' && questionData?.pairs) {
        return questionData.pairs.map(pair => `${pair.left} → ${pair.right}`).join(', ');
      }
      if (type === 'ordre') {
        return answer.map((item, index) => `${index + 1}. ${item}`).join('; ');
      }
      return answer.join(', ');
    }
    return String(answer);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        {quizTitle || "Bilan du Quiz"}
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 6, p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="h5" component="div">
          Votre Score Global : <Box component="span" sx={{ color: userPointsEarned >= totalPointsPossible / 2 ? 'success.dark' : (userPointsEarned > 0 ? 'warning.dark' : 'error.dark'), fontWeight: 'bold' }}>{userPointsEarned}</Box> / {totalPointsPossible} Points
        </Typography>
        {totalPointsPossible > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {((userPointsEarned / totalPointsPossible) * 100).toFixed(0)}% de bonnes réponses
          </Typography>
        )}
        {totalPointsPossible === 0 && validResults.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Score non calculable (types de questions inconnus ou données manquantes).
          </Typography>
        )}
      </Box>

      <List sx={{ width: '100%' }}>
        {groupedResultsForDisplay.map((item, groupIndex) => {
          if (item.type === 'sectionHeader') {
            return (
              <React.Fragment key={`section-${groupIndex}`}>
                <Typography variant="h5" component="h3" sx={{ mt: groupIndex === 0 ? 0 : 4, mb: 2, fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'divider', pb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Score de la section : <Box component="span" sx={{ color: item.corrects >= item.total / 2 ? 'success.dark' : (item.corrects > 0 ? 'warning.dark' : 'error.dark') }}>{item.corrects}</Box> / {item.total} Points
                </Typography>
              </React.Fragment>
            );
          }

          if (item.type === 'sectionDivider') {
            return <Divider key={`divider-${groupIndex}`} sx={{ my: 4 }} />;
          }

          if (item.type === 'exercise') {
            const exercise = item;

            return (
              <Box key={`exercise-${groupIndex}`} sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, bgcolor: 'background.paper' }}>
                <Typography variant="h6" component="h4" sx={{ mb: 2, fontWeight: 'medium', textAlign: 'center' }}>
                  {exercise.title} : <Box component="span" sx={{ color: exercise.corrects > exercise.total / 2 ? 'success.dark' : (exercise.corrects > 0 ? 'warning.dark' : 'error.dark') }}>{exercise.corrects}</Box> / {exercise.total} Corrects (Questions)
                </Typography>

                <List disablePadding>
                  {exercise.questions.map((qResult, questionIndex) => {
                    const { questionData, result } = qResult;
                    const listItemKey = `${exercise.title}-${questionIndex}`;

                    const itemColor = result.correct ? 'success.main' : 'error.main';
                    const Icon = result.correct ? CheckCircleIcon : CancelIcon;
                    const DisplayIcon = questionData ? Icon : QuestionMarkIcon;
                    const displayItemColor = questionData ? itemColor : 'warning.main';

                    let secondaryContent;

                    if (!questionData) {
                      secondaryContent = (
                        <Box component="span">
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Détails manquants pour cette question.
                          </Typography>
                          {result && result.hasOwnProperty('userAnswer') && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Réponse enregistrée (brute) : <Box component="span" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.userAnswer)}</Box>
                            </Typography>
                          )}
                        </Box>
                      );
                    } else if (questionData.type === 'association' && Array.isArray(result.userAnswer)) {
                      let correctPairsCount = 0;
                      const correctPairs = Array.isArray(questionData.pairs) ? questionData.pairs : [];

                      const userPairsJsx = result.userAnswer.map((userPair, pairIndex) => {
                        const isPairCorrect = correctPairs.some(
                          correctPair => correctPair.left === userPair?.left && correctPair.right === userPair?.right
                        );
                        if (isPairCorrect) correctPairsCount++;

                        const pairColor = isPairCorrect ? 'success.main' : 'error.main';
                        const PairIcon = isPairCorrect ? CheckCircleIcon : CancelIcon;

                        return (
                          <Box key={`${userPair?.left || 'N/A'}-${userPair?.right || 'N/A'}-${pairIndex}`} sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 0.5 }}>
                            <PairIcon sx={{ fontSize: 'small', color: pairColor, mr: 0.5 }} />
                            <Typography variant="body2" component="span" sx={{ color: pairColor, fontWeight: 'bold' }}>
                              {userPair?.left || 'N/A'} → {userPair?.right || 'N/A'}
                            </Typography>
                          </Box>
                        );
                      });

                      secondaryContent = (
                        <Box component="span" sx={{ display: 'block', mt: 1 }}>
                          <Typography variant="body2" color="text.primary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
                            Associations correctes faites : <Box component="span" sx={{ color: correctPairsCount === correctPairs.length ? 'success.main' : (correctPairsCount > 0 ? 'warning.main' : 'error.main') }}>{correctPairsCount}</Box> / {correctPairs.length} (Total paires)
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {userPairsJsx.length > 0 ? userPairsJsx : <Typography variant="body2" color="text.secondary">Aucune association faite.</Typography>}
                          </Box>
                          {!result.correct && correctPairs.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                              La bonne réponse complète était : <Box component="span" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{formatCorrectAnswer(questionData.answer, questionData.type, questionData)}</Box>
                            </Typography>
                          )}
                        </Box>
                      );
                    } else if (questionData.type === 'choix_multiple' && Array.isArray(result.userAnswer)) {
                      const correctOptions = Array.isArray(questionData.answer) ? questionData.answer : [];
                      const userSelectedOptions = Array.isArray(result.userAnswer) ? result.userAnswer : [];
                      let userCorrectlySelectedCount = 0;

                      const optionsJsx = userSelectedOptions.map((userOption, optionIndex) => {
                        const isCorrectOption = correctOptions.includes(userOption);
                        if (isCorrectOption) userCorrectlySelectedCount++;
                        const optionColor = isCorrectOption ? 'success.main' : 'error.main';
                        const OptionIcon = isCorrectOption ? CheckCircleIcon : CancelIcon;

                        return (
                          <Box key={`${userOption}-${optionIndex}`} sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 0.5 }}>
                            <OptionIcon sx={{ fontSize: 'small', color: optionColor, mr: 0.5 }} />
                            <Typography variant="body2" component="span" sx={{ color: optionColor, fontWeight: 'bold' }}>
                              {userOption}
                            </Typography>
                          </Box>
                        );
                      });
                      const missedCorrectOptions = correctOptions.filter(correctOption => !userSelectedOptions.includes(correctOption));

                      secondaryContent = (
                        <Box component="span" sx={{ display: 'block', mt: 1 }}>
                          <Typography variant="body2" color="text.primary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
                            Options sélectionnées (Correctes/Incorrectes) : <Box component="span" sx={{ color: userCorrectlySelectedCount === correctOptions.length && userSelectedOptions.length === correctOptions.length ? 'success.main' : (userCorrectlySelectedCount > 0 ? 'warning.main' : 'error.main') }}>{userCorrectlySelectedCount}</Box> / {correctOptions.length} (Attendues)
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {optionsJsx.length > 0 ? optionsJsx : <Typography variant="body2" color="text.secondary">Aucune option sélectionnée.</Typography>}
                          </Box>
                          {missedCorrectOptions.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                              Options correctes manquées : <Box component="span" sx={{ fontWeight: 'bold' }}>{missedCorrectOptions.join(', ')}</Box>
                            </Typography>
                          )}
                          {!result.correct && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                              La bonne réponse complète était : <Box component="span" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{formatCorrectAnswer(questionData.answer, questionData.type, questionData)}</Box>
                            </Typography>
                          )}
                        </Box>
                      );
                    } else {
                      secondaryContent = (
                        <Box component="span">
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            Votre réponse : <Box component="span" sx={{ color: itemColor, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{formatAnswer(result.userAnswer, questionData.type, questionData)}</Box>
                          </Typography>

                          {!result.correct && questionData.answer !== undefined && questionData.answer !== null && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              Réponse correcte : <Box component="span" sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{formatCorrectAnswer(questionData.answer, questionData.type, questionData)}</Box>
                            </Typography>
                          )}
                        </Box>
                      );
                    }

                    return (
                      <React.Fragment key={listItemKey}>
                        <ListItem disablePadding sx={{ py: 1.5, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 40, color: displayItemColor, mt: '2px' }}>
                            <DisplayIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              questionData ? (
                                <Typography variant="body1" sx={{ fontWeight: 'normal' }}>
                                  {questionIndex + 1}. {questionData.question}
                                </Typography>
                              ) : (
                                <Typography variant="body1" color="warning.main" sx={{ fontWeight: 'normal' }}>
                                  Question manquante (résultat enregistré à l'index {qResult.originalIndex + 1} du quiz).
                                </Typography>
                              )
                            }
                            secondary={secondaryContent}
                          />
                        </ListItem>
                        {questionIndex < exercise.questions.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    );
                  })}
                </List>
              </Box>
            );
          }

          return null;
        })}

        {validResults.length === 0 && (
          <ListItem>
            <ListItemText primary="Aucun résultat à afficher." sx={{ textAlign: 'center' }} />
          </ListItem>
        )}
        {!Array.isArray(results) && (
          <ListItem>
            <ListItemText primary="Erreur : Les résultats ne sont pas au format attendu." sx={{ textAlign: 'center', color: 'error.main' }} />
          </ListItem>
        )}
        {validResults.length > 0 && groupedResultsForDisplay.filter(item => item.type === 'exercise').length === 0 && (
          <ListItem>
            <ListItemText primary="Les résultats n'ont pas pu être regroupés par section/exercice. Vérifiez la structure des données et les types de questions." sx={{ textAlign: 'center', color: 'warning.main' }} />
          </ListItem>
        )}
      </List>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onRestart}
          sx={{ px: 4 }}
        >
          Recommencer le quiz
        </Button>
      </Box>
    </Box>
  );
};

export default Bilan;
