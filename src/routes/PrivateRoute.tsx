import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PrivateRoute({ children, redirectTo = '/login' }: PrivateRouteProps) {
  const auth = useContext(AuthContext);
  const { isAuthenticated } = auth;

  const hasToken = !!localStorage.getItem('access_token');

  // User is not logged in:
  if (!isAuthenticated || !hasToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
