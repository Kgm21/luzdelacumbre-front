import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../CONFIG/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  const validateToken = async (token) => {
    if (!token) return { valid: false };
    try {
      const response = await fetch(`${API_URL}/api/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return { valid: response.ok, role: data.role || null };
    } catch (error) {
      console.error("Error validating token:", error);
      return { valid: false };
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      validateToken(savedToken).then((result) => {
        setAuth({
          token: result.valid ? savedToken : null,
          role: result.valid ? result.role : null,
          isAuthenticated: result.valid,
        });
      });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", "6851d1a26852013aa90ebb06"); // Ajusta según el backend
    validateToken(token).then((result) => {
      if (result.valid) {
        setAuth({ token, role, isAuthenticated: true });
      } else {
        setAuth({ token: null, role: null, isAuthenticated: false });
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setAuth({ token: null, role: null, isAuthenticated: false });
  };

  // Depuración: Verificar qué se pasa al contexto
  console.log("Auth context provided:", { auth, login, logout, validateToken });

  return (
    <AuthContext.Provider value={{ auth, login, logout, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Depuración en useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("Context from useAuth:", context);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};