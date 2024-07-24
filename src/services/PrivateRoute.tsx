import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthService';
import { isTokenExpired } from './tokensHendler'; // Adjust the path as needed

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation();

 const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return element;
};

export default PrivateRoute;
