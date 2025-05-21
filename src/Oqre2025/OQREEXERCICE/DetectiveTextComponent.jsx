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
  
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const textContent = `
Le projet de Neva

1
Eh bien, Neva, j'aime beaucoup tes idées, dit la directrice en examinant le
travail de recherche qu'elle a entre les mains au sujet de la protection des
écosystèmes fragiles.
Merci, madame Harris, répond Neva. Si on ne les arrête pas, les
constructeurs bâtiront un centre commercial. Où vivront toutes ces espèces?
Elles perdront leur habitat.
J'ai une idée! Donne-moi quelques minutes, dit madame Harris en
quittant la salle de classe.

[... reste du texte ...]
`;

const TextDisplay = ({ text }) => {
  const blocks = text.trim().split(/\n\s*(\d+)\s*\n/);
  const renderedBlocks = [];

  if (blocks.length > 0) {
    const initialContent = blocks[0].trim();
    if (initialContent) {
      const lines = initialContent.split('\n');
      if (lines.length > 0 && lines[0].trim()) {
        const potentialTitle = lines[0].trim();
        if (potentialTitle.toLowerCase() !== 'nom :' && !potentialTitle.toLowerCase().startsWith('date:')) {
          renderedBlocks.push(
            <Typography variant="h5" component="h2" gutterBottom key="title">
              {potentialTitle}
            </Typography>
          );
          if (lines.slice(1).join('\n').trim()) {
            renderedBlocks.push(
              <Typography variant="body1" paragraph key="intro-text">
                {lines.slice(1).join('\n').split('\n').map((line, lineIndex) => (
                  <React.Fragment key={`line-${lineIndex}`}>
                    {line}
                    <br/>
                  </React.Fragment>
                ))}
              </Typography>
            );
          }
        } else {
          renderedBlocks.push(
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} key="nom-date">
              {lines.filter(line => line.trim()).join(' | ')}
            </Typography>
          );
          if (blocks.length > 1 && blocks[1].trim() && blocks[1].trim().toLowerCase() !== 'le projet de neva') {
            renderedBlocks.push(
              <Typography variant="body1" paragraph key="plain-text-after-nom-date">
                {blocks[1].trim().split('\n').map((line, lineIndex) => (
                  <React.Fragment key={`line-after-${lineIndex}`}>
                    {line}
                    <br/>
                  </React.Fragment>
                ))}
              </Typography>
            );
          }
        }
      }
    }

    for (let i = 1; i < blocks.length; i += 2) {
      const blockNumber = blocks[i];
      const blockContent = blocks[i + 1].trim();
      if (blockContent) {
        renderedBlocks.push(
          <Box key={`block-${blockNumber}`} sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="overline" sx={{ minWidth: '25px', mr: 1, fontWeight: 'bold' }}>
              {blockNumber}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 0 }}>
              {blockContent.split('\n').map((line, lineIndex) => (
                <React.Fragment key={`block-${blockNumber}-line-${lineIndex}`}>
                  {line}
                  <br/>
                </React.Fragment>
              ))}
            </Typography>
          </Box>
        );
      }
    }
  }

  return <Box sx={{ mb: 4 }}>{renderedBlocks}</Box>;
};

