import axios from "axios";
import { useNavigate } from 'react-router-dom';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  token:string;
  numTel :string
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
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
  }, []);


  const login = async (email: string, motDePasse: string) => {
    try {
      const response = await axios.post('http://localhost:3006/auth/login', { email, motDePasse });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      console.log('Utilisateur connecté:', user);
      navigate('/'); // Redirect to the homepage after login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Si l'erreur est une erreur Axios, vous pouvez accéder aux détails de l'erreur Axios
        console.error('Login failed', error);
        throw new Error('Login failed. Please check your email and password.');
      } else {
        // Sinon, l'erreur est une autre erreur JavaScript
        console.error('An unexpected error occurred', error);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };




  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
