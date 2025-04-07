// src/App.js
import React, { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire';
// import './App.css'; // REMOVE THIS LINE
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Maths20215() {
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    import('../public/questionnaireData.json')
      .then(data => {
        setQuestionnaireData(data.default);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questionnaire data:", err);
        setError("Could not load questionnaire.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ mt: 5 }}>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  if (!questionnaireData) {
    return (
       <Container>
        <Typography align="center" sx={{ mt: 5 }}>
          No questionnaire data found.
        </Typography>
      </Container>
    );
  }

  return (
    // Container provides max-width and centering
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Questionnaire data={questionnaireData} />
    </Container>
  );
}

export default Maths20215;