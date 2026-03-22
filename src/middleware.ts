// src/middleware.ts
// Proteção de rotas no edge (middleware Next.js)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

// Rotas que exigem login
const PROTECTED_PATHS = [
  "/dashboard",
  "/summons",
  "/mySummons",
  "/problems",
  "/users",
  "/profile",
];

// Rotas que só admin pode acessar
const ADMIN_PATHS = ["/users"];

// Rotas que admin e suporte podem acessar
const ADMIN_SUPORTE_PATHS = ["/dashboard", "/summons", "/problems"];

// Rota raiz (login) — redireciona usuário já logado
const PUBLIC_PATH = "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isPublic = pathname === PUBLIC_PATH;

  const session = getSessionFromRequest(request);

  // Redireciona para login se não autenticado numa rota protegida
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redireciona para dashboard se já logado e tentar acessar página de login
  if (isPublic && session) {
    const dest = session.tipo === "comum" ? "/mySummons" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Checar permissões por role
  if (session && ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (session.tipo !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (session && ADMIN_SUPORTE_PATHS.some((p) => pathname.startsWith(p))) {
    if (!["admin", "suporte"].includes(session.tipo)) {
      return NextResponse.redirect(new URL("/mySummons", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
