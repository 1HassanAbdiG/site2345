// src/App.js (Example)
import React from 'react';
import ReadingLevelsComponent from './ReadingLevelsComponent';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Optional: Define a theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1565c0', // Example Blue
             dark: '#003c8f',
             light: '#5e92f3',
        },
        secondary: {
            main: '#ff8f00', // Example Amber/Orange
        },
        background: {
            default: '#f5f5f5' // Light grey background
        }
    },
});

function Lecture2App() {
  return (
     <ThemeProvider theme={theme}> {/* Optional Theming */}
      <CssBaseline /> {/* Normalize CSS */}
      <div className="App">
        <ReadingLevelsComponent />
      </div>
     </ThemeProvider>
  );
}

export default Lecture2App;