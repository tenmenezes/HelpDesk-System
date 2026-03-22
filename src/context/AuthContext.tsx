"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hidrata o usuário lendo o cookie via /api/me (server-side, seguro)
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // login recebe o objeto do usuário diretamente da resposta do /api/auth/login
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
