// src/components/PasswordRecovery.js
import React, { useState } from 'react';
import axios from 'axios';
import { MDBContainer, MDBCol, MDBRow, MDBBtn } from 'mdb-react-ui-kit';
import '../App.css';
function PasswordRecovery() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        'https://localhost:44396/api/Account/PasswordRecovery',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Password recovery email sent:', response.data);
      setSuccessMessage('An email has been sent to your address with instructions to reset your password.');
    } catch (error) {
      console.error('Password recovery error:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to send password recovery email: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col='12'>
          <div className="form-container">
            <h3 className="text-center mb-4">Password Recovery</h3>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handlePasswordRecovery}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <MDBBtn className="login-btn mb-0" size='lg' type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Send Recovery Email'}
              </MDBBtn>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default PasswordRecovery;
