import { createContext } from 'react';
import type { ReactNode } from 'react';

interface TokenPayload {
  user_id: number;
  username: string;
  is_admin: boolean;
  exp: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: TokenPayload | null;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  isAdmin: false,
});

export type { TokenPayload, ReactNode };

// // Import React utilities
// import { createContext, useState } from 'react';
// import type { ReactNode } from 'react';

// /**
//  * --------------------------------------------------
//  * Type for the AuthContext data
//  * --------------------------------------------------
//  * isAuthenticated  → boolean showing login state
//  * setIsAuthenticated → function to update login state
//  */
// interface AuthContextType {
//   isAuthenticated: boolean;
//   setIsAuthenticated: (value: boolean) => void;
//   isAdmin: boolean;
//   setIsAdmin: (value: boolean) => void;
// }

// // SAFE DEFAULT VALUE — so context is NEVER NULL
// const defaultValue: AuthContextType = {
//   isAuthenticated: false,
//   setIsAuthenticated: () => {},
//   isAdmin: false,
//   setIsAdmin: () => {},
// };

// /**
//  * --------------------------------------------------
//  * Create the AuthContext
//  * --------------------------------------------------
//  * Default value is `null` because actual values
//  * will be provided in AuthProvider component.
//  */
// const AuthContext = createContext<AuthContextType>(defaultValue);

// /**
//  * --------------------------------------------------
//  * AuthProvider Component
//  * --------------------------------------------------
//  * This component wraps your entire app, giving all
//  * children access to the authentication state.
//  */
// export default function AuthProvider({ children }: { children: ReactNode }) {
//   /**
//    * --------------------------------------------------
//    * State: isAuthenticated
//    * --------------------------------------------------
//    * Automatically checks if access_token exists
//    * Convert to boolean using !!
//    *
//    * Example:
//    * !!"token123" → true
//    * !!null → false
//    */
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
//     !!localStorage.getItem('access_token'),
//   );

//   const [isAdmin, setIsAdmin] = useState<boolean>(false);

//   return (
//     /**
//      * --------------------------------------------------
//      * AuthContext Provider
//      * --------------------------------------------------
//      * Makes isAuthenticated & setIsAuthenticated
//      * available to all components using useContext().
//      */
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export { AuthContext };
