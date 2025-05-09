// src/App.js (Example usage)
import React from 'react';
import ReadingLevelsComponent from './lecture';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Optional: for theme customization

// Optional: Create a basic theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink/Red
    },
  },
});


function LectureApp() {
  return (
     <ThemeProvider theme={theme}> {/* Optional */}
      <CssBaseline /> {/* Normalize CSS */}
      <div className="App">
        <ReadingLevelsComponent />
      </div>
     </ThemeProvider>
  );
}

export default LectureApp;