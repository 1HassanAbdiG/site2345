import { useRef } from "react"; // Importation du hook useRef pour référencer l'élément vidéo
import { Button, Box } from "@mui/material"; // Importation des composants Material-UI pour l'interface utilisateur
import { PlayArrow, Pause, Replay } from "@mui/icons-material"; // Importation des icônes Material-UI pour les boutons

// Définition du composant VideoPlayer
const VideoPlayer = () => {
  const videoRef = useRef(null); // Création d'une référence pour l'élément vidéo

  // Fonction pour démarrer la lecture de la vidéo
  const handlePlay = () => videoRef.current.play();

  // Fonction pour mettre la vidéo en pause
  const handlePause = () => videoRef.current.pause();
  
  // Fonction pour redémarrer la vidéo depuis le début
  const handleRestart = () => {
    videoRef.current.currentTime = 0; // Remet la vidéo au début
    videoRef.current.play(); // Redémarre la lecture automatiquement
  };

  return (
    // Conteneur principal avec du style pour centrer et embellir l'affichage
    <Box sx={{ textAlign: "center", maxWidth: 600, margin: "auto", p: 2, boxShadow: 3, borderRadius: 2 }}>
      
      {/* Élément vidéo avec un contrôle intégré */}
      <video ref={videoRef} width="100%" controls style={{ borderRadius: "8px" }}>
        <source src="/canva.mp4" type="video/mp4" />
        Your browser does not support the video tag. {/* Message affiché si le format vidéo n'est pas supporté */}
      </video>

      {/* Conteneur des boutons de contrôle avec un espacement entre eux */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        
        {/* Bouton pour démarrer la vidéo */}
        <Button variant="contained" color="primary" startIcon={<PlayArrow />} onClick={handlePlay}>
          Play
        </Button>

        {/* Bouton pour mettre en pause la vidéo */}
        <Button variant="contained" color="secondary" startIcon={<Pause />} onClick={handlePause}>
          Pause
        </Button>

        {/* Bouton pour redémarrer la vidéo */}
        <Button variant="contained" color="success" startIcon={<Replay />} onClick={handleRestart}>
          Restart
        </Button>

      </Box>
    </Box>
  );
};

export default VideoPlayer; // Exportation du composant pour l'utiliser ailleurs
