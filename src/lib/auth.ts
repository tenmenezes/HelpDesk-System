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

function base64UrlToArrayBuffer(input: string): ArrayBuffer {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return buffer;
}

async function getJwtVerificationKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

// Verifica e decodifica o JWT de forma compatível com middleware/edge runtime
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

    const header = JSON.parse(
      new TextDecoder().decode(base64UrlToArrayBuffer(encodedHeader))
    ) as { alg?: string; typ?: string };

    if (header.alg !== "HS256") return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToArrayBuffer(encodedPayload))
    ) as SessionPayload & { exp?: number };

    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;

    const key = await getJwtVerificationKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToArrayBuffer(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );

    if (!isValid) return null;

    return {
      id: payload.id,
      email: payload.email,
      tipo: payload.tipo,
      nome: payload.nome,
      id_setor: payload.id_setor,
      foto_perfil: payload.foto_perfil ?? null,
    };
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
  return await verifyToken(token);
}

// Extrai sessão de um NextRequest (para uso em middleware)
export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// Nome do cookie para uso em route handlers (logout)
export const SESSION_COOKIE_NAME = COOKIE_NAME;
