import React, { useState, useEffect } from "react";
import {
    Button,
    Grid,
    Card,
    CardMedia,
    Typography,
    Paper,
    Box,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import data from "./data.json"; // Ensure this path is correct

const Syllable1 = () => {
    // State for the selected category, defaulting to the first key in data or 'animaux'
    const availableCategories = Object.keys(data);
    const defaultCategory = availableCategories.length > 0 ? availableCategories[0] : 'animaux';
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

    const [selectedSyllables, setSelectedSyllables] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [answerComplete, setAnswerComplete] = useState(false);

    // Derive the syllables and words based on the selected category
    // SAFELY access the nested properties and fall back to empty arrays
    const categoryData = data[selectedCategory];
    const syllables = categoryData?.syllabes || []; // Safely access syllabes, fall back to []
    const words = categoryData?.words || [];       // Safely access words, fall back to []


    // Effect to update progress. Depends on current index and the length of the words list (which changes with category)
    useEffect(() => {
        if (words.length > 0) {
             // Progress should go from 0 to 100%. When on the last word, progress is 100%.
             // So, currentIndex + 1 is the number of completed/current words.
             setProgress(((currentIndex + 1) / words.length) * 100);
        } else {
            setProgress(0); // Handle empty word list case
        }
    }, [currentIndex, words.length]); // Depend on currentIndex and the derived words.length

    // Function to import image dynamically
    const importImage = (imageFilename) => {
        if (!imageFilename) return null;
        try {
            // Assuming images are in a subfolder named 'images' relative to THIS component file
            // Add check if require function exists (useful for non-webpack environments)
            if (typeof require === 'function') {
                 return require(`./images/${imageFilename}`);
            } else {
                 console.warn("require is not available for dynamic image import.");
                 return null; // Or return a default placeholder path
            }
        } catch (err) {
            console.error(`Image not found at ./images/${imageFilename}:`, err);
            return null;
        }
    };

    // Function to play audio dynamically
    const playAudio = (audioFileName) => {
        if (!audioFileName) return;
        try {
            // Assuming audio files are in a subfolder named 'audio' and have .mp3 extension
            // Add check if require function exists
            if (typeof require === 'function') {
                const audioPath = require(`./audio/${audioFileName}`);
                const audio = new Audio(audioPath);
                audio.play().catch(e => console.error("Error playing audio:", e)); // Catch potential play errors
            } else {
                console.warn("require is not available for dynamic audio import.");
            }
        } catch (err) {
            console.error(`Audio not found at ./audio/${audioFileName}.mp3:`, err);
        }
    };

    const handleSyllableClick = (syllable) => {
         // Prevent clicking if summary is shown, answer is complete, or no words are loaded
        if (showSummary || answerComplete || !words || words.length === 0 || !words[currentIndex]) {
             // console.log("Cannot click syllable: showSummary, answerComplete, or words not loaded.");
             return;
        }

        const targetWordData = words[currentIndex];
        const targetLength = targetWordData.correct?.length || 0; // Safely get length

        const newSyllables = selectedSyllables + syllable;

         // If adding the syllable makes the combined length *exactly* match the target length
         if (newSyllables.length === targetLength) {
             setSelectedSyllables(newSyllables);
             setAnswerComplete(true); // Mark as complete
         } else if (newSyllables.length < targetLength) {
             // If adding the syllable keeps the combined length *less than* the target length
             setSelectedSyllables(newSyllables);
             // Don't mark complete yet
         } else {
             // If adding the syllable *exceeds* the target length (incorrect)
             setSelectedSyllables(newSyllables); // Still show what they picked
             setAnswerComplete(true); // Mark as complete so they can move on/see result
         }
    };


    const handleNextWord = () => {
         // Prevent proceeding if no words are loaded or current word data is missing
         if (!words || words.length === 0 || !words[currentIndex]) {
             console.log("Cannot proceed: words not loaded or currentIndex out of bounds.");
             return;
         }

        const currentWordData = words[currentIndex];
        const isCorrect = selectedSyllables.toLowerCase() === currentWordData.correct?.toLowerCase(); // Safely access correct

        setResults((prevResults) => [
            ...prevResults,
            {
                word: currentWordData.correct?.toLowerCase(), // Safely access correct
                userAnswer: selectedSyllables.toLowerCase(),
                correct: isCorrect,
            },
        ]);

        // Play correct word audio only if correct and audio property exists
        if (isCorrect && currentWordData.audio) {
             playAudio(currentWordData.audio); // Use the 'audio' property which matches the audio file name
        } else if (currentWordData?.audio) { // Optionally play correct audio even if wrong answer
             // playAudio(currentWordData.audio);
        }


        if (currentIndex < words.length - 1) {
            // Move to the next word in the current category's list
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedSyllables(""); // Reset selected syllables for the new word
            setAnswerComplete(false); // Reset complete state
        } else {
            // Game finished for this category
            setShowSummary(true);
            setOpenSnackbar(true);
        }
    };

     // This function resets the game *state* for the *current* category's word list
    const resetGame = () => {
        setCurrentIndex(0);
        setSelectedSyllables("");
        setResults([]);
        setShowSummary(false);
        setAnswerComplete(false);
        setOpenSnackbar(false);
        // The next render cycle will use the derived words/syllables list from selectedCategory state.
    };

    // Handler for category change
    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        // Reset the game when the category changes
        resetGame();
         // Ensure game starts fresh with the new category's first word
        // The state updates and subsequent re-render will handle loading new data.
    };


    // Show loading or message if the selected category has no words
    if (!words || words.length === 0) {
        // Filter categories to only show those that have words
        const categoriesWithWords = availableCategories.filter(key => data[key]?.words?.length > 0);

        return (
            <Grid container spacing={1} sx={{ padding: 2, textAlign: "center", backgroundColor: "#f5f5f5" }}>
                 <Grid item xs={12}>
                    <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                             🌟 Choisis les bonnes syllabes ! 🌟
                        </Typography>
                         <FormControl fullWidth sx={{ mt: 2, mb: 2 }}> {/* Added margin bottom */}
                             <InputLabel id="category-select-label">Catégorie</InputLabel>
                             <Select
                                 labelId="category-select-label"
                                 id="category-select"
                                 value={selectedCategory}
                                 label="Catégorie"
                                 onChange={handleCategoryChange}
                             >
                                 {/* Map over keys in data to create MenuItems */}
                                 {/* Only show categories that actually exist in data */}
                                 {availableCategories.map((categoryKey) => (
                                      <MenuItem key={categoryKey} value={categoryKey}>
                                           {/* Capitalize the first letter for display */}
                                          {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                                      </MenuItem>
                                 ))}
                             </Select>
                         </FormControl>
                        <Typography variant="h6" color="error">
                             {/* Check if the selected category key actually exists in data */}
                            {data.hasOwnProperty(selectedCategory) ?
                                `Aucun mot disponible pour la catégorie "${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}".`
                                : `Catégorie "${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}" introuvable ou vide.`
                            }
                        </Typography>
                         {/* Only show reset if there are other categories with words */}
                         {categoriesWithWords.length > 0 && (
                             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                 Veuillez sélectionner une catégorie avec des mots disponibles.
                             </Typography>
                         )}

                    </Paper>
                 </Grid>
            </Grid>
        );
    }

     // Get the current word data (safe now because we checked words.length > 0)
    const currentWordData = words[currentIndex];


    return (
        <Grid
            container
            spacing={1}
            sx={{
                padding: 2,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            {/* Titre, Catégorie Select et progression */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        🌟 Choisis les bonnes syllabes ! 🌟
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}> {/* Added margin bottom */}
                        <InputLabel id="category-select-label">Catégorie</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category-select"
                            value={selectedCategory}
                            label="Catégorie"
                            onChange={handleCategoryChange}
                        >
                            {/* Map over keys in data to create MenuItems */}
                             {/* Only show categories that actually exist in data */}
                             {Object.keys(data).map((categoryKey) => (
                                <MenuItem key={categoryKey} value={categoryKey}>
                                     {/* Capitalize the first letter for display */}
                                    {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ marginTop: 2, height: 12, borderRadius: 5 }}
                    />
                     {/* Display word count only if words exist */}
                     {words.length > 0 && (
                         <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                           Mot {currentIndex + 1} sur {words.length}
                        </Typography>
                     )}
                </Paper>
            </Grid>

            {/* Jeu en cours */}
            {!showSummary ? (
                <>
                    <Grid item xs={12}>
                        {/* Use motion.div for animation */}
                        <motion.div
                             key={currentIndex} // Add key prop tied to index for exit/enter animation
                             initial={{ opacity: 0, x: 50 }} // Start slightly offscreen/faded
                             animate={{ opacity: 1, x: 0 }} // Animate to visible/onscreen
                             // exit={{ opacity: 0, x: -50 }} // Optional: Animate offscreen/faded on exit - requires AnimatePresence wrapper
                             transition={{ duration: 0.5 }} // Animation duration
                        >
                            <Card
                                sx={{
                                    p: 1,
                                    m: 1,
                                    display: "flex",
                                     flexDirection: { xs: 'column', md: 'row' }, // Responsive layout
                                    alignItems: "center",
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    backgroundColor: "#e6eaf2",
                                }}
                            >
                                {/* Ensure currentWordData exists before accessing properties */}
                                {currentWordData && (
                                    <CardMedia
                                        component="img"
                                         // Use currentWordData for image and alt
                                        src={importImage(currentWordData.image)} // Image import logic handles null
                                        alt={currentWordData.correct} // Use correct for alt text
                                        sx={{
                                            height: 200,
                                            maxWidth: "250px",
                                            objectFit: "contain",
                                            borderRadius: 2,
                                            mb: { xs: 2, md: 0 }, // Adjust margin for mobile
                                            mr: { md: 3 }, // Adjust margin for desktop
                                        }}
                                    />
                                )}
                                <div style={{ margin: "20px", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}> {/* Add flexGrow and center content */}
                                     {/* Use currentWordData for article and correct */}
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 2, fontSize: "2.5rem", fontWeight: "medium", textAlign: "center", color: "green" }}
                                    >
                                        {currentWordData?.article?.toLowerCase()}{" "} {/* Optional chaining on article */}
                                        {selectedSyllables.toLowerCase() || "____"}
                                        {/* Add check for currentWordData before comparing */}
                                        {selectedSyllables && currentWordData?.correct &&
                                            (selectedSyllables.toLowerCase() === currentWordData.correct.toLowerCase() ? " ✅" : " ❌")}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}> {/* Allow wrap */}
                                         {/* Use currentWordData for audio */}
                                        <Button
                                            variant="contained"
                                            color="success"
                                             // Check if audio property exists before calling playAudio
                                            onClick={() => currentWordData?.audio && playAudio(currentWordData.audio)}
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                px: 3,
                                                py: 1,
                                            }}
                                        >
                                            🔊 Écouter le mot
                                        </Button>
                                         {/* Reset button remains */}
                                         <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={resetGame}
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    px: 3,
                                                    py: 1,
                                                    "&:hover": {
                                                        transform: "scale(1.05)",
                                                        backgroundColor: "#1565c0",
                                                    },
                                                }}
                                            >
                                                Réinitialiser cette catégorie
                                            </Button>
                                    </Box>
                                     {/* Show "Continuer" button only when answer is complete */}
                                    {answerComplete && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mt: 2,
                                                cursor: "pointer",
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                px: 3,
                                                py: 1,
                                            }}
                                            onClick={handleNextWord}
                                        >
                                            {/* Change button text based on if it's the last word */}
                                            {currentIndex < words.length - 1 ? 'Mot suivant' : 'Voir le bilan'}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Syllabes disponibles - Use the derived syllables array */}
                    <Grid item xs={12}>
                         <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Syllabes disponibles :
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                {/* Ensure syllables is an array before mapping */}
                                {syllables && syllables.map((syllable, i) => ( // Added check just in case, but the derivation should prevent undefined
                                    <Button
                                        key={syllable + i} // Use syllable and index for a more unique key
                                        variant="contained"
                                        sx={{
                                            m: 1,
                                            p: 2,
                                            fontSize: "1.5rem",
                                            textTransform: "none",
                                            backgroundColor: "#1976d2",
                                            color: "#ffffff",
                                            "&:hover": {
                                                backgroundColor: "#115293",
                                                transform: "scale(1.05)",
                                            },
                                            transition: "all 0.1s ease",
                                            cursor: "pointer",
                                            minWidth: "100px",
                                            minHeight: "50px",
                                        }}
                                        onClick={() => handleSyllableClick(syllable)}
                                         // Disable syllable buttons if the answer is complete
                                        disabled={answerComplete}
                                    >
                                        {syllable.toLowerCase()}
                                    </Button>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </>
            ) : (
                
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={resetGame} // Reset starts a new game within the *current* category
                        sx={{ mt: 2, cursor: "pointer" }}
                    >
                        Recommencer cette catégorie
                    </Button>
                    <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
                        Bilan des réponses pour "{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}"
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mot correct</TableCell>
                                    <TableCell>Réponse utilisateur</TableCell>
                                    <TableCell>Résultat</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Results table uses the 'results' state */}
                                {results.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{result.word}</TableCell>
                                        <TableCell>{result.userAnswer || "____"}</TableCell>
                                        <TableCell>
                                            {result.correct ? "✅ Correct" : "❌ Faux"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                     {/* Optional: Button to go back to category selection or start a new game */}
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                           // Logic to potentially go back to a category selection screen
                           // or simply resetting the game is often sufficient
                            resetGame(); // Resets current category
                            // If you had a route/state for a category selection screen, you'd go there:
                            // navigate('/category-select');
                        }}
                        sx={{ mt: 2, mr: 1 }}
                    >
                       Rejouer cette catégorie
                    </Button>
                </Grid>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={`Bravo ! Tu as terminé la catégorie "${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}" !`}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Grid>
    );
};

export default Syllable1;