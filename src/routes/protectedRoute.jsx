import React from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || null

  return user ? children : <Navigate to="/" />
}
