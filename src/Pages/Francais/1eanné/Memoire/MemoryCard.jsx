// src/components/MemoryCard.js
// Ou src/Pages/Francais/1eanné/Memoire/MemoryCard.jsx (si co-localisé avec MemoryGame.jsx)
import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

const MemoryCard = ({ card, isFlipped, onClick }) => {
  
  // --- STYLES CONFIGURABLES POUR LA CARTE ET L'IMAGE ---
  // Ces valeurs ont été ajustées pour agrandir la carte.
  // ==================================================
  const cardWidth = 150;    // Largeur de la carte
  const cardHeight = 180;   // Hauteur de la carte
  const imageHeight = 110;  // Hauteur allouée pour l'image dans la carte
  // ==================================================
  // --- FIN DES STYLES CONFIGURABLES ---

  const cardContent = isFlipped ? (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', // Centre verticalement si l'espace le permet
        height: '100%',
        p: 0.5 // Petit padding intérieur
      }}
    >
      <Box 
        sx={{ 
          width: '100%',
          height: `${imageHeight}px`, // Hauteur fixe pour la zone de l'image
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          mb: 0.5 // Petit espace entre l'image et le texte
        }}
      >
        <img
          src={card.displayImageUrl}
          alt={card.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%', 
            objectFit: 'contain', 
            display: 'block' // Pour éviter l'espace sous l'image
          }}
        />
      </Box>
      <Typography 
        variant="caption" 
        display="block" 
        sx={{ 
          mt: 'auto', // Pousse le texte vers le bas s'il y a de l'espace
          textAlign: 'center',
          width: '100%',
          lineHeight: 1.2, // Ajustement de l'interligne pour les noms longs
          // fontSize: '0.8rem', // Décommentez et ajustez si une taille de police plus grande est souhaitée
        }}
        noWrap={false} // Permet au texte de passer à la ligne si nécessaire
      >
        {card.name}
      </Typography>
    </Box>
  ) : (
    <Typography 
        variant="h1" // Taille du '❓' (peut être ajustée si besoin)
        component="div" // Pour une sémantique correcte, Typography rend un <p> par défaut
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            userSelect: 'none' // Empêche la sélection du texte du point d'interrogation
        }}
    >
      ❓
    </Typography>
  );

  return (
    <Card
      onClick={onClick}
      sx={{
        width: cardWidth,
        height: cardHeight,
        margin: 1, // theme.spacing(1) = 8px par défaut. Contribue à l'espacement total.
        cursor: 'pointer',
        backgroundColor: isFlipped ? '#fff' : '#e0e0e0',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        transformOrigin: 'center',
        '&:hover': {
            transform: !isFlipped ? 'scale(1.03)' : 'none',
        },
        display: 'flex', // Ajouté pour s'assurer que CardActionArea remplit la Card
        flexDirection: 'column' // Ajouté
      }}
    >
      <CardActionArea sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}> {/* display flex pour que CardContent s'étende */}
        <CardContent 
          sx={{ 
            width: '100%', 
            height: '100%', // S'assure que le contenu remplit la zone d'action
            p: 0, // Padding géré par le Box intérieur pour le contenu retourné
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Centre le '❓' ou le contenu de la carte retournée
            alignItems: 'center',
            boxSizing: 'border-box' // Pour inclure padding/border dans width/height
          }}
        >
          {cardContent}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MemoryCard;