// Quiz.js
// Import React et les Hooks nécessaires (useState, useMemo)
import React, { useState, useMemo } from 'react';
// Remarque : useEffect n'est pas utilisé dans la logique actuelle, donc retiré

// Import Material UI components
import {
    Container,
    Paper,
    Typography,
    Box,
    LinearProgress,
    Fade // Pour les transitions
} from '@mui/material';

// Assurez-vous que 'types.json' est le bon nom de fichier et chemin
// La structure attendue est maintenant { titre: string, sections: [...] }
import quizData from './types.json'; // Renommé l'import en quizData pour correspondre à la structure JSON

// Importez tous les composants de question possibles
// IMPORTANT : Assurez-vous que ces chemins d'accès sont corrects
import VraiFauxQuestion from './VraiFauxQuestion';
import ChoixUniqueQuestion from './QuestionChoixUnique';
import ChoixMultipleQuestion from './QuestionChoixMultiple';
// CORRECTION : Correction du chemin d'accès pour ReponseCourteQuestion
import ReponseCourteQuestion from './QuestionReponseCourte'; // Assurez-vous que le fichier est nommé QuestionReponseCourte.js
import OrdreQuestion from './OrdreQuestion';
import AssociationQuestion from './AssociationQuestion';
import TexteTrouQuestion from './TexteTrouQuestion';
import DicteeQuestion from './DicteeQuestion';


import Bilan from './Bilan';

// Mappage des types de questions définis dans le JSON vers les composants React importés.
// On vérifie ici si l'import a réussi et que la variable du composant est bien définie.
const questionComponentMap = {
    'vrai_faux': VraiFauxQuestion,
    'choix_unique': ChoixUniqueQuestion,
    'choix_multiple': ChoixMultipleQuestion,
    'reponse_courte': ReponseCourteQuestion,
    'ordre': OrdreQuestion,
    'association': AssociationQuestion,
    'texte_a_trou': TexteTrouQuestion,
    'dictee': DicteeQuestion,
    // Note: Le type 'drawing' du JSON n'est PAS inclus ici car il n'y a pas de composant interactif.
    // Ajoutez d'autres types ici si nécessaire, en vous assurant d'importer le composant correspondant
};


