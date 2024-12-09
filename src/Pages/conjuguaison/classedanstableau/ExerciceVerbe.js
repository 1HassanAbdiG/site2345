import React, { useState } from "react";
import { Box, Typography, Card, Grid, Button, Alert } from "@mui/material";


// Suppression des imports inutilisés comme Grid si non utilisé.


import { useDrag, useDrop } from "react-dnd";
import data from "./verbes.json";

// Define the item type for the draggable verbs
const ItemType = "VERB";

// Draggable verb component
const DraggableVerb = ({ verb, groupName, moveVerb, isIncorrect }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { verb, groupName },
  });

  return (
    <Button
      ref={drag}
      sx={{
        backgroundColor: isIncorrect ? "#f8d7da" : "#fff", // red background for incorrect verbs
        mb: 1,
        borderRadius: 1,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "move",
        "&:hover": { backgroundColor: "#f0f0f0" },
        padding: "8px 16px",
        textTransform: "none",
        fontWeight: "normal",
      }}
    >
      {verb}
    </Button>
  );
};

// Droppable group component
const DroppableGroup = ({ groupName, moveVerb, children }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => {
      if (item.groupName !== groupName) {
        moveVerb(item.verb, item.groupName, groupName);
      }
    },
  });

  return (
    <Card
      ref={drop}
      sx={{
        p: 2,
        minHeight: "150px",
        mb: 2,
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        "&:hover": { backgroundColor: "#f3f3f3" },
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", mb: 1, color: "#333" }}>
        {groupName}
      </Typography>
      {children}
    </Card>
  );
};

// Main exercise component
const ExerciceVerbes = () => {
  const [groups, setGroups] = useState({
    "1er groupe": [],
    "2ème groupe": [],
    "3ème groupe": [],
    "Verbes disponibles": data.verbs,
  });

  const [incorrectVerbs, setIncorrectVerbs] = useState([]);
  const [score, setScore] = useState(null);
  const [detailedScores, setDetailedScores] = useState({});

  const moveVerb = (verb, sourceGroup, destinationGroup) => {
    const newGroups = { ...groups };
    newGroups[sourceGroup] = newGroups[sourceGroup].filter((v) => v !== verb);
    newGroups[destinationGroup].push(verb);
    setGroups(newGroups);
  };

  const handleCheck = () => {
    let totalCorrect = 0;
    let totalVerbs = 0;
    const incorrect = [];
    const scoresByGroup = {};

    Object.keys(data.correctGroups).forEach((group) => {
      const correctVerbs = data.correctGroups[group];
      const userVerbs = groups[group];
      totalVerbs += correctVerbs.length;

      let groupCorrect = 0;
      correctVerbs.forEach((verb) => {
        if (userVerbs.includes(verb)) {
          totalCorrect++;
          groupCorrect++;
        } else {
          incorrect.push(verb);
        }
      });

      scoresByGroup[group] = `${groupCorrect} / ${correctVerbs.length}`;
    });

    setDetailedScores(scoresByGroup);
    setIncorrectVerbs(incorrect);
    setScore(`Votre score total : ${totalCorrect} / ${totalVerbs}`);
  };

  const handleReset = () => {
    setGroups({
      "1er groupe": [],
      "2ème groupe": [],
      "3ème groupe": [],
      "Verbes disponibles": data.verbs,
    });
    setScore(null);
    setDetailedScores({});
    setIncorrectVerbs([]);
  };

  const renderGroup = (groupName) => (
    <DroppableGroup key={groupName} groupName={groupName} moveVerb={moveVerb}>
      {groups[groupName].map((verb) => (
        <DraggableVerb
          key={verb}
          verb={verb}
          groupName={groupName}
          moveVerb={moveVerb}
          isIncorrect={incorrectVerbs.includes(verb)}
        />
      ))}
    </DroppableGroup>
  );

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        {data.instructions}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Verbes disponibles
            </Typography>
            <Box sx={{ overflowY: "auto", maxHeight: "300px" }}>
              {groups["Verbes disponibles"].map((verb) => (
                <DraggableVerb key={verb} verb={verb} groupName="Verbes disponibles" moveVerb={moveVerb} isIncorrect={false} />
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {Object.keys(groups).map((groupName) => {
          if (groupName !== "Verbes disponibles") {
            return renderGroup(groupName);
          }
          return null;
        })}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: "1.1rem", fontWeight: "bold", mr: 2 }}
          onClick={handleCheck}
        >
          Vérifier mes réponses
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ fontSize: "1rem", fontWeight: "bold" }}
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
      </Box>

      {score && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ fontSize: "1.2rem", mb: 2 }}>
            {score}
          </Alert>
          <Card sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Détails des scores par groupe
            </Typography>
            {Object.entries(detailedScores).map(([group, score]) => (
              <Typography key={group} sx={{ mb: 1, fontSize: "1rem" }}>
                <strong>{group} :</strong> {score}
              </Typography>
            ))}
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default ExerciceVerbes;