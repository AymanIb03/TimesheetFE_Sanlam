import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, MenuItem, Box, Paper, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    background: {
      default: '#f0f2f5',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const GlassCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '700px',  // Limite la largeur du formulaire à 700px
  margin: 'auto',  // Centre le formulaire
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #007bff, #00d4ff)',
  color: '#fff',
  boxShadow: '0 4px 20px rgba(0, 123, 255, 0.5)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #00d4ff, #007bff)',
    transform: 'scale(1.08)',
  },
}));

const EnhancedGlassCard = styled(GlassCard)(({ theme }) => ({
  border: '2px solid',
  borderColor: theme.palette.primary.light,
  boxShadow: '0 8px 32px rgba(0, 123, 255, 0.2)',
}));

function EditTimesheet() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [timesheet, setTimesheet] = useState({
    date: '',
    hoursWorked: '',
    projectId: '',
    assignmentId: ''
  });
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get(`https://localhost:44396/api/Timesheet/${id}`, config)
      .then(response => {
        setTimesheet({
          ...response.data,
          projectId: response.data.projectId || '',
          assignmentId: response.data.assignmentId || ''
        });
      })
      .catch(error => console.error('Erreur lors de la récupération du timesheet:', error));

    axios.get('https://localhost:44396/api/Timesheet/UserProjects', config)
      .then(response => setProjects(response.data))
      .catch(error => console.error('Erreur lors de la récupération des projets:', error));
  }, [id]);

  useEffect(() => {
    if (timesheet.projectId) {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      axios.get(`https://localhost:44396/api/Timesheet/AssignmentsByProject/${timesheet.projectId}`, config)
        .then(response => {
          if (response.data && response.data.length > 0) {
            const assignment = response.data[0];
            setTimesheet(prev => ({ ...prev, assignmentId: assignment.id }));
          } else {
            console.error('Aucun assignement trouvé');
          }
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'assignement:', error));
    }
  }, [timesheet.projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const updatedTimesheet = {
        id: timesheet.id,
        date: timesheet.date,
        hoursWorked: parseFloat(timesheet.hoursWorked),
        assignementId: parseInt(timesheet.assignmentId, 10)
    };

    axios.put(`https://localhost:44396/api/Timesheet/${id}`, updatedTimesheet, config)
        .then(() => {
            localStorage.setItem('timesheetEditSuccess', 'Timesheet modifié avec succès');
            toast.success('Timesheet modifié avec succès');  // Afficher le toast de succès
            navigate('/timesheets'); 
        })
        .catch(error => {
            toast.error("Erreur lors de la mise à jour du timesheet");
            console.error("Erreur lors de la mise à jour du timesheet:", error);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />  {/* Ajouter le ToastContainer pour afficher les notifications */}
      <Box sx={{ padding: '2rem' }}>
        <EnhancedGlassCard>
          <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, textAlign: 'center', fontWeight: 'bold' }}>
            📝 Modifier Timesheet
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                '& .MuiTextField-root': { marginBottom: '1.5rem' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={timesheet.date ? timesheet.date.split('T')[0] : ''}
                onChange={(e) => setTimesheet({ ...timesheet, date: e.target.value })}
                required
              />
              <TextField
                label="Heures Travaillées"
                type="number"
                fullWidth
                variant="outlined"
                value={timesheet.hoursWorked}
                onChange={(e) => setTimesheet({ ...timesheet, hoursWorked: e.target.value })}
                required
              />
              <TextField
                select
                label="Projet"
                fullWidth
                variant="outlined"
                value={timesheet.projectId}
                onChange={(e) => setTimesheet({ ...timesheet, projectId: e.target.value })}
                required
              >
                <MenuItem value="" disabled>Sélectionner un projet</MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.id} value={project.id}>{project.projectName}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <GradientButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                startIcon={<SaveIcon />}
              >
                Enregistrer les modifications
              </GradientButton>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/timesheets')}
                startIcon={<ArrowBackIcon />}
              >
                Retour à la liste
              </Button>
            </Box>
          </form>
        </EnhancedGlassCard>
      </Box>
    </ThemeProvider>
  );
}

export default EditTimesheet;
