import axios from "axios";
import { useNavigate } from 'react-router-dom';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  token: string;
  numTel: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
  updatePassword: (userId: number, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = async (email: string, motDePasse: string) => {
    try {
      const response = await axios.post('https://pa-api-0tcm.onrender.com/auth/login', { email, motDePasse }, { adapter: 'fetch' });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      console.log('Utilisateur connecté:', user);
      navigate('/'); // Redirect to the homepage after login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed', error);
        throw new Error('Login failed. Please check your email and password.');
      } else {
        console.error('An unexpected error occurred', error);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const updatePassword = async (userId: number, newPassword: string) => {
    if (!token) throw new Error('No token available');
    try {
      const response = await axios.patch(`https://pa-api-0tcm.onrender.com/users/${userId}`, {
        password: newPassword ,  token 
      });
      if (!response.data.success) {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
