// src/app/api/chamados/[id]/route.ts
// PUT: editar chamado | DELETE: deletar chamado

import { getSession } from "@/lib/auth";
import {
  badRequest, forbidden, ok, serverError, unauthorized,
} from "@/lib/api-response";
import { deleteChamado, updateChamado } from "@/server/services/chamados.service";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["aberto", "andamento", "resolvido", "cancelado"]).optional(),
  prioridade: z.enum(["baixa", "media", "alta"]).optional(),
  titulo: z.string().min(3).max(100).optional(),
  descricao: z.string().min(10).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { id } = await params;
    const chamadoId = parseInt(id);
    if (isNaN(chamadoId)) return badRequest("ID inválido");

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dados inválidos");

    // Usuário comum pode editar apenas título e descrição (não status/prioridade)
    if (session.tipo === "comum") {
      if (parsed.data.status || parsed.data.prioridade) {
        return forbidden("Sem permissão para alterar status ou prioridade");
      }
    }

    const result = await updateChamado(chamadoId, parsed.data);
    return ok(result);
  } catch (err) {
    console.error("[PUT /api/chamados/[id]]", err);
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!["admin", "suporte"].includes(session.tipo)) return forbidden();

    const { id } = await params;
    const chamadoId = parseInt(id);
    if (isNaN(chamadoId)) return badRequest("ID inválido");

    const result = await deleteChamado(chamadoId);
    return ok(result);
  } catch (err) {
    console.error("[DELETE /api/chamados/[id]]", err);
    return serverError();
  }
}
