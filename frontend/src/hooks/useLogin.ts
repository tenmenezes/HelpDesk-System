"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
  const { login: loginPHP } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(email: string, senha: string) {
    setError("");
    setLoading(true);

    const ok = await loginPHP(email, senha);

    setLoading(false);

    if (!ok) {
      setError("Email ou senha incorretos.");
      return;
    }

    window.location.href = "/dashboard";
  }

  return { login, loading, error };
}
