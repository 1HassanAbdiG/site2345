import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel as MuiFormControlLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  Scoreboard as ScoreboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EmojiEvents as EmojiEventsIcon,
  Lightbulb as LightbulbIcon,
  Translate as TranslateIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const DetectiveTextComponent = ({ questionsData }) => {
  const [qcmAnswers, setQcmAnswers] = useState({});
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [shortAnswers, setShortAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [teacherMode, setTeacherMode] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const allQcms = [
    ...questionsData.qcmComprehension.map((q, i) => ({ ...q, category: 'comprehension', originalIndex: i })),
    ...questionsData.qcmVocabulary.map((q, i) => ({ ...q, category: 'vocabulary', originalIndex: i })),
    ...questionsData.qcmGrammar.map((q, i) => ({ ...q, category: 'grammar', originalIndex: i })),
  ];

  const totalQcms = allQcms.length;

  const handleQcmChange = (globalIndex, optionIndex) => {
    if (!submitted) {
      setQcmAnswers({
        ...qcmAnswers,
        [globalIndex]: optionIndex,
      });
    }
  };

  const handleWrittenAnswerChange = (e) => {
    const text = e.target.value;
    setWrittenAnswer(text);
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
  };

  const handleShortAnswerChange = (index, answer) => {
    setShortAnswers({
      ...shortAnswers,
      [index]: answer
    });
  };

  const calculateScore = () => {
    let score = 0;
    allQcms.forEach((qcm, globalIndex) => {
      if (qcmAnswers[globalIndex] === qcm.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    if (Object.keys(qcmAnswers).length !== totalQcms) {
      alert("Veuillez répondre à toutes les questions à choix multiples avant de soumettre.");
      return;
    }
    if (wordCount < questionsData.writingQuestion.minWords) {
      alert(`Votre réponse écrite ne contient que ${wordCount} mots. Il en faut au moins ${questionsData.writingQuestion.minWords}.`);
      return;
    }

    const score = calculateScore();
    setCurrentScore(score);
    setAttemptHistory([...attemptHistory, score]);
    setSubmitted(true);
  };

  const handleTeacherModeToggle = () => {
    if (!teacherMode) {
      setCodeDialogOpen(true);
    } else {
      setTeacherMode(false);
    }
  };

  const handleValidateTeacherCode = () => {
    if (teacherCode === "123") {
      setTeacherMode(true);
      setCodeDialogOpen(false);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const handleNewAttempt = () => {
    setQcmAnswers({});
    setWrittenAnswer('');
    setShortAnswers({});
    setSubmitted(false);
    setCurrentScore(0);
    setWordCount(0);
  };

  const totalAttempts = attemptHistory.length;
  const maxScore = totalAttempts > 0 ? Math.max(...attemptHistory) : 0;
  const minScore = totalAttempts > 0 ? Math.min(...attemptHistory) : 0;
  const firstScore = totalAttempts > 0 ? attemptHistory[0] : 0;
  const percentageScore = Math.round((currentScore / totalQcms) * 100);

  const renderQcmSection = (title, questions, startGlobalIndex, icon) => (
    <>
      <Typography variant="h5" component="h3" sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center' }}>
        {icon}
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {questions.map((qcm, index) => {
        const globalIndex = startGlobalIndex + index;
        const isCorrect = submitted && qcmAnswers[globalIndex] === qcm.correctAnswerIndex;
        const isIncorrect = submitted && qcmAnswers[globalIndex] !== undefined && qcmAnswers[globalIndex] !== qcm.correctAnswerIndex;
        
        return (
          <Card 
            key={`qcm-${qcm.category}-${index}`} 
            variant="outlined" 
            sx={{ 
              mb: 3,
              borderColor: submitted || teacherMode
                ? isCorrect 
                  ? 'success.main' 
                  : isIncorrect 
                    ? 'error.main' 
                    : 'divider' 
                : 'divider'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 24, 
                  height: 24, 
                  mr: 1,
                  fontSize: '0.8rem'
                }}>
                  {index + 1}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="500">
                  {qcm.question}
                </Typography>
              </Box>
              
              <RadioGroup
                value={qcmAnswers[globalIndex] === undefined ? null : qcmAnswers[globalIndex]}
                onChange={(e) => handleQcmChange(globalIndex, parseInt(e.target.value, 10))}
              >
                {qcm.options.map((option, optIndex) => (
                  <FormControlLabel
                    key={`option-${optIndex}`}
                    value={optIndex}
                    control={<Radio color="primary" disabled={submitted && !teacherMode} />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: (submitted || teacherMode) && qcmAnswers[globalIndex] === optIndex && !isCorrect ? 'line-through' : 'none',
                            color: (submitted || teacherMode) && optIndex === qcm.correctAnswerIndex ? 'success.main' :
                                  (submitted || teacherMode) && qcmAnswers[globalIndex] === optIndex && !isCorrect ? 'error.main' : 'text.primary',
                            fontWeight: (submitted || teacherMode) && optIndex === qcm.correctAnswerIndex ? 600 : 'normal'
                          }}
                        >
                          {option}
                        </Typography>
                        {(submitted || teacherMode) && optIndex === qcm.correctAnswerIndex && (
                          <CheckCircleOutlineIcon color="success" sx={{ ml: 1, fontSize: 20 }} />
                        )}
                        {(submitted || teacherMode) && qcmAnswers[globalIndex] === optIndex && !isCorrect && (
                          <CancelOutlinedIcon color="error" sx={{ ml: 1, fontSize: 20 }} />
                        )}
                      </Box>
                    }
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      padding: '4px 8px',
                      backgroundColor: (submitted || teacherMode) && optIndex === qcm.correctAnswerIndex 
                        ? 'rgba(46, 125, 50, 0.08)' 
                        : (submitted || teacherMode) && qcmAnswers[globalIndex] === optIndex && !isCorrect 
                          ? 'rgba(211, 47, 47, 0.08)' 
                          : 'transparent'
                    }}
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}
    </>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, position: 'relative' }}>
        {/* Mode Enseignant */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <MuiFormControlLabel
            control={
              <Switch
                checked={teacherMode}
                onChange={handleTeacherModeToggle}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>Mode Enseignant</Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {questionsData.titre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {questionsData.description}
          </Typography>
        </Box>

        {renderQcmSection(
          "Compréhension du texte", 
          questionsData.qcmComprehension, 
          0,
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
        )}

        {renderQcmSection(
          "Vocabulaire", 
          questionsData.qcmVocabulary, 
          questionsData.qcmComprehension.length,
          <TranslateIcon color="primary" sx={{ mr: 1 }} />
        )}

        {renderQcmSection(
          "Grammaire", 
          questionsData.qcmGrammar, 
          questionsData.qcmComprehension.length + questionsData.qcmVocabulary.length,
          <SchoolIcon color="primary" sx={{ mr: 1 }} />
        )}

        {/* Question d'écriture */}
        <Typography variant="h5" component="h3" sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center' }}>
          <EditIcon color="primary" sx={{ mr: 1 }} />
          {questionsData.writingQuestion.title}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: 24, 
                height: 24, 
                mr: 1,
                fontSize: '0.8rem'
              }}>
                {questionsData.qcmComprehension.length + questionsData.qcmVocabulary.length + questionsData.qcmGrammar.length + 1}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="500">
                {questionsData.writingQuestion.question}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {questionsData.writingQuestion.instruction}
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={writtenAnswer}
              onChange={handleWrittenAnswerChange}
              disabled={submitted && !teacherMode}
              placeholder="Écrivez votre réponse ici..."
              sx={{ mb: 1 }}
            />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color={wordCount < questionsData.writingQuestion.minWords ? 'error' : 'success.main'}>
                {wordCount} mots (minimum {questionsData.writingQuestion.minWords} requis)
              </Typography>
              {wordCount > 0 && (
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(100, (wordCount / questionsData.writingQuestion.minWords) * 100)} 
                  sx={{ 
                    width: '50%',
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: wordCount >= questionsData.writingQuestion.minWords ? 'success.main' : 'error.main'
                    }
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Questions de réponse courte */}
        <Typography variant="h5" component="h3" sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center' }}>
          <LightbulbIcon color="primary" sx={{ mr: 1 }} />
          {questionsData.shortAnswerTitle}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {questionsData.shortAnswerInstruction}
        </Typography>
        
        {questionsData.shortAnswerComprehension.map((qa, index) => (
          <Accordion key={`short-ans-${index}`} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ 
                  bgcolor: 'secondary.main', 
                  width: 24, 
                  height: 24, 
                  mr: 1.5,
                  fontSize: '0.8rem'
                }}>
                  {index + 1}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="500">
                  {qa.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={shortAnswers[index] || ''}
                  onChange={(e) => handleShortAnswerChange(index, e.target.value)}
                  disabled={submitted && !teacherMode}
                  placeholder="Écrivez votre réponse ici..."
                  sx={{ mb: 2 }}
                />
              </Box>
              
              {(submitted || teacherMode) && (
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 1,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <Box component="span" fontWeight="600" color="primary.main">
                      Réponse attendue :
                    </Box> {qa.answer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    <Box component="span" fontWeight="500">
                      Référence :
                    </Box> {qa.reference}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 4, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {!submitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={Object.keys(qcmAnswers).length !== totalQcms || wordCount < questionsData.writingQuestion.minWords}
              size="large"
              startIcon={<VisibilityIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
            >
              Soumettre toutes les réponses
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleNewAttempt}
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
            >
              Nouvelle tentative
            </Button>
          )}
        </Box>

        {/* Boîte de dialogue pour le code enseignant */}
        <Dialog open={codeDialogOpen} onClose={() => setCodeDialogOpen(false)}>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <LockIcon color="primary" sx={{ mr: 1 }} />
              Accès Mode Enseignant
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Pour activer le mode enseignant, veuillez entrer le code d'accès.
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Code enseignant"
              value={teacherCode}
              onChange={(e) => setTeacherCode(e.target.value)}
              error={codeError}
              helperText={codeError && "Code incorrect. Le code valide est '123'."}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCodeDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={handleValidateTeacherCode}
              variant="contained"
              color="primary"
              startIcon={<LockIcon />}
            >
              Valider
            </Button>
          </DialogActions>
        </Dialog>

        {(submitted || teacherMode) && (
          <Paper sx={{ 
            p: 3, 
            mt: 4, 
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
            color: 'white',
            borderRadius: 2
          }}>
            <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Résultats de l'évaluation
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Box flexGrow={1}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                  {currentScore}/{totalQcms}
                </Typography>
                <Typography variant="subtitle1">
                  {percentageScore >= 80 ? "Excellent travail !" : 
                   percentageScore >= 60 ? "Bon travail !" : 
                   percentageScore >= 40 ? "Peut mieux faire" : "À revoir"}
                </Typography>
              </Box>
              <Box>
                <Avatar sx={{ 
                  bgcolor: 'white', 
                  width: 64, 
                  height: 64,
                  color: 'primary.main'
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {percentageScore}%
                  </Typography>
                </Avatar>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <ScoreboardIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Tentatives :</strong> {totalAttempts}
                </Typography>
              </Grid>
              {totalAttempts > 0 && (
                <>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Meilleur score :</strong> {maxScore}/{totalQcms}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Progression :</strong> {currentScore - firstScore > 0 ? '+' : ''}{currentScore - firstScore}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            {attemptHistory.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Historique des tentatives :
                </Typography>
                <Box>
                  {attemptHistory.map((score, index) => (
                    <Chip
                      key={index}
                      label={`Tentative ${index + 1}: ${score}/${totalQcms}`}
                      sx={{ mr: 1, mb: 1 }}
                      color={index === attemptHistory.length - 1 ? 'primary' : 'default'}
                      variant={index === attemptHistory.length - 1 ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default DetectiveTextComponent;