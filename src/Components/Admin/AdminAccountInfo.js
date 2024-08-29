import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Button, TextField, Grid } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';

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

const AdminAccountInfo = () => {
  const [adminInfo, setAdminInfo] = useState({
    id: '',
    userName: '',
    email: '',
  });

  const [originalAdminInfo, setOriginalAdminInfo] = useState({}); // Pour sauvegarder les infos originales
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Restaurer les valeurs d'origine
      setAdminInfo(originalAdminInfo);
    } else {
      // Sauvegarder les valeurs actuelles avant édition
      setOriginalAdminInfo({ ...adminInfo });
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:44396/api/Admin/AdminInfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminInfo(response.data);
        setOriginalAdminInfo(response.data); // Sauvegarder l'état initial
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleChangePassword = async () => {
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError('Please enter your current password.');
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setNewPasswordError('New passwords do not match.');
      setConfirmPasswordError('New passwords do not match.');
      hasError = true;
    }

    if (hasError) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://localhost:44396/api/Admin/ChangePassword',
        { currentPassword, newPassword, confirmNewPassword: confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error.response?.data || 'Error changing password';
      if (
        typeof errorMessage === 'string' &&
        errorMessage.includes('incorrect')
      ) {
        setCurrentPasswordError('The current password is incorrect.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://localhost:44396/api/Admin/EditUser',
        { userId: adminInfo.id, userName: adminInfo.userName, email: adminInfo.email, role: 'Admin' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data || 'Account information updated successfully');
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data || 'Error updating account information';
      toast.error(errorMessage);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <GlassCard>
              <Title>Admin Account Information</Title>
              {isEditing ? (
                <>
                  <TextField
                    label="Username"
                    value={adminInfo.userName}
                    onChange={(e) => setAdminInfo({ ...adminInfo, userName: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    value={adminInfo.email}
                    onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <GradientButton
                      type="button"
                      fullWidth
                      sx={{ fontSize: '1rem', marginRight: '1rem' }}
                      onClick={handleUpdateInfo}
                    >
                      Save Changes
                    </GradientButton>
                    <GradientButton
                      type="button"
                      fullWidth
                      sx={{ fontSize: '1rem' }}
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </GradientButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <AccountCircleIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                    <strong>{adminInfo.userName}</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <EmailIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} />
                    <strong>{adminInfo.email}</strong>
                  </Typography>
                  <GradientButton
                    type="button"
                    fullWidth
                    sx={{ fontSize: '1rem', marginTop: '1rem' }}
                    onClick={handleEditToggle}
                  >
                    Edit Info
                  </GradientButton>
                </>
              )}
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlassCard>
              <Title>Change Password</Title>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { marginBottom: '1rem' },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={!!currentPasswordError}
                  helperText={currentPasswordError}
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!newPasswordError}
                  helperText={newPasswordError}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                />
                <GradientButton
                  type="button"
                  fullWidth
                  sx={{ fontSize: '1rem', marginTop: '1rem' }}
                  onClick={handleChangePassword}
                >
                  Change Password
                </GradientButton>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default AdminAccountInfo;
