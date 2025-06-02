// AssociationQuestion.js
import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
// Import Material UI components
import {
    Typography,
    Box,
    Button,
    Grid,
    Paper,
    List, // Import List for list items
    ListItem // Import ListItem for individual items
} from '@mui/material';
import { styled } from '@mui/system';
// Import Material UI icons needed for visual feedback within THIS component
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import CheckCircleIcon
import CancelIcon from '@mui/icons-material/Cancel';       // Import CancelIcon


// Styled component for the clickable items (Left and Right)
const SelectablePaper = styled(Paper)(({ theme, isSelected, isSubmitted, isPlaceholder }) => ({
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    cursor: (isSelected || isSubmitted || isPlaceholder) ? 'default' : 'pointer', // Change cursor based on state
    userSelect: 'none', // Prevent text selection
    textAlign: 'center', // Center text
    transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, transform 0.2s ease-in-out', // Smooth transitions
    border: '2px solid', // Add a border for better definition

    // Base styles
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    transform: 'scale(1)',

    // Style for selected LEFT item
    ...(isSelected && {
        borderColor: theme.palette.primary.main, // Bordure de couleur primaire si sélectionné
        backgroundColor: theme.palette.primary.light, // Fond plus clair si sélectionné
        color: theme.palette.primary.contrastText, // Texte contrastant
        transform: 'scale(1.03)', // Léger agrandissement
    }),

    // Style when submitted (items are no longer interactive)
    ...(isSubmitted && {
         opacity: 0.8, // Estompe légèrement
         pointerEvents: 'none', // Désactive les interactions
         cursor: 'default',
    }),

    // Style for placeholder item
     ...(isPlaceholder && {
         opacity: 0.6,
         fontStyle: 'italic',
         backgroundColor: theme.palette.grey[100],
         borderColor: 'transparent',
         cursor: 'default',
         pointerEvents: 'none',
     })
}));


