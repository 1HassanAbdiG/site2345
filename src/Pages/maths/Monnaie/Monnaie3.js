import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
} from "@mui/material";

const MoneyChangeExercise = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [givenAmount, setGivenAmount] = useState("");
  const [change, setChange] = useState(null);
  const [error, setError] = useState("");

  const generateRandomTotal = () => {
    setTotalAmount((Math.floor(Math.random() * 4995) + 5) / 100); // Random total between 0.05 and 49.95
    setGivenAmount("");
    setChange(null);
    setError("");
  };

  const handleCalculateChange = () => {
    const given = parseFloat(givenAmount);
    if (isNaN(given) || given <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }
    if (given < totalAmount) {
      setError("Le montant donné est insuffisant.");
      return;
    }
    setError("");
    setChange((given - totalAmount).toFixed(2));
  };

  return (
    <Grid container spacing={4} padding={3}>
      {/* Instructions */}
      <Grid item xs={12}>
        <Paper style={{ padding: "20px", backgroundColor: "#e3f2fd" }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Rendre la Monnaie
          </Typography>
          <Typography variant="body1">
            1. Cliquez sur "Nouveau montant" pour générer un total aléatoire.
          </Typography>
          <Typography variant="body1">
            2. Entrez le montant donné par le client.
          </Typography>
          <Typography variant="body1">
            3. Calculez la monnaie à rendre.
          </Typography>
        </Paper>
      </Grid>

      {/* Total à payer */}
      <Grid item xs={12} sm={6}>
        <Card style={{ backgroundColor: "#e8f5e9", border: "2px solid #4caf50" }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              Total à payer
            </Typography>
            <Typography variant="h4" color="secondary">
              {totalAmount > 0 ? `${totalAmount.toFixed(2)}$` : "Générez un montant"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={generateRandomTotal}
              fullWidth
              style={{ marginTop: "10px" }}
            >
              Nouveau montant
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Montant donné */}
      <Grid item xs={12} sm={6}>
        <Card style={{ backgroundColor: "#fff3e0", border: "2px solid #ff9800" }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              Montant donné par le client
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              type="number"
              value={givenAmount}
              onChange={(e) => setGivenAmount(e.target.value)}
              placeholder="Entrez le montant donné"
              style={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleCalculateChange}
              fullWidth
              style={{ marginTop: "10px" }}
              disabled={totalAmount === 0}
            >
              Calculer la monnaie
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Résultat */}
      <Grid item xs={12}>
        <Paper style={{ padding: "20px", backgroundColor: "#e0f7fa" }}>
          {error && (
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {change !== null && !error && (
            <Typography variant="h5" color="primary" gutterBottom>
              Monnaie à rendre : {change}$
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MoneyChangeExercise;
