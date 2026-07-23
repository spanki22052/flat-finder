import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../shared/api/client';
import type { User } from '../../shared/api/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string, email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    apiClient.get<{ data: { user: User } }>('/auth/me')
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = useCallback(async (login: string, password: string) => {
    const res = await apiClient.post<{ data: { user: User; accessToken: string } }>('/auth/login', { login, password });
    const { user: u, accessToken } = res.data.data;
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setUser(u);
  }, []);

  const register = useCallback(async (username: string, password: string, name: string, email?: string) => {
    const res = await apiClient.post<{ data: { user: User; accessToken: string } }>('/auth/register', { username, password, name, email });
    const { user: u, accessToken } = res.data.data;
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
