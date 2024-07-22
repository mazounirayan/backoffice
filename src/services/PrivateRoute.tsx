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

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  return element;
};

export default PrivateRoute;
