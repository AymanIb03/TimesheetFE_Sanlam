import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, Grid } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
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
  padding: theme.spacing(1),
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #007bff, #00d4ff)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
  transition: 'transform 0.3s ease',
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

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://localhost:44396/api/Admin/GetUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setUser(response.data);
        setProjects(response.data.assignments); // Obtenir les projets affectés
        setRoles(response.data.roles); // Obtenir les rôles
      })
      .catch(error => console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error));
  }, [userId]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Détails de l'utilisateur</Title>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <AccountCircleIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                <strong>{user.userName}</strong>
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <EmailIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                <strong>{user.email}</strong>
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <CheckCircleIcon sx={{ marginRight: '0.5rem', color: user.isActive ? '#388e3c' : '#d32f2f' }} />
                <strong>Actif :</strong> {user.isActive ? 'Oui' : 'Non'}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <WorkIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                <strong>Rôle(s) :</strong> {roles.length > 0 ? roles.join(', ') : 'Aucun rôle attribué'}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                <AssignmentIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                Projets affectés :
              </Typography>
              <Box component="ul" sx={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                {projects.length > 0 ? (
                  projects.map(project => (
                    <Box component="li" key={project.projectId} sx={{ color: '#007bff', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {project.projectName}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                    Aucun projet affecté
                  </Typography>
                )}
              </Box>
              <GradientButton
                type="button"
                fullWidth
                sx={{ fontSize: '1rem', marginTop: '1rem' }}
                onClick={() => navigate('/admin/users')}
              >
                Retour à la liste
              </GradientButton>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default UserDetails;
