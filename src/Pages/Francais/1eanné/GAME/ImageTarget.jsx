// src/ImageTarget.js
import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './data';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icône succès
import CancelIcon from '@mui/icons-material/Cancel'; // Icône erreur
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Icône placeholder

const ImageTarget = ({ id, image, correctName, onDrop, droppedItem, isCorrect }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.NAME,
    drop: (item) => onDrop(id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  let borderColor = 'grey.400'; // Bordure par défaut
  let overlayBg = 'transparent';

  if (isCorrect) {
    borderColor = 'success.main'; // Vert MUI si correct
    overlayBg = 'rgba(102, 187, 106, 0.1)'; // Léger fond vert
  } else if (droppedItem && !isCorrect) {
    borderColor = 'error.main'; // Rouge MUI si incorrect
    overlayBg = 'rgba(239, 83, 80, 0.1)'; // Léger fond rouge
  } else if (isOver && canDrop) {
    borderColor = 'primary.main'; // Bleu MUI quand on survole
    overlayBg = 'rgba(25, 118, 210, 0.1)'; // Léger fond bleu
  }

  const hasImage = image && image !== '';

  return (
    <Card
      ref={drop} // Attache la référence de drop à la Card
      sx={{
        width: 150,
        height: 180, // Légèrement plus haute pour le nom en bas
        m: 1, // Marge autour
        border: `3px dashed ${borderColor}`, // Utilise les couleurs du thème
        transition: 'border-color 0.3s ease, background-color 0.3s ease',
        position: 'relative', // Pour positionner le nom déposé
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: overlayBg, // Fond léger basé sur l'état
        overflow: 'hidden', // Cache ce qui dépasse
      }}
    >
      {hasImage ? (
        <CardMedia
          component="img"
          image={image}
          alt={`Image pour ${correctName}`}
          sx={{
            maxHeight: '140px', // Limite la hauteur de l'image
            width: 'auto', // Ajuste la largeur automatiquement
            maxWidth: '100%',
            objectFit: 'contain', // S'assure que l'image entière est visible
            mt: droppedItem ? 0 : 'auto', // Centre verticalement si pas de nom déposé
            mb: droppedItem ? '5px' : 'auto',
          }}
          // Gestion d'erreur simple si l'image ne charge pas
          onError={(e) => {
            e.target.style.display = 'none'; // Cache l'élément img cassé
            // On pourrait afficher un placeholder ici si besoin
            const placeholder = e.target.nextElementSibling;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
      ) : null}
      {/* Placeholder si l'image ne charge pas ou non fournie */}
      <Box
        sx={{
          display: hasImage ? 'none' : 'flex', // Affiché si pas d'image
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          color: 'text.secondary',
          textAlign: 'center',
          p: 1
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="caption">Image de {correctName}</Typography>
      </Box>

      {/* Affiche le nom déposé en bas */}
      {droppedItem && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 5,
            left: 5,
            right: 5,
            p: 0.5,
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5, // Espace entre le nom et l'icône
            boxShadow: 1, // Légère ombre
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: isCorrect ? 'success.dark' : 'error.dark' }}>
            {droppedItem.name}
          </Typography>
          {isCorrect ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <CancelIcon color="error" fontSize="small" />
          )}
        </Box>
      )}
    </Card>
  );
};

export default ImageTarget;