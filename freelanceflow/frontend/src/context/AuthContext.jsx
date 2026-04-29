// Authentication context and provider.
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister, refreshToken as apiRefresh } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const storeSession = (token, refreshToken, userData) => {
    localStorage.setItem('ff_access_token', token);
    localStorage.setItem('ff_refresh_token', refreshToken);
    localStorage.setItem('ff_user', JSON.stringify(userData));
    setUser(userData);
  };

  const clearSession = () => {
    localStorage.removeItem('ff_access_token');
    localStorage.removeItem('ff_refresh_token');
    localStorage.removeItem('ff_user');
    setUser(null);
  };

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    storeSession(data.token, data.refreshToken, data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    return data;
  }, []);

  const refresh = useCallback(async () => {
    const refreshTokenValue = localStorage.getItem('ff_refresh_token');
    if (!refreshTokenValue) return null;
    const data = await apiRefresh(refreshTokenValue);
    localStorage.setItem('ff_access_token', data.token);
    localStorage.setItem('ff_refresh_token', data.refreshToken);
    return data.token;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('ff_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, refresh, logout, setUser }),
    [user, loading, login, register, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
