import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('role');

  if (!role) {
    // No hay rol, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    // No es admin, redirige a home o donde quieras
    return <Navigate to="/" replace />;
  }

  // Es admin, deja pasar
  return children;
};
