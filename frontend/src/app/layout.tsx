import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: "HelpDeskp - Corp",
  description: "Criado por Yago Menezes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
