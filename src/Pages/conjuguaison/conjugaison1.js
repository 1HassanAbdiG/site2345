
import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';

// Dynamically load JSON files
const context = require.context('./', false, /\.json$/); // Adjust the path based on your folder structure

// Import all JSON files
const jsonFiles = context.keys().reduce((files, fileName) => {
  const jsonContent = context(fileName);
  const fileNameWithoutExtension = fileName.replace('./', '').replace('.json', '');
  files[fileNameWithoutExtension] = jsonContent;
  return files;
}, {});

const Conjugaison1 = () => {
  const [selectedGroup, setSelectedGroup] = useState(Object.keys(jsonFiles)[0]); // Default to the first file
  const [selectedVerb, setSelectedVerb] = useState(Object.keys(jsonFiles[selectedGroup].verbs)[0]); // Default to the first verb in the group
  const [selectedTense, setSelectedTense] = useState("present");

  const handleGroupChange = (event) => {
    const newGroup = event.target.value;
    setSelectedGroup(newGroup);
    setSelectedVerb(Object.keys(jsonFiles[newGroup].verbs)[0]); // Default to the first verb in the new group
  };

  const handleVerbChange = (event) => {
    setSelectedVerb(event.target.value);
  };

  const handleTenseChange = (event) => {
    setSelectedTense(event.target.value);
  };

  // Get conjugations for the selected verb
  const conjugations = jsonFiles[selectedGroup].verbs[selectedVerb];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Conjugaison des verbes
      </Typography>
      
      {/* Select Group */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Groupe</InputLabel>
        <Select
          value={selectedGroup}
          onChange={handleGroupChange}
          label="Groupe"
        >
          {Object.keys(jsonFiles).map(group => (
            <MenuItem key={group} value={group}>{jsonFiles[group].rule.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select Verb */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Verbe</InputLabel>
        <Select
          value={selectedVerb}
          onChange={handleVerbChange}
          label="Verbe"
        >
          {Object.keys(jsonFiles[selectedGroup].verbs).map(verb => (
            <MenuItem key={verb} value={verb}>{verb}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select Tense */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Tense</InputLabel>
        <Select
          value={selectedTense}
          onChange={handleTenseChange}
          label="Tense"
        >
          <MenuItem value="present">Présent</MenuItem>
          <MenuItem value="future">Futur</MenuItem>
          <MenuItem value="imparfait">Imparfait</MenuItem>
          <MenuItem value="passeCompose">Passé Composé</MenuItem>
        </Select>
      </FormControl>

      {/* Conjugation Table */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {conjugations && conjugations.map((conjugation, index) => (
          <Grid item xs={2} key={index}>
            <TextField
              label={["je", "tu", "il/elle", "nous", "vous", "ils/elles"][index]}
              value={conjugation}
              fullWidth
              disabled
            />
          </Grid>
        ))}
      </Grid>

      {/* Rule Explanation */}
      <div style={{ marginTop: '30px' }}>
        <Typography variant="h6">Règle :</Typography>
        {jsonFiles[selectedGroup].rule.content.map((rule, index) => (
          <Typography key={index} variant="body1">
            <strong>{rule.idea}: </strong>{rule.text}
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default Conjugaison1;
