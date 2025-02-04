import React from 'react';
import { Link } from 'react-router-dom';

const ProgramContent = ({ sections }) => {
  const openPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank'); // Ouvre le PDF dans un nouvel onglet
  };

  return (
    <div>
      {sections.map((section) => (
        <div key={section.id}>
          <h2>{section.title}</h2>
          {section.topics.map((topic, index) => (
            <div key={index}>
              <h3>{topic.name}</h3>
              <button onClick={() => openPDF(topic.pdf)}>Open PDF</button>
            </div>
          ))}
          <h4>Tests</h4>
          {section.tests.map((test, index) => (
            <div key={index}>
              <button onClick={() => openPDF(test.pdf)}>{test.name}</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProgramContent;
