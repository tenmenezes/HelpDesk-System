// src/app/api/auth/change-password/route.ts
import { badRequest, serverError, success } from "@/lib/api-response";
import { changePassword } from "@/server/auth/auth.service";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  senhaAtual: z.string().min(1),
  novaSenha: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest("Dados incompletos ou inválidos");

    const { email, senhaAtual, novaSenha } = parsed.data;
    await changePassword(email, senhaAtual, novaSenha);
    return success("Senha alterada com sucesso");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao alterar senha";
    if (msg === "Usuário não encontrado" || msg === "Senha atual incorreta") {
      return badRequest(msg);
    }
    console.error("[POST /api/auth/change-password]", err);
    return serverError();
  }
}