const DetectiveTextComponent = ({ questionsData }) => {
  const [qcmAnswers, setQcmAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);

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

    const score = calculateScore();
    setCurrentScore(score);
    setAttemptHistory([...attemptHistory, score]);
    setSubmitted(true);
  };

  const handleNewAttempt = () => {
    setQcmAnswers({});
    setSubmitted(false);
    setCurrentScore(0);
  };

  const totalAttempts = attemptHistory.length;
  const maxScore = totalAttempts > 0 ? Math.max(...attemptHistory) : 0;
  const minScore = totalAttempts > 0 ? Math.min(...attemptHistory) : 0;
  const firstScore = totalAttempts > 0 ? attemptHistory[0] : 0;

  const renderQcmSection = (title, questions, startGlobalIndex) => (
    <>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 4 }}>
        {title}
      </Typography>
      {questions.map((qcm, index) => {
        const globalIndex = startGlobalIndex + index;
        const isCorrect = submitted && qcmAnswers[globalIndex] === qcm.correctAnswerIndex;
        const isIncorrect = submitted && qcmAnswers[globalIndex] !== undefined && qcmAnswers[globalIndex] !== qcm.correctAnswerIndex;
        const cardBorderColor = submitted ? (isCorrect ? 'success.main' : (isIncorrect ? 'error.main' : 'text.primary')) : 'grey.300';
        const cardSx = submitted ? { borderColor: cardBorderColor, border: '1px solid' } : {};

        return (
          <Card key={`qcm-${qcm.category}-${index}`} variant="outlined" sx={{ mb: 3, ...cardSx }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>{`${index + 1}. ${qcm.question}`}</Typography>
              <RadioGroup
                value={qcmAnswers[globalIndex] === undefined ? null : qcmAnswers[globalIndex]}
                onChange={(e) => handleQcmChange(globalIndex, parseInt(e.target.value, 10))}
                aria-label={`Options pour la question ${index + 1}`}
              >
                {qcm.options.map((option, optIndex) => (
                  <FormControlLabel
                    key={`option-${optIndex}`}
                    value={optIndex}
                    control={<Radio size="small" disabled={submitted} />}
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: submitted && qcmAnswers[globalIndex] === optIndex && !isCorrect ? 'line-through' : 'none',
                          color: submitted && optIndex === qcm.correctAnswerIndex ? 'success.main' :
                                submitted && qcmAnswers[globalIndex] === optIndex && !isCorrect ? 'error.main' : 'text.primary',
                          display: 'flex', alignItems: 'center'
                        }}
                      >
                        {option}
                        {submitted && optIndex === qcm.correctAnswerIndex && (
                          <CheckCircleOutlineIcon color="success" sx={{ ml: 1, fontSize: 16 }} aria-label="Réponse correcte" />
                        )}
                        {submitted && qcmAnswers[globalIndex] === optIndex && !isCorrect && (
                          <CancelOutlinedIcon color="error" sx={{ ml: 1, fontSize: 16 }} aria-label="Réponse incorrecte" />
                        )}
                      </Typography>
                    }
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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <TextDisplay text={textContent} />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          (Source du texte : {questionsData.pdfPath || 'Non spécifiée'})
        </Typography>

        {renderQcmSection("Questions de compréhension (QCM)", questionsData.qcmComprehension, 0)}
        {renderQcmSection("Questions de vocabulaire (QCM)", questionsData.qcmVocabulary, questionsData.qcmComprehension.length)}
        {renderQcmSection("Questions de grammaire (QCM)", questionsData.qcmGrammar, questionsData.qcmComprehension.length + questionsData.qcmVocabulary.length)}

        <Box sx={{ mt: 4, mb: 4, display: 'flex', gap: 2 }}>
          {!submitted && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit} 
              disabled={Object.keys(qcmAnswers).length !== totalQcms}
            >
              Soumettre les réponses ({Object.keys(qcmAnswers).length}/{totalQcms})
            </Button>
          )}
          {submitted && (
            <Button variant="outlined" color="secondary" onClick={handleNewAttempt}>
              Nouvelle tentative
            </Button>
          )}
        </Box>

        {totalAttempts > 0 && (
          <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h6" component="h4" gutterBottom sx={{ color: 'inherit' }}>
              Bilan de Score (QCM uniquement)
            </Typography>
            {submitted && (
              <Typography variant="h5" component="p" sx={{ mb: 2, color: 'warning.main' }}>
                Votre Score : {currentScore} / {totalQcms}
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <ScoreboardIcon sx={{ mr: 1 }} aria-hidden="true" />
                <Typography variant="body1"><strong>Tentatives totales :</strong> {totalAttempts}</Typography>
              </Grid>
              {totalAttempts > 0 && (
                <>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon sx={{ mr: 1 }} aria-hidden="true" />
                    <Typography variant="body1"><strong>Score maximum :</strong> {maxScore} / {totalQcms}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon sx={{ mr: 1 }} aria-hidden="true" />
                    <Typography variant="body1"><strong>Score minimum :</strong> {minScore} / {totalQcms}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1 }} aria-hidden="true" />
                    <Typography variant="body1"><strong>Premier score :</strong> {firstScore} / {totalQcms}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        )}

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 4 }}>
          Questions de compréhension (Réponses courtes)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cliquez sur chaque question pour révéler la réponse et la référence dans le texte. 
          Ces questions ne sont pas prises en compte dans le score.
        </Typography>
        <Box sx={{ mb: 3 }}>
          {questionsData.shortAnswerComprehension.map((qa, index) => (
            <Accordion key={`short-ans-${index}`} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="subtitle1">{`${index + 1}. ${qa.question}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 1, bgcolor: 'grey.100', borderRadius: '4px' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Réponse :</strong> {qa.answer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    (Référence : {qa.reference})
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default DetectiveTextComponent;