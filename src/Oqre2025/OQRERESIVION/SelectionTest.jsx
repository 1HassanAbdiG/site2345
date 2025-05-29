import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import TestEnLigne from './Ressources';
import Oqrerevision from './Oqrerevision2';
import TextEditorSelectionModify from "../tex"

function SelectionTest() {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Préparation aux évaluations provinciales
                </Typography>
               



                <Tabs
                    value={selectedTab}
                    
                    onChange={handleChange}
                    centered
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Test en ligne – Simulation officielle" />
                    <Tab label="Test de révision – Entraînement supplémentaire" />

                </Tabs>

                <Box sx={{ mt: 4 }}>
                    {selectedTab === 0 && <TestEnLigne />}
                    {selectedTab === 1 && <Oqrerevision />}
                
                </Box>
                <TextEditorSelectionModify></TextEditorSelectionModify>
            </Paper>
        </Box>
    );
}

export default SelectionTest;
