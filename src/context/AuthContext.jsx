import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token"); // Opcional, para persistencia
    if (savedToken) {
      fetch("http://localhost:3000/api/auth/validate-token", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) setAuth({ token: savedToken, role: data.role, isAuthenticated: true });
        })
        .catch(() => setAuth({ token: null, role: null, isAuthenticated: false }));
    }
  }, []);

  const login = (token, role) => {
    setAuth({ token, role, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ token: null, role: null, isAuthenticated: false });
    // Opcional: localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);