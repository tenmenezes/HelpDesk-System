"use client";
// Hook de login — wrapper para uso externo se necessário

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doLogin(email: string, senha: string) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Email ou senha incorretos.");
        return false;
      }

      login(data.user);
      return true;
    } catch {
      setError("Erro ao conectar ao servidor.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { login: doLogin, loading, error };
}
