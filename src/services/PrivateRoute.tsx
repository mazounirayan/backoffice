import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthService';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user } = useAuth();
  const location = useLocation();
 const token = localStorage.getItem('token');
  if (!token) {
    // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est connecté, affichez le composant de la route protégée
  return element;
};

export default PrivateRoute;
