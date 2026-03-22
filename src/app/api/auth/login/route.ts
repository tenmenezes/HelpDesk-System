// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginUsuario } from "@/server/auth/auth.service";
import { buildSessionCookie } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha obrigatória"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.errors[0].message);
    }

    const { email, senha } = parsed.data;
    const { token, user } = await loginUsuario(email, senha);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        id_setor: user.id_setor,
        foto_perfil: user.foto_perfil,
        foto_url: user.foto_url,
      },
    });

    response.cookies.set(buildSessionCookie(token));
    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao fazer login";
    if (msg === "Usuário não encontrado" || msg === "Senha incorreta") {
      return NextResponse.json({ success: false, message: msg }, { status: 401 });
    }
    console.error("[POST /api/auth/login]", err);
    return serverError();
  }
}
