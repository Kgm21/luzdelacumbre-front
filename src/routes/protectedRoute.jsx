const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { auth } = useAuth();

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    

    // Por defecto
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
