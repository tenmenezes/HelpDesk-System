import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import ClientShell from "@/components/client-shell";
import { getSession } from "@/lib/auth";
import { getAvatarUrl } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "HelpDeskp - Corp",
  description: "Criado por Yago Menezes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const initialUser = session
    ? {
        id: session.id,
        nome: session.nome,
        tipo: session.tipo,
        email: session.email,
        id_setor: session.id_setor,
        foto_perfil: session.foto_perfil ?? null,
        foto_url: getAvatarUrl(session.foto_perfil),
      }
    : null;

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ClientShell initialUser={initialUser}>{children}</ClientShell>
      </body>
    </html>
  );
}
