// src/app/api/me/route.ts
// Retorna os dados da sessão atual (para re-hidratação do AuthContext)
import { getSession } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api-response";
import { getAvatarUrl } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  // Buscar dados frescos do banco (foto pode ter mudado)
  const usuario = await prisma.usuario.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo: true,
      id_setor: true,
      foto_perfil: true,
    },
  });
  if (!usuario) return unauthorized();

  return ok({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    id_setor: usuario.id_setor,
    foto_perfil: usuario.foto_perfil,
    foto_url: getAvatarUrl(usuario.foto_perfil),
  });
}
