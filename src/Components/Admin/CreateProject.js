import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Paper, Typography, Button, TextField, Grid } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#9c27b0', // Purple color for "Annuler" button
    },
    background: {
      default: '#f0f2f5',
    },
    text: {
      primary: '#343a40',
      secondary: '#495057',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const GlassCard = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  },
  textAlign: 'left',
  border: `2px solid ${theme.palette.primary.main}`,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #007bff, #00d4ff)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
  transition: 'transform 0.3s ease',
  flexGrow: 1,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
  transition: 'transform 0.3s ease',
  flexGrow: 1,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: '700',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1.5),
  textAlign: 'center',
  textTransform: 'uppercase',
}));

function CreateProject() {
  const [ProjectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    const token = localStorage.getItem('token');
    const projectData = { 
      projectName: ProjectName  
    };
  
    axios.post('https://localhost:44396/api/Admin/CreateProject', 
    projectData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'  
      }
    })
      .then(() => {
        toast.success('Projet créé avec succès');
        navigate('/admin/projects', {
          state: { message: 'Projet créé avec succès', type: 'success' }
        });
      })
      .catch(error => {
        toast.error('Erreur lors de la création du projet');
        navigate('/admin/projects', {
          state: { message: 'Erreur lors de la création du projet', type: 'error' }
        });
      });
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <ToastContainer />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Créer un projet</Title>
              <TextField
                label="Nom du projet"
                value={ProjectName}
                onChange={(e) => setProjectName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <GradientButton
                  onClick={handleCreate}
                  sx={{ marginRight: '1rem' }}
                >
                  Créer le projet
                </GradientButton>
                <SecondaryButton
                  onClick={handleCancel}
                >
                  Annuler
                </SecondaryButton>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default CreateProject;
