import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = authService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = (data) => {
    const result = authService.register(data);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = () => {
    const session = authService.getSession();
    setUser(session);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
