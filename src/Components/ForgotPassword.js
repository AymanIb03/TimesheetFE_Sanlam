import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import sanlamLogo from '../assets/SanlamFooter.png';
import '../App.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setMessage('');

    try {
      const response = await axios.post(
        'https://localhost:44396/api/Account/ForgotPassword',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      setMessage('A reset password email has been sent.');
    } catch (error) {
      setErrorMessage('Error: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
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

            <h3 className="text-center mb-4" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0064af' }}>Forgot Password</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label htmlFor="email" style={{ color: '#0064af', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
                  Please enter your email address:
                </label>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ border: '1px solid #0064af' }}
                  />
                </div>
              </div>

              <MDBBtn className="login-btn mb-3 w-100" size='lg' type="submit" disabled={loading} style={{ backgroundColor: '#0064af', border: 'none', transition: 'none' }}>
                {loading ? 'Loading...' : 'Send Reset Email'}
              </MDBBtn>

              <MDBBtn className="login-btn w-100" size='lg' type="button" onClick={handleCancel} style={{ backgroundColor: '#9c27b0', border: 'none', transition: 'none' }}>
                Cancel
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

export default ForgotPassword;
