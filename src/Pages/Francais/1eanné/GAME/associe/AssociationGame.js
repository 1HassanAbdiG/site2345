import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import {
  Grid, Paper, Typography, Box, Button
} from '@mui/material';
import { ArcherContainer, ArcherElement } from 'react-archer';
import gameData from './associe.json';

// Fonction pour importer les images depuis le dossier local
// Ensure the path is correct relative to THIS component file
const importImage = (imageFilename) => {
  try {
    return require(`../syllabeMots/images/${imageFilename}`);
  } catch (err) {
    console.error(`Image not found: ${imageFilename}`, err);
    // Return a placeholder or null, handle null in rendering
    return null;
  }
};

// Function to shuffle array (can be defined outside the component)
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const AssociationGame = () => {
  // State for the selected category
  const [selectedCategory, setSelectedCategory] = useState('animaux');

  // State for all game-related data
  const [gameState, setGameState] = useState({
    categoryData: gameData[selectedCategory], // Store current category data
    leftItems: [],
    rightItems: [],
    shuffledRightItems: [],
    selectedLeft: null, // The currently selected image item
    pairings: [], // Array of { leftId, rightId, leftAlt, rightText }
    submitted: false,
    score: 0
  });

  // useCallback version of shuffleArray to be stable for handleReset dependency
  const stableShuffleArray = useCallback(shuffleArray, []);


  // Effect to initialize or reset the game state when the category changes
  // or when the component mounts
  useEffect(() => {
    const currentCategoryData = gameData[selectedCategory];

    const initialLeftItems = currentCategoryData.questions.map(q => ({
      ...q,
      id: `left-${q.id}`,
      imageSrc: importImage(q.image),
      // Store original word directly on the left item for easier access
      word: q.word
    }));

    const initialRightItems = currentCategoryData.questions.map(q => ({
      id: `right-${q.id}`,
      text: q.word
    }));

    setGameState(prev => ({
      ...prev,
      categoryData: currentCategoryData, // Update category data
      leftItems: initialLeftItems,
      rightItems: initialRightItems,
      shuffledRightItems: stableShuffleArray(initialRightItems), // Shuffle initial words
      selectedLeft: null,
      pairings: [],
      submitted: false,
      score: 0
    }));

    console.log(`Game initialized for category: ${selectedCategory}`);

    // Dependency array: Re-run this effect only when selectedCategory changes
  }, [selectedCategory, stableShuffleArray]); // Include stableShuffleArray for completeness, though it's stable


  // Function to un-pair an item (called when clicking a paired item)
  const handleUnpair = (clickedItem) => {
      // Find the pairing that involves the clicked item
      const pairingToRemove = gameState.pairings.find(pair =>
          pair.leftId === clickedItem.id || pair.rightId === clickedItem.id
      );

      if (!pairingToRemove) return; // Should not happen if logic is correct, but safety

      setGameState(prev => ({
          ...prev,
          pairings: prev.pairings.filter(pair => pair !== pairingToRemove), // Remove the found pairing
          // If the removed pairing involved the currently selected left item, clear selection
          selectedLeft: prev.selectedLeft?.id === pairingToRemove.leftId ? null : prev.selectedLeft
      }));
      console.log(`Unpaired: ${pairingToRemove.leftAlt} <-> ${pairingToRemove.rightText}`);
  };


  const handleLeftClick = (item) => {
    if (gameState.submitted) return; // Ignore clicks after submission

    const isPaired = gameState.pairings.some(pair => pair.leftId === item.id);
    const isSelected = gameState.selectedLeft?.id === item.id;

    if (isPaired) {
      // If already paired and not submitted, un-pair it
      handleUnpair(item);
    } else if (isSelected) {
      // If already selected, deselect it
      setGameState(prev => ({ ...prev, selectedLeft: null }));
    }
     else {
      // If not paired and not selected, select it
      setGameState(prev => ({ ...prev, selectedLeft: item }));
    }
  };

  const handleRightClick = (item) => {
    if (gameState.submitted) return; // Ignore clicks after submission

    const isPaired = gameState.pairings.some(pair => pair.rightId === item.id);

    if (isPaired) {
       // If already paired and not submitted, un-pair it
       handleUnpair(item);
    } else {
      // If not paired, attempt to create a new pairing
      if (!gameState.selectedLeft) {
        alert("Veuillez d'abord sélectionner une image.");
        return;
      }

      // Prevent pairing if the selected left item is already paired (shouldn't happen with handleLeftClick fix, but defensive)
      if (gameState.pairings.some(pair => pair.leftId === gameState.selectedLeft.id)) {
         // This means the user clicked an image, then a word, but *then* clicked the image again or something
         // that resulted in the image being paired before clicking this word.
         // Clear selection and inform the user.
         alert("L'image sélectionnée est déjà associée. Veuillez désélectionner ou choisir une autre image.");
         setGameState(prev => ({ ...prev, selectedLeft: null }));
         return;
      }

      // --- Proceed with pairing ---
      // Find the *original* left item data to get the correct word for comparison later
      const originalLeftItem = gameState.leftItems.find(left => left.id === gameState.selectedLeft.id);
      if (!originalLeftItem) {
           console.error("Selected left item not found in original list!");
           setGameState(prev => ({ ...prev, selectedLeft: null })); // Clear selection on error
           return;
      }

      setGameState(prev => ({
        ...prev,
        pairings: [...prev.pairings, {
          leftId: prev.selectedLeft.id,
          rightId: item.id,
          leftAlt: originalLeftItem.word, // Use word from original left item data
          rightText: item.text // Use text from the clicked right item
        }],
        selectedLeft: null // Clear selection after making a pair
      }));
       console.log(`Attempted pair: ${originalLeftItem.word} <-> ${item.text}`);
    }
  };

  const handleSubmit = () => {
    // Optional: Prevent submission if not all items are paired
    if (gameState.pairings.length !== gameState.leftItems.length) {
        alert(`Veuillez associer toutes les ${gameState.leftItems.length} images avant de valider.`);
        return;
    }

    const correctCount = gameState.pairings.reduce((count, pair) => {
      // Check correctness using the stored words
      return pair.leftAlt === pair.rightText ? count + 1 : count;
    }, 0);

    setGameState(prev => ({
      ...prev,
      score: correctCount,
      submitted: true
    }));
     console.log(`Game submitted. Score: ${correctCount}/${gameState.leftItems.length}`);
  };

  // Reset function clears the current game state and re-shuffles words for the SAME category
  const handleReset = () => {
      setGameState(prev => ({
          ...prev,
          shuffledRightItems: stableShuffleArray(prev.rightItems), // Re-shuffle words for the current category
          selectedLeft: null,
          pairings: [],
          submitted: false,
          score: 0
      }));
      console.log(`Game reset for category: ${selectedCategory}`);
  };


  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    // The useEffect hook handles the full state reset and re-initialization
    // when selectedCategory changes. No need to call handleReset here.
  };


  // Accessing state properties more conveniently
  const {
    categoryData,
    leftItems,
    shuffledRightItems,
    selectedLeft,
    pairings,
    submitted,
    score
  } = gameState;


  return (
    <Grid container spacing={4} padding={3}>
      {/* Sélection de catégorie */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
          <Typography variant="h6" gutterBottom>Choisissez une catégorie :</Typography>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ padding: '8px', fontSize: '16px', width: '100%', cursor: 'pointer' }}
          >
            {Object.keys(gameData).map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </Paper>
      </Grid>

      {/* Titre et instructions */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            {categoryData.titre}
          </Typography>
          <Typography variant="body1" align="center">
            {categoryData.instructions}
          </Typography>
        </Paper>
      </Grid>

      {/* Zone de jeu */}
      <Grid item xs={12}>
        {/* ArcherContainer must wrap the elements you want to connect */}
        <ArcherContainer strokeColor="blue" strokeWidth={2}>
          {/* Use alignItems="stretch" to make grid items fill height */}
          <Grid container spacing={2} justifyContent="center" alignItems="stretch">
            {/* Colonne des images */}
            <Grid item xs={12} md={5}>
              {/* Paper should take full height of the grid item */}
              <Paper sx={{ p: 2, backgroundColor: '#f1f8e9', height: '100%' }}>
                <Typography variant="h6" align="center">Images</Typography>
                {/* Box should take full height of the paper and distribute items */}
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent={leftItems.length > 1 ? "space-around" : "center"} // Adjust justification if only one item
                  alignItems="center"
                  height="100%"
                >
                  {leftItems.map(item => {
                    const pairing = pairings.find(pair => pair.leftId === item.id);
                    const isPaired = !!pairing;
                    const isSelected = selectedLeft?.id === item.id;

                    // Determine line color
                    let lineColor = 'blue'; // Default before pairing attempt
                    if (isPaired) {
                         if (submitted) {
                              // After submission: green for correct, red for incorrect
                             lineColor = pairing.leftAlt === pairing.rightText ? 'green' : 'red';
                         } else {
                             // Paired but not submitted: grey line
                             lineColor = 'grey';
                         }
                    }


                    return (
                      <ArcherElement
                        key={item.id}
                        id={item.id}
                        relations={
                          isPaired // Only draw relation if paired
                            ? [{
                                targetId: pairing.rightId, // Use the rightId from the pairing
                                targetAnchor: 'left',
                                sourceAnchor: 'right',
                                style: {
                                  strokeColor: lineColor, // Use dynamic color
                                  strokeWidth: 2,
                                   // Solid line after submission, dashed before
                                  strokeDasharray: submitted ? 'none' : '5,5'
                                }
                              }]
                            : [] // No relations if not paired
                        }
                      >
                        <Paper
                          // Handle click: allows selection, deselection, or un-pairing
                          onClick={() => handleLeftClick(item)}
                          sx={{
                            p: 1,
                            // Background color based on state (selected, paired, default)
                            backgroundColor: isSelected ? '#bbdefb' : (isPaired ? '#a5d6a7' : '#ffffff'),
                            // Cursor changes if clickable (not submitted)
                            cursor: submitted ? 'default' : 'pointer',
                            textAlign: 'center',
                            // Dim paired items before submission
                            opacity: isPaired && !submitted ? 0.8 : 1,
                            // Highlight selected item with border
                            border: isSelected ? '2px solid blue' : 'none',
                             // Ensure items don't grow/shrink in flex container
                            flexShrink: 0
                          }}
                        >
                          {item.imageSrc ? (
                            <img
                              // Increased image size here
                              src={item.imageSrc}
                              alt={item.word}
                              style={{
                                width: '150px', // Increased size
                                height: '150px', // Increased size
                                objectFit: 'contain'
                              }}
                            />
                           ) : (
                            <Box width="150px" height="150px" display="flex" justifyContent="center" alignItems="center">
                                <Typography variant="caption">Image non trouvée</Typography>
                            </Box>
                           )}
                        </Paper>
                      </ArcherElement>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>

            {/* Colonne des mots */}
            <Grid item xs={12} md={5}>
               {/* Paper should take full height of the grid item */}
               <Paper sx={{ p: 2, backgroundColor: '#f1f8e9', height: '100%' }}>
                <Typography variant="h6" align="center">Mots</Typography>
                 {/* Box should take full height of the paper and distribute items */}
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent={shuffledRightItems.length > 1 ? "space-around" : "center"} // Adjust justification if only one item
                    alignItems="center"
                    height="100%"
                >
                  {shuffledRightItems.map(item => { // Use the state variable here
                    const pairing = pairings.find(pair => pair.rightId === item.id);
                    const isPaired = !!pairing;
                    const isCorrect = submitted && isPaired ? (pairing.leftAlt === pairing.rightText) : false;


                    // Determine paper color based on state and submission status
                    let paperColor = '#f5f5f5'; // Default unpaired color (lighter grey)
                    if (isPaired) {
                        paperColor = '#c8e6c9'; // Default paired color before submission (light green)
                         if (submitted) {
                            // After submission: green for correct, red for incorrect
                             paperColor = isCorrect ? '#a5d6a7' : '#ef9a9a';
                         }
                    } else if (submitted && !isPaired) {
                         // If submitted but this word wasn't paired, dim it
                         paperColor = '#e0e0e0';
                    }


                    return (
                      <ArcherElement key={item.id} id={item.id}>
                        <Paper
                           // Handle click: allows pairing or un-pairing
                          onClick={() => handleRightClick(item)}
                          sx={{
                            p: 2,
                            backgroundColor: paperColor, // Use dynamic color
                            // Cursor changes if clickable (not submitted)
                            cursor: submitted ? 'default' : 'pointer',
                            textAlign: 'center',
                            minWidth: '120px', // Keep a min width for words
                            // Slightly dim paired items before submission
                            opacity: isPaired && !submitted ? 0.8 : 1,
                             // Ensure items don't grow/shrink in flex container
                            flexShrink: 0,
                             // Highlight if the corresponding left item is selected
                            border: selectedLeft?.id === pairing?.leftId ? '2px dashed blue' : 'none' // Optional visual cue
                          }}
                        >
                          {item.text}
                        </Paper>
                      </ArcherElement>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </ArcherContainer>
      </Grid>

      {/* Boutons */}
      <Grid item xs={12} container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            // Disable submit if not all items are paired or if already submitted
            disabled={pairings.length !== leftItems.length || submitted}
          >
            Valider
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
             // Enable reset even if submitted
          >
            Recommencer
          </Button>
        </Grid>
      </Grid>

      {/* Résultats */}
      {submitted && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#c8e6c9' }}>
            <Typography variant="h5" color="primary" gutterBottom align="center">
              Résultats
            </Typography>
            <Typography variant="h6" align="center">
              Score: {score} / {leftItems.length}
            </Typography>
            <Typography align="center" sx={{ mt: 1 }}>
              {score === leftItems.length ? '🎉 Excellent !' :
               score > 0 ? '👍 Bien joué !' :
               '🤔 Essayez encore !'}
            </Typography>
            {score < leftItems.length && (
                 <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                     Les associations correctes sont indiquées en vert, les incorrectes en rouge.
                 </Typography>
            )}
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default AssociationGame;