// This component expects 'question' object and 'onAnswer' callback as props
function AssociationQuestion({ question, onAnswer }) {
  // State to store the pairs that are still available to be matched
  const [availablePairs, setAvailablePairs] = useState([]);
  // State to store the item currently selected from the left side
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  // State to store the user's *attempted* associations (correct or not, completed pairs)
  // This is the list that will be sent to the Bilan
  const [userAssociations, setUserAssociations] = useState([]);
  // State for immediate feedback after selecting a right item (optional)
  const [feedback, setFeedback] = useState(null); // true/false/null for last attempt
  // State to track if the question has been submitted
  const [submitted, setSubmitted] = useState(false);


  // --- Initialisation / Reset quand la question change ---
  useEffect(() => {
    // Vérifie si la question est valide et a des paires
    if (question?.pairs && Array.isArray(question.pairs)) {
      // Initialise les paires disponibles avec les paires de la question
      // Crée une copie pour ne pas modifier les données d'origine
      // Optionnel: ajouter un ID unique à chaque paire si les left/right ne sont pas suffisants pour le suivi
      setAvailablePairs(question.pairs.map((pair, index) => ({...pair, id: index}))); // Ajout d'un ID pour suivre les instances
      setUserAssociations([]); // Réinitialise les associations faites par l'utilisateur
      setSelectedLeftItem(null); // Réinitialise l'élément sélectionné
      setFeedback(null); // Réinitialise le feedback
      setSubmitted(false); // Réinitialise l'état de soumission
    } else {
         // Gérer le cas où question ou question.pairs est manquant/invalide
         console.error("Association question data is invalid:", question);
         setAvailablePairs([]);
         setUserAssociations([]);
         setSelectedLeftItem(null);
         setFeedback(null);
         setSubmitted(false);
         // Optionally call onAnswer with an error state?
         // onAnswer({ correct: false, userAnswer: [], error: 'Invalid question data' });
    }
  }, [question]); // Exécute cet effet quand la prop 'question' change

  // --- Dérivations d'état pour l'affichage ---
  // Utilise useMemo pour optimiser le calcul des listes affichées
  const { leftItemsToDisplay, rightItemsToDisplay } = useMemo(() => {
      // Crée un ensemble d'éléments gauches déjà associés pour les filtrer plus facilement
      const matchedLefts = new Set(userAssociations.map(assoc => assoc.left));

      const leftItems = [];
      const rightItems = [];

      // Parcourt les paires ENCORE DISPONIBLES
      availablePairs.forEach(pair => {
          // Ajoute l'élément gauche s'il n'a pas encore été associé
          if (!matchedLefts.has(pair.left)) {
              leftItems.push(pair.left);
              // On marque l'élément gauche comme "utilisé" une fois qu'il est dans la liste de gauche à afficher
               matchedLefts.add(pair.left); // Ajoutez à l'ensemble pour ne pas l'ajouter plusieurs fois s'il apparaît dans d'autres paires disponibles
          }

          // Ajoute l'élément droit correspondant (l'instance de la paire disponible)
          // On stocke la paire complète ou au moins l'ID pour pouvoir l'identifier au drop/click
          rightItems.push(pair); // Stocke la paire complète ou { right: pair.right, id: pair.id }

      });

      // Les listes sont générées à partir des paires *disponibles*, donc elles ne contiennent que ce qui reste à faire.
      // Les leftItems sont les strings uniques restantes. rightItems sont les paires disponibles complètes.
      return { leftItemsToDisplay: leftItems, rightItemsToDisplay: rightItems };

  }, [availablePairs, userAssociations]); // Recalcule si les paires disponibles ou les associations changent


  // --- Gestion des sélections ---

  // Gère la sélection d'un élément de la colonne de gauche
  const handleSelectLeft = (leftItem) => {
      // Ne rien faire si déjà soumis ou si cet élément est déjà dans userAssociations (ne devrait pas arriver avec le filtrage d'affichage)
      if (submitted || userAssociations.some(assoc => assoc.left === leftItem)) return;

      // Si l'élément cliqué est déjà sélectionné, désélectionner
      if (selectedLeftItem === leftItem) {
          setSelectedLeftItem(null);
      } else {
          // Sélectionner le nouvel élément de gauche
          setSelectedLeftItem(leftItem);
          // Efface le feedback d'une tentative précédente
          setFeedback(null);
      }
  };

  // Gère la sélection d'un élément de la colonne de droite
  const handleSelectRight = (rightPairInstance) => { // rightPairInstance est l'objet paire de availablePairs {left, right, id}
    // Procède seulement si pas soumis, si un élément de gauche est sélectionné,
    // et si l'instance de paire cliquée existe dans les paires encore disponibles.
    if (submitted || !selectedLeftItem || !availablePairs.some(p => p.id === rightPairInstance.id)) {
        // Optionnel: feedback si clic sur un élément non valide alors qu'un left est sélectionné
        if (!submitted && selectedLeftItem) {
             setFeedback(false); // Indique une tentative d'association invalide
             setSelectedLeftItem(null); // Désélectionne l'élément gauche
        }
        return; // Arrête la fonction
    }

    // Tente de trouver la paire exacte parmi les paires disponibles
    // où l'élément gauche correspond à celui sélectionné ET l'ID de l'instance de droite correspond à celle cliquée
    const matchedPair = availablePairs.find(
        p => p.left === selectedLeftItem && p.id === rightPairInstance.id
    );

    // Si la paire correspondante est trouvée (l'utilisateur a cliqué sur la bonne cible pour l'élément gauche sélectionné)
    if (matchedPair) {
      // Ajoute la paire trouvée (avec son ID) à la liste des associations faites par l'utilisateur
      // On stocke la paire complète pour avoir left, right et id dans userAssociations si besoin dans Bilan
      setUserAssociations(prev => [...prev, matchedPair]);

      // Retire cette paire spécifique des paires disponibles
      setAvailablePairs(prev => prev.filter(p => p.id !== matchedPair.id));

      // Vérifie si cette association faite était correcte pour le feedback local (elle l'est forcément si elle correspond à une availablePair)
      setFeedback(true);

      // Désélectionne l'élément gauche
      setSelectedLeftItem(null);

    } else {
      // Ce cas ne devrait pas arriver avec la logique de filtrage si handleSelectRight est appelé sur un item de rightItemsToDisplay
      // Mais si c'était possible, ce serait une association incorrecte tentée.
      // Gérer comme une association incorrecte : ajouter la paire (left, right de l'instance cliquée) à userAssociations,
      // mais ne rien retirer des availablePairs.
       console.warn("Association logic error: clicked right item doesn't match selected left item in available pairs.", { selectedLeftItem, rightPairInstance, availablePairs });
       // Pour l'instant, on traite cela comme une tentative invalide qui désélectionne et donne un feedback négatif
       setFeedback(false);
       setSelectedLeftItem(null);
    }
  };

  // --- Gestion de la Validation Finale ---

  // Gère la validation quand le bouton est cliqué
  const handleValidation = () => {
    // Ne permet de valider que si pas déjà soumis ET si toutes les paires ont été associées
    if (submitted || availablePairs.length > 0) {
         // Vous pourriez donner un feedback visuel ici si le bouton est cliqué alors qu'il est disabled
         return;
    }

    // Marque comme soumis pour désactiver les contrôles
    setSubmitted(true);

    // Compare les associations faites par l'utilisateur avec les paires correctes originales
    // On utilise les IDs pour comparer les instances si les valeurs left/right ne sont pas uniques
    // Trie les deux listes par ID pour une comparaison fiable
    const sortById = (pairs) => pairs.slice().sort((a, b) => a.id - b.id);

    const correctPairsSorted = sortById(question.pairs);
    const userAssociationsSorted = sortById(userAssociations); // userAssociations contient les paires originales avec leurs IDs

    // Vérifie si toutes les paires ont été faites (déjà vérifié par availablePairs.length === 0)
    // ET si les associations faites sont exactement les mêmes que les paires correctes (en comparant par ID)
    const isCorrect =
       userAssociationsSorted.length === correctPairsSorted.length &&
       userAssociationsSorted.every((userPair, index) =>
          userPair.id === correctPairsSorted[index].id
          // Optional: verify left and right values too as a double check, though ID should be sufficient
          // && userPair.left === correctPairsSorted[index].left
          // && userPair.right === correctPairsSorted[index].right
       );


    // Appelle la fonction onAnswer du parent
    // **CRITICAL:** Passe la liste des associations faites par l'utilisateur (`userAssociations`) au Bilan
    onAnswer({
      correct: isCorrect, // Succès global si toutes les paires correctes ont été faites
      userAnswer: userAssociations // Passe la liste des paires faites par l'utilisateur (contient les paires originales avec IDs)
    });
  };

   // Vérifie si toutes les paires originales ont été associées (pour désactiver/activer le bouton Valider)
   const allOriginalPairsAssociated = availablePairs.length === 0 && userAssociations.length === question?.pairs?.length;


  // --- Rendu du composant ---
  return (
    // Utilise Box pour le layout interne, le parent Quiz fournit la structure Paper
    <Box sx={{ textAlign: 'center', maxWidth: 700, margin: 'auto', p: 2 }}>

      {/* Titre de la question */}
      <Typography variant="h5" component="div" gutterBottom sx={{ mb: 4, fontWeight: 'medium' }}>
        {question.question}
      </Typography>

      {/* Zone d'Association: Deux colonnes pour les éléments disponibles */}
      <Grid container spacing={4} sx={{ mb: 4 }}>

         {/* Colonne de Gauche: Éléments à associer */}
         <Grid item xs={12} sm={6}>
             <Typography variant="h6" gutterBottom>Éléments à associer</Typography>
             <List sx={{ listStyle: 'none', padding: 0 }}>
                 {/* Boucle sur les éléments gauches uniques encore disponibles */}
                 {leftItemsToDisplay.map((item) => (
                     <ListItem disablePadding key={item}> {/* ListItem pour la structure, key sur l'item string */}
                         <SelectablePaper
                             onClick={() => handleSelectLeft(item)}
                             isSelected={selectedLeftItem === item}
                             isSubmitted={submitted}
                             sx={{ width: '100%' }} // Assure que le Paper prend toute la largeur du ListItem
                         >
                             <Typography variant="body1">{item}</Typography>
                         </SelectablePaper>
                     </ListItem>
                 ))}
                  {/* Message si la liste de gauche est vide mais qu'il y a des paires dans la question */}
                  {leftItemsToDisplay.length === 0 && question?.pairs?.length > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                         Tous les éléments de gauche sont associés.
                      </Typography>
                  )}
                  {/* Message si la question n'a pas de paires */}
                  {(!question?.pairs || question.pairs.length === 0) && (
                       <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Aucun élément à associer.
                       </Typography>
                   )}
             </List>
         </Grid>

         {/* Colonne de Droite: Cibles d'association (Instances de paires disponibles) */}
          <Grid item xs={12} sm={6}>
             <Typography variant="h6" gutterBottom>Cibles d'association</Typography>
              <List sx={{ listStyle: 'none', padding: 0 }}>
                 {/* Boucle sur les INSTANCES de paires ENCORE DISPONIBLES (qui sont les cibles cliquables) */}
                 {rightItemsToDisplay.map((pairInstance) => ( // pairInstance est l'objet {left, right, id}
                     <ListItem disablePadding key={pairInstance.id}> {/* Key sur l'ID unique de la paire */}
                         <SelectablePaper
                              onClick={() => handleSelectRight(pairInstance)} // Passe l'instance complète au gestionnaire
                              isSubmitted={submitted} // Passe l'état soumis pour désactiver
                              // Désactive le clic si pas encore soumis ET aucun élément gauche n'est sélectionné
                              disabled={submitted || selectedLeftItem === null}
                              sx={{
                                  width: '100%',
                                  // Opacité et curseur modifiés si désactivé
                                  opacity: (submitted || selectedLeftItem === null) ? 0.6 : 1,
                                  cursor: (submitted || selectedLeftItem === null) ? 'not-allowed' : 'pointer',
                              }}
                         >
                              <Typography variant="body1">{pairInstance.right}</Typography> {/* Affiche le texte de droite */}
                         </SelectablePaper>
                     </ListItem>
                 ))}
                 {/* Message si la liste de droite est vide mais qu'il y a des paires dans la question */}
                  {rightItemsToDisplay.length === 0 && question?.pairs?.length > 0 && (
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        Toutes les cibles sont associées.
                     </Typography>
                  )}
                   {/* Message si la question n'a pas de paires */}
                  {(!question?.pairs || question.pairs.length === 0) && (
                       <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Aucune cible à associer.
                       </Typography>
                   )}
             </List>
         </Grid>

      </Grid>

        {/* Afficher les Associations faites par l'utilisateur */}
        {/* Montre cette section si l'utilisateur a fait au moins une association */}
        {userAssociations.length > 0 && (
            <Box sx={{ mt: 2, mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                 <Typography variant="h6" gutterBottom>Associations faites :</Typography>
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                     {/* Boucle sur les associations faites par l'utilisateur */}
                     {/* userAssociations contient les paires originales avec IDs si elles ont été correctement associées */}
                     {/* Sinon, elle peut contenir des tentatives {left, right} sans ID si la logique handleSelectRight est modifiée */}
                     {userAssociations.map((assoc, index) => {
                          // Trouver la paire correcte originale pour cette association faite par l'utilisateur (en utilisant l'ID si possible)
                           // Si l'assoc n'a pas d'ID, on essaie de la trouver par left/right (moins fiable avec doublons)
                          const originalPair = question?.pairs?.find(p => (assoc.id !== undefined && p.id === assoc.id) || (assoc.left === p.left && assoc.right === p.right));
                           // L'association est correcte si elle correspond à une paire originale
                          const isCorrectPair = !!originalPair;

                          const pairColor = isCorrectPair ? 'success.main' : 'error.main';
                          const PairIcon = isCorrectPair ? CheckCircleIcon : CancelIcon;

                          // Afficher la paire faite par l'utilisateur avec son icône/couleur
                          return (
                             // Utilise une clé composite robuste
                             <Paper
                                key={`${assoc?.left || 'N/A'}-${assoc?.right || 'N/A'}-${assoc?.id || index}`}
                                elevation={1}
                                sx={{
                                    p: 1,
                                    bgcolor: isCorrectPair ? 'success.light' : 'error.light',
                                    border: `1px solid ${isCorrectPair ? theme => theme.palette.success.main : theme => theme.palette.error.main}`
                                }}
                             >
                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <PairIcon sx={{ fontSize: 'small', color: pairColor, mr: 0.5 }} />
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          {assoc?.left || 'N/A'} <Box component="span" sx={{ mx: 0.5 }}>→</Box> {assoc?.right || 'N/A'}
                                      </Typography>
                                 </Box>
                             </Paper>
                          );
                     })}
                 </Box>
            </Box>
        )}

       {/* Feedback immédiat (Optionnel) */}
       {feedback !== null && (
           <Typography
             variant="body1"
             sx={{
               mt: 2,
               fontWeight: 'bold',
               color: feedback ? 'success.main' : 'error.main',
               textAlign: 'center',
               transition: 'color 0.3s ease-in-out'
             }}
           >
             {feedback ? '✅ Bonne association ! Continue.' : '❌ Cette association n\'est pas correcte. Essaye encore !'}
           </Typography>
       )}


      {/* Bouton Valider */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleValidation}
        // Désactive le bouton si déjà soumis OU si toutes les paires attendues n'ont pas été associées
        disabled={submitted || userAssociations.length !== question?.pairs?.length}
        sx={{ px: 4, mt: userAssociations.length === 0 ? 4 : 2 }} // Ajuste la marge supérieure
      >
        Valider toutes les associations
      </Button>

    </Box>
  );
}

export default AssociationQuestion;