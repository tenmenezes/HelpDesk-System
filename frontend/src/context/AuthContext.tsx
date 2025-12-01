"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  nome: string;
  tipo: string;
  email: string;
  foto_perfil?: string;
  id_setor?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          localStorage.removeItem("user");
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // só definindo loading como false após montagem
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  const login = (userData: User) => {
    // // Log temporário para debug (testes internos)
    // console.log("Dados do usuário recebidos:", userData);
    // console.log("ID do usuário:", userData.id);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
