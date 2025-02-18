import React, { useState, useEffect, useRef } from "react";
import { Box, Select, MenuItem, Typography, Card, CardMedia, CardContent } from "@mui/material";
import dictations from "./video.json"; // Import du JSON

const DictationPage = () => {
    const [selectedLevel, setSelectedLevel] = useState("1re année");
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const videoPlayerRef = useRef(null);
    const [canPlay, setCanPlay] = useState(false);

    useEffect(() => {
        const selected = dictations.levels.find((l) => l.level === selectedLevel);
        setVideos(selected ? selected.videos : []);
        setSelectedVideo(null); // Réinitialiser la vidéo sélectionnée
        setIsPlaying(false);
        setIsLoading(false);
        setCanPlay(false);
    }, [selectedLevel]);

    const startVideo = (video) => {
        if (!video.url) {
            alert("⛔ La vidéo n'est pas disponible !");
            return;
        }

        if (videoPlayerRef.current) {
            videoPlayerRef.current.pause();
            videoPlayerRef.current.currentTime = 0; 
        }

        setIsLoading(true);
        setSelectedVideo(video);
        setIsPlaying(false);
        setCanPlay(false);
    };

    useEffect(() => {
        if (selectedVideo && !isPlaying && videoPlayerRef.current) {
            const videoElement = videoPlayerRef.current;

            videoElement.load();
            setIsLoading(true);

            videoElement.oncanplay = () => {
                setIsLoading(false);
                setCanPlay(true);
            };

            videoElement.onplay = () => {
                setIsPlaying(true);
            };

            videoElement.onerror = () => {
                setIsLoading(false);
                alert("Erreur lors du chargement de la vidéo.");
            };
        }
    }, [selectedVideo, isPlaying]);

    const handlePlay = () => {
        if (canPlay && videoPlayerRef.current) {
            videoPlayerRef.current.play();
        }
    };

    const VideoPlayer = React.forwardRef(({ url, isPlaying, isLoading, onPlay }, ref) => {
        const videoRef = useRef(null);

        useEffect(() => {
            if (videoRef.current) {
                if (isPlaying) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            }
        }, [isPlaying]);

        useEffect(() => {
            if (videoRef.current) {
                videoRef.current.load();
            }
        }, [url]);

        return (
            <div className="video-container" style={{ position: "relative", overflow: "hidden", borderRadius: "8px" }}>
                {isLoading ? (
                    <Typography variant="body1" color="primary" gutterBottom>
                        Chargement de la vidéo...
                    </Typography>
                ) : null}
                <video 
                    ref={(el) => {
                        ref.current = el;
                        videoRef.current = el;
                    }} 
                    width="100%" 
                    controls 
                    onClick={onPlay}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "600px", // Fixe la largeur maximale de la vidéo
                        maxHeight: "400px", // Fixe la hauteur maximale de la vidéo
                        objectFit: "cover",
                    }}
                >
                    <source src={url} type="video/mp4" />
                    Votre navigateur ne supporte pas le format vidéo.
                </video>
            </div>
        );
    });

    return (
        <Box sx={{ maxWidth: 800, margin: "auto", p: 3, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
                📚 Dictées - {selectedLevel}
            </Typography>

            <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                sx={{ mb: 3, backgroundColor: "white", borderRadius: 2 }}
            >
                {dictations.levels.map((level) => (
                    <MenuItem key={level.level} value={level.level}>
                        {level.level}
                    </MenuItem>
                ))}
            </Select>

            {selectedVideo ? (
                <Box sx={{ my: 3, border: "3px solid #3f51b5", borderRadius: "8px", padding: "10px" , background:"black"}}>
                    <Typography variant="h6" sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                        {selectedVideo.title}
                    </Typography>
                    <VideoPlayer ref={videoPlayerRef} url={selectedVideo.url} isPlaying={isPlaying} isLoading={isLoading} onPlay={handlePlay} />
                </Box>
            ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Sélectionnez une vidéo ci-dessous 👇
                </Typography>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {videos.map((video, index) => (
                    <Card
                        key={index}
                        sx={{
                            width: 200,
                            cursor: "pointer",
                            boxShadow: 6,
                            borderRadius: 2,
                           
                            border: "2px solidrgb(181, 63, 116)", // Contour autour des cartes
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.05)", // Zoom au survol
                                boxShadow: 8,
                            },
                        }}
                        onClick={() => startVideo(video)}
                    >
                        <CardMedia
                            component="img"
                            height="120"
                            image={video.thumbnail || "/thumbnails/default.jpg"}
                            alt={video.title || "Miniature par défaut"}
                            sx={{ objectFit: "cover", borderRadius: "8px 8px 0 0", background:"black", }}
                        />
                        <CardContent sx={{ textAlign: "center", padding: "8px" }}>
                            <Typography variant="body1" fontWeight="bold">
                                {video.title || "Vidéo sans titre"}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default DictationPage;
