import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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

function AssignmentsList() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchProject, setSearchProject] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('https://localhost:44396/api/Admin/GetAssignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setAssignments(response.data);
        setFilteredAssignments(response.data);
      })
      .catch(error => {
        toast.error('Erreur lors de la récupération des assignements');
        console.error('Erreur lors de la récupération des assignements:', error);
      });

    axios.get('https://localhost:44396/api/Admin/GetProjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setProjects(response.data))
      .catch(error => toast.error('Erreur lors de la récupération des projets'));

    axios.get('https://localhost:44396/api/Admin/GetUsers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setUsers(response.data))
      .catch(error => toast.error('Erreur lors de la récupération des utilisateurs'));

  }, []);

  useEffect(() => {
    filterAssignments();
  }, [searchProject, searchUser]);

  const filterAssignments = () => {
    let filtered = assignments;

    if (searchProject) {
      filtered = filtered.filter(assignment =>
        assignment.projectName.toLowerCase().includes(searchProject.toLowerCase())
      );
    }

    if (searchUser) {
      filtered = filtered.filter(assignment =>
        assignment.userName.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  };

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    axios.delete(`https://localhost:44396/api/Admin/DeleteAssignment/${assignmentToDelete}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setAssignments(assignments.filter(a => a.id !== assignmentToDelete));
        setFilteredAssignments(filteredAssignments.filter(a => a.id !== assignmentToDelete));
        toast.success('Assignement supprimé avec succès');
        setOpenDialog(false);
      })
      .catch(error => {
        toast.error('Erreur lors de la suppression de l\'assignement');
        console.error('Erreur lors de la suppression de l\'assignement:', error);
      });
  };

  const handleCreateAssignment = () => {
    navigate('/admin/create-assignment');
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
          Liste des assignements
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <FormControl variant="outlined" style={{ minWidth: 300 }}>
            <InputLabel id="project-search-label">Rechercher par projet</InputLabel>
            <Select
              labelId="project-search-label"
              value={searchProject}
              onChange={(e) => setSearchProject(e.target.value)}
              label="Rechercher par projet"
            >
              <MenuItem value="">
                <em>Rechercher par projet</em>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.projectName}>
                  {project.projectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ minWidth: 300 }}>
            <InputLabel id="user-search-label">Rechercher par utilisateur</InputLabel>
            <Select
              labelId="user-search-label"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              label="Rechercher par utilisateur"
            >
              <MenuItem value="">
                <em>Rechercher par utilisateur</em>
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
            onClick={handleCreateAssignment}
          >
            Créer un assignement
          </Button>
        </div>
        {filteredAssignments.length > 0 ? (
          <>
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
              <Table>
                <TableHead style={{ background: 'linear-gradient(135deg, #007bff, #00d4ff)' }}>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nom du projet</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nom d'utilisateur</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAssignments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((assignment, index) => (
                    <TableRow key={assignment.id} hover style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                      <TableCell align="center" style={{ fontSize: '1rem', padding: '8px 16px' }}>{assignment.projectName}</TableCell>
                      <TableCell align="center" style={{ fontSize: '1rem', padding: '8px 16px' }}>{assignment.userName}</TableCell>
                      <TableCell align="center" style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
                        <ActionIconButton 
                          colorType="error" 
                          onClick={() => {
                            setAssignmentToDelete(assignment.id);
                            setOpenDialog(true);
                          }}
                        >
                          <DeleteIcon fontSize="inherit" />
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
                count={filteredAssignments.length}
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
          <Typography sx={{ textAlign: 'center', color: '#757575' }}>Aucun assignement disponible</Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet assignement ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AssignmentsList;
