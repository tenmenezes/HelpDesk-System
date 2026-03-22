// src/app/api/usuarios/register/route.ts
// Registro do primeiro administrador (quando não há usuários no sistema)

import { badRequest, conflict, created, serverError } from "@/lib/api-response";
import { registerFirstAdmin } from "@/server/services/usuarios.service";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(1),
  sector: z.coerce.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest("Dados inválidos");

    const usuario = await registerFirstAdmin(parsed.data);
    return created({ success: true, message: "Administrador criado com sucesso!", user: usuario });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao criar administrador";
    if (msg.includes("desabilitado") || msg.includes("já cadastrado")) {
      return conflict(msg);
    }
    console.error("[POST /api/usuarios/register]", err);
    return serverError();
  }
}
