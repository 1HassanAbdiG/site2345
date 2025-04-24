// ExerciseRenderer.jsx
import React from 'react';
import {
    Typography,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    ImageList,
    ImageListItem,
    IconButton
} from '@mui/material';

const ExerciseRenderer = ({ exercise, userAnswer, onAnswerChange, onRadioChange, onImageSelect }) => {
    if (!exercise) {
        return <Typography color="error">Error: Exercise data is missing or undefined.</Typography>;
    }

    switch (exercise.exerciseType) {
        case 'fill-in-the-blank':
            return (
                <div>
                    <Typography variant="h6">{exercise.question}</Typography>
                    {Array.isArray(exercise.answers) ? (
                        <TextField
                            label="Your Answer(s), comma separated"
                            value={userAnswer || ''}
                            onChange={onAnswerChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    ) : (
                        <TextField
                            label="Your Answer"
                            value={userAnswer || ''}
                            onChange={onAnswerChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    )}
                </div>
            );
        case 'multiple-choice':
            if (!exercise.options || !Array.isArray(exercise.options)) {
                return <Typography color="error">Error: Multiple choice options are missing or incorrectly formatted.</Typography>;
            }
            return (
                <div>
                    <Typography variant="h6">{exercise.question}</Typography>
                    <RadioGroup
                        aria-label="answer-choices"
                        name={`radio-group`}
                        value={userAnswer || ''}
                        onChange={onRadioChange}
                    >
                        {exercise.options.map((option, index) => (
                            <FormControlLabel key={index} value={String.fromCharCode(97 + index)} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                </div>
            );
        case 'text-input':
            return (
                <div>
                    <Typography variant="h6">{exercise.question}</Typography>
                    <TextField
                        label="Your Answer"
                        value={userAnswer || ''}
                        onChange={onAnswerChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={exercise.inputType || 'text'}
                    />
                </div>
            );
        case 'image-select':
            if (!exercise.imageOptions || !Array.isArray(exercise.imageOptions)) {
                return <Typography color="error">Error: Image options are missing or incorrectly formatted for image-select exercise.</Typography>;
            }
            if (exercise.imageOptions.length === 0) { // Check for empty array as well
                return <Typography color="error">Error: Image options array is empty for image-select exercise.</Typography>;
            }
            return (
                <div>
                    <Typography variant="h6">{exercise.question}</Typography>
                    <ImageList sx={{ width: 500, height: 'auto' }} cols={4} rowHeight={100}>
                        {exercise.imageOptions.map((image, index) => {
                            if (!image) { // Check if individual image is null/undefined
                                return <Typography key={`error-image-${index}`} color="error">Error: Image filename is missing at index {index} in imageOptions.</Typography>;
                            }
                            return (
                                <ImageListItem key={index}>
                                    <IconButton
                                        onClick={() => onImageSelect(index)}
                                        sx={{ border: userAnswer === index.toString() ? '2px solid blue' : 'none' }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Option ${index + 1}`}
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </IconButton>
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </div>
            );
        case 'true-false':
            return (
                <div>
                    <Typography variant="h6">{exercise.question}</Typography>
                    <RadioGroup
                        aria-label="true-false"
                        name={`true-false-group`}
                        value={userAnswer}
                        onChange={onRadioChange}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="True" />
                        <FormControlLabel value="false" control={<Radio />} label="False" />
                    </RadioGroup>
                </div>
            );
            case 'drag-and-drop':
                console.log("ExerciseRenderer - drag-and-drop case - exercise object:", exercise); // Log the entire exercise object
                if (!exercise.numberPairs) {
                    console.log("ExerciseRenderer - drag-and-drop case - Error: numberPairs is UNDEFINED or MISSING!");
                    return <Typography color="error">Error: Number pairs are missing or undefined for drag-and-drop exercise. Please check your exercise data in JSON.</Typography>;
                }
                if (!Array.isArray(exercise.numberPairs)) {
                    console.log("ExerciseRenderer - drag-and-drop case - Error: numberPairs is NOT AN ARRAY!");
                    return <Typography color="error">Error: Number pairs are not an array for drag-and-drop exercise. Please check your exercise data in JSON.</Typography>;
                }
                if (exercise.numberPairs.length === 0) {
                    console.log("ExerciseRenderer - drag-and-drop case - Error: numberPairs ARRAY IS EMPTY!");
                    return <Typography color="error">Error: Number pairs array is empty for drag-and-drop exercise.  Please ensure numberPairs array has data in your JSON.</Typography>;
                }
    
                return (
                    <div>
                        <Typography variant="h6">{exercise.question}</Typography>
                        {exercise.numberPairs.map((pair, index) => {
                            console.log(`ExerciseRenderer - drag-and-drop case - Processing pair at index ${index}:`, pair); // Log each pair
                            if (!pair || typeof pair !== 'object') {
                                console.log(`ExerciseRenderer - drag-and-drop case - Error: Pair at index ${index} is MISSING or NOT AN OBJECT!`);
                                return <Typography key={`error-pair-${index}`} color="error">Error: Number pair data is missing or invalid at index {index} for drag-and-drop.</Typography>;
                            }
                            return (
                                <div key={index} style={{ margin: '10px 0' }}>
                                    <Typography>
                                        {pair.num1}  [ <TextField
                                        label="Symbol"
                                        value={userAnswer[index] || ''}
                                        onChange={(e) => onAnswerChange(e, index)}
                                        variant="outlined"
                                        size="small"
                                        style={{ width: 50 }}
                                    /> ] {pair.num2}
                                    </Typography>
                                </div>
                            );
                    })}
                </div>
            );
        default:
            return <Typography color="warning">Warning: Exercise type "{exercise.exerciseType}" is not supported.</Typography>;
    }
};

export default ExerciseRenderer;