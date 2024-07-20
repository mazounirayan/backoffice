import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  role: string;
  nom: string;
  prenom: string;
  email: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
}

interface UserContextType {
  user: User | null;
  token: string | null;
  updatePassword: (userId: number, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const savedToken = localStorage.getItem('token');
    if (loggedInUser && savedToken) {
      setUser(loggedInUser);
      setToken(savedToken);
    }
  }, []);

  const updatePassword = async (userId: number, newPassword: string) => {
    if (!token) throw new Error('No token available');
    const response = await fetch(`https://pa-api-0tcm.onrender.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ password: newPassword })
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }
  };

  return (
    <UserContext.Provider value={{ user, token, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
