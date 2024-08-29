import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, FormControl, InputLabel, Select, MenuItem, Box, Card, CardContent, IconButton, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
    },
    secondary: {
      main: '#FF9800',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#4CAF50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: {
      fontWeight: '700',
      fontSize: '1.75rem',
      color: '#1976D2',
      letterSpacing: '0.05em',
    },
    body1: {
      fontWeight: '400',
      fontSize: '1rem',
      color: '#333',
    },
    button: {
      textTransform: 'none',
    },
  },
});

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #E3F2FD, #ffffff)',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  },
}));

const ActionIconButton = styled(IconButton)(({ theme, colorType }) => ({
  color: theme.palette[colorType].main,
  position: 'relative',
  marginRight: '8px', // Add small space between buttons
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette[colorType].main,
    opacity: 0.1,
    borderRadius: '50%',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  },
  '&:hover:before': {
    transform: 'scale(1.3)',
    opacity: 0.2,
  },
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  background: '#fff',
  padding: theme.spacing(4),
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
}));

function Timesheets() {
  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [projectNameFilter, setProjectNameFilter] = useState('');
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [projectNames, setProjectNames] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const successMessage = localStorage.getItem('timesheetEditSuccess');
    if (successMessage) {
      toast.success(successMessage);
      localStorage.removeItem('timesheetEditSuccess');
    }

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get('https://localhost:44396/api/Timesheet', config)
      .then(response => {
        const timesheetsData = response.data.map(timesheet => ({
          ...timesheet,
          projectName: timesheet.projectName || 'Projet non disponible',
        }));
        setTimesheets(timesheetsData);
        setFilteredTimesheets(timesheetsData);

        const uniqueProjectNames = [...new Set(timesheetsData.map(ts => ts.projectName))];
        setProjectNames(uniqueProjectNames);
      })
      .catch(error => console.error('Erreur lors de la récupération des timesheets:', error));
  }, []);

  useEffect(() => {
    let filteredData = timesheets;

    if (projectNameFilter) {
      filteredData = filteredData.filter(timesheet =>
        timesheet.projectName.toLowerCase() === projectNameFilter.toLowerCase()
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter(timesheet => {
        if (statusFilter === 'validated') return timesheet.isValidated === true;
        if (statusFilter === 'pending') return timesheet.isValidated === null;
        if (statusFilter === 'rejected') return timesheet.isValidated === false;
        return true;
      });
    }

    if (dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter(timesheet =>
        new Date(timesheet.date) >= dateRange[0] && new Date(timesheet.date) <= dateRange[1]
      );
    }

    filteredData.sort((a, b) => {
      if (a.projectName.toLowerCase() < b.projectName.toLowerCase()) return -1;
      if (a.projectName.toLowerCase() > b.projectName.toLowerCase()) return 1;
      return new Date(a.date) - new Date(b.date);
    });

    setFilteredTimesheets(filteredData);
  }, [projectNameFilter, statusFilter, dateRange, timesheets]);

  const handleEdit = (id) => {
    navigate(`/edit-timesheet/${id}`);
  };

  const handleDelete = (id) => {
    setTimesheetToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.delete(`https://localhost:44396/api/Timesheet/${timesheetToDelete}`, config)
      .then(response => {
        setTimesheets(prevTimesheets => prevTimesheets.filter(ts => ts.id !== timesheetToDelete));
        setShowModal(false);
        toast.success('Timesheet supprimé avec succès');
      })
      .catch(error => {
        console.error("Erreur lors de la suppression du timesheet:", error);
        toast.error('Erreur lors de la suppression du timesheet');
      });
  };

  const getStatusLabel = (isValidated) => {
    const badgeStyle = {
      padding: '8px 12px',
      fontSize: '14px',
      width: '100px',
      textAlign: 'center',
      borderRadius: '10px',
      color: '#fff',
    };

    if (isValidated === null) {
      return <span style={{ ...badgeStyle, backgroundColor: '#6c757d' }}>En attente</span>;
    } else if (isValidated === true) {
      return <span style={{ ...badgeStyle, backgroundColor: theme.palette.success.main }}>Validé</span>;
    } else if (isValidated === false) {
      return <span style={{ ...badgeStyle, backgroundColor: '#D32F2F' }}>Rejeté</span>;
    } else {
      return <span style={{ ...badgeStyle, backgroundColor: '#343a40' }}>Inconnu</span>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem' }}>
        <ToastContainer />
        <Box sx={{ padding: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '15px', backgroundColor: '#ffffff' }}>
          <Box mb={4}>
            <h3 style={{ textAlign: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>Liste des Timesheets</h3>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <FormControl fullWidth sx={{ maxWidth: 200 }}>
              <InputLabel id="projectFilterLabel">Filtrer par projet</InputLabel>
              <Select
                labelId="projectFilterLabel"
                id="projectFilter"
                value={projectNameFilter}
                label="Filtrer par projet"
                onChange={(e) => setProjectNameFilter(e.target.value)}
              >
                <MenuItem value="">Tous les projets</MenuItem>
                {projectNames.map((projectName, index) => (
                  <MenuItem key={index} value={projectName}>{projectName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ maxWidth: 200 }}>
              <InputLabel id="statusFilterLabel">Filtrer par statut</InputLabel>
              <Select
                labelId="statusFilterLabel"
                id="statusFilter"
                value={statusFilter}
                label="Filtrer par statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="validated">Validé</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="rejected">Rejeté</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" onClick={() => setDateRange([dayjs().startOf('week'), dayjs()])}>THIS WEEK</Button>
            <Button variant="outlined" onClick={() => setDateRange([dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')])}>LAST MONTH</Button>
            <Button variant="outlined" onClick={() => setDateRange([dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month')])}>NEXT MONTH</Button>
            <Button variant="outlined" onClick={() => setDateRange([dayjs().startOf('month'), dayjs()])}>RESET</Button>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                startText="Start"
                endText="End"
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} fullWidth sx={{ maxWidth: 150, marginLeft: 1 }} />
                    <Box sx={{ mx: 1 }}> - </Box>
                    <TextField {...endProps} fullWidth sx={{ maxWidth: 150 }} />
                  </>
                )}
              />
            </LocalizationProvider>
          </Box>

          {filteredTimesheets.length > 0 ? (
            <Grid container spacing={3}>
              {filteredTimesheets.map(timesheet => (
                <Grid item xs={12} sm={6} md={4} key={timesheet.id}>
                  <GradientCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <h4 style={{ margin: 0, color: theme.palette.primary.main }}>{timesheet.projectName}</h4>
                          <p style={{ margin: 0, color: '#333' }}>{new Date(timesheet.date).toLocaleDateString()}</p>
                          <p style={{ margin: 0, fontWeight: 'bold', color: '#555' }}>{timesheet.hoursWorked} Heures</p>
                        </Box>
                        <Box display="flex" alignItems="center">
                          {getStatusLabel(timesheet.isValidated)}
                          <ActionIconButton
                            onClick={() => handleEdit(timesheet.id)}
                            colorType="secondary"
                            sx={{ marginLeft: 1 }} // Reduced space for smaller gap
                            disabled={timesheet.isValidated === true}
                          >
                            <EditIcon />
                            {timesheet.isValidated === false && (
                              <WarningAmberIcon color="error" fontSize="small" sx={{ marginLeft: 0.5 }} />
                            )}
                          </ActionIconButton>
                          <ActionIconButton
                            onClick={() => handleDelete(timesheet.id)}
                            colorType="error"
                            disabled={timesheet.isValidated === true || timesheet.isValidated === false}
                          >
                            <DeleteIcon />
                          </ActionIconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </GradientCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <p style={{ textAlign: 'center', color: '#555' }}>Aucun timesheet disponible</p>
          )}
        </Box>

        <StyledModal open={showModal} onClose={() => setShowModal(false)}>
          <ModalContent>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Confirmation de suppression</h2>
            <p style={{ marginBottom: '20px', color: '#555' }}>Êtes-vous sûr de vouloir supprimer ce timesheet ?</p>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowModal(false)} variant="outlined" color="primary" sx={{ marginRight: 2 }}>
                Annuler
              </Button>
              <Button onClick={confirmDelete} variant="contained" color="error">
                Supprimer
              </Button>
            </Box>
          </ModalContent>
        </StyledModal>
      </Box>
    </ThemeProvider>
  );
}

export default Timesheets;
