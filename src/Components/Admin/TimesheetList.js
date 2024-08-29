import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  IconButton,
  Button,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomDateRangePicker from '../CustomDateRangePicker'; 

const ActionIconButton = styled(IconButton)(({ theme, colorType }) => ({
  color: theme.palette[colorType].main,
  position: 'relative',
  border: `2px solid ${theme.palette[colorType].main}`,
  marginRight: '8px',
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: theme.palette[colorType].main,
    color: '#fff',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

function TimesheetList() {
  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [dateRange, setDateRange] = useState([new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('https://localhost:44396/api/Admin/GetTimesheets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTimesheets(response.data);
        setFilteredTimesheets(response.data);
      })
      .catch(error => {
        toast.error('Erreur lors de la récupération des timesheets');
        console.error('Erreur lors de la récupération des timesheets:', error);
      });

    axios.get('https://localhost:44396/api/Admin/GetProjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        toast.error('Erreur lors de la récupération des projets');
        console.error('Erreur lors de la récupération des projets:', error);
      });

    axios.get('https://localhost:44396/api/Admin/GetUsers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUsers(response.data.filter(user => user.roles.includes('User')));
      })
      .catch(error => {
        toast.error('Erreur lors de la récupération des utilisateurs');
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });

  }, []);

  const filterTimesheets = useCallback(() => {
    let filtered = timesheets;

    if (searchProject) {
      filtered = filtered.filter(timesheet =>
        timesheet.projectName.toLowerCase().includes(searchProject.toLowerCase())
      );
    }

    if (searchUser) {
      filtered = filtered.filter(timesheet =>
        timesheet.userName.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    if (searchStatus) {
      filtered = filtered.filter(timesheet => {
        if (searchStatus === 'validé') {
          return timesheet.isValidated === true;
        } else if (searchStatus === 'en attente') {
          return timesheet.isValidated === null;
        } else if (searchStatus === 'rejeté') {
          return timesheet.isValidated === false;
        } else {
          return true;
        }
      });
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(timesheet =>
        new Date(timesheet.date) >= dateRange[0] && new Date(timesheet.date) <= dateRange[1]
      );
    }

    setFilteredTimesheets(filtered);
  }, [searchProject, searchUser, searchStatus, dateRange, timesheets]);

  useEffect(() => {
    filterTimesheets();
  }, [filterTimesheets]);

  const handleShowDialog = (timesheet, type) => {
    setSelectedTimesheet(timesheet);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTimesheet(null);
    setActionType('');
  };

  const handleConfirmAction = () => {
    const token = localStorage.getItem('token');
    const isValidated = actionType === 'validate';

    axios.post(`https://localhost:44396/api/Admin/ValidateTimesheet/${selectedTimesheet.id}`, JSON.stringify(isValidated), {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
    })
      .then(() => {
        const updatedTimesheets = timesheets.map(t =>
          t.id === selectedTimesheet.id
            ? { ...t, isValidated }
            : t
        );
        setTimesheets(updatedTimesheets);
        toast.success(`Timesheet ${isValidated ? 'validé' : 'rejeté'} avec succès`);
      })
      .catch(error => {
        toast.error(`Erreur lors de la ${isValidated ? 'validation' : 'rejet'} du timesheet`);
        console.error(`Erreur lors de la ${isValidated ? 'validation' : 'rejet'} du timesheet:`, error);
      })
      .finally(() => {
        handleCloseDialog();
      });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <ToastContainer />
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '15px', width: '100%' }}>
        <Typography 
          variant="h3" 
          style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #007bff, #00d4ff)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}
        >
          Liste des timesheets
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="searchProjectLabel">Rechercher par projet</InputLabel>
            <Select
              labelId="searchProjectLabel"
              value={searchProject}
              label="Rechercher par projet"
              onChange={(e) => setSearchProject(e.target.value)}
            >
              <MenuItem value="">Tous les projets</MenuItem>
              {projects.map(project => (
                <MenuItem key={project.id} value={project.projectName}>
                  {project.projectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="searchUserLabel">Rechercher par utilisateur</InputLabel>
            <Select
              labelId="searchUserLabel"
              value={searchUser}
              label="Rechercher par utilisateur"
              onChange={(e) => setSearchUser(e.target.value)}
            >
              <MenuItem value="">Tous les utilisateurs</MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.userName}>
                  {user.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="searchStatusLabel">Filtrer par statut</InputLabel>
            <Select
              labelId="searchStatusLabel"
              value={searchStatus}
              label="Filtrer par statut"
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="en attente">En attente</MenuItem>
              <MenuItem value="validé">Validé</MenuItem>
              <MenuItem value="rejeté">Rejeté</MenuItem>
            </Select>
          </FormControl>
          <CustomDateRangePicker onDateChange={setDateRange} />
        </div>
        {filteredTimesheets.length > 0 ? (
          <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
            <Table>
              <TableHead style={{ background: 'linear-gradient(135deg, #007bff, #00d4ff)' }}>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nom du projet</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nom d'utilisateur</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Date</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nombre d'heures</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Statut</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTimesheets.map(timesheet => (
                  <TableRow key={timesheet.id} hover style={{ backgroundColor: timesheet.isValidated === true ? '#e0f7fa' : timesheet.isValidated === false ? '#ffebee' : '#ffffff' }}>
                    <TableCell align="center" style={{ padding: '8px 16px' }}>{timesheet.projectName}</TableCell>
                    <TableCell align="center" style={{ padding: '8px 16px' }}>{timesheet.userName}</TableCell>
                    <TableCell align="center" style={{ padding: '8px 16px' }}>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                    <TableCell align="center" style={{ padding: '8px 16px' }}>{timesheet.hoursWorked}</TableCell>
                    <TableCell align="center" style={{ padding: '8px 16px' }}>
                      {timesheet.isValidated === true ? 'Validé' : timesheet.isValidated === false ? 'Rejeté' : 'En attente'}
                    </TableCell>
                    <TableCell align="center" style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
                      {timesheet.isValidated === true ? (
                        <ActionIconButton colorType="error" onClick={() => handleShowDialog(timesheet, 'reject')}>
                          <CancelIcon fontSize="inherit" />
                        </ActionIconButton>
                      ) : timesheet.isValidated === false ? (
                        <ActionIconButton colorType="success" onClick={() => handleShowDialog(timesheet, 'validate')}>
                          <CheckCircleIcon fontSize="inherit" />
                        </ActionIconButton>
                      ) : (
                        <>
                          <ActionIconButton colorType="success" onClick={() => handleShowDialog(timesheet, 'validate')} style={{ marginRight: '8px' }}>
                            <CheckCircleIcon fontSize="inherit" />
                          </ActionIconButton>
                          <ActionIconButton colorType="error" onClick={() => handleShowDialog(timesheet, 'reject')}>
                            <CancelIcon fontSize="inherit" />
                          </ActionIconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ textAlign: 'center', color: '#757575', marginTop: '2rem' }}>Aucun timesheet disponible</Typography>
        )}
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer l'action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir {actionType === 'validate' ? 'valider' : 'rejeter'} ce timesheet ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmAction} variant="contained" color={actionType === 'validate' ? 'success' : 'error'}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TimesheetList;
