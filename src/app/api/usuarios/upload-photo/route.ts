// src/app/api/usuarios/upload-photo/route.ts
// Upload de foto de perfil para Supabase Storage

import { getSession } from "@/lib/auth";
import { badRequest, ok, serverError, unauthorized } from "@/lib/api-response";
import { uploadFotoPerfil } from "@/server/services/usuarios.service";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    const userIdRaw = formData.get("userId");

    if (!file) return badRequest("Arquivo não enviado");
    if (!userIdRaw) return badRequest("userId não informado");

    const userId = parseInt(String(userIdRaw));
    if (isNaN(userId)) return badRequest("userId inválido");

    // Segurança: usuário comum só pode atualizar sua própria foto
    if (session.tipo === "comum" && session.id !== userId) {
      return badRequest("Sem permissão para alterar foto de outro usuário");
    }

    if (file.size > MAX_SIZE) return badRequest("Arquivo muito grande (máx. 4MB)");
    if (!ALLOWED_TYPES.includes(file.type)) return badRequest("Tipo de arquivo não permitido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFotoPerfil(userId, buffer, file.type);

    return ok({ success: true, url: result.foto_url, user: result });
  } catch (err) {
    console.error("[POST /api/usuarios/upload-photo]", err);
    return serverError("Erro ao fazer upload da foto");
  }
}
