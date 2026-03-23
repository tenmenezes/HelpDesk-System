"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export type User = {
  id: number;
  nome: string;
  tipo: string;
  email: string;
  foto_perfil?: string | null;
  foto_url?: string | null;
  id_setor?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AUTH_STORAGE_KEY = "helpdesk_user";

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  // Hidrata o usuário lendo o cookie via /api/me (server-side, seguro)
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        persistUser(data);
      } else {
        setUser(null);
        persistUser(null);
      }
    } catch {
      setUser(null);
      persistUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    persistUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  // login recebe o objeto do usuário diretamente da resposta do /api/auth/login
  const login = (userData: User) => {
    setUser(userData);
    persistUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    persistUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
