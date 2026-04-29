// Authentication context and provider.
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister, refreshToken as apiRefresh } from '../services/api';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

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
    try {
      const data = await apiLogin(email, password);
      storeSession(data.token, data.refreshToken, data.user);
      return data.user;
    } catch (error) {
      if (error?.response?.status === 403) {
        throw new Error('Please verify your email before logging in.');
      }

      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password);
      return {
        ...data,
        message:
          data?.message ||
          `Please verify your email to complete sign up. We sent a verification email to ${email}.`,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Sign up failed'));
    }
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
