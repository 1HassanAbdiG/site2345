import React from 'react';
import DictationComponent from './Dicte'; // Ajustez le chemin si nécessaire
import { Container, Typography, CssBaseline } from '@mui/material';

function AppDicte() {
  return (
    <>
      <CssBaseline /> {/* Style de base cohérent */}
      <Container maxWidth="lg"> {/* Conteneur principal */}
         <Typography variant="h4" component="h1" align="center" sx={{ my: 4 }}>
           Les Mots à Maîtriser pour le Concours d’Orthographe
         </Typography>
         
         <DictationComponent />
      </Container>
    </>
  );
}

export default AppDicte;
