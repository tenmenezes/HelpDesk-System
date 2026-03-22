// src/app/api/chamados/user/[id]/route.ts
// GET: chamados de um usuário específico

import { getSession } from "@/lib/auth";
import { badRequest, forbidden, ok, serverError, unauthorized } from "@/lib/api-response";
import { getChamadosByUsuario } from "@/server/services/chamados.service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) return badRequest("ID inválido");

    // Usuário comum só pode ver os próprios chamados
    if (session.tipo === "comum" && session.id !== userId) {
      return forbidden("Sem permissão");
    }

    const chamados = await getChamadosByUsuario(userId);
    return ok(chamados);
  } catch (err) {
    console.error("[GET /api/chamados/user/[id]]", err);
    return serverError();
  }
}
