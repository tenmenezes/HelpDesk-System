// src/app/api/chamados/route.ts
// GET: todos os chamados (admin/suporte) | POST: criar chamado

import { getSession } from "@/lib/auth";
import { badRequest, forbidden, ok, serverError, unauthorized } from "@/lib/api-response";
import { getAllChamados, createChamado } from "@/server/services/chamados.service";
import { z } from "zod";

const createSchema = z.object({
  id_usuario: z.number().int().positive(),
  id_setor: z.number().int().positive(),
  titulo: z.string().min(3).max(100),
  descricao: z.string().min(10),
  status: z.enum(["aberto", "andamento", "resolvido", "cancelado"]).optional(),
  prioridade: z.enum(["baixa", "media", "alta"]).optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!["admin", "suporte"].includes(session.tipo)) return forbidden();

    const chamados = await getAllChamados();
    return ok(chamados);
  } catch (err) {
    console.error("[GET /api/chamados]", err);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dados inválidos: " + parsed.error.errors[0].message);

    // Usuário comum só pode criar chamado para si mesmo
    if (session.tipo === "comum" && parsed.data.id_usuario !== session.id) {
      return forbidden("Você só pode criar chamados para si mesmo");
    }

    const result = await createChamado(parsed.data);
    return ok(result);
  } catch (err) {
    console.error("[POST /api/chamados]", err);
    return serverError();
  }
}
