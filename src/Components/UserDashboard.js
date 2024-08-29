import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

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

const Header = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '1rem',
  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  justifyContent: 'center', // Centrer le texte
  alignItems: 'center',
  borderBottomLeftRadius: '15px',
  borderBottomRightRadius: '15px',
  marginTop: '1rem',  
  marginBottom: '1.5rem', 
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
  },
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

const ProjectCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #ffffff, #d7e1ec)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #e0e7ff, #cfd8dc)',
    transform: 'scale(1.02)',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  marginRight: theme.spacing(2),
}));

const EnhancedGlassCard = styled(GlassCard)(({ theme }) => ({
  border: '2px solid',
  borderColor: theme.palette.primary.light,
  boxShadow: '0 8px 32px rgba(0, 123, 255, 0.2)',
}));

const BackgroundBox = styled(Box)(({ theme }) => ({
  /* backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', */
  minHeight: '100vh',
  padding: '2rem',
  boxSizing: 'border-box',
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const FloatingActionButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  width: 56,
  height: 56,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
  color: '#fff',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function UserDashboard() {
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [username, setUsername] = useState('');
  const [inputError, setInputError] = useState({ projectId: false, date: false });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [newTimesheet, setNewTimesheet] = useState({
    timesheetCode: '',
    projectId: '',
    date: getCurrentDate(),
    hoursWorked: '',
    assignementId: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get('https://localhost:44396/api/Timesheet/UserProjects', config)
      .then(response => setProjects(response.data))
      .catch(error => console.error('Erreur lors de la récupération des projets:', error));

    axios.get('https://localhost:44396/api/Timesheet/AssignmentsByUser', config)
      .then(response => setAssignments(response.data))
      .catch(error => console.error('Erreur lors de la récupération des assignements:', error));

    axios.get('https://localhost:44396/api/Timesheet/UserInfo', config)
      .then(response => setUsername(response.data.userName))
      .catch(error => console.error('Erreur lors de la récupération du nom d\'utilisateur:', error));

    axios.get('https://localhost:44396/api/Timesheet', config)
      .then(response => {
        const timesheetsData = response.data.map(timesheet => {
          const project = projects.find(p => p.id === timesheet.projectId);
          return { ...timesheet, projectName: project ? project.projectName : 'Projet non disponible' };
        });
        setTimesheets(timesheetsData);
      })
      .catch(error => console.error('Erreur lors de la récupération des timesheets:', error));
  }, [projects]);

  useEffect(() => {
    if (newTimesheet.projectId) {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      axios.get(`https://localhost:44396/api/Timesheet/AssignmentsByProject/${newTimesheet.projectId}`, config)
        .then(response => {
          const assignment = response.data[0];
          if (assignment) {
            setNewTimesheet({ ...newTimesheet, assignementId: assignment.id });
          } else {
            console.error('Aucun assignement trouvé pour ce projet.');
          }
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'assignement:', error));
    }
  }, [newTimesheet.projectId]);

  const handleTimesheetSubmit = () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.post('https://localhost:44396/api/Timesheet', newTimesheet, config)
      .then(response => {
        const project = projects.find(p => p.id === response.data.projectId);
        const newTimesheetWithProjectName = {
          ...response.data,
          projectName: project ? project.projectName : 'Projet non disponible'
        };
        setTimesheets([...timesheets, newTimesheetWithProjectName]);
        setNewTimesheet({ projectId: '', date: getCurrentDate(), hoursWorked: '', assignementId: '' });
        setInputError({ projectId: false, date: false });
        toast.success('Timesheet ajouté avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de la soumission du timesheet:', error);
        if (error.response && error.response.data === "Un timesheet pour ce projet et cette date existe déjà.") {
          setInputError({ projectId: true, date: true });
          toast.error('Un timesheet pour ce projet et cette date existe déjà.');
        } else {
          toast.error('Erreur lors de la soumission du timesheet');
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <BackgroundBox>
        <ToastContainer />
        {/* Header */}
        <Header>
          <Typography variant="h5" fontWeight="bold">
            <EmojiPeopleIcon sx={{ marginRight: '0.5rem' }} /> Bonjour, {username || "Utilisateur"}!
          </Typography>
        </Header>
        {/* Sidebar */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250 }}>
            <List>
              <ListItem button>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Timesheets" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Projets" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Infos du compte" />
              </ListItem>
            </List>
            <Divider />
          </Box>
        </Drawer>

        {/* Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <EnhancedGlassCard>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                <FolderIcon sx={{ marginRight: '0.5rem' }} /> Projets affectés
              </Typography>
              <Box>
                {projects.map(project => (
                  <ProjectCard key={project.id}>
                    <UserAvatar>
                      <AssignmentIcon />
                    </UserAvatar>
                    <Typography variant="body1">{project.projectName}</Typography>
                  </ProjectCard>
                ))}
              </Box>
            </EnhancedGlassCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <EnhancedGlassCard>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                <ScheduleIcon sx={{ marginRight: '0.5rem' }} /> Remplir votre Timesheet du jour
              </Typography>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { marginBottom: '1.5rem' },
                }}
                noValidate
                autoComplete="off"
              >
                <AnimatedTextField
                  select
                  label="Sélectionner un projet"
                  fullWidth
                  variant="outlined"
                  value={newTimesheet.projectId}
                  onChange={(e) => setNewTimesheet({ ...newTimesheet, projectId: e.target.value })}
                  error={inputError.projectId}
                  helperText={inputError.projectId && "Un projet doit être sélectionné"}
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.projectName}
                    </MenuItem>
                  ))}
                </AnimatedTextField>
                <AnimatedTextField
                  label="Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={newTimesheet.date}
                  onChange={(e) => setNewTimesheet({ ...newTimesheet, date: e.target.value })}
                  error={inputError.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <AnimatedTextField
                  label="Heures Travaillées"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={newTimesheet.hoursWorked}
                  onChange={(e) => setNewTimesheet({ ...newTimesheet, hoursWorked: e.target.value })}
                />
                <GradientButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleTimesheetSubmit}
                  sx={{ marginTop: '1rem' }}
                  startIcon={<SendIcon />}
                >
                  Soumettre
                </GradientButton>
              </Box>
            </EnhancedGlassCard>
          </Grid>
        </Grid>
      </BackgroundBox>
    </ThemeProvider>
  );
}

export default UserDashboard;
