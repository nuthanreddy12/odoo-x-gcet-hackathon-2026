import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('stocksense_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      email: 'admin@stocksense.io',
      full_name: 'Alex Morgan',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    };
  });

  const login = async (email: string): Promise<boolean> => {
    // Attempt backend or provide local authenticated session
    const loggedUser: User = {
      id: 1,
      email,
      full_name: email.split('@')[0],
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    };
    setUser(loggedUser);
    localStorage.setItem('stocksense_user', JSON.stringify(loggedUser));
    localStorage.setItem('stocksense_token', 'demo-jwt-token-stocksense');
    return true;
  };

  const signup = async (email: string, _pass: string, name: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now(),
      email,
      full_name: name,
      role: 'inventory_manager',
      is_active: true,
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('stocksense_user', JSON.stringify(newUser));
    localStorage.setItem('stocksense_token', 'demo-jwt-token-stocksense');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stocksense_user');
    localStorage.removeItem('stocksense_token');
  };

  const demoLogin = () => {
    login('admin@stocksense.io');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
