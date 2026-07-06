import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  emailVerified: boolean;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useSessionTimeout(() => setUser(null));

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get<User>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
    };
    initializeAuth();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await api.post("/auth/login", { email, password });
      await refreshUser();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [refreshUser]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await api.post("/auth/register", { name, email, password });
        await refreshUser();
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isEmailVerified: user?.emailVerified ?? false,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}