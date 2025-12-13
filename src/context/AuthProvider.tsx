import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext, type TokenPayload } from './AuthContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('access_token'),
  );

  const accessToken = localStorage.getItem('access_token');

  const user = useMemo(() => {
    if (!accessToken) return null;
    try {
      return jwtDecode<TokenPayload>(accessToken);
    } catch (err) {
      console.error('Invalid token');
      return null;
    }
  }, [accessToken]);

  const isAdmin = user?.is_admin ?? false;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
