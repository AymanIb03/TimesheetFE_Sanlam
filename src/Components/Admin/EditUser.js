import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
      main: '#9c27b0',
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

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://localhost:44396/api/Admin/GetUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUserName(response.data.userName);
        setEmail(response.data.email);
        setSelectedRole(response.data.roles[0]); // Assuming the user has only one role
      })
      .catch(error => console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error));

    axios.get('https://localhost:44396/api/Admin/GetRoles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des rôles:', error));
  }, [userId]);

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.post(`https://localhost:44396/api/Admin/EditUser`, 
      { UserId: userId, UserName: userName, Email: email, Role: selectedRole }, 
      { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        toast.success("Utilisateur modifié avec succès");
        navigate('/admin/users');
      })
      .catch(error => {
        console.error('Erreur lors de la modification de l\'utilisateur:', error);
        toast.error("Erreur lors de la modification de l'utilisateur");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Modifier l'utilisateur</Title>
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
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                fullWidth
                margin="normal"
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <GradientButton
                  onClick={handleSave}
                  sx={{ marginRight: '1rem' }}
                >
                  Enregistrer les modifications
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

export default EditUser;
