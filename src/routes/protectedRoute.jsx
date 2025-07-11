import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (auth.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute; // Asegúrate de que esté exportado