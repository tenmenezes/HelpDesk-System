// src/app/api/usuarios/[id]/route.ts
// PUT: edita usuário | DELETE: remove usuário (ambos: admin only)

import { getSession } from "@/lib/auth";
import {
  badRequest, forbidden, notFound, ok, serverError, success, unauthorized,
} from "@/lib/api-response";
import { deleteUsuario, updateUsuario } from "@/server/services/usuarios.service";
import { z } from "zod";

const updateSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(1),
  sector: z.coerce.number().int().positive(),
  type: z.enum(["comum", "suporte", "admin"]),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.tipo !== "admin") return forbidden();

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) return badRequest("ID inválido");

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dados inválidos: " + parsed.error.errors[0].message);

    const updated = await updateUsuario(userId, parsed.data);
    return ok({ success: true, user: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Record to update not found")) return notFound("Usuário não encontrado");
    console.error("[PUT /api/usuarios/[id]]", err);
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.tipo !== "admin") return forbidden();

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) return badRequest("ID inválido");

    await deleteUsuario(userId);
    return success("Usuário excluído com sucesso");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Record to delete does not exist")) return notFound("Usuário não encontrado");
    console.error("[DELETE /api/usuarios/[id]]", err);
    return serverError();
  }
}
