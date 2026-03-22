// src/app/api/usuarios/create/route.ts
// POST: admin cria novo usuário (comum ou suporte)

import { getSession } from "@/lib/auth";
import { badRequest, conflict, created, forbidden, serverError, unauthorized } from "@/lib/api-response";
import { createUsuario } from "@/server/services/usuarios.service";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(1),
  sector: z.coerce.number().int().positive(),
  type: z.enum(["comum", "suporte", "admin"]),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.tipo !== "admin") return forbidden();

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest("Dados inválidos: " + parsed.error.errors[0].message);

    const usuario = await createUsuario(parsed.data);
    return created({ success: true, message: "Usuário criado com sucesso.", user: usuario });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao criar usuário";
    if (msg.includes("já cadastrado")) return conflict(msg);
    console.error("[POST /api/usuarios/create]", err);
    return serverError();
  }
}
