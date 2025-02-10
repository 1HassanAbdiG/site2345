import React, { useState } from 'react';
import {
    Container, Typography, Box, Button, Card, List, ListItem, ListItemText, Divider, Grid, Drawer, IconButton
} from "@mui/material";
import styles from './programme.module.css';  // Import CSS module for styling

import YouTube from 'react-youtube';  // Import YouTube component for embedding videos
import CombinedGame from '../jeu/francais/conjuguaison/compo/jeuduc';  // Import a specific game component
import Placer_Val from '../jeu/maths/placer_val';  // Import another game component

const Programme = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programData, setProgramData] = useState(null);
    const [error, setError] = useState(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [videoId, setVideoId] = useState('');
    const [activeComponentKey, setActiveComponentKey] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    const [selectedYear, setSelectedYear] = useState(2); // Default year

    const years = [2, 3, 4, 5, 6, 7, 8, 9];

    const handleNextYear = () => {
        setSelectedYear((prevYear) => {
            const currentIndex = years.indexOf(prevYear);
            return years[(currentIndex + 1) % years.length]; // Move to the next year
        });
    };

    // Mapping routes to components for dynamic rendering of game components
    const componentMap = {
        "/jeuSuJVerb": "CombinedGame",
        "/jeuPlacer_Val": "Placer_Val",
    };

    const handleGameLinkClick = (link) => {
        if (componentMap[link]) {
            setActiveComponentKey(componentMap[link]);
        } else {
            setActiveComponentKey(null); // Hide component if link doesn't match
        }
    };

    const renderActiveComponent = () => {
        switch (activeComponentKey) {
            case "CombinedGame":
                return <CombinedGame />;
            case "Placer_Val":
                return <Placer_Val />;
            default:
                return null;
        }
    };

    const cacher = () => {
        setIsVisible(!isVisible);
    };

    const subjects = ['maths', 'francais', 'science'];

    const loadProgramData = async (subject) => {
        try {
            const data = await import(`../json/${subject}_${selectedYear}.json`);
            setProgramData(data.programme);
            setError(null);
        } catch (error) {
            console.error('Erreur de chargement des données:', error);
            setProgramData(null);
            setError(`Aucun programme trouvé pour ${subject}`);
        }
    };

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setSelectedProgram(null);
        setActiveComponentKey(null); // Reset active component when subject changes
        loadProgramData(subject);
    };

    const selectProgram = (index) => {
        setSelectedProgram(selectedProgram === index ? null : index);
        setActiveComponentKey(null); // Ensure no active component when selecting a new program
    };

    const openVideo = (url) => {
        const videoId = url.split('v=')[1]; // Extract the video ID from the URL
        setVideoId(videoId);
        setIsVideoOpen(true);
    };

    const closeVideo = () => {
        setIsVideoOpen(false);
        setVideoId('');
    };

    const renderProgramDetails = (programData) => (
        selectedProgram !== null ? (
            <>
                <h3>{programData[selectedProgram].title}</h3>
                <ul>
                    {programData[selectedProgram].sousTitre.map((subtitle, i) => (
                        <li key={i}>
                            <a href={programData[selectedProgram].pdfLinks[i]} target="_blank" rel="noopener noreferrer">
                                {i} - {subtitle}
                            </a>
                        </li>
                    ))}
                </ul>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "60%" }}>Points importants</th>
                            <th>Évaluation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{programData[selectedProgram].pointsImportants}</td>
                            <td>
                                <ul>
                                    {Array.isArray(programData[selectedProgram].evaluation) ? (
                                        programData[selectedProgram].evaluation.map((evalItem, idx) => (
                                            <li key={idx}>{evalItem}</li>
                                        ))
                                    ) : (
                                        <li>{programData[selectedProgram].evaluation}</li>
                                    )}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h4>Jeux associés</h4>
                {programData[selectedProgram].lien && (
                    <button
                        onClick={() => handleGameLinkClick(programData[selectedProgram].lien)}
                        style={{
                            backgroundColor: '#9a8272', // Dominant brown color
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6E3D1B'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
                    >
                        Lancer le jeu
                    </button>
                )}
                <div className={styles.activeComponent}>
                    {renderActiveComponent()}
                </div>

                {programData[selectedProgram].videos && (
                    <div className={styles.videoSection}>
                        <h4>Vidéos associées</h4>
                        <div className={styles.videoGrid}>
                            {programData[selectedProgram].videos.map((video, idx) => (
                                <div key={idx} className={styles.videoCard}>
                                    <div className={styles.thumbnail}>
                                        <img src={`https://img.youtube.com/vi/${video.videoLink.split('v=')[1]}/0.jpg`} alt="Thumbnail" />
                                    </div>
                                    <div className={styles.videoInfo}>
                                        <span className={styles.videoTitle}>{video.title}</span>
                                        <button
                                            onClick={() => openVideo(video.videoLink)}
                                            className={styles.watchButton}
                                        >
                                            Visionner la vidéo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <br></br>
                    </div>
                )}
            </>
        ) : (
            <div>
                <h2>Contenu du Cours</h2>
                <p>Sélectionnez un programme pour voir les détails.</p>
            </div>
        )
    );

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setSelectedProgram(null);  // Clear selected program when changing year
        setProgramData(null); // Clear the program data when year changes
    };

    return (
        <div className={styles.body}>
            <Box textAlign="center" mb={3}>
                {[2, 3, 4, 5, 6, 7, 8, 9].map((year) => (
                    <Button
                        key={year}
                        onClick={() => handleYearChange(year)}
                        sx={{
                            m: 1,
                            px: 2,
                            py: 1,
                            bgcolor: selectedYear === year ? "#FFD700" : "#333333",
                            color: selectedYear === year ? "black" : "white",
                            "&:hover": { bgcolor: "#FFA500" },
                            borderRadius: "8px",
                            fontWeight: "bold",
                            transition: "transform 0.2s",
                            transform: selectedYear === year ? "scale(1.1)" : "scale(1)"
                        }}
                    >
                        {year}e année
                    </Button>
                ))}
            </Box>

            <div className={styles.header}>
                <div className={styles.Content1}>
                    <h1 style={{ color: "red" }}>Programme d'Études - {selectedYear} Année</h1>
                    <p>Sélectionnez une matière pour voir le programme détaillé.</p>
                </div>
            </div>

            <div className={styles.navButtons}>
                {subjects.map(subject => (
                    <button
                        key={subject}
                        className={styles.navButton}
                        onClick={() => handleSubjectChange(subject)}
                    >
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </button>
                ))}
            </div>

            <div className={styles.container}>
                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                    </div>
                )}
                {programData && !error && (
                    <div className={styles.programList}>
                        <h2>Programme de {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} - {selectedYear} Année</h2>
                        {programData.map((item, index) => (
                            <button key={index} className={styles.programButton} onClick={() => selectProgram(index)}>
                                {item.title}
                            </button>
                        ))}
                    </div>
                )}

                <div className={styles.programDetails}>
                    {programData && !error && renderProgramDetails(programData)}

                    {isVideoOpen && (
                        <div className={styles.videoModal}>
                            <div className={styles.closeButton} onClick={closeVideo}>
                                X
                            </div>
                            <YouTube videoId={videoId} opts={{ width: "100%", height: "400px" }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Programme;
