import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthAPI, TOKEN_KEY } from "@/services/api";

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "ms_user";

function parseJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const json = JSON.parse(atob(padded));
    return json as { userId?: string; sub?: string; email?: string; role?: string };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) {
      setToken(t);
      const payload = parseJwt(t);
      if (payload && !u) {
        setUser({
          id: payload.userId || payload.sub,
          email: payload.email || "",
          role: payload.role,
        });
      }
    }
    if (u) {
      try { setUser(JSON.parse(u)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await AuthAPI.login(email, password);
    // Expecting { token, user }
    const tk = data?.token;
    const payload = tk ? parseJwt(tk) : null;
    const usr: User = data?.user ?? {
      id: payload?.userId || payload?.sub,
      email: payload?.email || email,
      role: payload?.role,
    };
    if (!tk) throw new Error("No token returned from server");
    localStorage.setItem(TOKEN_KEY, tk);
    localStorage.setItem(USER_KEY, JSON.stringify(usr));
    setToken(tk);
    setUser(usr);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
