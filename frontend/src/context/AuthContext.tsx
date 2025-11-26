"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id_usuario: number;
  nome: string;
  email: string;
  tipo: "comum" | "suporte" | "admin";
  foto_perfil: string;
  id_setor: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Recupera login ao recarregar página
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  async function login(email: string, senha: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/auth/login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        return false;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
