"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import AosInit from "@/components/aos-init";
import { AuthProvider, type User } from "@/context/AuthContext";
import { MotionProvider } from "@/components/motion-provider";

export default function ClientShell({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
    >
      <MotionProvider>
        <Toaster />
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        <AosInit />
      </MotionProvider>
    </ThemeProvider>
  );
}
