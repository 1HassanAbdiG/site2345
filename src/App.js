import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Pages/header1';
import Footer from './Pages/footer1';
import Accueil from './Pages/Accueil';
import Francais from './Pages/Francais/Francais';
//import Dictation from './Pages/Francais/dictée/Dictation';
import Lecture from './Pages/Francais/francais/lecture';
import Nav from './Pages/Nav';
import styles from './Pages//Accueil.module.css';
import Conjugation from './Pages/conjuguaison/Conjugation';
//import AdjectiveLesson from './Pages/grammaire/AdjectiveLesson';
import DecimauxExercice from './Pages/maths/decimaux/decimaux';
import Mathematiques from './Pages/maths/Mathematiques';
import IntruderExercise from './Pages/Francais/intrus/IntruderExercise';
//import PhraseBuilder from './Pages/PhraseBuilder';
//import MoneyExercise from './Pages/maths/Monnaie/MoneyExercise';
//import Exercice from './Pages/maths/entre/exercice';
//import MoneyExerciseList from './Pages/maths/Monnaie/page';
import MainComponent from './Pages/maths/Monnaie/monnaie';
//import Math3e from './Pages/maths/addsub/MathsAddSub';
import MainComponent1 from './Pages/maths/addsub/addsub';
import TextReader from './Pages/Francais/TextAudio/tex1.js';
import MultipDiv from './Pages/maths/MultDic/multdiv.js';
import InteractiveBook1 from './Pages/Francais/TextAudio/tex2.js';
import Histoires from './Pages/Francais/TextAudio/HISTOIRE/home.js';
import InteractiveBook3 from './Pages/Francais/TextAudio/chaperonR/tex3.js';
import InteractiveBook4 from './Pages/Francais/TextAudio/lepetit/tex4.js';
import InteractiveBook5 from './Pages/Francais/TextAudio/École/tex5.js';
import InteractiveBook6 from './Pages/Francais/TextAudio/GARCON/tex5.js';
import Suite from './Pages/maths/suite/suite1.jsx';
import FractionQuiz from './Pages/maths/FRACT/FractionQuiz.js';
import WordPlayer from './Pages/Francais/dictée/dictee.jsx';
import Jeuhistoire from './Pages/OQRE/jeuHistoire.js';
import InteractiveBook7 from './Pages/Francais/TextAudio/Bons_Amis/tex10.js';
import InteractiveBook11 from './Pages/Francais/TextAudio/loe/tex4.js';

import Grammaire from './Pages/grammaire/grammaire.jsx';
//import Conjugation1 from './Pages/conjuguaison/conjugaison1';
//import ConjugationPractice from './Pages/conjuguaison/conjugaison1';

const App = () => {
  return (

    <Router>
      <div className="app">
        {/* Fixed header */}
        <Header />

        {/* Main content area */}
        <div className={styles.container}>

          <Nav></Nav>


          <Routes>

            <Route path="/" element={<Accueil />} />
            <Route path="/francais" element={<Francais />} />
            <Route path="/mathematiques" element={<Mathematiques />} />


            <Route path="/francais/dictee" element={< WordPlayer/>} />
            <Route path="/francais/comprehension" element={<Lecture />} />
            <Route path="/francais/conjugaison" element={<Conjugation />} />



            <Route path="/francais/grammaire" element={<Grammaire />} />
            <Route path="/faction" element={<FractionQuiz />} />
            <Route path="/exerciseDecimaux" element={<DecimauxExercice />} />
            
            <Route path="/francais/intrus" element={<IntruderExercise />} />
            <Route path="/francais/construction" element={<Jeuhistoire />} />
            






            <Route path="/story/contes-africains" element={<TextReader />} />
            <Route path="/story/contes-princesses-princes" element={<InteractiveBook1 />} />
            <Route path="/story/chaperon" element={<InteractiveBook3 />} />
            <Route path="/story/enfant_coeur_pur" element={<InteractiveBook4 />} />
            <Route path="/story/ecole" element={<InteractiveBook5 />} />
            <Route path="/story/Le_Garçon_Courageux" element={<InteractiveBook6 />} />
            <Route path="/story/Bons_Amis" element={< InteractiveBook7/>} />
            <Route path="/story/aventure_leo" element={< InteractiveBook11/>} />
            
            
            
            


            <Route path="/francais/histoire" element={<Histoires />} />
            <Route path="/exerciseMonnaie" element={<MainComponent />} />
            <Route path="/multiplication" element={<MultipDiv />} />
            {/*<Route path="/addSoustraction" element={< Math3e/>} />*/}
            <Route path="/addSoustraction" element={<MainComponent1 />} />
            <Route path="/exerciseSuite" element={<Suite />} />
            
















            {/* Add more routes here */}
          </Routes>
        </div>

        {/* Fixed footer */}
        <Footer />
      </div>
    </Router>

  );
};

export default App;
