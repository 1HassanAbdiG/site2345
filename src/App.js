import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Pages/header1';
import Footer from './Pages/footer1';
import Accueil from './Pages/Accueil';
import Francais from './Pages/Francais/Francais';
import Dictation from './Pages/Francais/dictée/Dictation';
import Lecture from './Pages/Francais/francais/lecture';
import Nav from './Pages/Nav';
import styles from './Pages//Accueil.module.css';
import Conjugation from './Pages/conjuguaison/Conjugation';
import AdjectiveLesson from './Pages/grammaire/AdjectiveLesson';
import DecimauxExercice from './Pages/maths/decimaux/decimaux';
import Mathematiques from './Pages/maths/Mathematiques';
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


            <Route path="/francais/dictee" element={<Dictation />} />
            <Route path="/francais/comprehension" element={<Lecture />} />
            <Route path="/francais/conjugaison" element={<Conjugation />} />
            


            <Route path="/francais/grammaire" element={<AdjectiveLesson />} />
            <Route path="/exerciseDecimaux" element={<DecimauxExercice />} />











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
