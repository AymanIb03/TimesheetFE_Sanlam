import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, Select, MenuItem, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Paper, Typography, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
  fontSize: '1.25rem',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1rem',
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: 'center',
}));

const AdminTimesheetDownload = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const usersResponse = await axios.get('https://localhost:44396/api/Admin/GetUsers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProjectsForUser = async () => {
      if (selectedUser) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://localhost:44396/api/Admin/GetProjectsForUser/${selectedUser}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProjects(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des projets pour l\'utilisateur:', error);
        }
      }
    };

    fetchProjectsForUser();
  }, [selectedUser]);

  const checkTimesheets = async () => {
    if (!selectedUser || !selectedProject || !dateRange[0] || !dateRange[1]) {
      alert('Veuillez sélectionner un utilisateur, un projet et une plage de dates.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `https://localhost:44396/api/Admin/DownloadTimesheets`, 
        {
          params: {
            userId: selectedUser,
            projectId: selectedProject,
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD')
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob' 
        }
      );

      const contentType = response.headers['content-type'];
      console.log('Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          const responseData = JSON.parse(reader.result);
          console.log('Response Data:', responseData);
          if (responseData.message) {
            setPendingResponse(responseData);
            setOpen(true);
          }
        };
        reader.readAsText(response.data);
      } else {
        downloadFile(response.data, response.headers['content-disposition']);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement des timesheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (data, contentDisposition) => {
    let fileName = 'Timesheets.xlsx';

    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
      const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://localhost:44396/api/Admin/DownloadTimesheets`, 
        {
          params: {
            userId: selectedUser,
            projectId: selectedProject,
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
            proceed: true 
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob' 
        }
      );

      downloadFile(response.data, response.headers['content-disposition']);
    } catch (error) {
      console.error("Erreur lors de la confirmation du téléchargement :", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPendingResponse(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Title>Télécharger les Timesheets</Title>
              <FormControl fullWidth margin="normal">
                <InputLabel>Choisir un utilisateur</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  label="Choisir un utilisateur"
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Choisir un projet</InputLabel>
                <Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  label="Choisir un projet"
                >
                  {projects.map((project) => (
                    <MenuItem key={project.projectId} value={project.projectId}>
                      {project.projectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker
                  startText="Début"
                  endText="Fin"
                  value={dateRange}
                  onChange={(newValue) => setDateRange(newValue)}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} fullWidth margin="normal" />
                      <Box sx={{ mx: 2 }}> - </Box>
                      <TextField {...endProps} fullWidth margin="normal" />
                    </>
                  )}
                />
              </LocalizationProvider>

              <GradientButton
                variant="contained"
                onClick={checkTimesheets}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Télécharger'}
              </GradientButton>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>

      {/* Modal de confirmation */}
      <StyledDialog
        open={open}
        onClose={handleClose}
      >
        <StyledDialogTitle>Confirmation</StyledDialogTitle>
        <StyledDialogContent>
          <DialogContentText>
            Certaines timesheets dans la période sélectionnée ne sont pas validées. Voulez-vous continuer avec seulement les timesheets validées ?
          </DialogContentText>
          {pendingResponse && pendingResponse.invalidTimesheets && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>Timesheets non validées :</Typography>
              <ul>
                {pendingResponse.invalidTimesheets.map((timesheet) => (
                  <li key={timesheet.id}>
                    Date: {timesheet.date}, Heures travaillées: {timesheet.hoursWorked}, Statut: {timesheet.isValidated === false ? "Rejetée" : "En attente"}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          <GradientButton onClick={handleClose} color="primary">
            Annuler
          </GradientButton>
          <GradientButton onClick={handleConfirm} color="primary" autoFocus>
            Continuer
          </GradientButton>
        </StyledDialogActions>
      </StyledDialog>
    </ThemeProvider>
  );
};

export default AdminTimesheetDownload;
