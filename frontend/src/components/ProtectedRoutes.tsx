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
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
    if (roles && user && !roles.includes(user.tipo)) router.push("/");
  }, [user]);

  if (!user) return null;
  if (roles && user && !roles.includes(user.tipo)) return null;

  return <>{children}</>;
}