function Quiz() {
    // CORRECTION : Déplacement du useMemo INSIDE du composant fonctionnel
    // Utilité pour aplatir la structure JSON imbriquée en une liste simple de questions
    // Cette liste sera utilisée pour le currentIndex et pour passer à Bilan
    const questionsDataFlat = useMemo(() => {
        const flatList = [];
        // Vérifier que quizData et sections existent avant de boucler
        if (quizData && Array.isArray(quizData.sections)) {
            quizData.sections.forEach(section => {
                // Vérifier que les exercices existent avant de boucler
                if (Array.isArray(section.exercices)) {
                    section.exercices.forEach(exercice => {
                        // N'inclut dans la liste plate que les exercices qui ont un type GÉRÉ
                        // ET qui contiennent un tableau de questions
                        if (questionComponentMap[exercice.type] && Array.isArray(exercice.questions)) {
                             // Chaque question dans l'exercice devient un élément distinct dans la liste aplatie
                             exercice.questions.forEach((question, index) => {
                                 // Ajoute toutes les propriétés de la question spécifique PLUS les métadonnées
                                 // de l'exercice et de la section.
                                 flatList.push({
                                     ...question, // Copie les props de la question (question, options, answer, pairs, etc.)
                                     type: exercice.type, // Ajoute le type (qui est au niveau de l'exercice dans le JSON)
                                     sectionOrder: section.sectionOrder,
                                     sectionTitle: section.sectionTitle,
                                     exerciseOrder: exercice.exerciseOrder,
                                     exerciseTitle: exercice.exerciseTitle,
                                     questionIndexInExercise: index // Index de la question dans son exercice (utile pour le Bilan)
                                 });
                             });
                        } else if (exercice.type && !questionComponentMap[exercice.type]) {
                             // Cas où un exercice a un type mais il n'est pas géré dans questionComponentMap
                             console.warn(`Exercice "${exercice.exerciseTitle}" (type: "${exercice.type}") skipped in interactive quiz (type not mapped).`);
                        } else if (Array.isArray(exercice.questions)) {
                              // Cas où un exercice a des questions mais un type inconnu ou pas de type
                               console.warn(`Exercice "${exercice.exerciseTitle}" skipped due to unknown type "${exercice.type}" or no questions array.`);
                        } else {
                             // Cas où un exercice n'a pas de tableau de questions
                             console.warn(`Exercice "${exercice.exerciseTitle}" has no 'questions' array.`);
                        }
                    });
                } else {
                     console.warn(`Section "${section.sectionTitle}" has no 'exercices' array.`);
                }
            });
        } else if (quizData) {
             console.error("Quiz data is not in the expected format { titre: ..., sections: [...] }");
        }
        return flatList;
    }, [quizData]); // Le useMemo dépend de quizData

    // currentIndex suit la position dans la liste aplatie questionsDataFlat
    const [currentIndex, setCurrentIndex] = useState(0);
    // results reste une liste plate alignée avec questionsDataFlat
    const [results, setResults] = useState([]);
    const [showBilan, setShowBilan] = useState(false);
    // Pour la transition de fondu
    const [isQuestionVisible, setIsQuestionVisible] = useState(true);

    // Utilise la liste aplatie pour obtenir la question courante
    const totalQuestions = questionsDataFlat.length;
    // question est l'objet de la liste aplatie à l'index courant
    const question = totalQuestions > currentIndex ? questionsDataFlat[currentIndex] : null;


    // Calcule la progression basée sur la liste aplatie
    const progressValue = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;

    // Gère la réponse d'une question (appelé par les composants enfants)
    const handleAnswer = ({ correct, userAnswer }) => {
        // Enregistre le résultat. L'index dans 'results' correspond à l'index dans 'questionsDataFlat'.
        // Avec l'ajout de l'état 'submitted' dans les composants enfants, chaque index ne devrait
        // être ajouté qu'une seule fois, évitant les résultats en double.
        setResults(prev => [...prev, { correct, userAnswer }]);

        // Démarre la transition de sortie pour la question actuelle
        setIsQuestionVisible(false);

        const nextIndex = currentIndex + 1;
        const delay = 300; // Durée de la transition de fondu

        // Après la transition...
        setTimeout(() => {
            if (nextIndex < totalQuestions) {
                // Passe à la question suivante dans la liste aplatie
                setCurrentIndex(nextIndex);
                // Démarre la transition d'entrée pour la nouvelle question
                setIsQuestionVisible(true);
            } else {
                // Toutes les questions ont été répondues, affiche le bilan
                setShowBilan(true);
                // Le bilan gérera sa propre transition (souvent, il apparaît juste)
            }
        }, delay);
    };

    // Gère le redémarrage du quiz
    const handleRestart = () => {
        // Démarre la transition de sortie (si on vient du bilan ou de la fin)
        setIsQuestionVisible(false); // Assurez-vous que le bilan est aussi masqué avant de redémarrer si nécessaire
         const delay = 300; // Correspond à la durée de fondu

        setTimeout(() => {
            setResults([]); // Réinitialise les résultats
            setCurrentIndex(0); // Retourne à la première question
            setShowBilan(false); // Masque le bilan
            setIsQuestionVisible(true); // Démarre la transition d'entrée pour la première question
        }, delay);
    };

    // --- Rendu des cas spéciaux (pas de données, etc.) ---

    // Gérer le cas où le fichier JSON n'a pas pu être chargé correctement ou est vide après aplatissement
    if (!quizData || !Array.isArray(quizData.sections) || totalQuestions === 0) {
         return (
             <Box
                 sx={{
                     minHeight: '100vh', // Prend toute la hauteur de la vue
                     bgcolor: 'grey.100', // Fond gris léger
                     py: 6, // Padding vertical
                     display: 'flex', // Utilise flexbox
                     justifyContent: 'center', // Centre horizontalement
                     alignItems: 'center' // Centre verticalement
                 }}
             >
                 <Container maxWidth="sm"> {/* Conteneur pour limiter la largeur */}
                     <Paper elevation={5} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}> {/* Carte avec ombre, padding, bords arrondis */}
                         <Typography variant="h6" color="text.secondary">
                             {/* Message spécifique si pas de données */}
                             {quizData && !Array.isArray(quizData.sections) ?
                                 "Les données du quiz ne sont pas au format attendu." :
                                 "Aucune question interactive disponible pour le moment."
                             }
                         </Typography>
                     </Paper>
                 </Container>
             </Box>
         );
    }

    // --- Déterminer le composant de question à afficher ---
    let currentQuestionComponent = null;

    // Afficher une question seulement si showBilan est faux ET que la question courante existe
    if (!showBilan && question) {
        // Le type est maintenant dans l'objet 'question' (qui vient de la liste aplatie)
        const QuestionComponent = questionComponentMap[question.type];

        // Vérifier si un composant React valide existe pour ce type
        if (typeof QuestionComponent === 'function') {
            // Si valide, créer l'élément du composant avec les props nécessaires
            currentQuestionComponent = <QuestionComponent question={question} onAnswer={handleAnswer} />;
        } else {
            // Si le type est dans les données mais qu'il n'y a pas de composant mappé ou qu'il n'est pas une fonction valide
             currentQuestionComponent = (
                <Typography color="error" align="center">
                    Erreur : Type de question "{question.type}" dans les données du quiz non reconnu ou composant associé manquant.
                </Typography>
            );
            console.error(`Type de question non géré ou composant manquant : "${question.type}". Vérifiez questionComponentMap et les imports.`);
        }
    } else if (!showBilan && !question && currentIndex < totalQuestions) {
         // Ce cas ne devrait pas arriver si la logique d'aplatissement est correcte (currentIndex valide mais question absente),
         // mais c'est une sécurité.
         currentQuestionComponent = (
               <Typography color="error" align="center">
                   Erreur interne : Impossible de charger les données de la question {currentIndex + 1} (sur {totalQuestions}).
               </Typography>
           );
            console.error(`questionsDataFlat[${currentIndex}] is null or undefined but currentIndex (${currentIndex}) < totalQuestions (${totalQuestions}).`);
    }


    // --- Rendre le Bilan si showBilan est vrai ---
    if (showBilan) {
         return (
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'grey.100',
                    py: 6,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
             >
               {/* La transition s'applique au conteneur du Bilan */}
               <Fade in={showBilan} timeout={500}>
                 <Box sx={{ width: '100%', maxWidth: 800 }}> {/* Ajustez la largeur max pour le bilan */}
                    {/* Passe les résultats ET la LISTE APLATIE de questions au Bilan */}
                    {/* Passe aussi le titre global du quiz */}
                    <Bilan results={results} questionsData={questionsDataFlat} onRestart={handleRestart} quizTitle={quizData.titre} />
                 </Box>
               </Fade>
             </Box>
         );
    }


    // --- Rendre la structure principale du quiz pendant la phase de question ---
    return (
        <Box
            sx={{
                minHeight: '100vh', // Fond sur toute la hauteur
                bgcolor: 'grey.100',
                py: 6 // Padding vertical
            }}
        >
            <Container maxWidth="md"> {/* Largeur limitée */}
                <Paper
                    elevation={8} // Ombre plus prononcée
                    sx={{
                        p: 0, // Pas de padding sur le papier lui-même
                        borderRadius: 3, // Bords plus arrondis
                        overflow: 'hidden', // S'assure que les enfants respectent les bords arrondis
                        display: 'flex', // Utilise flexbox pour l'organisation interne
                        flexDirection: 'column', // Empile verticalement
                        minHeight: 600, // Hauteur minimale pour un look constant
                    }}
                >
                    {/* Section Entête - n'afficher que si on affiche une question */}
                    {!showBilan && question && (
                        <Box
                            sx={{
                                bgcolor: 'primary.dark', // Couleur de fond de l'entête
                                color: 'primary.contrastText', // Couleur du texte de l'entête
                                p: 3, // Padding interne
                                textAlign: 'center', // Centre le texte
                                borderTopLeftRadius: 10, // Bords arrondis pour le haut
                                borderTopRightRadius: 10,
                                display: 'flex', // Utilise flexbox
                                flexDirection: 'column', // Empile les éléments de l'entête
                                gap: 1 // Espace entre les éléments de l'entête
                            }}
                        >
                            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
                                {/* Affiche le titre du quiz depuis les données JSON */}
                                {quizData.titre || "Quiz Interactif"}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ width: '70%', flexGrow: 1 }}> {/* La barre de progression prend de l'espace */}
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressValue} // Valeur calculée
                                        sx={{
                                            height: 14, // Épaisseur de la barre
                                            borderRadius: 7, // Bords arrondis
                                            bgcolor: 'rgba(255,255,255,0.4)', // Couleur de fond de la piste
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: 'secondary.main' // Couleur de la barre de progression
                                            }
                                        }}
                                    />
                                </Box>
                                {/* Afficher le compteur seulement s'il y a des questions */}
                                {totalQuestions > 0 && (
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexShrink: 0 }}> {/* Empêche le compteur de rétrécir */}
                                        Question {currentIndex + 1} / {totalQuestions} {/* Affiche la progression */}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Section Contenu Principal (Question) */}
                    <Box
                        sx={{
                            p: 4, // Padding interne
                            flexGrow: 1, // Prend l'espace restant
                            display: 'flex',
                            flexDirection: 'column', // Empile le contenu si besoin
                            justifyContent: 'center', // Centre verticalement
                            alignItems: 'center', // Centre horizontalement
                            textAlign: 'center', // Centre le texte
                        }}
                    >
                         {/* Applique la transition de fondu au conteneur du composant de question */}
                         <Fade in={isQuestionVisible} timeout={500}>
                            {/* Conteneur pour le composant de question, limite sa largeur max */}
                            <Box sx={{ width: '100%', maxWidth: 600 }}>
                                 {/* Rend le composant de question déterminé par le switch ou le message d'erreur */}
                                 {currentQuestionComponent}
                            </Box>
                         </Fade>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}

export default Quiz;