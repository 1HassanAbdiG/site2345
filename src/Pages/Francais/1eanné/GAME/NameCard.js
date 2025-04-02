// src/NameCard.js
import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './data';
import Chip from '@mui/material/Chip'; // Importation du composant Chip

const NameCard = ({ id, name, isPlaced }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.NAME,
        item: { id, name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: !isPlaced,
    }));

    return (
        <Chip
            ref={drag} // Attache la référence de drag au Chip
            label={name}
            variant="outlined" // Style de Chip
            clickable // Indique qu'il est interactif
            sx={{ // Styles MUI via la prop sx
                cursor: isPlaced ? 'default' : 'move',
                opacity: isDragging || isPlaced ? 0.6 : 1,
                backgroundColor: isPlaced ? 'action.disabledBackground' : 'background.paper', // Couleurs du thème MUI
                borderColor: isPlaced ? 'action.disabled' : 'primary.main',
                color: isPlaced ? 'action.disabled' : 'text.primary',
                m: 0.5, // Marge autour du Chip (m: margin, 0.5 correspond à 4px par défaut)
                transition: 'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out',
                '&:hover': { // Style au survol (si pas déjà placé)
                    backgroundColor: !isPlaced ? 'action.hover' : undefined,
                }
            }}
        />
    );
};

export default NameCard;