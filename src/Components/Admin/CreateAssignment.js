import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Paper, Typography, Button, TextField, MenuItem, Grid } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#9c27b0', // Change this to the color of your "Retour à la liste" button
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

function CreateAssignment() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('https://localhost:44396/api/Admin/GetUsers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setUsers(response.data))
      .catch(error => toast.error(`Erreur lors de la récupération des utilisateurs: ${error.message}`));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const token = localStorage.getItem('token');

      axios.get(`https://localhost:44396/api/Admin/GetProjectsNotAssignedToUser/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setFilteredProjects(response.data))
        .catch(error => toast.error(`Erreur lors de la récupération des projets: ${error.message}`));
    }
  }, [selectedUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProject || !selectedUser) {
      toast.error("Tous les champs sont requis");
      return;
    }

    const token = localStorage.getItem('token');
    const assignment = {
      projectId: selectedProject,
      userId: selectedUser
    };

    axios.post('https://localhost:44396/api/Admin/AssignUserToProject', assignment, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success('Assignement créé avec succès');
        navigate('/admin/assignments', { state: { message: 'Assignement ajouté avec succès', type: 'success' } });
      })
      .catch(error => toast.error(`Erreur lors de la création de l'assignement: ${error.message}`));
  };

  const handleBackToList = () => {
    navigate('/admin/assignments');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <ToastContainer />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Créer un assignement</Title>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Utilisateur"
                  select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                >
                  <MenuItem value="">
                    Sélectionnez un utilisateur
                  </MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>{user.userName}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Projet"
                  select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  disabled={!selectedUser}
                >
                  <MenuItem value="">
                    Sélectionnez un projet
                  </MenuItem>
                  {filteredProjects.map(project => (
                    <MenuItem key={project.id} value={project.id}>{project.projectName}</MenuItem>
                  ))}
                </TextField>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <GradientButton
                    type="submit"
                    sx={{ marginRight: '1rem' }}
                  >
                    Créer
                  </GradientButton>
                  <SecondaryButton
                    onClick={handleBackToList}
                  >
                    Retour à la liste
                  </SecondaryButton>
                </Box>
              </form>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default CreateAssignment;
