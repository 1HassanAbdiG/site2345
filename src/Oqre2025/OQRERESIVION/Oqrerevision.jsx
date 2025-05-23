import React, { useState } from 'react';
import TestViewer from './TestViewer'; // Ajustez le chemin si nécessaire
import { Box, Button, Typography, Container } from '@mui/material';

// Importez vos fichiers JSON spécifiques ici
import maths31Data from './maths31.json';
import maths61Data from './maths61.json';
import Oqrerevision1 from './Oqrerevision2';
// Ajoutez les autres imports si besoin

function Oqrerevision() {
  // Utilisez un état pour gérer quelle série de questions afficher
  const [currentTestData, setCurrentTestData] = useState(maths31Data); // Commence avec maths31.json

  const handleTestChange = (data) => {
    setCurrentTestData(data);
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh' }}> {/* Fond léger */}
       <Container sx={{ py: 2, textAlign: 'center' }}>
           <Typography variant="h5" gutterBottom>
               Sélectionnez le test :
           </Typography>
           <Button
               variant="contained"
               sx={{ mr: 2 }}
               onClick={() => handleTestChange(maths31Data)}
               disabled={currentTestData === maths31Data}
           >
               Maths 3e année
           </Button>
           <Button
                variant="contained"
                onClick={() => handleTestChange(maths61Data)}
                disabled={currentTestData === maths61Data}
            >
                Maths 6e année (Exemple)
            </Button>
           {/* Ajoutez d'autres boutons pour d'autres fichiers JSON */}
       </Container>
      <TestViewer testData={currentTestData} />
      <Oqrerevision1></Oqrerevision1>
    </Box>
  );
}

export default Oqrerevision;