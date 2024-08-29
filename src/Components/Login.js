import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import sanlamLogo from '../assets/SanlamFooter.png';
import '../App.css';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      if (role === 'Admin') {
        navigate('/admin/users');
      } else if (role) {
        navigate('/user-dashboard');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        'https://localhost:44396/api/Account/Login',
        { userName, password, rememberMe },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.token && response.data.role) {
        const { token, role } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        if (role === 'Admin') {
          navigate('/admin/users');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        throw new Error('La réponse de l\'API ne contient pas le rôle ou le token.');
      }
    } catch (error) {
      setErrorMessage('Login failed: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow className="d-flex align-items-center">
        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
        </MDBCol>

        <MDBCol col='4' md='6'>
          <div className="form-container shadow-lg p-5 rounded" style={{ backgroundColor: 'white', boxShadow: '0px 4px 15px rgba(0, 100, 175, 0.4)' }}>
            <div className="text-center mb-4">
              <img src={sanlamLogo} alt="Sanlam Assurance Maroc" style={{ height: '50px' }} />
            </div>

            <h2 className="text-center mb-4" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0064af', textTransform: 'uppercase' }}>Welcome Back!</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <span className="input-group-text" style={{ backgroundColor: 'white', border: '1px solid #0064af' }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#0064af' }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  style={{ border: '1px solid #0064af' }}
                />
              </div>
              <div className="input-group mb-4">
                <span className="input-group-text" style={{ backgroundColor: 'white', border: '1px solid #0064af' }}>
                  <FontAwesomeIcon icon={faLock} style={{ color: '#0064af' }} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ border: '1px solid #0064af' }}
                />
                <span
                  className="input-group-text"
                  style={{ backgroundColor: 'white', border: '1px solid #0064af', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: '#0064af' }} />
                </span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox
                  name='flexCheck'
                  checked={rememberMe}
                  id='flexCheckDefault'
                  label='Remember me'
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span
                  className="forgot-password-link"
                  onClick={handleForgotPassword}
                  style={{ cursor: 'pointer', color: '#0064af', textDecoration: 'underline' }}
                >
                  Forgot password?
                </span>
              </div>

              <MDBBtn className="login-btn mb-0 w-100" size='lg' type="submit" disabled={loading} style={{ backgroundColor: '#0064af', border: 'none' }}>
                {loading ? 'Loading...' : 'Login'}
              </MDBBtn>
            </form>
          </div>
        </MDBCol>
      </MDBRow>

      <div className="footer text-white d-flex align-items-center justify-content-center py-3" style={{ backgroundColor: '#0064af' }}>
        <div className="container text-center">
          <p className="mb-0">© SANLAM ASSURANCE | MAROC 2024.</p>
        </div>
      </div>
    </MDBContainer>
  );
}

export default Login;
