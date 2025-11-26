"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // ainda carregando auth

    // Não logado
    if (!user) {
      router.replace("/");
      return;
    }

    // Sem permissão
    if (roles && !roles.includes(user.tipo)) {
      router.replace("/");
      return;
    }
  }, [user, loading, roles, router]);

  // Loading global do auth
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-muted">
        <div className="flex flex-col gap-2 items-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-lg font-medium text-muted-foreground">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  // Se tentou acessar sem permissão → tela em branco (o redirect já ocorre)
  if (!user || (roles && !roles.includes(user.tipo))) {
    return null;
  }

  return <>{children}</>;
}
