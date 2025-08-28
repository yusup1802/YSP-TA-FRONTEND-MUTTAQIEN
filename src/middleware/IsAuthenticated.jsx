// src/routes/LoginRoute.jsx
import { Navigate } from 'react-router';
import AuthStore from '../stores/AuthStore';

const IsAuthenticated = ({ children }) => {
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const user = AuthStore((state) => state.user);

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return children;
};

export default IsAuthenticated;
