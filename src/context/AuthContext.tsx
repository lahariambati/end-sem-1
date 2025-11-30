import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (userData: any) => { success: boolean; error?: string };
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo user if no users exist
    const usersData = localStorage.getItem('users');
    if (!usersData) {
      const demoUser = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123'
      };
      localStorage.setItem('users', JSON.stringify([demoUser]));
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    try {
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = (userData: any) => {
    try {
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      if (users.find((u: any) => u.email === userData.email)) {
        return { success: false, error: 'Email already exists' };
      }

      const newUser = { ...userData, id: Date.now().toString() };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};