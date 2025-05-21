import { useState } from 'react';
import DetectiveTextComponent from './DetectiveTextComponent';

// Structure modifiée pour inclure les titres
const jsonFiles = {
  "3e année": [
    { id: "json31", title: "Jouer aux détectives" },
   
  
  ],
  "6e année": [
    { id: "json61", title: "Le projet de Neva" },
    { id: "json62", title: "Le projet de Neva 2" },
   
  ]
};

export default function JsonViewer() {
  const [selectedNiveau, setSelectedNiveau] = useState("3e année");
  const [selectedFileId, setSelectedFileId] = useState("json31");
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await import(`./data/${selectedFileId}.json`);
      setQuestionsData(response.default);
    } catch (error) {
      console.error("Erreur de chargement :", error);
      setError("Fichier introuvable ou erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  // Trouver le fichier sélectionné
  const selectedFile = jsonFiles[selectedNiveau].find(file => file.id === selectedFileId);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Sélectionner un niveau</h2>
      <select 
        value={selectedNiveau} 
        onChange={(e) => {
          const niveau = e.target.value;
          setSelectedNiveau(niveau);
          setSelectedFileId(jsonFiles[niveau][0].id); // Prend le premier fichier du niveau
          setQuestionsData(null);
        }}
        style={{ padding: '8px', marginRight: '10px' }}
      >
        {Object.keys(jsonFiles).map(niveau => (
          <option key={niveau} value={niveau}>{niveau}</option>
        ))}
      </select>

      <h3>Textes disponibles</h3>
      <select 
        value={selectedFileId} 
        onChange={(e) => {
          setSelectedFileId(e.target.value);
          setQuestionsData(null);
        }}
        style={{ padding: '8px', marginRight: '10px' }}
      >
        {jsonFiles[selectedNiveau].map(file => (
          <option key={file.id} value={file.id}>
            {file.title}
          </option>
        ))}
      </select>

      <button 
        onClick={handleLoad}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Chargement...' : 'Charger le texte'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
      )}

      {questionsData && (
        <div style={{ marginTop: '20px' }}>
          <h2>{selectedFile?.title || questionsData.titre || selectedFileId}</h2>
          <DetectiveTextComponent questionsData={questionsData} />
        </div>
      )}
    </div>
  );
}