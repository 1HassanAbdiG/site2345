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
import JeuEdu from './Pages/Jeu/jeu.jsx';

// Importation des exercices et jeux
//import Ex_conjuguaison from './Pages/Francais/conjuguaison/Ex_conjuguaison.jsx';
import WordPlayer from './Pages/Francais/dictée/dictee.jsx';
import Lecture from './Pages/Francais/francais/lecture';
import Conjugation from './Pages/conjuguaison/Conjugation';
import Grammaire from './Pages/grammaire/grammaire.jsx';
import IntruderExercise from './Pages/Francais/intrus/IntruderExercise';
import Jeuhistoire from './Pages/OQRE/jeuHistoire.js';

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
import ConjugationGame from './Pages/Jeu/conjuguaison/ver.jsx';
//import GrammarGame from './Pages/Jeu/gramm/gram.jsx';
//import DictationPage from './Pages/VIDEO/video_dictée.jsx';

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
          <Route path="/francais" element={<Francais />} />
          <Route path="/mathematiques" element={<Mathematiques />} />
          <Route path="/jeux" element={<JeuEdu />} />

          {/* Exercices et jeux */}
          <Route path="/francais/dictee" element={<WordPlayer />} />
          <Route path="/francais/comprehension" element={<Lecture />} />
          <Route path="/francais/conjugaison" element={<Conjugation />} />
          <Route path="/francais/grammaire" element={<Grammaire />} />
          <Route path="/faction" element={<FractionQuiz />} />
          <Route path="/exerciseDecimaux" element={<DecimauxExercice />} />
          <Route path="/exerciseMultiplicationDivision" element={<DecimauxExercice1 />} />
          <Route path="/francais/intrus" element={<IntruderExercise />} />
          <Route path="/francais/construction" element={<Jeuhistoire />} />

          {/* Histoires interactives */}
          <Route path="/story/contes-africains" element={<TextReader />} />
          <Route path="/story/contes-princesses-princes" element={<InteractiveBook1 />} />
          <Route path="/story/chaperon" element={<InteractiveBook3 />} />
          <Route path="/story/enfant_coeur_pur" element={<InteractiveBook4 />} />
          <Route path="/story/ecole" element={<InteractiveBook5 />} />
          <Route path="/story/Le_Garçon_Courageux" element={<InteractiveBook6 />} />
          <Route path="/story/Bons_Amis" element={<InteractiveBook7 />} />
          <Route path="/story/aventure_leo" element={<InteractiveBook11 />} />
          <Route path="/francais/histoire" element={<Histoires />} />

          {/* Exercices de mathématiques */}
          <Route path="/exerciseMonnaie" element={<MainComponent />} />
          <Route path="/multiplication" element={<MultipDiv />} />
          <Route path="/addSoustraction" element={<MainComponent1 />} />
          <Route path="/exerciseSuite" element={<Suite />} />

          {/* Jeux éducatifs */}
          <Route path="/jeu/jeu-conjugaison" element={<ConjugationGame />} />
         {/* <Route path="/jeu/jeu-grammaire" element={< DictationPage />} />*/}
          
        </Routes>
      </div>

      {/* Pied de page fixe */}
      <Footer />
    </Router>
  );
};

export default App;
