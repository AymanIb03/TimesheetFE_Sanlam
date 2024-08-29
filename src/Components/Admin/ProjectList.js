import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

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

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get('https://localhost:44396/api/Admin/GetProjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProjects(response.data);
        setFilteredProjects(response.data);
      })
      .catch(error => {
        toast.error('Erreur lors de la récupération des projets');
        console.error('Erreur lors de la récupération des projets:', error);
      });
  }, []);

  useEffect(() => {
    setFilteredProjects(projects.filter(project => 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, projects]);

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === 'success') {
        toast.success(location.state.message);
      } else if (location.state.type === 'error') {
        toast.error(location.state.message);
      }
    }
  }, [location]);

  const handleEdit = (projectId) => {
    navigate(`/admin/edit-project/${projectId}`);
  };

  const handleDelete = (projectId) => {
    const token = localStorage.getItem('token');
    axios.delete(`https://localhost:44396/api/Admin/DeleteProject/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectId));
        setFilteredProjects(filteredProjects.filter(project => project.id !== projectId));
        toast.success('Projet supprimé avec succès');
        setOpenDialog(false);
      })
      .catch(error => {
        toast.error('Erreur lors de la suppression du projet');
        console.error('Erreur lors de la suppression du projet:', error);
        setOpenDialog(false);
      });
  };

  const handleDetails = (projectId) => {
    navigate(`/admin/project-details/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/admin/create-project');
  };

  const handleOpenDialog = (projectId) => {
    setProjectToDelete(projectId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProjectToDelete(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
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
          Liste des projets
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <FormControl variant="outlined" style={{ minWidth: 300 }}>
            <InputLabel id="project-search-label">Rechercher par nom de projet</InputLabel>
            <Select
              labelId="project-search-label"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Rechercher par nom de projet"
            >
              <MenuItem value="">
                <em>Rechercher par nom de projet</em>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.projectName}>
                  {project.projectName}
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
            onClick={handleCreateProject}
          >
            Créer un projet
          </Button>
        </div>
        {filteredProjects.length > 0 ? (
          <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
            <Table>
              <TableHead style={{ background: 'linear-gradient(135deg, #007bff, #00d4ff)' }}>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Nom du projet</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((project, index) => (
                  <TableRow key={project.id} hover style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                    <TableCell align="center" style={{ fontSize: '1rem', padding: '8px 16px' }}>{project.projectName}</TableCell>
                    <TableCell align="center" style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
                      <ActionIconButton
                        colorType="warning"
                        onClick={() => handleEdit(project.id)}
                      >
                        <EditIcon fontSize="inherit" />
                      </ActionIconButton>
                      <ActionIconButton
                        colorType="error"
                        onClick={() => handleOpenDialog(project.id)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </ActionIconButton>
                      <ActionIconButton
                        colorType="primary"
                        onClick={() => handleDetails(project.id)}
                      >
                        <InfoIcon fontSize="inherit" />
                      </ActionIconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ textAlign: 'center', color: '#757575' }}>Aucun projet disponible</Typography>
        )}
      </Paper>

      {/* Dialog de confirmation pour la suppression */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation de suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={() => handleDelete(projectToDelete)} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProjectList;
