import { Navigate } from 'react-router';
import AuthStore from '../stores/AuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const user = AuthStore((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // atau ke "unauthorized" page
  }

  return children;
};

export default ProtectedRoute;
