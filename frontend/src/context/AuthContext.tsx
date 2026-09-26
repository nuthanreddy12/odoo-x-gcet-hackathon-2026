import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isManager: boolean;
  isStaff: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name: string, role?: string) => Promise<boolean>;
  logout: () => void;
  demoLogin: () => void;
  demoLoginStaff: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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

  const isManager = user?.role === 'admin' || user?.role === 'inventory_manager';
  const isStaff = user?.role === 'warehouse_staff';

  const login = async (email: string, pass: string = 'admin123'): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('stocksense_user', JSON.stringify(data.user));
        localStorage.setItem('stocksense_token', data.access_token);
        return true;
      }
    } catch {
      // Backend unavailable; fallback to local session
    }

    const defaultRole = email.includes('staff') ? 'warehouse_staff' : 'admin';
    const loggedUser: User = {
      id: email.includes('staff') ? 2 : 1,
      email,
      full_name: email.split('@')[0],
      role: defaultRole,
      is_active: true,
      created_at: new Date().toISOString()
    };
    setUser(loggedUser);
    localStorage.setItem('stocksense_user', JSON.stringify(loggedUser));
    return true;
  };

  const signup = async (email: string, pass: string, name: string, role: string = 'inventory_manager'): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: pass,
          full_name: name,
          role
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('stocksense_user', JSON.stringify(data.user));
        localStorage.setItem('stocksense_token', data.access_token);
        return true;
      }
    } catch {
      // Backend unavailable; fallback to local session
    }

    const newUser: User = {
      id: Date.now(),
      email,
      full_name: name,
      role,
      is_active: true,
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('stocksense_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stocksense_user');
    localStorage.removeItem('stocksense_token');
  };

  const demoLogin = () => {
    login('admin@stocksense.io', 'admin123');
  };

  const demoLoginStaff = () => {
    login('staff@stocksense.io', 'staff123');
  };

  // Ensure an existing or default session has a valid backend JWT instead of the fake demo string
  useEffect(() => {
    const existingToken = localStorage.getItem('stocksense_token');
    if (!existingToken || existingToken === 'demo-jwt-token-stocksense') {
      login('admin@stocksense.io', 'admin123');
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isManager,
      isStaff,
      login,
      signup,
      logout,
      demoLogin,
      demoLoginStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
