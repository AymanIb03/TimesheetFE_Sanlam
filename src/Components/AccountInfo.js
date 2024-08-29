import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#00d4ff',
    },
    background: {
      default: '#edf6f9',
    },
    text: {
      primary: '#343a40',
      secondary: '#495057',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    body1: {
      fontWeight: '400',
      fontSize: '1rem', // Reduced font size
    },
    subtitle1: {
      fontWeight: '500',
      fontSize: '1.25rem', // Reduced font size
      letterSpacing: '0.05em',
      color: '#007bff',
    },
  },
});

const GlassCard = styled(Paper)(({ theme }) => ({
  borderRadius: '10px', // Reduced border radius
  padding: theme.spacing(3), // Reduced padding
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)', // Reduced blur
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', // Reduced shadow
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  },
  textAlign: 'left',
  border: `2px solid ${theme.palette.primary.main}`,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px', // Reduced border radius
  padding: theme.spacing(1), // Reduced padding
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
  fontSize: '1.5rem', // Reduced font size
  marginBottom: theme.spacing(1.5), // Reduced margin
  textAlign: 'center',
  textTransform: 'uppercase',
}));

function AccountInfo() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get('https://localhost:44396/api/Timesheet/UserInfo', config)
      .then(response => {
        setUsername(response.data.userName);
        setEmail(response.data.email);
      })
      .catch(error => console.error('Erreur lors de la récupération des informations du compte:', error));
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Réinitialiser les messages d'erreur
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError('Veuillez entrer votre mot de passe actuel.');
      hasError = true;
    }

    if (newPassword !== confirmNewPassword) {
      setNewPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      setConfirmPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      hasError = true;
    }

    if (hasError) {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const data = {
      currentPassword,
      newPassword,
      confirmNewPassword
    };

    axios.post('https://localhost:44396/api/Timesheet/ChangePassword', data, config)
      .then(response => {
        toast.success('Mot de passe modifié avec succès');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      })
      .catch(error => {
        console.error('Erreur lors du changement de mot de passe:', error);

        if (error.response && error.response.data && error.response.data.includes('incorrect')) {
          setCurrentPasswordError('Le mot de passe actuel est incorrect.');
        } else {
          toast.error('Erreur lors du changement de mot de passe');
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', padding: '1.5rem' }}>
        <ToastContainer />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <GlassCard>
              <Title>
                Account Information
              </Title>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <AccountCircleIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} /> <strong>{username}</strong>
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ marginRight: '0.5rem', color: '#007bff' }} /> <strong>{email}</strong>
              </Typography>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlassCard>
              <Title>
                Change Password
              </Title>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { marginBottom: '1rem' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleChangePassword}
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
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                />
                <GradientButton
                  type="submit"
                  fullWidth
                  sx={{ fontSize: '1rem', marginTop: '1rem' }}
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
}

export default AccountInfo;
