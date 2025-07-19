import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();
  const { isLoading, isAuthenticated, role } = auth;

  // Mientras carga el auth, muestra algo (o null)
  if (isLoading) {
    return <div>Cargando sesión…</div>;
  }

  // (1) No autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // (2) Autenticado pero rol no permitido → 404
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/error404" replace />;
  }

  // (3) Autenticado y rol OK → children
  return children;
};

export default PrivateRoute;

