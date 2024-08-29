import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token d'authentification du stockage local
    localStorage.removeItem('token');

    // Rediriger vers la page de connexion
    navigate('/login');
  }, [navigate]);

  return null; // Pas besoin de rendre quoi que ce soit
}

export default Logout;
