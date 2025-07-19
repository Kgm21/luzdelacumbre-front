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
      const decoded = jwtDecode(token); // Decodifica el token primero
      const res = await fetch(`${API_URL}/api/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('🔐 [AuthProvider] validateToken result:', {
        status: res.status,
        data: JSON.stringify(data, null, 2),
      });
      if (!res.ok) {
        throw new Error(data.message || `Validation failed with status ${res.status}`);
      }
      return {
        valid: true,
        role: data.role ?? decoded.role ?? null,
        userId: data.userId ?? data.uid ?? decoded.uid ?? decoded._id ?? null,
      };
    } catch (error) {
      console.error('🔐 [AuthProvider] Token validation error:', error.message);
      return { valid: false };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      console.log('🔍 [AuthProvider] initializeAuth - savedToken:', savedToken);
      if (!savedToken) {
        console.log('🔍 [AuthProvider] No token found in localStorage');
        setAuth((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const decoded = jwtDecode(savedToken);
        console.log('🔍 [AuthProvider] Decoded token:', decoded);
        const validation = await validateToken(savedToken);

        if (validation.valid) {
          setAuth({
            token: savedToken,
            userId: validation.userId || decoded.uid || decoded._id || null,
            role: validation.role || decoded.role || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('🔍 [AuthProvider] Token invalid, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          setAuth({
            token: null,
            userId: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('🔍 [AuthProvider] Initialize auth error:', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
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
      console.log('🔐 [AuthProvider] Login - Decoded token:', decoded);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId || decoded.uid || decoded._id || '');
      localStorage.setItem('refreshToken', refreshToken || '');
      setAuth({
        token,
        userId: userId || decoded.uid || decoded._id || null,
        role: role || decoded.role || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('🔐 [AuthProvider] Login error:', error);
      setAuth((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    console.log('🔐 [AuthProvider] Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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