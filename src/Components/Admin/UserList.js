import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Typography,
  Box,
  styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get('https://localhost:44396/api/Admin/GetUsers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const filteredUsers = response.data.filter(user => user.roles.includes('User'));
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    const selectedUser = e.target.value;
    setSearchTerm(selectedUser);
    if (selectedUser === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.userName.toLowerCase().includes(selectedUser.toLowerCase())));
    }
  };

  const handleEdit = (userId) => {
    navigate(`/admin/edit-user/${userId}`);
  };

  const handleToggleActive = (userId, isActive) => {
    setSelectedUserId(userId);
    setModalAction(isActive ? 'deactivate' : 'activate');
    setOpenDialog(true);
  };

  const confirmAction = () => {
    const token = localStorage.getItem('token');
    axios.post(`https://localhost:44396/api/Admin/ToggleUserStatus/${selectedUserId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setUsers(users.map(user =>
          user.id === selectedUserId ? { ...user, isActive: modalAction === 'activate' } : user
        ));
        setFilteredUsers(filteredUsers.map(user =>
          user.id === selectedUserId ? { ...user, isActive: modalAction === 'activate' } : user
        ));
        setOpenDialog(false);
        toast.success(`Utilisateur ${modalAction === 'deactivate' ? 'désactivé' : 'activé'} avec succès`);
      })
      .catch(error => {
        console.error('Erreur lors du changement de statut de l\'utilisateur:', error);
        toast.error('Erreur lors du changement de statut de l\'utilisateur');
      });
  };

  const handleDetails = (userId) => {
    navigate(`/admin/user-details/${userId}`);
  };

  const handleCreateUser = () => {
    navigate('/admin/create-user');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
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
          Liste des utilisateurs
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <FormControl variant="outlined" style={{ minWidth: 300 }}>
            <InputLabel id="user-search-label">Rechercher par nom d'utilisateur</InputLabel>
            <Select
              labelId="user-search-label"
              value={searchTerm}
              onChange={handleSearchChange}
              label="Rechercher par nom d'utilisateur"
            >
              <MenuItem value="">
                <em>Rechercher par nom d'utilisateur</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.userName}>
                  {user.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            style={{
              fontWeight: 'bold',
              padding: '0.5rem 2rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #007bff, #00d4ff)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
            }}
            onClick={handleCreateUser}
          >
            Créer un utilisateur
          </Button>
        </div>
        {filteredUsers.length > 0 ? (
          <>
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
              <Table>
                <TableHead style={{ background: 'linear-gradient(135deg, #007bff, #00d4ff)' }}>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nom d'utilisateur</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Email</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Actif</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                    <TableRow key={user.id} hover style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                      <TableCell align="center" style={{ fontSize: '1rem', padding: '8px 16px' }}>{user.userName}</TableCell>
                      <TableCell align="center" style={{ fontSize: '1rem', padding: '8px 16px' }}>{user.email}</TableCell>
                      <TableCell align="center" style={{ fontSize: '1rem', padding: '8px 16px', color: user.isActive ? '#388e3c' : '#d32f2f' }}>
                        {user.isActive ? 'Oui' : 'Non'}
                      </TableCell>
                      <TableCell align="center" style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
                        <ActionIconButton
                          colorType="warning"
                          onClick={() => handleEdit(user.id)}
                        >
                          <EditIcon fontSize="inherit" />
                        </ActionIconButton>
                        <ActionIconButton
                          colorType={user.isActive ? 'error' : 'success'}
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                        >
                          {user.isActive ? <ToggleOffIcon fontSize="large" /> : <ToggleOnIcon fontSize="large" />}
                        </ActionIconButton>
                        <ActionIconButton
                          colorType="primary"
                          onClick={() => handleDetails(user.id)}
                        >
                          <InfoIcon fontSize="inherit" />
                        </ActionIconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem' }}>
              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Lignes par page"
                labelDisplayedRows={() => ''}
                sx={{
                  '& .MuiTablePagination-toolbar': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  },
                  '& .MuiTablePagination-selectLabel': {
                    margin: 0,
                  },
                  '& .MuiTablePagination-input': {
                    marginLeft: '8px',
                    marginRight: '16px',
                  },
                  '& .MuiTablePagination-select': {
                    margin: 0,
                    minWidth: 'auto',
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <Typography sx={{ textAlign: 'center', color: '#757575' }}>Aucun utilisateur disponible</Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Êtes-vous sûr de vouloir ${modalAction === 'deactivate' ? 'désactiver' : 'activer'} cet utilisateur ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" color="primary">
            Annuler
          </Button>
          <Button onClick={confirmAction} variant="contained" color={modalAction === 'deactivate' ? 'error' : 'success'}>
            {modalAction === 'deactivate' ? "Désactiver" : "Activer"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserList;
