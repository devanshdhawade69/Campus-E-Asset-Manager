import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

type User = { token: string } | null;

type AuthContextProps = {
  user: User;
  loading: boolean;
  login: (emailOrRoll: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({token});
    setLoading(false);
  }, []);

  const login = async (emailOrRoll: string, password: string) => {
    const {data} = await api.post('/auth/login', {emailOrRollno: emailOrRoll, password});
    localStorage.setItem('token', data.token);
    setUser({token: data.token});
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
