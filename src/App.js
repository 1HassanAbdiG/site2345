import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importation des composants principaux
import Header from './Pages/header1';
import Footer from './Pages/footer1';
import Nav from './Pages/Nav';

// Importation des styles
import styles from './Pages/Accueil.module.css';

// Importation des pages principales
import Accueil from './Pages/Accueil';
import Francais from './Pages/Francais/Francais';
import Mathematiques from './Pages/maths/Mathematiques';
//import JeuEdu from './Pages/Jeu/jeu.jsx';

// Importation des exercices et jeux
//import Ex_conjuguaison from './Pages/Francais/conjuguaison/Ex_conjuguaison.jsx';
import WordPlayer from './Pages/Francais/dictée/dictee.jsx';
import Lecture from './Pages/Francais/francais/lecture';
import Conjugation from './Pages/conjuguaison/Conjugation';
import Grammaire from './Pages/grammaire/grammaire.jsx';
import IntruderExercise from './Pages/Francais/intrus/IntruderExercise';
//import Jeuhistoire from './Pages/OQRE/jeuHistoire.js';

// Importation des exercices de mathématiques
import FractionQuiz from './Pages/maths/FRACT/FractionQuiz.js';
import DecimauxExercice from './Pages/maths/decimaux/decimaux';
import DecimauxExercice1 from './Pages/maths/decimaux/decimaux Mult_Div.js';
import MainComponent from './Pages/maths/Monnaie/monnaie';
import MultipDiv from './Pages/maths/MultDic/multdiv.js';
import MainComponent1 from './Pages/maths/addsub/addsub';
import Suite from './Pages/maths/suite/suite1.jsx';

// Importation des histoires interactives
import TextReader from './Pages/Francais/TextAudio/tex1.js';
import InteractiveBook1 from './Pages/Francais/TextAudio/tex2.js';
import Histoires from './Pages/Francais/TextAudio/HISTOIRE/home.js';
import InteractiveBook3 from './Pages/Francais/TextAudio/chaperonR/tex3.js';
import InteractiveBook4 from './Pages/Francais/TextAudio/lepetit/tex4.js';
import InteractiveBook5 from './Pages/Francais/TextAudio/École/tex5.js';
import InteractiveBook6 from './Pages/Francais/TextAudio/GARCON/tex5.js';
import InteractiveBook7 from './Pages/Francais/TextAudio/Bons_Amis/tex10.js';
import InteractiveBook11 from './Pages/Francais/TextAudio/loe/tex4.js';

// Importation des jeux éducatifs
//import ConjugationGame from './Pages/Jeu/conjuguaison/ver.jsx';
//import Conj from './Pages/Francais/conjuguaison/conj.jsx';
//import Multip from './Pages/maths/multip.jsx';
//import About from './Pages/About.jsx';
//import ChatComponent from './ChatComponent.js';
//import Exercicegram from './Exercice de conjuguaison/exercice.jsx';
//import SyllableGame from './Pages/Francais/1eanné/SyllableGame.js';
import Exercice1e2e from './Pages/Francais/1eanné/1eannée/header.jsx';
import InteractiveBookTigre from './Pages/Francais/TextAudio/le_tigre_chacals/textigre.js';
import InteractiveBookBucheron from './Pages/Francais/TextAudio/le petit_bûcheron/bucheron.js';
import InteractiveBookLuna from './Pages/Francais/TextAudio/Le Voyage_Luna/texLuna.js';
//import Jeuhistoire2 from './Pages/Francais/jeuHistoire.js';
import Jeuhistoire4 from './Pages/Francais/Conctruction/jeuHistoire.js';
//import FractionExercises from './Pages/maths/FRACT/FractionQuiz.js';
import FractionsExercise222 from './Pages/OQRE/Maths/1e année/faction/faction.jsx';
//import MathExercisesPage from './Pages/maths/Math2025/MathsADSOU.jsx';
import AppDicte from './Pages/appdicte.jsx';
//import PreparationOQRE from './Oqre2025/oqre.jsx';
//import PreparationOQRE1 from './Oqre2025/oqre1.jsx';
//import EmojiMemoryGame from './Pages/Francais/1eanné/Memoire/EmojiMemoryGame.jsx';
//import MemoryGame from './Pages/Francais/1eanné/Memoire/MemoryGame.jsx';
//import PlantGamesContainer from './Pages/Francais/1eanné/1eannée/plante/planteExer.jsx';
//import PlantLesson from './Pages/Francais/1eanné/1eannée/plante/PlantLesson.jsx';
//import MathExercisesApp from './Oqre2025/Revision/MathExercises.jsx';
//import LectureApp from './Pages/Francais/1eanné/1eannée/corps/texteCorps/lecture/lectureapp.jsx';
//import Lecture2App from './Pages/Francais/1eanné/1eannée/corps/texteCorps/lecture/Lexture2App.jsx';
//import InteractiveLearningGame from './Pages/Francais/1eanné/1eannée/corps/texteCorps/lecture/lecture2e.jsx';
//import MathExerciseComponent from './Pages/OQRE/Maths/3eannée/exoqre.jsx';
//import MedalQuiz from './Test/exerciceH.jsx';
//import GrammarGame from './Pages/Jeu/gramm/gram.jsx';
//import DictationPage from './Pages/VIDEO/video_dictée.jsx';
import ComponentLoade from"./Pages/Francais/1eanné/GAME/Exercice1eannée/ComponentLoader.jsx"
import SelectionTest from './Oqre2025/OQRERESIVION/SelectionTest.jsx';

