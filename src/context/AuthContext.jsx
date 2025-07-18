import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../CONFIG/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    userId: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const validateToken = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('🔐 validateToken result:', { status: res.status, data: JSON.stringify(data, null, 2) });
      if (!res.ok) {
        throw new Error(data.message || `Validation failed with status ${res.status}`);
      }
      return {
        valid: true,
        role: data.role ?? null,
        userId: data.userId ?? data.uid ?? null,
      };
    } catch (error) {
      console.error('Token validation error:', error.message);
      return { valid: false };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      console.log('Initializing auth:', { savedToken: !!savedToken });
      if (!savedToken) {
        setAuth((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const decoded = jwtDecode(savedToken);
        const validation = await validateToken(savedToken);

        if (validation.valid) {
          setAuth({
            token: savedToken,
            userId: decoded.uid || decoded._id || validation.userId || null,
            role: validation.role || decoded.role || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setAuth({
            token: null,
            userId: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Initialize auth error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setAuth({
          token: null,
          userId: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (token, userId, role, refreshToken) => {
    try {
      setAuth((prev) => ({ ...prev, isLoading: true }));
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken || '');
      setAuth({
        token,
        userId: userId || decoded.uid || decoded._id || null,
        role: role || decoded.role || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      setAuth((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuth({
      token: null,
      userId: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};