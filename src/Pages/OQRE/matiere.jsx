import React, { useState, useEffect } from "react";
import {
  Container, Typography, Box, Button, Card, List, ListItem, ListItemText, Divider, Grid, Drawer, IconButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const MathProgram = () => {
  const [data, setData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(6); // Par défaut, 6e année

  useEffect(() => {
    fetch(`/data${selectedYear}.json`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setSelectedSection(json.sections[0]);
      })
      .catch((err) => console.error("Erreur de chargement du JSON:", err));
  }, [selectedYear]);

  const handleTopicClick = (topic) => {
    if (topic.pdf) {
      window.open(topic.pdf, "_blank");
    }
  };

  const handleTestClick = (test) => {
    if (test.pdf) {
      window.open(test.pdf, "_blank");
    }
  };

  if (!data) return <Typography>Chargement...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ bgcolor: "#FFFFFF", p: 3, borderRadius: 2 }}>
      {/* Boutons pour changer d'année */}
      <Box textAlign="center" mb={3}>
        {[2, 3, 4, 5, 6, 7, 8, 9].map((year) => (
          <Button
            key={year}
            onClick={() => setSelectedYear(year)}
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

      {/* Titre principal */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333333", textAlign: "center", borderBottom: "3px solid #FFD700" }}>
        {data.title}
      </Typography>

      {/* Bouton Menu Mobile */}
      <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { xs: "block", md: "none" } }}>
        <MenuIcon />
      </IconButton>

      <Grid container spacing={3}>
        {/* Sidebar mobile (Drawer) */}
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <List sx={{ width: 250, bgcolor: "#FFD700", height: "100%" }}>
            {data.sections.map((section) => (
              <ListItem
                button
                key={section.id}
                onClick={() => { setSelectedSection(section); setMobileOpen(false); }}
                sx={{ 
                  bgcolor: selectedSection?.id === section.id ? "#FFA500" : "transparent",
                  "&:hover": { bgcolor: "#FFA500" },
                  color: "black"
                }}
              >
                <ListItemText primary={section.title} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Liste des sections (Desktop) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, bgcolor: "#FFF8DC" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", color: "#333333" }}>Sections</Typography>
            <List>
              {data.sections.map((section) => (
                <ListItem
                  button
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  sx={{
                    bgcolor: selectedSection?.id === section.id ? "#FFD700" : "transparent",
                    color: "#333333",
                    "&:hover": { textDecoration: "underline", color: "#FFA500" }
                  }}
                >
                  <ListItemText primary={section.title} />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Contenu détaillé */}
        <Grid item xs={12} md={8}>
          {selectedSection && (
            <Card sx={{ p: 3, bgcolor: "#FFFFFF", border: "2px solid #FFD700" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333333" }}>
                {selectedSection.title}
              </Typography>

              <List>
                {selectedSection.topics.map((topic, index) => (
                  <ListItem key={index} button onClick={() => handleTopicClick(topic)}>
                    {topic.pdf && <PictureAsPdfIcon sx={{ color: "red", mr: 1 }} />}
                    <ListItemText primary={topic.name} sx={{ cursor: "pointer", "&:hover": { color: "#FFA500" } }} />
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2, color: "white", bgcolor: "#333333", p: 1 }}>
                Points importants
              </Typography>
              <Typography sx={{ ml: 2 }}>{selectedSection.points}</Typography>

              <Divider />

              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2, color: "white", bgcolor: "#333333", p: 1 }}>
                Évaluation
              </Typography>
              <List>
                {selectedSection.tests.map((test, index) => (
                  <ListItem key={index} button onClick={() => handleTestClick(test)}>
                    {test.pdf && <PictureAsPdfIcon sx={{ color: "red", mr: 1 }} />}
                    <ListItemText primary={test.name} sx={{ cursor: "pointer", "&:hover": { color: "#FFA500" } }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MathProgram;
