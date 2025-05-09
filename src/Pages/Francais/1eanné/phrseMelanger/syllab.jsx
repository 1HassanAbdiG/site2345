import React, { useState, useCallback, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Stack,
    Tooltip,
    CircularProgress // Pour indiquer le chargement des voix
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Pour indiquer une erreur
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Pour indiquer succès/voix prête

// Données des syllabes (inchangées)
const syllableData = [
    { consonant: 'b', vowels: ['ba', 'be', 'bi', 'bo', 'bu'] },
    { consonant: 'c', vowels: ['ca', 'ce', 'ci', 'co', 'cu'] },
    { consonant: 'd', vowels: ['da', 'de', 'di', 'do', 'du'] },
    { consonant: 'f', vowels: ['fa', 'fe', 'fi', 'fo', 'fu'] },
    { consonant: 'g', vowels: ['ga', 'ge', 'gi', 'go', 'gu'] },
    { consonant: 'l', vowels: ['la', 'le', 'li', 'lo', 'lu'] },
    { consonant: 'm', vowels: ['ma', 'me', 'mi', 'mo', 'mu'] },
    { consonant: 'n', vowels: ['na', 'ne', 'ni', 'no', 'nu'] },
    { consonant: 'p', vowels: ['pa', 'pe', 'pi', 'po', 'pu'] },
    { consonant: 'r', vowels: ['ra', 're', 'ri', 'ro', 'ru'] },
    { consonant: 's', vowels: ['sa', 'se', 'si', 'so', 'su'] },
    { consonant: 't', vowels: ['ta', 'te', 'ti', 'to', 'tu'] },
    { consonant: 'v', vowels: ['va', 've', 'vi', 'vo', 'vu'] }
];
const vowelsHeader = ['a', 'e', 'i', 'o', 'u'];

function SyllableReaderMUI() {
    const [constructedWord, setConstructedWord] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    // const [voices, setVoices] = useState([]); // Removed unused state 'voices'
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [voiceLoading, setVoiceLoading] = useState(true);
    const [speechError, setSpeechError] = useState('');

    // --- useEffect pour charger les voix ---
    useEffect(() => {
        // Stocker la fonction dans une variable pour la réutiliser dans le setTimeout
        let populateVoiceList;
        populateVoiceList = () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                const availableVoices = window.speechSynthesis.getVoices();

                if (availableVoices.length === 0 && voiceLoading) {
                    console.warn("getVoices() returned empty array, still loading...");
                    return;
                }

                 if (availableVoices.length > 0) {
                    // setVoices(availableVoices); // Removed setting unused state
                    console.log("Available voices:", availableVoices);

                    let defaultFrenchVoice = availableVoices.find(voice => voice.lang === 'fr-FR');
                    if (!defaultFrenchVoice) {
                       defaultFrenchVoice = availableVoices.find(voice => voice.lang.startsWith('fr'));
                    }

                    if (defaultFrenchVoice) {
                        setSelectedVoice(defaultFrenchVoice);
                        console.log("Selected default French voice:", defaultFrenchVoice);
                        setSpeechError('');
                    } else {
                        setSelectedVoice(null);
                        setSpeechError("Aucune voix française trouvée sur ce navigateur.");
                        console.warn("Aucune voix française trouvée.");
                    }
                    setVoiceLoading(false);
                 } else if (!voiceLoading) {
                    // Si on arrive ici après que le chargement ait été marqué comme terminé (ex: timeout)
                    // mais qu'aucune voix n'est toujours trouvée.
                    if (!speechError) setSpeechError("Impossible de charger les voix.");
                 }
            } else {
                setSpeechError("Synthèse vocale non supportée par ce navigateur.");
                setVoiceLoading(false);
            }
        };

        // Logique de chargement initiale et via l'événement
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Check if voices are already available immediately
            if (window.speechSynthesis.getVoices().length > 0) {
                 populateVoiceList(); // Populate immediately if voices are there
            } else {
                // Otherwise, wait for the voiceschanged event or a timeout
                window.speechSynthesis.onvoiceschanged = populateVoiceList;

                 // Fallback timeout in case onvoiceschanged doesn't fire or takes long
                const timeoutId = setTimeout(() => {
                    if (voiceLoading) { // Check if loading is still true after timeout
                       console.log("Timeout reached, attempting populateVoiceList again.");
                       populateVoiceList();
                       // If still loading after timeout, mark as finished (with or without success)
                       if (voiceLoading) setVoiceLoading(false);
                    }
                }, 3000); // Increased delay to 3s

                // Cleanup the timeout
                return () => {
                    clearTimeout(timeoutId);
                     // Also ensure onvoiceschanged is cleaned up if component unmounts before it fires
                     if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.onvoiceschanged === populateVoiceList) {
                         window.speechSynthesis.onvoiceschanged = null;
                     }
                };
            }

        } else {
           // Handle no speech synthesis support immediately
           populateVoiceList();
        }

        // Cleanup the onvoiceschanged listener on unmount
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.onvoiceschanged === populateVoiceList) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    // Disabling hook dependency check: This effect is meant to run once on mount to initialize speech synthesis,
    // setting up event listeners and handling initial voice loading state. Including voiceLoading or speechError
    // would cause unintended re-runs whenever these states change *after* the initial load attempt.
    // The internal logic of populateVoiceList correctly handles state updates based on voice availability.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <--- CHANGEMENT ICI: Added eslint-disable-next-line

    // --- Fonction Speak intégrée ---
    const speak = useCallback((text) => {
        if (!('speechSynthesis' in window)) {
            console.error("Synthèse vocale non supportée.");
            setSpeechError("Synthèse vocale non supportée.");
            return;
        }
        if (voiceLoading) {
            console.warn("Voix en cours de chargement.");
            // Pas besoin de setSpeechError ici, l'état de chargement est déjà affiché
            return;
        }
        if (!selectedVoice) {
            console.error("Aucune voix sélectionnée.");
            if (!speechError) setSpeechError("Aucune voix appropriée n'est disponible."); // Check if error already exists before setting
            return;
        }
         // Cancel any previous utterance before speaking the new one
        if (window.speechSynthesis.speaking) {
             window.speechSynthesis.cancel();
             // Small delay might be needed on some browsers after cancel
             setTimeout(() => speakUtterance(text), 50);
             return;
        }

        const speakUtterance = (speakText) => {
            setSpeechError(''); // Clear previous errors on new speak attempt
            setIsSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(speakText);
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
            utterance.rate = 0.9;
            utterance.pitch = 1;

            utterance.onend = () => {
                setIsSpeaking(false);
            };
            utterance.onerror = (event) => {
                console.error('TTS Error:', event);
                let errorMsg = event.error || 'inconnue';
                 try { // Essayer d'accéder à utterance.error peut parfois échouer
                    if (utterance.error) errorMsg = utterance.error;
                 } catch (e) {
                    console.warn("Impossible d'accéder à utterance.error", e);
                 }
                setSpeechError(`Erreur TTS: ${errorMsg}`);
                setIsSpeaking(false);
            };

             window.speechSynthesis.speak(utterance);
        };

        // Initial call if not speaking
        speakUtterance(text);


    // Disabling hook dependency check: This function uses state setters (setIsSpeaking, setSpeechError)
    // which don't require the current value of the state variables themselves as dependencies.
    // It correctly depends on selectedVoice and voiceLoading for its core logic.
    // isSpeaking is implicitly handled by the cancel/reschedule logic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVoice, voiceLoading]); // <--- CHANGEMENT ICI: Added eslint-disable-next-line and reviewed dependencies


    // --- Gestionnaires d'événements ---
    const handleSyllableClick = useCallback((syllable) => {
         // Ne rien faire si les voix ne sont pas prêtes ou pendant le chargement
        if (voiceLoading || !selectedVoice) return;

        // Cancel any ongoing speech before appending and speaking the new syllable
        if (window.speechSynthesis.speaking) {
             window.speechSynthesis.cancel();
             // Add a slight delay for cancellation to register before the next speak
             setTimeout(() => {
                setConstructedWord(prev => prev + syllable);
                 // Speak the *new* total word after adding the syllable
                 // This allows users to hear the word being built in real-time
                 // or just the last syllable depending on preference/logic.
                 // Let's speak only the new syllable for a click.
                speak(syllable);
             }, 50); // 50ms delay after cancel
        } else {
            setConstructedWord(prev => prev + syllable);
             // Speak only the new syllable
             speak(syllable);
        }

    // The speak function is a dependency because it's called here.
    // No other state needs to be a dependency for this specific handler's logic.
    }, [voiceLoading, selectedVoice, speak]); // Added speak as a dependency

    const handleReadWord = useCallback(() => {
        // Ne rien faire si pas de mot ou si les voix ne sont pas prêtes
        if (!constructedWord || voiceLoading || !selectedVoice) return;
         // This reads the *entire* constructed word
        speak(constructedWord);
    }, [constructedWord, voiceLoading, selectedVoice, speak]); // Added speak as a dependency

    const handleClearWord = useCallback(() => {
        setConstructedWord('');
        if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    }, []); // No dependencies needed for clearing state/canceling speech

    // --- Rendu du Composant ---
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                    Constructeur de Mots Syllabiques
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, mt: 2, mb: 3, borderColor: 'primary.light', borderRadius: 2 }}>
                    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
                        <Box
                            sx={{
                                flexGrow: 1, p: 1.5, border: '1px solid', borderColor: 'grey.400',
                                borderRadius: 1, minHeight: '50px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100',
                                width: '100%', overflowWrap: 'break-word', wordBreak: 'break-all',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'medium',
                                    color: constructedWord ? 'text.primary' : 'text.secondary',
                                    fontStyle: constructedWord ? 'normal' : 'italic',
                                    textAlign: 'center'
                                }}
                                aria-live="polite"
                            >
                                {constructedWord || "Cliquez sur les syllabes..."}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'center' }}>
                            <Tooltip title="Lire le mot construit">
                                <span>
                                    <Button
                                        variant="contained" color="success" startIcon={<PlayArrowIcon />}
                                        onClick={handleReadWord}
                                        disabled={!constructedWord || isSpeaking || voiceLoading || !selectedVoice}
                                        sx={{ minWidth: { xs: 100, sm: 120 } }}
                                    >
                                        Lire
                                    </Button>
                                </span>
                            </Tooltip>
                            <Tooltip title="Effacer le mot">
                                <span>
                                    <Button
                                        variant="contained" color="error" startIcon={<ClearIcon />}
                                        onClick={handleClearWord} disabled={!constructedWord}
                                        sx={{ minWidth: { xs: 100, sm: 120 } }}
                                    >
                                        Effacer
                                    </Button>
                                </span>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Paper>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, minHeight: '24px' }}>
                   {/* Logique d'affichage état/erreur inchangée */}
                   {voiceLoading ? (
                        <> <CircularProgress size={20} sx={{ mr: 1 }} /> <Typography variant="body2" color="text.secondary">Chargement des voix...</Typography> </>
                    ) : speechError ? (
                        <> <ErrorOutlineIcon color="error" sx={{ mr: 1 }} /> <Typography variant="body2" color="error">{speechError}</Typography> </>
                    ) : selectedVoice ? (
                         <> <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} /> <Typography variant="body2" color="text.secondary"> Prêt ({selectedVoice.name}) {isSpeaking && " (Lecture...)"} </Typography> </>
                    ): (
                         <Typography variant="body2" color="text.secondary">État de la voix inconnu.</Typography>
                    )}
                </Box>

                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                    <Table aria-label="tableau des syllabes interactif">
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', borderTopLeftRadius: 'inherit', width: '50px' }}>/</TableCell>
                                {vowelsHeader.map(v => (
                                    <TableCell key={v} align="center" sx={{ color: 'white', fontWeight: 'bold' }}>{v}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {syllableData.map(({ consonant, vowels }) => (
                                <TableRow key={consonant} hover>
                                    <TableCell
                                        align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.light', color: 'primary.contrastText', borderRight: '1px solid', borderColor: 'divider' }} >
                                        {consonant}
                                    </TableCell>
                                    {vowels.map(syllable => (
                                        <TableCell
                                            key={syllable}
                                            align="center"
                                            onClick={() => handleSyllableClick(syllable)} // Simplified click handler
                                            sx={{
                                                cursor: voiceLoading || !selectedVoice ? 'not-allowed' : 'pointer',
                                                opacity: voiceLoading || !selectedVoice ? 0.6 : 1,
                                                fontWeight: 500, fontSize: '1.1rem', border: '1px solid',
                                                borderColor: 'grey.300', userSelect: 'none',
                                                '&:hover': voiceLoading || !selectedVoice ? {} : {
                                                    backgroundColor: 'action.hover', transform: 'scale(1.05)',
                                                    boxShadow: 3, zIndex: 1, position: 'relative'
                                                },
                                                transition: (theme) => theme.transitions.create(['background-color', 'transform', 'box-shadow', 'opacity'], {
                                                    duration: theme.transitions.duration.short,
                                                }),
                                            }}
                                            role="button"
                                            tabIndex={voiceLoading || !selectedVoice ? -1 : 0}
                                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !(voiceLoading || !selectedVoice) && handleSyllableClick(syllable)}
                                            aria-label={`Ajouter la syllabe ${syllable}`}
                                            aria-disabled={voiceLoading || !selectedVoice}
                                        >
                                            {syllable}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper>
        </Container>
    );
}

export default SyllableReaderMUI;