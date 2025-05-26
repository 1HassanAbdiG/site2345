import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Avatar,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import { Launch, School, Description, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
  borderRadius: '16px',
  boxShadow: theme.shadows[6],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12]
  }
}));

const TestButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  justifyContent: 'flex-start',
  '& .MuiButton-startIcon': {
    marginRight: '12px'
  }
}));

const tests = {
  primaire: [
    {
      titre: 'Version standard',
      description: 'Version complète du test avec tous les éléments',
      url: 'https://d3d9vqrpii4nuo.cloudfront.net/#/fr/student/primary-assessment',
      badge: 'Recommandé'
    },
    {
      titre: 'Version alternative – avec descriptions audio',
      description: 'Inclut des descriptions audio pour une meilleure accessibilité',
      url: 'https://d3d9vqrpii4nuo.cloudfront.net/#/fr/student/primary-assessment-alternative'
    },
    {
      titre: 'Version alternative – sans descriptions audio',
      description: 'Version simplifiée sans éléments audio',
      url: 'https://d3d9vqrpii4nuo.cloudfront.net/#/fr/student/primary-assessment-alternative-v2'
    }
  ],
  moyen: [
    {
      titre: 'Version standard',
      description: 'Version complète du test avec tous les éléments',
      url: 'https://d3d9vqrpii4nuo.cloudfront.net/#/fr/student/junior-assessment',
      badge: 'Recommandé'
    },
    {
      titre: 'Version alternative – avec descriptions audio',
      description: 'Inclut des descriptions audio pour une meilleure accessibilité',
      url: 'https://d3d9vqrpii4nuo.cloudfront.net/#/fr/student/junior-assessment-alternative'
    },
    {
      titre: 'Version alternative – sans descriptions audio',
      description: 'Version simplifiée sans éléments audio',
      url: 'https://d3d9vqrpii4nuo.cloudfront.net/#/fr/student/junior-assessment-alternative-v2'
    }
  ]
};

function TestEnLigne() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');

  const handleOpen = (url) => {
    setIframeUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIframeUrl('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          px: isMobile ? 2 : 0
        }}
      >
        <Avatar
          sx={{
            m: 'auto',
            bgcolor: 'primary.main',
            width: 80,
            height: 80,
            mb: 3
          }}
        >
          <School sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: isMobile ? '2rem' : '2.5rem'
          }}
        >
          Tests en ligne
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}
        >
          Ressources pédagogiques pour les parents - Évaluation des compétences en français et mathématiques
        </Typography>
      </Box>

      {/* Cycle primaire */}
      <StyledCard sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box
              sx={{
                width: 8,
                height: 40,
                bgcolor: 'primary.main',
                borderRadius: 4
              }}
            />
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              3e année - Cycle primaire
            </Typography>
          </Stack>
          
          <Grid container spacing={3}>
            {tests.primaire.map((test, idx) => (
              <Grid item xs={12} key={idx}>
                <TestButton
                  variant="contained"
                  color="primary"
                  startIcon={<Launch />}
                  onClick={() => handleOpen(test.url)}
                  fullWidth
                  sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {test.titre}
                      {test.badge && (
                        <Chip
                          label={test.badge}
                          size="small"
                          color="secondary"
                          sx={{ ml: 2, fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.description}
                    </Typography>
                  </Box>
                </TestButton>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Cycle moyen */}
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box
              sx={{
                width: 8,
                height: 40,
                bgcolor: 'secondary.main',
                borderRadius: 4
              }}
            />
            <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>
              6e année - Cycle moyen
            </Typography>
          </Stack>
          
          <Grid container spacing={3}>
            {tests.moyen.map((test, idx) => (
              <Grid item xs={12} key={idx}>
                <TestButton
                  variant="contained"
                  color="secondary"
                  startIcon={<Launch />}
                  onClick={() => handleOpen(test.url)}
                  fullWidth
                  sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'secondary.light',
                      color: 'secondary.contrastText'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {test.titre}
                      {test.badge && (
                        <Chip
                          label={test.badge}
                          size="small"
                          color="primary"
                          sx={{ ml: 2, fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {test.description}
                    </Typography>
                  </Box>
                </TestButton>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Dialog avec iframe */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '16px',
            height: isMobile ? '100%' : '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText'
          }}
        >
          <Box display="flex" alignItems="center">
            <Description sx={{ mr: 1 }} />
            <Typography variant="h6">Visualisation du test</Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '100%' }}>
          <iframe
            src={iframeUrl}
            title="Test en ligne"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              minHeight: '60vh'
            }}
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default TestEnLigne;