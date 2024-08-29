import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

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

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://localhost:44396/api/Admin/GetProject/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(error => {
        toast.error('Erreur lors de la récupération du projet');
        console.error('Erreur lors de la récupération du projet:', error);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <Typography variant="h6" color="primary">Chargement...</Typography>;
  }

  if (!project) {
    return <Typography variant="h6" color="error">Projet non trouvé</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Détails du projet</Title>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <FolderOpenIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                <strong>Nom du projet:</strong> <span style={{ color: '#007bff', marginLeft: '0.5rem' }}>{project.projectName}</span>
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                Assignments:
              </Typography>
              {project.assignments && project.assignments.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead style={{ backgroundColor: '#007bff' }}>
                      <TableRow>
                        <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="center">
                          <AssignmentIndIcon sx={{ marginRight: '0.5rem' }} />
                          Assigned to
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {project.assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell align="center" sx={{ color: '#007bff', fontWeight: 'bold' }}>
                            {assignment.user ? assignment.user.userName : 'Utilisateur inconnu'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                  Aucun assignment pour ce projet.
                </Typography>
              )}
              <GradientButton
                type="button"
                fullWidth
                sx={{ fontSize: '1rem', marginTop: '1rem' }}
                onClick={() => navigate('/admin/projects')}
              >
                Retour à la liste des projets
              </GradientButton>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default ProjectDetails;
