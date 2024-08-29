import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element }) {
  const token = localStorage.getItem('token');

  return token ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
