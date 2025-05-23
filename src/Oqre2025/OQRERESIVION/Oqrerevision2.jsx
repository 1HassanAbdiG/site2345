

import React, { useState } from 'react';
import TestTaker from './TestTaker'; // Adjust the path as needed
import { Box, Button, Typography, Container } from '@mui/material';

// Import your JSON data files
// Assuming your JSON files are in a 'data' folder
import maths31Data from './maths31.json';
// import maths32Data from './data/maths32.json';
// import maths33Data from './data/maths33.json';
import maths61Data from './maths61.json'; // Example for another test
// Ajoutez les autres imports si besoin

function Oqrerevision1() {
  // Use state to manage which test data is currently displayed
  const [currentTestData, setCurrentTestData] = useState(maths31Data); // Start with Maths 3

  const handleTestChange = (data) => {
    setCurrentTestData(data);
  };

  return (
    <Box sx={{ bgcolor: '#f0f2ff', minHeight: '100vh', pb: 4 }}> {/* Light background, padding bottom */}
       <Container sx={{ py: 2, textAlign: 'center' }}>
           <Typography variant="h5" gutterBottom>
               Sélectionnez le test :
           </Typography>
           <Button
               variant={currentTestData === maths31Data ? "contained" : "outlined"}
               sx={{ mr: 2 }}
               onClick={() => handleTestChange(maths31Data)}
           >
               Maths 3e année
           </Button>
           <Button
               variant={currentTestData === maths61Data ? "contained" : "outlined"}
                onClick={() => handleTestChange(maths61Data)}
            >
                Maths 6e année (Exemple)
            </Button>
           {/* Add other buttons for your other JSON files */}
       </Container>

      {/* Pass the selected test data to the TestTaker component */}
      <TestTaker testData={currentTestData} />
    </Box>
  );
}

export default Oqrerevision1;