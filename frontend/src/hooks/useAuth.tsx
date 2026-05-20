import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

type UserPayload = { id: string; name: string; email: string; role: string; exp?: number };

type AuthContextValue = {
  user: UserPayload | null;
  loading: boolean;
  signOut: () => void;
  setUserFromToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type RawJwt = {
  id?: string;
  _id?: string;
  sub?: string;
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
};

const decodeUser = (token: string): UserPayload | null => {
  try {
    const decoded = jwtDecode<RawJwt>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

    const id = decoded.id ?? decoded._id ?? decoded.sub;
    const email = decoded.email;
    const name = decoded.name ?? 'User';
    const role = decoded.role ?? 'manager';

    if (!id || !email) return null;

    return {
      id: String(id),
      email: String(email),
      name: String(name),
      role: String(role),
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('finova_token');
    if (token) {
      const decoded = decodeUser(token);
      if (decoded) setUser(decoded);
      else localStorage.removeItem('finova_token');
    }
    setLoading(false);
  }, []);

  const setUserFromToken = useCallback((token: string) => {
    localStorage.setItem('finova_token', token);
    const decoded = decodeUser(token);
    setUser(decoded);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('finova_token');
    setUser(null);
  }, []);

  const memoValue = useMemo(
    () => ({ user, loading, signOut, setUserFromToken }),
    [user, loading, signOut, setUserFromToken]
  );

  return <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
