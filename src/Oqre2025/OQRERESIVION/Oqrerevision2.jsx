import React, { useState, useEffect } from 'react';
import TestViewer from './TestTaker';

import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Divider,
  Tabs,
  Tab
} from '@mui/material';

import {

  Translate as FrenchIcon,
  Functions as MathIcon
} from '@mui/icons-material';
import TestComponent from './TestComponent';


// Configuration des couleurs
const subjectColors = {
  maths: {
    primary: '#3f51b5',
    light: '#757de8',
    dark: '#002984'
  },
  francais: {
    primary: '#7F27FF',   // Violet électrique tendance
    light: '#BF8BFF',     // Lavande lumineuse
    dark: '#4C1B8C'       // Violet profond
  }

};

const gradeColors = {
  '3': '#4caf50',
  '6': '#ff9800'
};

// Style des cartes
const testCardStyle = (selected, subject) => ({
  height: '100%',
  border: selected ? `3px solid ${subjectColors[subject].primary}` : '1px solid #e0e0e0',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: selected ? 'none' : 'translateY(-5px)',
    boxShadow: selected ? 'none' : '0 6px 20px rgba(0,0,0,0.1)'
  }
});

async function detectAvailableTests(grade, subject) {
  try {
    const context = require.context('./', false, /\.json$/);
    return context.keys()
      .filter(key => key.startsWith(`./${subject}${grade}`))
      .map(key => key.replace('./', '').replace('.json', ''));
  } catch (error) {
    console.error("Erreur de détection des tests:", error);
    return [];
  }
}

function Oqrerevision() {
  const [currentGrade, setCurrentGrade] = useState('3');
  const [currentSubject, setCurrentSubject] = useState('maths');
  const [currentTest, setCurrentTest] = useState('');
  const [testData, setTestData] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des tests
  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      const tests = await detectAvailableTests(currentGrade, currentSubject);
      setAvailableTests(tests);

      if (tests.length > 0) {
        handleTestChange(tests[0]);
      } else {
        setLoading(false);
      }
    };

    loadTests();
  }, [currentGrade, currentSubject]);

  const handleTestChange = async (testName) => {
    setLoading(true);
    setCurrentTest(testName);

    try {
      const data = await import(`./${testName}.json`);
      setTestData(data.default);
    } catch (error) {
      console.error(`Erreur de chargement du test ${testName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (grade) => {
    setCurrentGrade(grade);
    setCurrentTest('');
    setTestData(null);
  };

  const handleSubjectChange = (subject) => {
    setCurrentSubject(subject);
    setCurrentTest('');
    setTestData(null);
  };

  return (
    <Box sx={{
      bgcolor: '#f0f2f5',
      minHeight: '100vh',
      pt: 4
    }}>
     
      <Container maxWidth="xl">
        {/* En-tête */}
        <Paper elevation={3} sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(45deg, ${subjectColors[currentSubject].dark} 0%, ${subjectColors[currentSubject].primary} 100%)`,
          color: 'white'
        }}>

          <Typography variant="h3" component="h1" sx={{
            fontWeight: 700,
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Banque de tests OQRE
            

          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Matière
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<MathIcon />}
                  variant={currentSubject === 'maths' ? 'contained' : 'outlined'}
                  onClick={() => handleSubjectChange('maths')}
                  sx={{
                    bgcolor: currentSubject === 'maths' ? subjectColors.maths.light : 'transparent',
                    color: 'white',
                    '&:hover': {
                      bgcolor: subjectColors.maths.light
                    }
                  }}
                >
                  Mathématiques
                </Button>
                <Button
                  startIcon={<FrenchIcon />}
                  variant={currentSubject === 'francais' ? 'contained' : 'outlined'}
                  onClick={() => handleSubjectChange('francais')}
                  sx={{
                    bgcolor: currentSubject === 'francais' ? subjectColors.francais.light : 'transparent',
                    color: 'white',
                    '&:hover': {
                      bgcolor: subjectColors.francais.light
                    }
                  }}
                >
                  Français
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Niveau
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={currentGrade === '3' ? 'contained' : 'outlined'}
                  onClick={() => handleGradeChange('3')}
                  sx={{
                    bgcolor: currentGrade === '3' ? gradeColors['3'] : 'transparent',
                    color: currentGrade === '3' ? 'white' : 'inherit'
                  }}
                >
                  3e année
                </Button>
                <Button
                  variant={currentGrade === '6' ? 'contained' : 'outlined'}
                  onClick={() => handleGradeChange('6')}
                  sx={{
                    bgcolor: currentGrade === '6' ? gradeColors['6'] : 'transparent',
                    color: currentGrade === '6' ? 'white' : 'inherit'
                  }}
                >
                  6e année
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Liste des tests */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={10}>
            <CircularProgress size={60} />
          </Box>
        ) : availableTests.length > 0 ? (
          <>
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Tests disponibles
              </Typography>

              <Tabs
                value={currentTest}
                onChange={(e, newValue) => handleTestChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
              >
                {availableTests.map((test) => (
                  <Tab
                    key={test}
                    label={test.replace(`${currentSubject}${currentGrade}`, 'Test ')}
                    value={test}
                    sx={{
                      color: currentTest === test ? subjectColors[currentSubject].primary : 'inherit',
                      fontWeight: currentTest === test ? 600 : 400
                    }}
                  />
                ))}
              </Tabs>

              <Grid container spacing={3}>
                {availableTests.map((test) => (
                  <Grid item xs={12} sm={6} md={4} key={test}>
                    <Card
                      elevation={0}
                      sx={testCardStyle(currentTest === test, currentSubject)}
                      onClick={() => handleTestChange(test)}
                    >
                      <CardActionArea sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{
                              bgcolor: currentTest === test ? subjectColors[currentSubject].primary : '#e0e0e0',
                              color: currentTest === test ? 'white' : 'inherit',
                              mr: 2
                            }}>
                              {currentSubject === 'maths' ? <MathIcon /> : <FrenchIcon />}
                            </Avatar>
                            <Typography variant="h6" component="div">
                              {test.replace(`${currentSubject}${currentGrade}`, 'Test ')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Affichage du test */}
            {testData && (
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{
                    bgcolor: subjectColors[currentSubject].primary,
                    color: 'white',
                    width: 60,
                    height: 60,
                    mr: 3
                  }}>
                    {currentSubject === 'maths' ? <MathIcon fontSize="large" /> : <FrenchIcon fontSize="large" />}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {testData.testTitle || `Test ${currentTest.replace(`${currentSubject}${currentGrade}`, '')}`}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {currentSubject === 'maths' ? 'Mathématiques' : 'Français'} • {currentGrade}e année
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />

                {/* Sélection du composant en fonction de la matière */}
                {currentSubject === 'maths' ? (
                  <TestViewer testData={testData} />
                ) : (
                  <TestComponent testData={testData} />
                )}
              </Paper>
            )}
          </>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Aucun test disponible pour cette sélection
            </Typography>

          </Paper>
        )}

      </Container>
    </Box>
  );
}

export default Oqrerevision;