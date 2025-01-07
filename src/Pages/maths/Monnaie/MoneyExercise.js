import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DragIndicator, MonetizationOn, CheckCircle } from "@mui/icons-material";
import moneyData from "./moneyData.json";

const MoneyExercise = () => {
  const [targetAmount, setTargetAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [selectedMoney, setSelectedMoney] = useState([]);
  const [score, setScore] = useState([]);

  const generateRandomAmount = () => {
    return (Math.floor(Math.random() * 49995) + 5) / 100;
  };

  const updateProblem = () => {
    setTargetAmount(generateRandomAmount());
    resetAll();
  };

  const resetAll = () => {
    setCurrentAmount(0);
    setSelectedMoney([]);
  };

  const handleDragStart = (e, money) => {
    e.dataTransfer.setData("money", JSON.stringify(money));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const money = JSON.parse(e.dataTransfer.getData("money"));
    const newAmount = currentAmount + money.value;
    if (newAmount <= targetAmount || Math.abs(newAmount - targetAmount) < 0.01) {
      setCurrentAmount(newAmount);
      setSelectedMoney((prev) => [...prev, money]);
    } else {
      alert("Vous ne pouvez pas dépasser le montant cible !");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleValidate = () => {
    const tolerance = 0.01;
    if (Math.abs(currentAmount - targetAmount) <= tolerance) {
      alert("🎉 Bravo! Montant exact! 🎉");
      setScore((prev) => [...prev, { target: targetAmount, status: "Réussi" }]);
      updateProblem();
    } else {
      alert(`🚫 Incorrect! Vous avez déposé ${currentAmount.toFixed(2)}$ au lieu de ${targetAmount.toFixed(2)}$. Essayez encore.`);
      setScore((prev) => [...prev, { target: targetAmount, status: "Échoué" }]);
    }
  };

  const sortedMoney = selectedMoney.sort((a, b) => b.value - a.value);

  return (
    <Grid container spacing={4} padding={3}>
      {/* Consignes */}
      <Grid item xs={12}>
        <Paper style={{ padding: "20px", backgroundColor: "#e8f5e9" }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Consignes
          </Typography>
          <Typography variant="body1">
            1. Trouvez le montant cible affiché dans la section "Montant à trouver".
          </Typography>
          <Typography variant="body1">
            2. Glissez-déposez les billets et pièces dans la zone de dépôt.
          </Typography>
          <Typography variant="body1">
            3. Validez pour vérifier votre réponse.
          </Typography>
        </Paper>
      </Grid>
      {/* Partie 1 : Montant cible */}
      <Grid item xs={12} sm={4}>
        <Card style={{ backgroundColor: "#e8f5e9", border: "2px solid #4caf50" }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              <MonetizationOn /> Montant à trouver
            </Typography>
            <Typography variant="h4" color="secondary">
              {targetAmount.toFixed(2)}$
            </Typography>
            <Typography variant="h6" gutterBottom>
              Argent déposé :
            </Typography>
            <Paper style={{ padding: "10px", minHeight: "100px", backgroundColor: "#f1f8e9" }}>
              {sortedMoney.map((money, index) => (
                <Typography key={index}>
                  {money.value}$ ({money.name})
                </Typography>
              ))}
            </Paper>
            <Button
              variant="contained"
              color="primary"
              onClick={updateProblem}
              fullWidth
              style={{ marginTop: "10px" }}
            >
              Nouveau montant
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Partie 2 : Billets et pièces */}
      <Grid item xs={12} sm={4}>
        <Card style={{ backgroundColor: "#e3f2fd", border: "2px solid #2196f3" }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              <DragIndicator /> Billets et pièces
            </Typography>
            <Grid container spacing={1}>
              {moneyData.bills.map((bill, index) => (
                <Grid item key={index} xs={6}>
                  <Paper
                    elevation={3}
                    draggable
                    onDragStart={(e) => handleDragStart(e, { value: bill.value, name: bill.name })}
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      backgroundColor: "#bbdefb",
                      cursor: "grab",
                    }}
                  >
                    {bill.value}$ ({bill.name})
                  </Paper>
                </Grid>
              ))}
              {moneyData.coins.map((coin, index) => (
                <Grid item key={index} xs={6}>
                  <Paper
                    elevation={3}
                    draggable
                    onDragStart={(e) => handleDragStart(e, { value: coin.value, name: coin.name })}
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      backgroundColor: "#c8e6c9",
                      cursor: "grab",
                    }}
                  >
                    {coin.name} ({coin.value}$)
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Partie 3 : Zone de dépôt et validation */}
      <Grid item xs={12} sm={4}>
        <Card style={{ backgroundColor: "#fff3e0", border: "2px solid #ff9800" }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              <CheckCircle /> Zone de dépôt
            </Typography>
            <Paper
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                padding: "20px",
                minHeight: "200px",
                border: "2px dashed #ff9800",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                Déposez vos billets et pièces ici
              </Typography>
              <Typography
                variant="h4"
                color={currentAmount === targetAmount ? "success.main" : "error.main"}
              >
                Total : {currentAmount.toFixed(2)}$
              </Typography>
            </Paper>
            <Button
              variant="contained"
              color="success"
              onClick={handleValidate}
              fullWidth
              style={{ marginTop: "10px" }}
            >
              Valider
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetAll}
              fullWidth
              style={{ marginTop: "10px" }}
            >
              Réinitialiser tout
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {/* Tableau récapitulatif */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Montant cible</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {score.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.target.toFixed(2)}$</TableCell>
                  <TableCell>{entry.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default MoneyExercise;
