// FoodGuideActivities.jsx

import React, { useState } from 'react';
import {
    Container, Typography, Card, CardContent, CardHeader, FormControl,
    FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup,
    Button, Alert, TextField, Grid, Box, Stack, Select, MenuItem, InputLabel,
    Chip, Avatar, Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import GrainIcon from '@mui/icons-material/Grain';
import EggIcon from '@mui/icons-material/Egg';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import guideData from './alimjson.json';
import Lecture2eanne from '../Alimentation1/lecture2eanne';


// --- Activity Type Sub-Components ---

function DrawingWritingActivity({ activity }) {
    const getIcon = (groupName) => {
        if (groupName.includes('Légumes et fruits')) return <LocalFloristIcon sx={{ color: 'green' }} />;
        if (groupName.includes('Grains entiers')) return <GrainIcon sx={{ color: 'brown' }} />;
        if (groupName.includes('Aliments protéinés')) return <EggIcon sx={{ color: 'deeppink' }} />;
        return <RestaurantMenuIcon />;
    };

    return (
        <Card sx={{ mb: 3, border: '2px solid #4caf50' }}>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: '#4caf50' }}><RestaurantMenuIcon /></Avatar>}
                title={activity.title}
                titleTypographyProps={{ variant: 'h6', color: '#2e7d32', fontWeight: 'bold' }}
            />
            <CardContent>
                <Typography paragraph sx={{ fontStyle: 'italic' }}>{activity.instruction}</Typography>
                 {/* Plate Visual */}
                 <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box sx={{
                        width: 250, height: 250, border: '3px solid #bdbdbd',
                        borderRadius: '50%', display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', bgcolor: '#f5f5f5'
                    }}>
                        <Box sx={{ flex: 1, borderBottom: '2px solid #bdbdbd', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e8f5e9' }}>
                            <Typography variant="caption" align="center" sx={{ fontWeight: 'bold' }}>{activity.food_groups[0]?.name}<br />({activity.food_groups[0]?.proportion})</Typography>
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex' }}>
                            <Box sx={{ flex: 1, borderRight: '2px solid #bdbdbd', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#efebe9' }}>
                                <Typography variant="caption" align="center" sx={{ fontWeight: 'bold' }}>{activity.food_groups[1]?.name}<br />({activity.food_groups[1]?.proportion})</Typography>
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fce4ec' }}>
                                <Typography variant="caption" align="center" sx={{ fontWeight: 'bold' }}>{activity.food_groups[2]?.name}<br />({activity.food_groups[2]?.proportion})</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {/* Input areas */}
                <Grid container spacing={2}>
                    {activity.food_groups.map((group, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Stack spacing={1}>
                                <Chip
                                    avatar={<Avatar>{getIcon(group.name)}</Avatar>}
                                    label={`${group.name} (${group.proportion})`}
                                    variant="outlined"
                                    sx={{ borderColor: group.color_hint === 'green' ? 'green' : group.color_hint === 'brown' ? 'brown' : 'deeppink', fontWeight: 'medium' }}
                                />
                                <TextField fullWidth multiline rows={2} label={group.instruction_area} variant="outlined" size="small" />
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
                 <Alert severity="info" sx={{ mt: 3 }}>
                    Activité créative! Dessine sur papier ou utilise les zones de texte pour écrire tes idées.
                </Alert>
            </CardContent>
        </Card>
    );
}

function MultipleChoiceActivity({ activity }) {
    const [selectedValue, setSelectedValue] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleChange = (event) => { setSelectedValue(event.target.value); setShowFeedback(false); };
    const handleSubmit = () => { const correct = selectedValue === activity.correct_answer_id; setIsCorrect(correct); setShowFeedback(true); };

    return (
        <Card sx={{ mb: 3, border: '2px solid #1976d2' }}>
            <CardHeader
                 avatar={<Avatar sx={{ bgcolor: '#1976d2' }}><HelpOutlineIcon /></Avatar>}
                title={activity.title}
                titleTypographyProps={{ variant: 'h6', color: '#1565c0', fontWeight: 'bold' }}
                 />
            <CardContent>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>{activity.instruction}</FormLabel>
                    <RadioGroup name={`activity-${activity.id}`} value={selectedValue} onChange={handleChange}>
                        {activity.options.map((option) => (
                            <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem' } }}/>
                        ))}
                    </RadioGroup>
                    <Button variant="contained" onClick={handleSubmit} disabled={!selectedValue} sx={{ mt: 2, alignSelf: 'flex-start' }} startIcon={showFeedback ? (isCorrect ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />) : null}> Vérifier ma réponse </Button>
                    {showFeedback && (<Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}> {isCorrect ? (activity.feedback || "Super! C'est la bonne réponse!") : "Essaie encore! Ce n'est pas tout à fait ça."} </Alert> )}
                </FormControl>
            </CardContent>
        </Card>
    );
}

function CheckboxActivity({ activity }) {
    const [selectedValues, setSelectedValues] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleChange = (event) => { setSelectedValues({ ...selectedValues, [event.target.name]: event.target.checked }); setShowFeedback(false); };
    const handleSubmit = () => {
        const chosenIds = Object.keys(selectedValues).filter(id => selectedValues[id]);
        const correct = chosenIds.length === activity.correct_answer_ids.length && chosenIds.every(id => activity.correct_answer_ids.includes(id));
        setIsCorrect(correct);
        setShowFeedback(true);
    };
    const hasSelection = Object.values(selectedValues).some(v => v);

    return (
        <Card sx={{ mb: 3, border: '2px solid #ed6c02' }}>
             <CardHeader
                 avatar={<Avatar sx={{ bgcolor: '#ed6c02' }}><CheckCircleOutlineIcon /></Avatar>}
                title={activity.title}
                titleTypographyProps={{ variant: 'h6', color: '#e65100', fontWeight: 'bold' }}
                 />
            <CardContent>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>{activity.instruction}</FormLabel>
                    <FormGroup>
                        {activity.options.map((option) => (
                            <FormControlLabel key={option.id} control={<Checkbox checked={selectedValues[option.id] || false} onChange={handleChange} name={option.id} />} label={option.text} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem' } }} />
                        ))}
                    </FormGroup>
                     <Button variant="contained" onClick={handleSubmit} disabled={!hasSelection} sx={{ mt: 2, alignSelf: 'flex-start' }} startIcon={showFeedback ? (isCorrect ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />) : null} color="warning"> Vérifier mes choix </Button>
                    {showFeedback && ( <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}> {isCorrect ? (activity.feedback || "Excellent! Tu as trouvé les bonnes réponses!") : "Regarde bien, certaines réponses sont bonnes, d'autres non. Essaie encore!"} </Alert> )}
                </FormControl>
            </CardContent>
        </Card>
    );
}

function ScenarioChoiceActivity({ activity }) {
    const [selectedValue, setSelectedValue] = useState('');
    const [justification, setJustification] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleRadioChange = (event) => { setSelectedValue(event.target.value); setShowFeedback(false); };
    const handleTextChange = (event) => { setJustification(event.target.value); };
    const handleSubmit = () => { const correct = selectedValue === activity.correct_answer_id; setIsCorrect(correct); setShowFeedback(true); };

     return (
        <Card sx={{ mb: 3, border: '2px solid #673ab7' }}>
             <CardHeader
                avatar={<Avatar sx={{ bgcolor: '#673ab7' }}><EmojiEventsIcon /></Avatar>}
                title={activity.title}
                 titleTypographyProps={{ variant: 'h6', color: '#5e35b1', fontWeight: 'bold' }}
                />
            <CardContent>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>{activity.instruction}</FormLabel>
                    <RadioGroup name={`activity-${activity.id}`} value={selectedValue} onChange={handleRadioChange}>
                        {activity.options.map((option) => (
                            <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem' } }}/>
                        ))}
                    </RadioGroup>
                    {activity.justification_prompt && ( <TextField label={activity.justification_prompt} value={justification} onChange={handleTextChange} margin="normal" fullWidth multiline rows={2} variant="outlined" size="small"/> )}
                     <Button variant="contained" onClick={handleSubmit} disabled={!selectedValue} sx={{ mt: 2, alignSelf: 'flex-start' }} startIcon={showFeedback ? (isCorrect ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />) : null} color="secondary"> Mon choix et pourquoi </Button>
                    {showFeedback && ( <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}> {isCorrect ? "Bien joué! C'est un excellent choix!" : "Hmm, penses-y encore un peu. Quel choix est le plus sain?"} {isCorrect && justification && <Typography variant="body2" sx={{mt: 1}}>Merci pour ton explication!</Typography>} </Alert> )}
                </FormControl>
            </CardContent>
        </Card>
    );
}

function MatchingClassificationActivity({ activity }) {
    const [userSelections, setUserSelections] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [results, setResults] = useState({});

    const handleChange = (itemId, event) => { setUserSelections({ ...userSelections, [itemId]: event.target.value }); setShowFeedback(false); setResults({}); };
    const handleSubmit = () => {
        const newResults = {};
        activity.items_to_classify.forEach(item => {
            newResults[item.id] = userSelections[item.id] === activity.correct_mapping[item.id];
        });
        setResults(newResults);
        setShowFeedback(true);
    };
    const allItemsSelected = activity.items_to_classify.length === Object.keys(userSelections).length;

    return (
        <Card sx={{ mb: 3, border: '2px solid #ff9800' }}>
             <CardHeader
                 avatar={<Avatar sx={{ bgcolor: '#ff9800' }}><RestaurantMenuIcon /></Avatar>}
                title={activity.title}
                 titleTypographyProps={{ variant: 'h6', color: '#f57c00', fontWeight: 'bold' }}
                />
            <CardContent>
                <Typography paragraph sx={{ fontStyle: 'italic' }}>{activity.instruction}</Typography>
                <Grid container spacing={2} alignItems="center">
                    {activity.items_to_classify.map((item) => (
                        <React.Fragment key={item.id}>
                            <Grid item xs={5} sm={4}><Typography sx={{ textAlign: 'right', fontWeight: 'medium' }}>{item.text}</Typography></Grid>
                            <Grid item xs={5} sm={6}>
                                 <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id={`select-label-${item.id}`}>Choisir la catégorie</InputLabel>
                                    <Select
                                        labelId={`select-label-${item.id}`}
                                        id={`select-${item.id}`}
                                        value={userSelections[item.id] || ''}
                                        label="Choisir la catégorie"
                                        onChange={(e) => handleChange(item.id, e)}
                                    >
                                        <MenuItem value="" disabled><em>-- Sélectionne --</em></MenuItem>
                                        {activity.categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                             <Grid item xs={2} sm={2} sx={{ textAlign: 'center' }}> {showFeedback && results[item.id] !== undefined && ( results[item.id] ? <CheckCircleOutlineIcon color="success" /> : <HighlightOffIcon color="error" /> )} </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
                 <Button variant="contained" onClick={handleSubmit} disabled={!allItemsSelected || showFeedback} sx={{ mt: 3 }} color="warning"> Vérifier mes classements </Button>
                 {showFeedback && ( <Alert severity={Object.values(results).every(r => r) ? "success" : "warning"} sx={{ mt: 2 }}> {Object.values(results).every(r => r) ? "Félicitations! Tout est bien classé!" : "Bon travail! Regarde les icônes rouges pour voir ce qu'il faut corriger."} </Alert> )}
            </CardContent>
        </Card>
    );
}

function StoryWithQuestionsActivity({ activity }) {
    const [tfAnswers, setTfAnswers] = useState({});
    const [qcmAnswers, setQcmAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [results, setResults] = useState({});

    const handleTfChange = (questionId, event) => {
        setTfAnswers({ ...tfAnswers, [questionId]: event.target.value === 'true' });
        setShowFeedback(false);
    };

    const handleQcmChange = (questionId, event) => {
        setQcmAnswers({ ...qcmAnswers, [questionId]: event.target.value });
        setShowFeedback(false);
    };

    const handleSubmit = () => {
        const newResults = {};

        activity.true_false_questions.forEach(q => {
            newResults[q.id] = tfAnswers[q.id] === q.answer;
        });

        activity.multiple_choice_questions.forEach(q => {
            newResults[q.id] = qcmAnswers[q.id] === q.correct_answer_id;
        });

        setResults(newResults);
        setShowFeedback(true);
    };

    const allQuestionsAnswered =
        (activity.true_false_questions?.length || 0) === Object.keys(tfAnswers).length &&
        (activity.multiple_choice_questions?.length || 0) === Object.keys(qcmAnswers).length;

    const allCorrect = Object.values(results).every(r => r); // Moved here to actually use it

    return (
        <Card sx={{ mb: 3, border: '2px solid #0288d1' }}>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: '#0288d1' }}><MenuBookIcon /></Avatar>}
                title={activity.title}
                titleTypographyProps={{ variant: 'h6', color: '#01579b', fontWeight: 'bold' }}
            />
            <CardContent>
                <Typography paragraph sx={{ fontStyle: 'italic' }}>{activity.instruction}</Typography>
                <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="body1">{activity.story}</Typography>
                </Paper>

                {activity.true_false_questions && activity.true_false_questions.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Questions Vrai ou Faux</Typography>
                        {activity.true_false_questions.map((q) => (
                            <FormControl component="fieldset" key={q.id} fullWidth margin="dense">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <FormLabel component="legend" sx={{ flexGrow: 1 }}>{q.text}</FormLabel>
                                    <RadioGroup
                                        row
                                        name={`tf-${q.id}`}
                                        value={tfAnswers[q.id]?.toString() ?? ''}
                                        onChange={(e) => handleTfChange(q.id, e)}
                                    >
                                        <FormControlLabel value="true" control={<Radio size="small" />} label="Vrai" />
                                        <FormControlLabel value="false" control={<Radio size="small" />} label="Faux" />
                                    </RadioGroup>
                                    {showFeedback && results[q.id] !== undefined && (results[q.id] ? <CheckCircleOutlineIcon color="success" fontSize="small" /> : <HighlightOffIcon color="error" fontSize="small" />)}
                                </Stack>
                            </FormControl>
                        ))}
                    </Box>
                )}

                {activity.multiple_choice_questions && activity.multiple_choice_questions.length > 0 && (
                     <Box mb={2}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Questions à Choix Multiples</Typography>
                        {activity.multiple_choice_questions.map((q) => (
                             <FormControl component="fieldset" key={q.id} fullWidth margin="normal">
                                <FormLabel component="legend">{q.question_text}</FormLabel>
                                <RadioGroup
                                    name={`qcm-${q.id}`}
                                    value={qcmAnswers[q.id] || ''}
                                    onChange={(e) => handleQcmChange(q.id, e)}
                                >
                                    {q.options.map((opt) => (
                                        <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem' } }}/>
                                    ))}
                                </RadioGroup>
                                 {showFeedback && results[q.id] !== undefined && (<Box sx={{textAlign: 'right'}}>{results[q.id] ? <CheckCircleOutlineIcon color="success" /> : <HighlightOffIcon color="error" />}</Box>)}
                            </FormControl>
                        ))}
                    </Box>
                )}

                <Button variant="contained" onClick={handleSubmit} disabled={!allQuestionsAnswered || showFeedback} sx={{ mt: 2 }} color="info">
                    Vérifier toutes mes réponses
                </Button>
                 {showFeedback && (
                    <Alert severity={allCorrect ? "success" : "warning"} sx={{ mt: 2 }}>
                        {allCorrect ? "Bravo! Tu as tout compris de l'histoire d'Ahmed!" : "Bon travail! Regarde les icônes rouges pour voir les réponses à corriger."}
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}


function DragDropPlateActivity({ activity }) {
    const [placements, setPlacements] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [results, setResults] = useState({});

    const handleChange = (itemId, event) => {
        setPlacements({ ...placements, [itemId]: event.target.value });
        setShowFeedback(false);
        setResults({});
    };

    const handleSubmit = () => {
        const newResults = {};
        activity.draggable_items.forEach(item => {
            const correctZoneId = activity.correct_mapping[item.id];
            const userZoneId = placements[item.id];
            const correct = userZoneId === correctZoneId;
            newResults[item.id] = correct;
        });
        setResults(newResults);
        setShowFeedback(true);
    };

    const allItemsPlaced = activity.draggable_items.length === Object.keys(placements).length;

    

    const allCorrect = Object.values(results).every(r => r); // Moved here to actually use it

    return (
        <Card sx={{ mb: 3, border: '2px solid #d32f2f' }}>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: '#d32f2f' }}><DragIndicatorIcon /></Avatar>}
                title={activity.title}
                titleTypographyProps={{ variant: 'h6', color: '#b71c1c', fontWeight: 'bold' }}
            />
            <CardContent>
                <Typography paragraph sx={{ fontStyle: 'italic' }}>{activity.instruction}</Typography>

                 {/* Visual Plate Zones */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    {activity.plate_zones.map((zone) => (
                         <Paper key={zone.id} variant="outlined" sx={{ p: 1, textAlign: 'center', minWidth: '150px', bgcolor: '#ffebee' }}>
                             <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{zone.name}</Typography>
                         </Paper>
                    ))}
                </Box>

                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Place chaque aliment:</Typography>
                 {/* Items to "place" using Select */}
                 <Grid container spacing={2} alignItems="center">
                    {activity.draggable_items.map((item) => (
                        <React.Fragment key={item.id}>
                            <Grid item xs={5} sm={4}><Typography sx={{ textAlign: 'right', fontWeight: 'medium' }}>{item.text}</Typography></Grid>
                            <Grid item xs={5} sm={6}>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id={`place-label-${item.id}`}>Placer dans...</InputLabel>
                                    <Select
                                        labelId={`place-label-${item.id}`}
                                        id={`place-select-${item.id}`}
                                        value={placements[item.id] || ''}
                                        label="Placer dans..."
                                        onChange={(e) => handleChange(item.id, e)}
                                    >
                                        <MenuItem value="" disabled><em>-- Choisir une zone --</em></MenuItem>
                                        {activity.plate_zones.map((zone) => (
                                            <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2} sm={2} sx={{ textAlign: 'center' }}>
                                {showFeedback && results[item.id] !== undefined && (results[item.id] ? <CheckCircleOutlineIcon color="success" /> : <HighlightOffIcon color="error" />)}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>

                <Button variant="contained" onClick={handleSubmit} disabled={!allItemsPlaced || showFeedback} sx={{ mt: 3 }} color="error">
                    Vérifier mes placements
                </Button>

                 {showFeedback && (
                    <Alert severity={allCorrect ? "success" : "warning"} sx={{ mt: 2 }}>
                        {allCorrect ? (activity.feedback || "Super! Tu as bien rempli l'assiette!") : "Presque! Regarde les icônes rouges pour ajuster."}
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}


// --- Main Self-Contained Component ---

function FoodGuideActivities() {

    if (!guideData || !guideData.activities) {
         console.error("JSON data is missing or doesn't contain 'activities' array.", guideData);
        return <Typography color="error">Erreur: Impossible de charger les activités. Vérifiez le fichier JSON.</Typography>;
    }


    const renderActivity = (activity) => {
        switch (activity.type) {
            case 'drawing_writing':
                return <DrawingWritingActivity key={activity.id} activity={activity} />;
            case 'multiple_choice':
                return <MultipleChoiceActivity key={activity.id} activity={activity} />;
             case 'checkbox':
                return <CheckboxActivity key={activity.id} activity={activity} />;
            case 'scenario_choice':
                return <ScenarioChoiceActivity key={activity.id} activity={activity} />;
            case 'matching_or_classification':
                 return <MatchingClassificationActivity key={activity.id} activity={activity} />;
            case 'story_with_questions':
                 return <StoryWithQuestionsActivity key={activity.id} activity={activity} />;
            case 'drag_drop_plate':
                return <DragDropPlateActivity key={activity.id} activity={activity} />;
            default:
                console.warn(`Unsupported activity type encountered: ${activity.type}`);
                return (
                    <Card key={activity.id} sx={{ mb: 3, border: '2px solid gray' }}>
                        <CardContent>
                            <Typography color="text.secondary">
                                Type d'activité non supporté: {activity.type}
                            </Typography>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Lecture2eanne/>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                {guideData.title || "Guide Alimentaire"}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                {guideData.description || "Apprenons à bien manger!"}
            </Typography>

            {guideData.activities.map(activity => renderActivity(activity))}

        </Container>
    );
}

export default FoodGuideActivities;