import React from 'react';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SupportIcon from '@mui/icons-material/Support';
import BuildIcon from '@mui/icons-material/Build';
import FunIcon from '@mui/icons-material/EmojiPeople';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ color: '#3f51b5' }}>
        À Propos de Nous
      </Typography>
      <Card>
        <CardMedia
          component="img"
          height="150"
          image="/imag/ima2.png" // Une image aléatoire liée à l'éducation
          alt="Éducation"
        />
        <CardContent>
          <Typography variant="body1" paragraph>
            Bienvenue sur notre site éducatif ! Notre mission est de fournir une plateforme d'apprentissage interactive et engageante pour les élèves de tous âges. Nous croyons que l'éducation est la clé pour ouvrir des portes vers de nouvelles opportunités et un avenir meilleur.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Notre Vision
      </Typography>
      <Card>
        <CardMedia
          component="img"
          height="150"
          image="imag/ima3.png" // Image d'étudiants
          alt="Notre vision"
        />
        <CardContent>
          <Typography variant="body1" paragraph>
            Nous nous engageons à rendre l'éducation accessible à tous, en combinant technologie moderne et méthodes pédagogiques éprouvées. Nous souhaitons inspirer la curiosité et l'amour de l'apprentissage chez chaque élève.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h4" gutterBottom>
        Ce Que Nous Proposons
      </Typography>
      <List>
        <ListItem>
          <SchoolIcon sx={{ marginRight: 1 }} />
          <ListItemText primary="Des cours interactifs couvrant une variété de sujets." />
        </ListItem>
        <ListItem>
          <SupportIcon sx={{ marginRight: 1 }} />
          <ListItemText primary="Des ressources pédagogiques et des outils pour aider à l'apprentissage." />
        </ListItem>
        <ListItem>
          <FunIcon sx={{ marginRight: 1 }} />
          <ListItemText primary="Des activités ludiques pour rendre l'apprentissage agréable." />
        </ListItem>
        <ListItem>
          <BuildIcon sx={{ marginRight: 1 }} />
          <ListItemText primary="Un soutien communautaire pour les élèves et les enseignants." />
        </ListItem>
      </List>

      <Typography variant="h4" gutterBottom>
        Contactez-Nous
      </Typography>
      <Card>
        <CardMedia
          component="img"
          height="150"
          image="imag/ima1.png" // Image liée au contact
          alt="Contactez-nous"
        />
        <CardContent>
          <Typography variant="body1">
            Si vous avez des questions, des suggestions ou des commentaires, n'hésitez pas à nous contacter à l'adresse 
            <Button color="primary" href="mailto:contact@example.com" sx={{ marginLeft: 1 }}>
            hassan.galeb@eibschool.ca
            </Button>.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default About;