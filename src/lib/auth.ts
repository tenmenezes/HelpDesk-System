// src/lib/auth.ts
// Utilitários de autenticação: JWT, cookies HTTP-only, extração de sessão

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "helpdesk_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

export interface SessionPayload {
  id: number;
  email: string;
  tipo: string;
  nome: string;
  id_setor: number;
  foto_perfil?: string | null;
}

// Gera um JWT de sessão
export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

// Verifica e decodifica o JWT
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

// Cria o objeto de cookie com as flags de segurança corretas
export function buildSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

// Extrai e valida a sessão do cookie (para uso em API Routes server-side)
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Extrai sessão de um NextRequest (para uso em middleware)
export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Nome do cookie para uso em route handlers (logout)
export const SESSION_COOKIE_NAME = COOKIE_NAME;
