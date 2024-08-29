import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
} from 'mdb-react-ui-kit';
import sanlamLogo from '../assets/SanlamFooter.png';
import '../App.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setMessage('');

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setErrorMessage('Invalid password reset token.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:44396/api/Account/ResetPassword',
        { email, token, newPassword, confirmPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      setMessage('Password reset successful.');
      navigate('/login');
    } catch (error) {
      setErrorMessage(`Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
        </MDBCol>
        <MDBCol col='4' md='6'>
          <div className="form-container shadow-lg p-5 rounded" style={{ backgroundColor: 'white', boxShadow: '0px 4px 15px rgba(0, 100, 175, 0.4)' }}>
            <div className="text-center mb-4">
              <img src={sanlamLogo} alt="Sanlam Assurance Maroc" style={{ height: '50px' }} />
            </div>

            <h3 className="text-center mb-4" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0064af' }}>Reset Password</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="newPassword" style={{ color: '#0064af', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ border: '1px solid #0064af' }}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" style={{ color: '#0064af', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ border: '1px solid #0064af' }}
                />
              </div>

              <MDBBtn className="login-btn mb-3 w-100" size='lg' type="submit" disabled={loading} style={{ backgroundColor: '#0064af', border: 'none' }}>
                {loading ? 'Loading...' : 'Reset Password'}
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

export default ResetPassword;
