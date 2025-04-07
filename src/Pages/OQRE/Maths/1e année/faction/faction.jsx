import React, { useState } from 'react';





const FractionsExercise222 = () => {
    const [answers, setAnswers] = useState({
        q3: Array(4).fill(''),
        q4: Array(4).fill('')
    });

    const handleInputChange = (e, question, index) => {
        const newAnswers = { ...answers };
        newAnswers[question][index] = e.target.value;
        setAnswers(newAnswers);
    };

    return (
        <div className="p-4 space-y-8">
            <div>
                <h2 className="text-xl font-bold">1. Entoure les figures qui représentent <strong>3/8</strong> :</h2>
                <div className="grid grid-cols-4 gap-4 mt-2">
                    {/* Ajouter ici des images ou composants interactifs */}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold">2. Entoure les figures qui représentent <strong>2/7</strong> :</h2>
                <div className="grid grid-cols-4 gap-4 mt-2">
                    {/* Ajouter ici des images ou composants interactifs */}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold">3. Colorie les bandes de papier pour représenter les fractions demandées :</h2>
                {['2/6', '4/7', '1/3', '3/4'].map((fraction, index) => (
                    <div key={index} className="flex items-center mt-4">
                        <span className="w-20">{fraction}</span>
                        <input
                            type="text"
                            value={answers.q3[index]}
                            onChange={(e) => handleInputChange(e, 'q3', index)}
                            className="border rounded p-1 ml-2 w-40"
                        />
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-bold">4. Note sous chaque figure la fraction correspondant à la partie bleue :</h2>
                {Array(4).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center mt-4">
                        <input
                            type="text"
                            value={answers.q4[index]}
                            onChange={(e) => handleInputChange(e, 'q4', index)}
                            className="border rounded p-1 w-40"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FractionsExercise222;