const App = () => {
  return (
    <Router>
      {/* En-tête fixe */}
      <Header />

      {/* Contenu principal avec navigation */}
      <div className={styles.container}>
        <Nav />
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Accueil />} />
          <Route path="/about" element={<Exercice1e2e />} />
          <Route path="/francais" element={<Francais />} />
          <Route path="/mathematiques" element={<Mathematiques />} />
          <Route path="/jeux" element={< SelectionTest />} />

          {/*<Route path="/Concours" element={<MathExerciseComponent/>} />*/}

          <Route path="/Concours" element={<AppDicte />} />
          {/*<Route path="/revision" element={<MathExercisesApp/>} />*/}
          <Route path="/revision" element={<ComponentLoade />} />


          {/* Exercices et jeux */}
          <Route path="/francais/dictee" element={<WordPlayer />} />

          <Route path="/francais/comprehension" element={<Lecture />} />
          <Route path="/francais/conjugaison" element={<Conjugation />} />
          <Route path="/francais/grammaire" element={<Grammaire />} />
          <Route path="/faction" element={<FractionQuiz />} />
          <Route path="/exerciseDecimaux" element={<DecimauxExercice />} />
          <Route path="/exerciseMultiplicationDivision" element={<DecimauxExercice1 />} />
          <Route path="/francais/intrus" element={<IntruderExercise />} />
          <Route path="/francais/construction" element={<Jeuhistoire4 />} />

          {/* Histoires interactives */}
          <Route path="/story/contes-africains" element={<TextReader />} />
          <Route path="/story/contes-princesses-princes" element={<InteractiveBook1 />} />
          <Route path="/story/chaperon" element={<InteractiveBook3 />} />
          <Route path="/story/enfant_coeur_pur" element={<InteractiveBook4 />} />
          <Route path="/story/ecole" element={<InteractiveBook5 />} />
          <Route path="/story/Le_Garçon_Courageux" element={<InteractiveBook6 />} />
          <Route path="/story/contes_tigre" element={<InteractiveBookTigre />} />
          <Route path="/story/bucheron" element={<InteractiveBookBucheron />} />
          <Route path="/story/Luna" element={<InteractiveBookLuna />} />





          <Route path="/story/Bons_Amis" element={<InteractiveBook7 />} />
          <Route path="/story/aventure_leo" element={<InteractiveBook11 />} />
          <Route path="/francais/histoire" element={<Histoires />} />

          {/* Exercices de mathématiques */}
          <Route path="/exerciseMonnaie" element={<MainComponent />} />
          <Route path="/multiplication" element={<MultipDiv />} />
          <Route path="/addSoustraction" element={<MainComponent1 />} />
          <Route path="/exerciseSuite" element={<Suite />} />

          {/* Jeux éducatifs */}
          <Route path="/jeu/jeu-conjugaison" element={<FractionsExercise222 />} />
          {/* <Route path="/jeu/jeu-grammaire" element={< DictationPage />} />*/}

        </Routes>
      </div>

      {/* Pied de page fixe */}
      <Footer />
    </Router>
  );
};

export default App;
