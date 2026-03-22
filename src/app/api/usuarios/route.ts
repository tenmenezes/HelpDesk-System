// src/app/api/usuarios/route.ts
// GET: lista todos os usuários (admin only)
// POST (via /register): cria usuário via admin

import { getSession } from "@/lib/auth";
import { forbidden, ok, serverError, unauthorized } from "@/lib/api-response";
import { getAllUsuarios } from "@/server/services/usuarios.service";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.tipo !== "admin") return forbidden();

    const usuarios = await getAllUsuarios();
    return ok(usuarios);
  } catch (err) {
    console.error("[GET /api/usuarios]", err);
    return serverError();
  }
}
