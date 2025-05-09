// src/data.js

// --- Placeholder Data ---
// Replace with actual URLs if you have them
const placeholderAudioBase = "/audio/"; // Assuming audio files are in public/audio
const placeholderImageBase = "/images/"; // Assuming images are in public/images

export const readingData = {
  debutant: {
    id: 'debutant',
    label: 'Débutant',
    title: 'Débutants: Le corps et les sens',
    text: `Notre corps a la tête, les bras, les jambes et le tronc.\nAvec les yeux, on voit.\nAvec le nez, on sent.\nAvec les oreilles, on entend.\nAvec la bouche, on goûte.\nAvec les mains, on touche.`,
    audioSrc: `${placeholderAudioBase}debutant_corps_sens.mp3`, // Replace with actual path
    questions: [
      "Quelles sont les parties principales du corps mentionnées ?",
      "Avec quoi voit-on ?",
      "Avec quoi sent-on ?",
      "Que fait-on avec les oreilles ?",
      "Que fait-on avec les mains ?",
    ],
    syllableWords: [
      { id: 'syl-tete', word: 'tête', syllables: ['Tê', 'te'], imageUrl: `${placeholderImageBase}tete.png`, syllableCount: 2 },
      { id: 'syl-nez', word: 'nez', syllables: ['Nez'], imageUrl: `${placeholderImageBase}nez.png`, syllableCount: 1 },
      { id: 'syl-mains', word: 'mains', syllables: ['Mains'], imageUrl: `${placeholderImageBase}mains.png`, syllableCount: 1 },
      { id: 'syl-bouche', word: 'bouche', syllables: ['Bou', 'che'], imageUrl: `${placeholderImageBase}bouche.png`, syllableCount: 2 },
    ],
  },
  intermediaire: {
    id: 'intermediaire',
    label: 'Intermédiaire',
    title: 'Intermédiaires: Les parties du corps et nos sens',
    text: `Le corps est composé de la tête, du tronc, des bras et des jambes.\nSur la tête, il y a : les yeux pour voir, le nez pour sentir, les oreilles pour entendre, la bouche pour goûter.\nAvec nos mains, nous pouvons toucher les objets.`,
    audioSrc: `${placeholderAudioBase}intermediaire_corps_sens.mp3`, // Replace with actual path
    questions: [
      "De quoi est composé le corps ?",
      "Où se trouvent les yeux, le nez, les oreilles et la bouche ?",
      "À quoi servent les yeux ?",
      "À quoi sert le nez ?",
      "Que peut-on faire avec les mains ?",
    ],
     syllableWords: [
      { id: 'syl-oreilles', word: 'oreilles', syllables: ['O', 'reil', 'les'], imageUrl: `${placeholderImageBase}oreilles.png`, syllableCount: 3 },
      { id: 'syl-jambes', word: 'jambes', syllables: ['Jam', 'bes'], imageUrl: `${placeholderImageBase}jambes.png`, syllableCount: 2 },
      { id: 'syl-objets', word: 'objets', syllables: ['Ob', 'jets'], imageUrl: `${placeholderImageBase}objets.png`, syllableCount: 2 },
      { id: 'syl-corps', word: 'corps', syllables: ['Corps'], imageUrl: `${placeholderImageBase}corps.png`, syllableCount: 1 },
    ],
  },
  avance: {
    id: 'avance',
    label: 'Avancé',
    title: 'Avancés: Le corps humain et ses cinq sens',
    text: `Notre corps est divisé en plusieurs parties : la tête, le tronc, les bras et les jambes.\nLa tête porte les yeux, qui nous permettent de voir.\nLe nez sert à sentir les odeurs.\nLes oreilles nous aident à entendre les sons.\nLa bouche est utilisée pour goûter les aliments avec la langue.\nGrâce aux mains, nous pouvons toucher et sentir les formes et les textures.`,
    audioSrc: null, // No audio for advanced
    questions: [
      "Comment le texte divise-t-il le corps humain ?",
      "Quelle est la fonction principale des yeux mentionnée ?",
      "Comment le nez nous aide-t-il ?",
      "Quelle partie de la bouche est mentionnée pour goûter ?",
      "Quelles capacités des mains sont décrites dans le texte ?",
    ],
    syllableWords: null, // No syllable exercise for advanced
  },
};