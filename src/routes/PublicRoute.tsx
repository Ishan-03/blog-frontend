import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
  const auth = useContext(AuthContext);

  // If context is missing, avoid crash
  if (!auth) return null;

  const { isAuthenticated } = auth;
  const hasToken = !!localStorage.getItem('access_token');

  // If user already logged in → redirect to home (or custom)
  if (isAuthenticated && hasToken) {
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise show the public page (login/register)
  return <>{children}</>;
}
