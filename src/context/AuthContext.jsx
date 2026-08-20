import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nexora_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexora_user');
    }
  }, [user]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const { token, user: loggedInUser } = await authService.login(username, password);
      localStorage.setItem('nexora_token', token);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user');
    setUser(null);
  }, []);

  const signup = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { token, user: newUser } = await authService.signup(payload);
      localStorage.setItem('nexora_token', token);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { user, loading, login, logout, signup, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
