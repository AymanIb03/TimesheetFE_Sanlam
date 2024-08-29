import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Paper, Typography, Button, TextField, MenuItem, Grid } from '@mui/material';
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

function CreateUser() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const navigate = useNavigate();

  const handleCreateUser = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token is not available. Please log in again.');
      navigate('/login');
      return;
    }

    const userData = {
      userName,
      email,
      role
    };

    axios.post('https://localhost:44396/api/Admin/CreateUser', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        toast.success("Utilisateur créé avec succès");
        navigate('/admin/users');
      })
      .catch(error => {
        console.error('Erreur lors de la création de l\'utilisateur:', error.response || error.message);
        toast.error("Erreur lors de la création de l'utilisateur");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Créer un utilisateur</Title>
              <TextField
                label="Nom d'utilisateur"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Rôle"
                select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <GradientButton
                  onClick={handleCreateUser}
                  sx={{ marginRight: '1rem' }}
                >
                  Créer l'utilisateur
                </GradientButton>
                <SecondaryButton
                  onClick={() => navigate('/admin/users')}
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

export default CreateUser;
